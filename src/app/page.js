import { Intro, IntroFooter } from '@/components/Intro'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from './api/auth/[...nextauth]/route'

function Timeline() {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden lg:right-0 lg:min-w-[32rem] lg:overflow-visible">
      <svg
        className="absolute left-[max(0px,calc(50%-18.125rem))] top-0 h-full w-1.5 lg:left-full lg:ml-1 xl:left-auto xl:right-1 xl:ml-0"
        aria-hidden="true"
      >
        <defs>
          <pattern id="timeline" width="6" height="8" patternUnits="userSpaceOnUse">
            <path
              d="M0 0H6M0 8H6"
              className="stroke-sky-900/10 dark:stroke-white/10 xl:stroke-white/10"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#timeline)" />
      </svg>
    </div>
  )
}

function Glow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gray-950 lg:right-0 lg:min-w-[32rem]">
      <svg
        className="absolute -bottom-48 left-[-40%] h-[80rem] w-[180%] lg:-right-40 lg:bottom-auto lg:left-auto lg:top-[-40%] lg:h-[180%] lg:w-[80rem]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="gradient-desktop" cx="100%">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)" />
            <stop offset="53.95%" stopColor="rgba(0, 71, 255, 0.09)" />
            <stop offset="100%" stopColor="rgba(10, 14, 23, 0)" />
          </radialGradient>
          <radialGradient id="gradient-mobile" cy="100%">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)" />
            <stop offset="53.95%" stopColor="rgba(0, 71, 255, 0.09)" />
            <stop offset="100%" stopColor="rgba(10, 14, 23, 0)" />
          </radialGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#gradient-desktop)"
          className="hidden lg:block"
        />
        <rect
          width="100%"
          height="100%"
          fill="url(#$gradient-mobile)"
          className="lg:hidden"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 right-0 h-px bg-white mix-blend-overlay lg:left-auto lg:top-0 lg:h-auto lg:w-px" />
    </div>
  )
}

function FixedSidebar({ main, footer }) {
  return (
    <div className="flex fixed left-0 top-0 bottom-0 w-1/2">
      <div className="relative overflow-hidden px-6 lg:pointer-events-none lg:z-40 lg:flex lg:w-full lg:px-0">
        <Glow />
        <div className="relative flex w-full lg:pointer-events-auto lg:min-w-[32rem] lg:overflow-y-auto lg:overflow-x-hidden lg:justify-end lg:pr-32">
          <div className="mx-auto max-w-lg lg:mx-0 lg:flex lg:w-96 lg:max-w-none lg:flex-col lg:before:flex-1 lg:before:pt-6">
            <div className="pb-16 pt-20 sm:pb-20 sm:pt-32 lg:py-20">
              <div className="relative">
                {main}
              </div>
            </div>
            <div className="flex flex-1 items-end justify-center pb-4 lg:justify-start lg:pb-6">
              {footer}
            </div>
          </div>
        </div>
        <Timeline />
      </div>
    </div>
  )
}

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    return redirect('/projects')
  }

  return (
    <>
      <FixedSidebar main={<Intro />} footer={<IntroFooter />} />
      <div className="fixed left-1/2 top-0 right-0 bottom-0 overflow-auto flex flex-col flex-1 bg-gray-950">
        <div className="flex flex-row flex-1 w-full">
          <div className="relative flex-1">
            <main className="space-y-20 py-20 sm:space-y-32 sm:py-32 lg:pl-12 lg:pr-8">
              <article className="prose prose-sky prose-invert">
                <div className="relative mt-8 overflow-hidden rounded-xl bg-white dark:bg-gray-900 [&+*]:mt-8">
                  <img src="/img/features/hill-chart.png" />
                </div>
                
                <h2 className="prose-h2">Hill chart</h2>
                <p>A hill chart helps you and your team quickly visualize where you're at in your project. Want to see how that feature is progressing? Stop bothering engineers to do stand-up meetings, simply have a look at your Shape It! dashboard.</p>
              </article>
              <article className="prose prose-sky prose-invert">
                <div className="relative mt-8 overflow-hidden rounded-xl bg-white dark:bg-gray-900 [&+*]:mt-8">
                  <img src="/img/features/progress-updates.png" />
                </div>
                
                <h2 className="prose-h2">Progress updates</h2>
                <p>Your team can communicate updates right on the issue or pull request they're working on. No need to go to a different app. Shape It! adapts to your workflow, not the other way around.</p>
              </article>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
