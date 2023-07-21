'use client'

import Head from 'next/head'
import { useEffect, useState } from 'react'
import Header from './Header'
import Cycle from './Cycle'
import CycleSidebar from './CycleSidebar'
import { useProjectItemsDetails } from '@/contexts/ProjectItemsDetails'
import { useUrlParams } from '@/contexts/UrlParams'
import { notFound, useSearchParams, usePathname, useRouter } from 'next/navigation'


export default function CyclePage() {
  const { cycle } = useUrlParams()
  const searchParams = useSearchParams()
  const pathName = usePathname() || "/"
  const router = useRouter()
  const betIssue = searchParams.get('issue')
  const { cycles, pitches, bets } = useProjectItemsDetails()
  const {
    visibleCycle,
    inCycle,
    previousCycle,
    nextCycle,
    availableBets,
    availablePitches
  } = prepareData({ requestedCycle: cycle, cycles, pitches, bets, betIssue })

  const [visibleBet, setVisibleBet] = useState(availableBets.find(bet => belongsToCycle(visibleCycle, bet)))
  const [visibleScopes, setVisibleScopes] = useState(visibleBet?.scopes)
  const [selectedScopes, setSelectedScopes] = useState(visibleScopes)

  useEffect(() => {
    const allBetScopes = visibleBet?.scopes
    setVisibleScopes(allBetScopes)
    setSelectedScopes(allBetScopes)
  }, [visibleBet])
  
  useEffect(() => {
    if (betIssue) {
      setVisibleBet(availableBets.find(bet => belongsToCycle(visibleCycle, bet) && bet.id === betIssue))
    } else {
      setVisibleBet(availableBets.find(bet => belongsToCycle(visibleCycle, bet)))
    }
  }, [visibleCycle, availableBets, betIssue])

  function updateSearchParam (searchParams, param, value) {
    const currentSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
    currentSearchParams.set(param, value);

    return currentSearchParams;
  }

  function onBetChange({ issue, toggled }) {
    if (toggled) {
      setVisibleBet(issue)
      if (searchParams?.entries()) {
        const updatedSearchParams = updateSearchParam(searchParams, "issue", issue.id)
        router.push(`${pathName}?${updatedSearchParams}`, {shallow: true})
      }
    }
  }

  function onScopeChange({ issue, toggled }) {
    if (toggled) {
      setSelectedScopes([...selectedScopes, issue])
    } else {
      setSelectedScopes(selectedScopes.filter(sc => sc.url !== issue.url))
    }
  }

  function shouldShowPitches() {
    if (!availableBets.length) return true
    if (availablePitches.length) return true
    return false
  }

  return (
    <>
      <Head>
        <title>Shape It! - Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white">
        <Header />
        <div className={`mt-16 ${!shouldShowPitches() && 'grid grid-cols-1 gap-6 lg:grid-cols-4'}`}>
          { !shouldShowPitches() && (
            <div>
              <CycleSidebar
                availableBets={availableBets}
                visibleBet={visibleBet}
                onBetChange={onBetChange}
                visibleScopes={visibleScopes}
                selectedScopes={selectedScopes}
                onScopeChange={onScopeChange}
              />
            </div>
          ) }
          <div className="lg:col-span-3">
            <Cycle
              visibleCycle={visibleCycle}
              inCycle={inCycle}
              previousCycle={previousCycle}
              nextCycle={nextCycle}
              pitches={availablePitches}
              selectedScopes={selectedScopes}
              shouldShowPitches={shouldShowPitches()}
            />
          </div>
        </div>

      </div>
    </>
  )
}

function prepareData({ requestedCycle, cycles, pitches, bets }) {
  let { cycle, inCycle } = getVisibleCycleDetails(requestedCycle, cycles)
  if (!cycle) return notFound()
  const visibleCycle = cycle
  inCycle = inCycle
  
  const visibleCycleIndex = cycles.findIndex(cycle => cycle.id === visibleCycle.id)
  const previousCycle = visibleCycleIndex > 0 ? cycles[visibleCycleIndex - 1] : null
  const nextCycle = visibleCycleIndex < cycles.length - 1 ? cycles[visibleCycleIndex + 1] : null

  const availablePitches = pitches.filter(p => p.cycle === visibleCycle.id)
  const availableBets = bets.filter(b => b.cycle === visibleCycle.id)

  return {
    visibleCycle,
    inCycle,
    previousCycle,
    nextCycle,
    availableBets,
    availablePitches,
  }
}

function getVisibleCycleDetails(id, cycles) {
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

function belongsToCycle(cycle, bet) {
  if (!cycle || !bet) return false
  return bet.cycle === cycle.id
}