import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { graphql } from "@octokit/graphql"
import { authOptions, getToken } from '@/app/api/auth/[...nextauth]/route'
import Head from 'next/head'
import ProjectCard from '@/components/ProjectCard'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

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

  const orgProjects = responseData.viewer.organizations.nodes.reduce((projectsResult, org) => {
      const projects = org.projectsV2.nodes.reduce((result, project) => {
      // If the org didn't provide OAUTH permission for the current user, projects come as NULL
      if (!project) {
        return result;

      }

      result.push({
        ownerType: 'org',
        orgName: org.login,
        orgUrl: org.url,
        ...project
      });

      return result;
    }, []);

    projectsResult.push(projects);
    return projectsResult;
  }, []).flat();

  const isConnected = (project) => {
    const hasCycleField = project.cycle?.dataType === 'ITERATION' ||  project.cycle?.dataType === 'SINGLE_SELECT'
    const hasKindField =
      project.kind?.dataType === 'SINGLE_SELECT' &&
      ['Pitch', 'Bet'].every(kind => !!project.kind?.options?.find(opt => opt.name === kind))
    const hasAppetiteField = project.appetite?.dataType === 'SINGLE_SELECT'
    const isConnected = hasCycleField && hasKindField && hasAppetiteField
    return isConnected
  }

  const allProjects = [userProjects, orgProjects].flat()
  const myProjects = allProjects.filter(isConnected)
  const remainingProjects = allProjects.filter(x=>!myProjects.includes(x))

  return (
    <>
      <Head>
        <title>Shape It! - Projects</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div >
        <ul role="list" className="divide-y divide-black/5">
          <h2 className="text-4xl leading-10 font-extrabold text-gray-500 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-6xl  mt-8 mb-8">
            My Projects
          </h2>
          {
            myProjects.map((project) => (
              <ProjectCard key={project.url} project={project} isConnected={true} />
            ))
          }
          <h2 className="text-4xl leading-10 font-extrabold text-gray-500 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-6xl  pt-10 mb-8">
            Other projects
          </h2>
          {
            remainingProjects.map((project) => (
              <ProjectCard key={project.url} project={project} isConnected={false}/>
            ))
          }
        </ul>
      </div>
    </>
  )
}
