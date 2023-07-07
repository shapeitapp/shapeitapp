import { graphql } from '@octokit/graphql'
import { getServerSession } from 'next-auth/next'
import { authOptions, getToken } from '@/app/api/auth/[...nextauth]/route'
import { notFound } from 'next/navigation'
import { ProjectDetailsProvider } from '@/contexts/ProjectDetails'

export default async function ProjectLayout({ params, children }) {
  const session = await getServerSession(authOptions)
  const isLoggedIn = !!session
  const project = await fetchProject(params)
  
  if (!isLoggedIn && project.public === false) {
    return notFound()
  }

  return (
    <ProjectDetailsProvider value={project}>
      {children}
    </ProjectDetailsProvider>
  )
}

export async function fetchProject(params) {
  const session = await getServerSession(authOptions)
  const userOrOrganization = params.ownerType === 'org' ? 'organization' : 'user'

  const data = await graphql(
    `query($owner: String!, $projectNumber: Int!) { 
      ${userOrOrganization}(login: $owner) {
        projectV2(number: $projectNumber) {
          url
          title
          public
          fields(first: 100) {
            nodes {
              ...on ProjectV2IterationField {
                __typename,
                databaseId,
                name,
                configuration {
                  iterations {
                    id,
                    startDate,
                    duration
                  }
                }
              }
              ...on ProjectV2SingleSelectField {
                __typename,
                databaseId,
                name,
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }`,
    {
      owner: params.org,
      projectNumber: Number(params.project),
      headers: {
        authorization: `token ${getToken(session)}`
      }
    }
  )

  const project = data?.[userOrOrganization]?.projectV2
  project.fields = Object.fromEntries(project?.fields?.nodes?.map(field => {
    if (!['Appetite', 'Cycle', 'Kind'].includes(field.name)) return

    if (field.name === 'Cycle' && field.__typename !== 'ProjectV2IterationField' &&
      field.__typename !== 'ProjectV2SingleSelectField') return
    if (field.name === 'Appetite' && field.__typename !== 'ProjectV2SingleSelectField') return
    if (field.name === 'Kind' && field.__typename !== 'ProjectV2SingleSelectField') return

    return [
      field.name,
      {
        id: field.databaseId,
        values: field.options || field.configuration.iterations
      }
    ]
  }).filter(Boolean))

  project.org = params.org
  project.ownerType = params.ownerType
  project.number = Number(params.project)
  let isShapeUpCycle = true

  if (project.fields.Cycle?.values?.length) {
    for (const c of project.fields.Cycle?.values) {
      if (c?.startDate && c?.startDate && c?.duration) {
        const startDate = new Date(c.startDate)
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + c.duration)
        const now = new Date()

        if (startDate <= now && endDate >= now) {
          project.currentCycle = c
          break
        } else if (startDate > now) {
          project.currentCycle = c
          break
        }
      } else {
        isShapeUpCycle = false
      }
    }

    if (!project.currentCycle) {
      project.currentCycle = isShapeUpCycle ? project.fields.Cycle.values[project.fields.Cycle.values.length - 1] : project.fields.Cycle.values[0]
    }
  }

  return project
}

export async function isProjectConfigured(project) {
  if (!project) {
    return false;
  }
  const hasCurrentCycle = project.hasOwnProperty('currentCycle');
  const hasKindField = project.fields.hasOwnProperty('Kind');
  const hasCycleField = project.fields.hasOwnProperty('Cycle');
  const hasAppetiteField = project.fields.hasOwnProperty('Appetite');

  return hasCurrentCycle && hasKindField && hasCycleField && hasAppetiteField;
}