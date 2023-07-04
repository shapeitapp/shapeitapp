import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { graphql } from "@octokit/graphql"
import { authOptions, getToken } from '@/app/api/auth/[...nextauth]/route'
import Head from 'next/head'
import ProjectCard from '@/components/ProjectCard'

export default async function Projects() {
  const session = await getServerSession(authOptions)
  if (!session) return redirect('/')

  let responseData
  
  try {
    responseData = await graphql(
      `{
        viewer {
          login
          url
          projectsV2(first: 100) {
            nodes {
              title
              url
              public
              number
              creator {
                login
                url
              }
              cycle: field(name: "Cycle") {
                ... on ProjectV2FieldCommon {
                  dataType
                }
              }
              kind: field(name: "Kind") {
                ... on ProjectV2SingleSelectField {
                  dataType
                  options {
                    name
                  }
                }
              }
              appetite: field(name: "Appetite") {
                ... on ProjectV2SingleSelectField {
                  dataType
                  options {
                    name
                  }
                }
              }
            }
          }
          organizations(first: 100) {
            nodes {
              login
              url
              projectsV2(first: 100) {
                nodes {
                  title
                  url
                  public
                  number
                  creator {
                    login
                    url
                  }
                  cycle: field(name: "Cycle") {
                    ... on ProjectV2FieldCommon {
                      dataType
                    }
                  }
                  kind: field(name: "Kind") {
                    ... on ProjectV2SingleSelectField {
                      dataType
                      options {
                        name
                      }
                    }
                  }
                  appetite: field(name: "Appetite") {
                    ... on ProjectV2SingleSelectField {
                      dataType
                      options {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      {
        headers: {
          authorization: `token ${getToken(session)}`
        }
      }
    )
  } catch (e) {
    console.error(e)
    if (!e.data) {
      return (
        <div>There was an error trying to fetch GitHub data.</div>
      )
    }

    responseData = e.data
  }

  const userProjects = responseData.viewer.projectsV2.nodes.map(project => ({
    ownerType: 'user',
    orgName: responseData.viewer.login,
    orgUrl: responseData.viewer.url,
    ...project
  }))
  const orgProjects = responseData.viewer.organizations.nodes.map(org =>
    org.projectsV2.nodes.map(project => ({
      ownerType: 'org',
      orgName: org.login,
      orgUrl: org.url,
      ...project
    }))
  ).flat()
  const allProjects = [userProjects, orgProjects].flat()

  return (
    <>
      <Head>
        <title>Shape It! - Projects</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2 className="text-4xl leading-10 font-extrabold text-gray-500 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-6xl">
        Projects
      </h2>

      <div className="mt-8">
        <ul role="list" className="divide-y divide-black/5">
          {
            allProjects.map((project) => (
              <ProjectCard key={project.url} project={project} />
            ))
          }
        </ul>
      </div>
    </>
  )
}
