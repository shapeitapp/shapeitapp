import CyclePage from '@/components/CyclePage'
import { prepareData } from './cycles/[cycle]/page'
import { ProjectDetailsProvider } from '@/contexts/ProjectDetails'

export default async function ProjectPage({ params, searchParams }) {
  const {
    project,
    visibleCycle,
    previousCycle,
    nextCycle,
    inCycle,
    availablePitches = [],
    availableBets = [],
    availableScopes = [],
    betIssue
  }  = await prepareData(params, searchParams)

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
        betIssue={betIssue}
      />
    </ProjectDetailsProvider>
  )
}
