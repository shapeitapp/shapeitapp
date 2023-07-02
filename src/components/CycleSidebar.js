import Bet from './Bet'
import Scope from './Scope'

export default function ({
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
        <p className="max-w-4xl text-sm leading-5 text-gray-500">Ideas you're <strong>committed</strong> to implement during this cycle.</p>
      </div>

      <div>
        {
          availableBets.map((bet, index) => (
            <Bet key={index} issue={bet} toggled={visibleBet && bet.url === visibleBet.url} disabled={availableBets.length === 1} className="mt-3" onChange={onBetChange} />
          ))
        }
        {
          !visibleBet && (
            <p className="italic text-sm text-gray-400 mt-4">No bets have been created yet.</p>
          )
        }
      </div>

      {/* <div className="mt-8 pb-5 border-b border-gray-200 space-y-2">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Scopes
        </h3>
        <p className="max-w-4xl text-sm leading-5 text-gray-500">
          Subtasks to make the development of the bet easier.
        </p>
      </div>

      <div>
        {
          (visibleScopes || []).map((scope, index) => (
            <Scope key={index} issue={scope} toggled={!!selectedScopes.find(s => s.url === scope.url)} onChange={onScopeChange} className="mt-3" />
          ))
        }
        {
          !(visibleScopes || []).length && (
            <p className="italic text-sm text-gray-400 mt-4">No scopes have been created yet.</p>
          )
        }
      </div> */}
    </div>
  )
}