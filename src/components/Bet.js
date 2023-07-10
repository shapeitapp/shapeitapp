import { useEffect, useState, useRef } from 'react'

import Toggle from './Toggle'

export default function Bet({
  issue,
  toggled = false,
  disabled = false,
  className = '',
  onChange = () => {},
}) {
  const boxRef = useRef();
  const [backgroundPosition, setBackgroundPosition] = useState('');
  useEffect(() => {
    console.log('width', boxRef.current ? boxRef.current.offsetWidth : 0);
    const offsetWidth = boxRef.current ? boxRef.current.offsetWidth : 0;
    const offsetHeight = boxRef.current ? boxRef.current.offsetHeight : 0;
    const total = offsetWidth*2 + offsetHeight*2
    console.log(`total`, total)
    const borderLen = (60 / 100) * total
    console.log(`borderLength`, borderLen, `offsetWidth`, offsetWidth)
    let backgroundPos
    if (borderLen <= offsetWidth) {
      backgroundPos = (-500 + borderLen) + 'px 0px, 495px -300px, 500px 295px, 0px 300px';
    } else if (borderLen <= (offsetWidth + offsetHeight)) {
      backgroundPos = '0px 0px, 495px ' + (-300 + (borderLen - offsetWidth)) + 'px, 500px 295px, 0px 300px';
    } else if (borderLen <= (offsetWidth * 2 + offsetHeight)) {
      backgroundPos = '0px 0px, 495px 0px, ' + (500 - (borderLen - offsetWidth - offsetHeight)) + 'px 295px, 0px 300px';
    } else {
      backgroundPos = '0px 0px, 495px 0px, 0px 295px, 0px ' + (300 - (borderLen - (offsetWidth * 2) - offsetHeight)) + 'px';
    }
    console.log(backgroundPos)
    setBackgroundPosition(backgroundPos)
  }, []);
  return (
    <div className='shapeup-progress-bet' style={{ backgroundPosition: backgroundPosition }} ref={boxRef}>
    <div className={`flex shadow-sm rounded-md  ${className}`}>
      <div className="flex-1 flex items-center justify-between  rounded-r-md" >
        <div className="flex-1 px-4 py-2 text-sm leading-5">
          <a href={issue.url} target="_blank" className="text-gray-900 font-medium hover:text-gray-600 transition ease-in-out duration-150" title={issue.title} rel="noreferrer">{issue.title}</a>
          <p className="text-gray-500">{issue.appetite}</p>
        </div>
        <div className="flex-shrink-0 pr-2">
          <Toggle toggled={toggled} disabled={disabled} onChange={(toggled) => onChange({issue, toggled})} />
        </div>
      </div>
      </div>
    </div>
  )
}