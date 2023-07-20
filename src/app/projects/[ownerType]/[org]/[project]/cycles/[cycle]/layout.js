import { graphql } from '@octokit/graphql'
import { getServerSession } from 'next-auth'
import { authOptions, getToken } from '@/app/api/auth/[...nextauth]/route'
import { ProjectItemsDetailsProvider } from '@/contexts/ProjectItemsDetails'
import colors from '@/components/colors'
import { UrlParamsProvider } from '@/contexts/UrlParams'

export default async function ProjectCycleLayout({ params, children }) {
  const itemsData = await prepareData(params)
  
  return (
    <UrlParamsProvider value={params}>
      <ProjectItemsDetailsProvider value={itemsData}>
        {children}
      </ProjectItemsDetailsProvider>
    </UrlParamsProvider>
  )
}

async function prepareData(params) {
  const session = await getServerSession(authOptions)
  const isLoggedIn = !!session
  const userOrOrganization = params.ownerType === 'org' ? 'organization' : 'user'
  let itemsData
  let responseData
  const scopeData = {}
  

  try {  
    responseData = await graphql(
      `query($owner: String!, $projectNumber: Int!) {
        ${userOrOrganization}(login: $owner) {
          projectV2(number: $projectNumber) {
            items(first: 100) {
              nodes {
                content {
                  ...on DraftIssue {
                    id
                    title
                    body
                    author:creator {
                      login
                      avatarUrl
                    }
                  }
                  ...on Issue {
                    id
                    title
                    body
                    url
                    number
                    closed
                    closedAt
                    createdAt
                    repository {
                      isPrivate
                      name
                    }
                    author {
                      login
                      avatarUrl
                    }
                  }
                }
                fieldValues(first: 100) {
                  nodes {
                    ...on ProjectV2ItemFieldNumberValue {
                      field {
                        ...on ProjectV2Field {
                          name
                        }
                      }
                      number
                    }
                    ...on ProjectV2ItemFieldSingleSelectValue {
                      field {
                        ...on ProjectV2SingleSelectField {
                          name
                        }
                      }
                      id
                      name
                    }
                    ...on ProjectV2ItemFieldTextValue {
                      field {
                        ...on ProjectV2Field {
                          name
                        }
                      }
                      text
                    }
                    ...on ProjectV2ItemFieldIterationValue {
                      field {
                        ...on ProjectV2IterationField {
                          name
                        }
                      }
                      iterationId
                      title
                      startDate
                      duration
                    }
                  }
                }
              }
            },
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
                      duration,
                      title
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
  } catch (e) {
    if (!e.data) {
      console.log(e) // Using .log because Next.js does something weird with console.error and it hides the error
      throw e
    }

    responseData = e.data
  }

  const projectData = responseData[userOrOrganization].projectV2
  itemsData = projectData.items.nodes

  for (let i = 0; i < itemsData.length; i++) {
    let item = itemsData[i];
    if (item.fieldValues.nodes.find(fv => fv.field?.name === 'Kind')?.name === "Bet") {
      let {id} = item.content
      try {
        let scopeItems = await graphql(
          `query($nodeId: ID!){
            node (id: $nodeId){
                ... on Issue {
                  id
                  title
                  body
                  trackedIssues(first:100) {
                    nodes {
                      id
                      title
                      url
                      closed
                      closedAt
                      createdAt
                      comments(last: 100) {
                          nodes {
                            id
                            body
                            bodyText
                            createdAt
                            updatedAt
                            url
                            author {
                              avatarUrl(size: 100)
                              ... on User {
                                name
                                url
                              }
                            }
                          }
                        }
                      timelineItems(
                          last: 100,
                          itemTypes: CLOSED_EVENT
                        ) {
                          nodes {
                            ... on ClosedEvent {
                              __typename
                              id
                              url
                              stateReason
                              actor {
                                avatarUrl(size: 100)
                                ... on Actor {
                                  login
                                  url
                                }
                                ... on Bot {
                                  login
                                  url
                                }
                                ... on User {
                                  name
                                  url
                                }
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
              nodeId: id,
              headers: {
                authorization: `token ${getToken(session)}`
              }
            }
        )
        if (scopeItems.node.trackedIssues?.nodes) {
          scopeData[item.content.id] = scopeItems.node.trackedIssues?.nodes
        }
      }
      catch(e) {
        if (!e.data) {
          console.log(e) // Using .log because Next.js does something weird with console.error and it hides the error
          throw e
        }
      }
    }
  }
  
  let cycles = []

  projectData.fields.nodes.forEach(field => {
    if (field.name === 'Cycle') {
      if (field.__typename === 'ProjectV2IterationField' && field.configuration?.iterations) {
        field.configuration.iterations.forEach(iteration => {
          const startDate = new Date(iteration.startDate)
          const endDate = new Date(startDate)
          endDate.setDate(endDate.getDate() + iteration.duration)
          cycles.push({
            ...iteration,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            isShapeUp: true,
          })
        })
      }
      else if (field.__typename === 'ProjectV2SingleSelectField' && field.options.length > 0) {
        field.options.forEach(iteration => {
          cycles.push({
            ...iteration,
            startDate: '',
            endDate: '',
            isShapeUp: false
          })
        })
      }
    }
  })

  const issues = itemsData.map(item => {
    const isPrivate = item?.content?.repository?.isPrivate === undefined
                      || item?.content?.repository?.isPrivate === true

    if (!isLoggedIn && isPrivate) return null

    const cycleNode = item.fieldValues.nodes.find(fv => fv.field?.name === 'Cycle')
    if (!cycleNode) return
    const cycle = cycleNode?.iterationId ?
      cycles.find(cycle => cycle.id === cycleNode.iterationId) :
      cycles.find(cycle => cycle.name === cycleNode.name)

    if (!cycle) return

    const kind = item.fieldValues.nodes.find(fv => fv.field?.name === 'Kind')?.name
    let scopes = scopeData[item?.content?.id] ? scopeData[item?.content?.id] : []
    const history = getHistory(item.content)

    if (kind === 'Bet') {
      if (scopes.length > 0) {
        for (let [scopeIndex, scope] of scopes.entries()) {
          scope.history = getHistory(scope)
          scope.bet = item.content.url
          scope.progress = {
            percentage: scope.closed === true ? 100 : getCurrentPercentage(scope.comments.nodes.map(node => node.bodyText)),
            history: scope.history,
            notPlanned: getLatestCloseState(history) === 'NOT_PLANNED',
            completed: getLatestCloseState(history) === 'COMPLETED',
            closed: scope.closed === true
          }
          scope.color = colors[scopeIndex % colors.length]
        }
      }
      // We also extract text based tasks
      const extractedScope = extractTasks(item.content.body)
      for (let [scopeIndex, scope] of extractedScope.entries()) {
        scope.history = null;
        scope.bet = item.content.url
        scope.progress = {
          percentage: scope.closed === true ? 100 : 0,
          history: null,
          notPlanned: false,
          completed: scope.closed === true,
          closed: scope.closed === true
        },
        scope.color = colors[scopeIndex % colors.length]
      }
      if (extractedScope.length > 0) {
        scopes = scopes.concat(extractedScope);
      }
    }
    return {
      id: item.content.id,
      title: item.content.title,
      url: item.content.url,
      number: item.content.number,
      closed: item.content.closed,
      closedAt: item.content.closedAt,
      createdAt: item.content.createdAt,
      author: item.content.author,
      kind,
      appetite: item.fieldValues.nodes.find(fv => fv.field?.name === 'Appetite')?.name,
      cycle: cycle.id,
      scopes
    }
  }).filter(Boolean)

  cycles = cycles.sort((c1, c2) => { // Sort cycles by startDate
    if (c1.isShapeUp)
      return new Date(c1.startDate) - new Date(c2.startDate)
    else
      return c1.name - c2.name
  })

  const pitches = issues.filter(issue => issue.kind === 'Pitch')
  const bets = issues.filter(issue => issue.kind === 'Bet')

  return {
    cycles,
    bets,
    pitches
  }
}

function getLatestCloseState(history) {
  const closeStates = history.filter(hp => hp.closeReason !== undefined)
  if (closeStates.length) return history[closeStates.length-1].closeReason
}

function getCurrentPercentage(comments) {
  const reversedComments = comments.reverse()
  let percentage
  let i = 0

  do {
    percentage = getPercentage(reversedComments[i])
    i++
  } while (percentage === null && i < reversedComments.length)

  return percentage === null ? 0 : percentage
}

function getPercentage(comment = '') {
  const matches = comment.match(/^\/progress[\s]+([\d]+)/)
  if (matches && matches.length === 2) {
    let result = Number(matches[1])
    if (Number.isNaN(result)) return null
    if (result < 0) return 0
    if (result > 100) return 100
    return result
  }
  return null
}

function getStatus(comment = '') {
  const matches = comment.match(/^\/progress[\s]+[\d\n]+(.*)/s)
  if (matches && matches.length === 2) return matches[1]
  return null
}

function getHistory(scope) {
  const historyPoints = scope?.comments?.nodes?.map(node => getHistoryPoint(node)).filter(Boolean)
  const closedEvents = scope?.timelineItems?.nodes?.filter(ce => ce.__typename === 'ClosedEvent')
  if (scope.closed && closedEvents?.length) {  
    const closedEvent = closedEvents[closedEvents.length-1]
    const completed = closedEvent.stateReason === 'COMPLETED'
    const notPlanned = closedEvent.stateReason === 'NOT_PLANNED'
    historyPoints.push({
      percentage: completed ? 100 : undefined,
      status: null,
      statusMarkdown: null,
      createdAt: scope.closedAt,
      updatedAt: scope.closedAt,
      author: closedEvent.actor,
      url: closedEvent.url,
      closed: true,
      closeReason: closedEvent.stateReason,
      completed,
      notPlanned,
    })
  }

  return historyPoints?.reverse() || []
}

function getHistoryPoint(commentObject) {
  if (!commentObject.bodyText.match(/^\/progress[\s]+/)) return

  return {
    percentage: getPercentage(commentObject.bodyText),
    status: getStatus(commentObject.bodyText),
    statusMarkdown: getStatus(commentObject.body),
    createdAt: commentObject.createdAt,
    updatedAt: commentObject.updatedAt,
    author: commentObject.author,
    url: commentObject.url,
    id: commentObject.id
  }
}

function extractTasks(text) {
  const tasks = []
  const scopeRegex = /###?\sScope([^-]+)((-\s+\[[\sX|x]\]\s*#?.+\s*)+)/gm
  const taskRegex = /- \[(x| )\] (.+)/g

  const scopeMatch = scopeRegex.exec(text)
  if (scopeMatch) {
    const scopeText = scopeMatch[2]
    let match
    while ((match = taskRegex.exec(scopeText)) !== null) {
      if (!match[2].startsWith('#') && !match[2].startsWith('https://github.com')) {
        const task = {
          title: match[2],
          closed: match[1] === "x" ? true : false
        };
        tasks.push(task)
      }
    }
  }

  return tasks;
}
