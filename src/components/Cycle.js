import Link from 'next/link'
import Pitches from './Pitches'
import CycleDetails from './CycleDetails'
import CycleHeader from './CycleHeader'

export default function Cycle({ visibleCycle, inCycle, previousCycle, nextCycle, pitches, selectedScopes, shouldShowPitches }) {
  const history = (selectedScopes || []).map(scope => {
    return scope.progress.history?.map(h => {
      return {
        progress: h,
        scope,
      }
    })
  }).flat().sort((h1, h2) => {
    return new Date(h2.progress.updatedAt) - new Date(h1.progress.updatedAt)
  }).filter(Boolean)

  const isPastCycle = visibleCycle.isShapeUp ? new Date(visibleCycle.endDate) < new Date() : false

  return (
    <>
      <CycleHeader visibleCycle={visibleCycle} inCycle={inCycle} isPastCycle={isPastCycle} previousCycle={previousCycle} nextCycle={nextCycle} />
      {
        !inCycle && (
          <div className="rounded-md bg-yellow-50 shadow-xs p-4 my-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm leading-5 font-medium text-yellow-800">
                  Attention
                </h3>
                <div className="mt-2 text-sm leading-5 text-yellow-700">
                  <p>
                    {
                      isPastCycle && visibleCycle.isShapeUp ? (
                        <span>
                          This cycle has already finished.
                          <Link href="/" className="inline-flex mx-1.5 text-sm text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150">
                            Go to the current cycle.
                          </Link>
                        </span>
                      ) : (
                        shouldShowPitches ? (
                          <span>This cycle hasn&apos;t started yet. We&apos;re currently evaluating the pitches below and will soon decide which ones will make it to the cycle. Stay tuned!</span>
                          ) : (
                            visibleCycle.isShapeUp ? (
                              <span>We have already placed our bets but <strong>this cycle hasn&apos;t started yet</strong>. Stay tuned!</span>
                            ) : (
                              <span>The release date will be displayed after the completion of all scopes, Stay tuned!</span>
                            )
                        )
                      )
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }
      {
        shouldShowPitches ?
          (<Pitches pitches={pitches} />) :
          (<CycleDetails selectedScopes={selectedScopes} history={history} />)
      }
    </>
  )
}