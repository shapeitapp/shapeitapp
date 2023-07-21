import Toggle from './Toggle'

export default function Bet({
  issue,
  toggled = false,
  disabled = false,
  className = '',
  onChange = () => {},
}) {
  return (
    <div className={`pb-1 shadow-sm rounded-md  ${className}`}>
      <div className={`flex`}>
        <div className="flex-1 flex items-center justify-between  rounded-r-md" >
          <div className="flex-1 px-4 py-2 text-sm leading-5 ">
            <a href={issue.url} target="_blank" className="text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150" title={issue.title} rel="noreferrer">{issue.title}</a>
            <p className="text-gray-500">{issue.appetite}</p>
          </div>
          <div className="flex-shrink-0 pr-2">
            <Toggle toggled={toggled} disabled={disabled} onChange={(toggled) => onChange({issue, toggled})} />
          </div>
        </div>
      </div>
        <div className="w-full bg-gray-200 h-2 rounded-xl mt-2">
          <div
            className="bg-green-500 h-full rounded-xl"
            style={{ width: `${issue.progress}%` }}
          ></div>
      </div>
    </div>
  )
}