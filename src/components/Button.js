export default function Button({ text, href, onClick = () => {} }) {
  if (href) {
    return (
      <a className="inline-block bg-pink-700 text-white font-medium px-4 py-1.5 rounded no-underline hover:bg-pink-600" href={href} onClick={onClick}>{text}</a>
    )
  }

  return (
    <button className="bg-pink-700 text-white font-medium px-4 py-1.5 rounded hover:bg-pink-600" onClick={onClick}>{text}</button>
  )
}