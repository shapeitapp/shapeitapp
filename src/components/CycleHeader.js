import React, { useState } from 'react'
import Link from 'next/link'
import { DateTime } from 'luxon'
import { useProjectDetails } from '@/contexts/ProjectDetails'

function getWeeksAndDaysUntilDate(date){
  const diff = date.diffNow(['weeks', 'days']).toObject();
  const weeks = Math.floor(diff.weeks);
  const days = Math.floor(diff.days);

  const weekOutput = weeks !== 0 ? `${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}` : '';
  const dayOutput = days !== 0 ? `${days} ${days === 1 ? 'Day' : 'Days'}` : '';

  return weekOutput + (weekOutput && dayOutput ? ', ' : '') + dayOutput;
}



export default function CycleHeader({ visibleCycle, inCycle, previousCycle, nextCycle, isPastCycle }) {
  const dueOnDate = DateTime.fromISO(visibleCycle.endDate)
  const { org, number: projectNumber, ownerType } = useProjectDetails()
  const [showCalendar, setShowCalendar] = useState(false)

  const previousCycleButton = (
    <div data-test="previous-cycle" title={previousCycle && 'Go to the previous cycle'}>
      <svg className={`w-6 h-6 ${!previousCycle && 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  )

  const nextCycleButton = (
    <div data-test="next-cycle" title={previousCycle && 'Go to the next cycle'}>
      <svg className={`w-6 h-6 ${!nextCycle && 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )

  const handleMouseEnter = () => {
    setShowCalendar(true);
  };

  const handleMouseLeave = () => {
    setShowCalendar(false);
  };

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

                <span  className="inline-block transform -translate-y-1.5 ml-2 px-2 py-1 text-indigo-800 uppercase text-xs leading-4 font-medium border border-indigo-100 rounded-full">
                 <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  { getWeeksAndDaysUntilDate(dueOnDate) } remaining
                  </div>
                  {showCalendar &&
                    <div className=" flex flex-col bg-gray-100 text-gray-800 w-[11rem] p-2 border-inherit rounded-md absolute z-1 mt-2 border border-cyan-100">
                      <span className='mt-2 font-bold'>Start Date: </span>
                      <span>{new Date(visibleCycle.startDate).toDateString()}</span>
                      <span className='mt-2 font-bold'>Projected End Date : </span>
                      <span>{new Date(visibleCycle.endDate).toDateString()}</span>
                    </div>
                  }
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
      {!visibleCycle.isShapeUp &&
        <div>
          <p data-test="cycle-name" className="text-2xl">{visibleCycle.name}</p>
        </div>
      }
    </>
  )
}