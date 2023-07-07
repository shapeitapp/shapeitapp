import Link from 'next/link'
import { DateTime } from 'luxon'
import { useProjectDetails } from '@/contexts/ProjectDetails'

export default function CycleHeader({ visibleCycle, inCycle, previousCycle, nextCycle, isPastCycle }) {
  const dueOnDate = DateTime.fromISO(visibleCycle.endDate)
  const remainingDays = Math.floor(dueOnDate.diffNow('days').toObject().days)
  const { org, number: projectNumber, ownerType } = useProjectDetails()

  const previousCycleButton = (
    <div title={previousCycle && 'Go to the previous cycle'}>
      <svg className={`w-6 h-6 ${!previousCycle && 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  )

  const nextCycleButton = (
    <div title={previousCycle && 'Go to the next cycle'}>
      <svg className={`w-6 h-6 ${!nextCycle && 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )

  return (
    <>
      <div className="flex">
        <h2 className="flex-1 text-2xl leading-6 font-medium text-gray-900">
          <a href={visibleCycle.url} target="_blank" rel="noreferrer">{visibleCycle.title}</a>
          {
            inCycle && (
              <>
                <span className="inline-block transform -translate-y-1.5 ml-2 px-2 py-1 text-cyan-800 uppercase text-xs leading-4 font-medium border border-cyan-100 rounded-full">
                  <span className="inline-block mr-1 animate-pulse bg-red-500 rounded-full w-2 h-2"></span>
                  Current cycle
                </span>
                
                <span className="inline-block transform -translate-y-1.5 ml-2 px-2 py-1 text-indigo-800 uppercase text-xs leading-4 font-medium border border-indigo-100 rounded-full">
                  { remainingDays } days remaining
                </span>
              </>
            )
          }
        </h2>
        <div className="flex">
          {
            !previousCycle ? previousCycleButton : (
              <Link href={`/projects/${ownerType}/${org}/${projectNumber}/cycles/${previousCycle.id}`}>
                {previousCycleButton}
              </Link>
            )
          }
          
          {
            !nextCycle ? nextCycleButton : (
              <Link href={`/projects/${ownerType}/${org}/${projectNumber}/cycles/${nextCycle.id}`}>
                {nextCycleButton}
              </Link>
            )
          }
        </div>
      </div>
      {visibleCycle.isShapeUp &&
        <p className="my-4 text-gray-500">{inCycle ? 'The current' : 'This'} cycle {isPastCycle || inCycle ? 'started' : 'starts'} on {new Date(visibleCycle.startDate).toDateString()} and {isPastCycle ? 'finished' : 'will finish'} on {new Date(visibleCycle.endDate).toDateString()}.</p>
      }
      {!visibleCycle.isShapeUp &&
        <div>
          <p className="text-2xl">{visibleCycle.name}</p>
        </div>
      }
    </>
  )
}