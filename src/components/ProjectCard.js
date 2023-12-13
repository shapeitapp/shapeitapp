import { ChevronRightIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const statuses = {
  notConnected: 'text-gray-500 bg-gray-800/10',
  connected: 'text-green-500 bg-green-800/10',
}

export default function ProjectCard({ project, isConnected }) {

  return (
    <li key={project.url} className="relative flex items-center space-x-4 py-4">
      <div className="min-w-0 flex-auto">
        <div className="flex items-center gap-x-3">
          <div className={classNames(statuses[isConnected ? 'connected' : 'notConnected'], 'flex-none rounded-full p-1')}>
            <div className="h-2 w-2 rounded-full bg-current" />
          </div>
          <h2 className="flex gap-x-2 min-w-0 text-sm font-semibold leading-6 text-white">
            <a href={project.orgUrl} target="_blank" rel="noreferrer">
              <span className="truncate text-gray-500">{project.orgName}</span>
            </a>
            <span className="text-gray-500">/</span>
            <a href={project.url} target="_blank" rel="noreferrer">
              <span className="whitespace-nowrap text-gray-500">{project.title}</span>
            </a>
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-500">
          <p className="truncate">{project.public ? 'Public' : 'Private'}</p>
          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-700">
            <circle cx={1} cy={1} r={1} />
          </svg>
          <p className="whitespace-nowrap">Created by <a href={project.creator.url} target='_blank' rel="noreferrer">{project.creator.login}</a></p>
        </div>
      </div>
      {
        isConnected ? (
          <a
            className="flex space-x-4 items-center text-gray-500 bg-gray-400/10 ring-gray-400/20 rounded-full py-1 px-2 text-xs font-medium ring-1 ring-inset"
            href={`/projects/${project.ownerType}/${project.orgName}/${project.number}`}
          >
            Go to project

            <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </a>
        ) : (
          <a
            className="text-pink-600 bg-pink-600/10 ring-pink-600/30 rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset"
            href={`/projects/${project.ownerType}/${project.orgName}/${project.number}/configure`}
          >
            Connect
          </a>
        )
      }
    </li>
  )
}
