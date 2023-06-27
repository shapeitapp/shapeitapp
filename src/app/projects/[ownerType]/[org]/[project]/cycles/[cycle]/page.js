import { graphql } from '@octokit/graphql'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import CyclePage from '@/components/CyclePage'
import colors from '@/components/colors'
import { ProjectDetailsProvider } from '@/contexts/ProjectDetails'

export default async function ProjectCyclePage({ params }) {
  const {
    project,
    visibleCycle,
    previousCycle,
    nextCycle,
    inCycle,
    availablePitches = [],
    availableBets = [],
    availableScopes = []
  }  = await prepareData(params)

  return (
    <ProjectDetailsProvider value={project}>
      <CyclePage
        visibleCycle={visibleCycle}
        previousCycle={previousCycle}
        nextCycle={nextCycle}
        inCycle={inCycle}
        availablePitches={availablePitches}
        availableBets={availableBets}
        availableScopes={availableScopes}
      />
    </ProjectDetailsProvider>
  )
}

export async function prepareData(params) {
  const session = await getServerSession(authOptions)
  const isLoggedIn = !!session

  const userOrOrganization = params.ownerType === 'org' ? 'organization' : 'user'

  if (!isLoggedIn) {
    const data = await graphql(
      `query($owner: String!, $projectNumber: Int!) { 
        ${userOrOrganization}(login: $owner) {
          projectV2(number: $projectNumber) {
            public
          }
        }
      }`,
      {
        owner: params.org,
        projectNumber: Number(params.project),
        headers: {
          authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      }
    )

    if (!data?.[userOrOrganization]?.projectV2?.public) {
      return notFound()
    }
  }

  let responseData
  let scopeData = {}
  try {
    responseData = await graphql(
      `query($owner: String!, $projectNumber: Int!) {
        ${userOrOrganization}(login: $owner) {
          projectV2(number: $projectNumber) {
            title
            url
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
            }
          }
        }
      }`,
      {
        owner: params.org,
        projectNumber: Number(params.project),
        headers: {
          authorization: `token ${isLoggedIn ? session?.accessToken : process.env.GITHUB_TOKEN}`
        }
      }
    )
  } catch (e) {
    if (!e.data) {
      console.error(e)
      throw e
    }

    responseData = e.data
  }

  const projectData = responseData[userOrOrganization].projectV2.items.nodes
  for (let i = 0; i < projectData.length; i++) {
    let item = projectData[i];
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
                      body,
                      closed
                      closedAt
                      createdAt
                      comments(last: 100) {
                          nodes {
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
                authorization: `token ${process.env.GITHUB_TOKEN}`
              }
            }
        )
        if (scopeItems.node.trackedIssues?.nodes) {
          scopeData[item.content.id] = scopeItems.node.trackedIssues?.nodes
        }
      }
      catch(e) {
        console.log(e)
        if (!e.data) {
          console.error(e)
          throw e
        }
      }
    }
  }
  let cycles = []
  const issues = projectData.map(item => {
    const isPrivate = item?.content?.repository?.isPrivate === undefined
                      || item?.content?.repository?.isPrivate === true

    if (!isLoggedIn && isPrivate) return null

    let cycleNode = item.fieldValues.nodes.find(fv => fv.field?.name === 'Cycle')
    if (!cycleNode) return

    if (!cycles.find(cycle => cycle.id === cycleNode.iterationId)) {
      const startDate = new Date(cycleNode.startDate)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + cycleNode.duration)
      cycleNode.endDate = endDate
      cycleNode.startDate = startDate.toISOString()
      cycleNode.id = cycleNode.iterationId
      delete cycleNode.iterationId
      cycles.push(cycleNode)
    } else {
      cycleNode = cycles.find(cycle => cycle.id === cycleNode.iterationId)
    }

    const kind = item.fieldValues.nodes.find(fv => fv.field?.name === 'Kind')?.name
    let scopes = scopeData[item?.content?.id] ? scopeData[item?.content?.id] : []
    const history = getHistory(item.content)

    if (kind === 'Bet') {
      if (scopes.length > 0) {
        for (let [scopeIndex, scope] of scopes.entries()) {
          scope.history = getHistory(scope)
          scope.bet = item.content.url
          scope.progress = {
            percentage: getCurrentPercentage(scope),
            history: scope.history,
            notPlanned: getLatestCloseState(history) === 'NOT_PLANNED',
            completed: getLatestCloseState(history) === 'COMPLETED',
            closed: scope.closed === true
          }
          scope.color = colors[scopeIndex % colors.length]
        }
      }
      // We also extract text based tasks
      const extractedScopes = extractTasks(item.content.body)
      for (let [scopeIndex, extractedScope] of extractedScopes.entries()) {
        extractedScope.history = null;
        extractedScope.bet = item.content.url
        extractedScope.progress = {
          percentage: extractedScope.closed === true ? 100 : 0,
          history: null,
          notPlanned: false,
          completed: extractedScope.closed === true,
          closed: extractedScope.closed === true
        },
        extractedScope.color = colors[scopeIndex % colors.length]
      }
      if (extractedScopes.length > 0) {
        scopes = scopes.concat(extractedScopes);
      }
    }
    return {
      title: item.content.title,
      url: item.content.url,
      number: item.content.number,
      closed: item.content.closed,
      closedAt: item.content.closedAt,
      createdAt: item.content.createdAt,
      author: item.content.author,
      kind,
      appetite: item.fieldValues.nodes.find(fv => fv.field?.name === 'Appetite')?.name,
      cycle: cycleNode.id,
      scopes
    }
  }).filter(Boolean)

  cycles = cycles.sort((c1, c2) => { // Sort cycles by startDate
    return new Date(c1.startDate) - new Date(c2.startDate)
  })
  const pitches = issues.filter(issue => issue.kind === 'Pitch')
  const bets = issues.filter(issue => issue.kind === 'Bet')
  function getVisibleCycleDetails(id) {
    let inCycle = false
    let cycle
  
    if (id) {
      cycle = cycles.find(cycle => String(cycle.id) === id)
      if (cycle) {
        const startDate = new Date(cycle.startDate)
        const endDate = new Date(cycle.endDate)
        const now = new Date()
        inCycle = (startDate <= now && endDate >= now) 
      }
    } else {
      for (const c of cycles) {
        const startDate = new Date(c.startDate)
        const endDate = new Date(c.endDate)
        const now = new Date()
        cycle = c
        if (startDate <= now && endDate >= now) {
          inCycle = true
          break
        } else if (startDate > now) {
          inCycle = false
          break
        }
      }
    }
  
    return {
      cycle,
      inCycle,
    }
  }

  let { cycle, inCycle } = getVisibleCycleDetails(params.cycle)
  if (!cycle) return notFound()
  const visibleCycle = cycle
  inCycle = inCycle
  
  const visibleCycleIndex = cycles.findIndex(cycle => cycle.id === visibleCycle.id)
  const previousCycle = visibleCycleIndex > 0 ? cycles[visibleCycleIndex - 1] : null
  const nextCycle = visibleCycleIndex < cycles.length - 1 ? cycles[visibleCycleIndex + 1] : null

  const availablePitches = pitches.filter(p => p.cycle === visibleCycle.id)
  const availableBets = bets.filter(b => b.cycle === visibleCycle.id)
  

  return {
    project: {
      githubUrl: responseData[userOrOrganization].projectV2.url,
      title: responseData[userOrOrganization].projectV2.title,
      org: params.org,
      ownerType: params.ownerType,
      number: Number(params.project)
    },
    visibleCycle,
    previousCycle,
    nextCycle,
    inCycle,
    availablePitches,
    availableBets,
    cycles,
    bets,
    pitches
  }
}

function getLatestCloseState(history) {
  const closeStates = history.filter(hp => hp.closeReason !== undefined)
  if (closeStates.length) return history[closeStates.length-1].closeReason
}

function getCurrentPercentage(scope) {
  if (scope.closed) return 100
  const comments = scope.comments.nodes.map(node => node.bodyText)
  const reversedComments = comments.reverse()
  let percentage
  let i = 0

  do {
    percentage = getPercentage(reversedComments[i])
    i++
  } while (percentage === null && i < reversedComments.length)

  if (percentage === null) { // No /progress command found
    const extractedTasks = extractTasks(scope.body)
    const totalTasks = extractedTasks.length
    if (totalTasks === 0) return 0

    const completedTasks = extractedTasks.filter(t => t.closed).length
    return Math.round(completedTasks / totalTasks * 100)
  }

  return percentage
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
      if (!match[2].startsWith('#')) {
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
