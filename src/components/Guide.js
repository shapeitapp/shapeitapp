export default function Guide({title, content}) {
    return (
      <>
        <h2 className="text-4xl leading-10 font-extrabold text-gray-500 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-6xl">
          {title}
        </h2>
        <div className="mt-8">
          <article>
              <div dangerouslySetInnerHTML={{ __html: content }} />
          </article>
        </div>
      </>
    )
}