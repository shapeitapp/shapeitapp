import Bet from './Bet'
import Scope from './Scope'

export default function CycleSidebar({
  availableBets,
  visibleBet,
  onBetChange = () => {},
  visibleScopes,
  selectedScopes,
  onScopeChange = () => {},
}) {
  return (
    <div className="lg:shadow lg:p-4">
      <div className="pb-5 border-b border-gray-200 space-y-2">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Bets
        </h3>
        <p className="max-w-4xl text-sm leading-5 text-gray-500">Ideas you&apos;re <strong>committed</strong> to implement during this cycle.</p>
      </div>

      <div>
        {
          availableBets.map((bet, index) => {
            return <Bet key={index} issue={bet} toggled={visibleBet && bet.id === visibleBet.id}  className="mt-3" onChange={onBetChange} />
          })
        }
        {
          !visibleBet && (
            <p className="italic text-sm text-gray-400 mt-4">No bets have been created yet.</p>
          )
        }
      </div>
    </div>
  )
}