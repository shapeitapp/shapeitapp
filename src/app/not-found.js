import CommonLayout from '@/components/CommonLayout'

export default async function NotFound() {
  return (
    <CommonLayout>
      <h2
        className="text-4xl leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-6xl">
        <span data-test="project-title" className="shapeup-animated-gradient">Not found</span>
      </h2>
      <p className="mt-10 text-2xl leading-6 font-medium text-gray-900">Could not find requested resource</p>
    </CommonLayout>
  )
}
