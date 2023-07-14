'use client';

import { Logo } from '@/components/Logo'
import { signIn } from 'next-auth/react'

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M8 .198a8 8 0 0 0-8 8 7.999 7.999 0 0 0 5.47 7.59c.4.076.547-.172.547-.384 0-.19-.007-.694-.01-1.36-2.226.482-2.695-1.074-2.695-1.074-.364-.923-.89-1.17-.89-1.17-.725-.496.056-.486.056-.486.803.056 1.225.824 1.225.824.714 1.224 1.873.87 2.33.666.072-.518.278-.87.507-1.07-1.777-.2-3.644-.888-3.644-3.954 0-.873.31-1.586.823-2.146-.09-.202-.36-1.016.07-2.118 0 0 .67-.214 2.2.82a7.67 7.67 0 0 1 2-.27 7.67 7.67 0 0 1 2 .27c1.52-1.034 2.19-.82 2.19-.82.43 1.102.16 1.916.08 2.118.51.56.82 1.273.82 2.146 0 3.074-1.87 3.75-3.65 3.947.28.24.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.14.46.55.38A7.972 7.972 0 0 0 16 8.199a8 8 0 0 0-8-8Z" />
    </svg>
  )
}

export function Intro() {
  return (
    <>
      <div>
        <Logo size="m" />
      </div>
      <h1 data-test="hero-heading" className="mt-12 font-display text-4xl/tight font-light text-white">
        <div>Shape Up dashboard</div>
        <span className="text-sky-300">for GitHub Projects</span>
      </h1>
      <p className="mt-4 text-sm/6 text-gray-300">
        Convert your GitHub Project into Shape Up one. Visualize the progress of your team while keeping your operations on GitHub.
      </p>
      <button onClick={() => signIn('github')} className="text-white inline-flex flex-row cursor-pointer align-middle mt-8 px-5 py-4 border-sky-700 border rounded-lg hover:border-sky-950 hover:bg-sky-950">
        <GitHubIcon className="w-6 inline-block mr-4" />
        Sign in using GitHub
      </button>
    </>
  )
}

export function IntroFooter() {
  return (
    <div className="mt-8 md:mt-0 md:order-1">
      <p className="text-center text-base leading-6 text-gray-400">
        Made with <code className="text-sky-500">:love:</code> by <a href="https://www.fmvilas.me" target="_blank" className="text-sky-500 font-medium hover:text-sky-800 transition ease-in-out duration-150" rel="noreferrer">Fran Mendez</a>
      </p>
    </div>
  )
}
