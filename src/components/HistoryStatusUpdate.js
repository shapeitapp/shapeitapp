import ReactMarkdown from 'react-markdown'
import GithubFlavoredMarkdown from 'remark-gfm'
import RemarkEmoji from 'remark-emoji'
import { LinkIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline'

export default function HistoryStatusUpdate ({ statusUpdate, className = '' }) {
  function fullDateTime() {
    const date = new Date(statusUpdate.progress.createdAt).toDateString()
    const time = new Date(statusUpdate.progress.createdAt).toLocaleTimeString()
    if (statusUpdate.progress.createdAt !== statusUpdate.progress.updatedAt) {
      const updateDate = new Date(statusUpdate.progress.updatedAt).toDateString()
      const updateTime = new Date(statusUpdate.progress.updatedAt).toLocaleTimeString()
      return `${date} ${time} (last edited at ${updateDate} ${updateTime})`
    }
    return `${date} ${time}`
  }
  
  function lastDate() {
    if (statusUpdate.progress.createdAt !== statusUpdate.progress.updatedAt) {
      return new Date(statusUpdate.progress.updatedAt).toDateString()
    }
    return new Date(statusUpdate.progress.createdAt).toDateString()
  }

  function colorOfPercentage() {
    if (statusUpdate.progress.percentage < 30) return 'text-red-500'
    if (statusUpdate.progress.percentage < 60) return 'text-yellow-400'
    return 'text-green-500'
  }

  function ProgressUpdate() {
    return (
      <>
        <div className="flex">
          <img className="inline-block h-10 w-10 rounded-md" src={statusUpdate.progress.author.avatarUrl} title={statusUpdate.progress.author.name || statusUpdate.progress.author.login} />
          <div className="ml-2 -mt-1">
            <a href={statusUpdate.progress.author.url} target="_blank" className="text-sm text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150">{statusUpdate.progress.author.name || statusUpdate.progress.author.login}</a>
            <div className="text-sm text-gray-500">
              Updated progress of
              <a href={statusUpdate.progress.url} target="_blank" className="inline-flex mx-1.5 text-sm text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150">
                <div style={{ backgroundColor: statusUpdate.scope.color }} className="mr-1 rounded-full w-3 h-3"></div>
                <div className="-mt-1">{statusUpdate.scope.title}</div>
              </a>
              to <span className={colorOfPercentage()}>{statusUpdate.progress.percentage}% {statusUpdate.progress.percentage === 100 && '✨'}</span> on&nbsp;
              <span title={fullDateTime()}>
                {lastDate()}
              </span>
              {
                statusUpdate.progress.createdAt !== statusUpdate.progress.updatedAt && (
                  <span className="text-gray-400 ml-2">(edited)</span>
                )
              }
            </div>
          </div>
        </div>
        <ReactMarkdown plugins={[GithubFlavoredMarkdown, RemarkEmoji]} className="mt-4 mb-7 prose prose-pink">
          {statusUpdate.progress.statusMarkdown}
        </ReactMarkdown>
        <div className='flex'>
          <LinkIcon className="h-5 w-5 text-gray-400 mb-2 mr-6" aria-hidden="true" />
          <ChatBubbleOvalLeftIcon className="h-5 w-5 text-gray-400 mb-2 mr-6" aria-hidden="true" />
        </div>
      </>
    )
  }
  
  function CloseUpdate() {
    if (statusUpdate.progress.notPlanned) {
      return (
        <div className="flex mt-4 mb-8">
          <img className="inline-block h-10 w-10 rounded-md" src={statusUpdate.progress.author.avatarUrl} title={statusUpdate.progress.author.name || statusUpdate.progress.author.login} />
          <div className="ml-2 -mt-1">
            <a href={statusUpdate.progress.author.url} target="_blank" className="text-sm text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150">{statusUpdate.progress.author.name || statusUpdate.progress.author.login}</a>
            <div className="text-sm text-gray-500">
              Closed
              <a href={statusUpdate.progress.url} target="_blank" className="inline-flex mx-1.5 text-sm text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150">
                <div style={{ backgroundColor: statusUpdate.scope.color }} className="mr-1 rounded-full w-3 h-3 animate-pulse"></div>
                <div className="-mt-1">{statusUpdate.scope.title}</div>
              </a>
              as <span className="bg-red-500 text-white rounded px-2 py-0.5">not planned</span> {'on '}
              <span title={fullDateTime()}>
                {lastDate()}
              </span>
              {
                statusUpdate.progress.createdAt !== statusUpdate.progress.updatedAt && (
                  <span className="text-gray-400 ml-2">(edited)</span>
                )
              }
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex mt-4 mb-8">
        <img className="inline-block h-10 w-10 rounded-md" src={statusUpdate.progress.author.avatarUrl} title={statusUpdate.progress.author.name || statusUpdate.progress.author.login} />
        <div className="ml-2 -mt-1">
          <a href={statusUpdate.progress.author.url} target="_blank" className="text-sm text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150">{statusUpdate.progress.author.name || statusUpdate.progress.author.login}</a>
          <div className="text-sm text-gray-500">
            Completed
            <a href={statusUpdate.progress.url} target="_blank" className="inline-flex mx-1.5 text-sm text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150">
              <div style={{ backgroundColor: statusUpdate.scope.color }} className="mr-1 rounded-full w-3 h-3"></div>
              <div className="-mt-1">{statusUpdate.scope.title}</div>
            </a>
            {'🎉 on '}
            <span title={fullDateTime()}>
              {lastDate()}
            </span>
            {
              statusUpdate.progress.createdAt !== statusUpdate.progress.updatedAt && (
                <span className="text-gray-400 ml-2">(edited)</span>
              )
            }
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} border-b stroke-gray-200`}>
      {
        statusUpdate.progress.closed ? (
          <CloseUpdate />
        ): (
          <ProgressUpdate />
        )
      }
    </div>
  )
}