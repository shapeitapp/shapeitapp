'use client';

import { useState } from "react"
import { usePathname } from 'next/navigation'
import Header from "@/components/Header"
import { useProjectDetails } from "@/contexts/ProjectDetails"
import { CheckCircleIcon, CheckIcon } from '@heroicons/react/20/solid'
import Button from "./Button";
import Link from 'next/link';


export default function ProjectConfigurationPage() {
  const project = useProjectDetails()
  const { fields } = project

  const defaultCurrentStep = !fields.Cycle ? 'cycle' :
                             !fields.Kind ? 'kind' :
                             !fields.Appetite ? 'appetite' :
                             'done'
  const [currentStep, setCurrentStep] = useState(defaultCurrentStep)

  const steps = [
    { id: 'cycle', name: 'Create the "Cycle" field', status: fields.Cycle ? 'complete' : 'pending' },
    { id: 'kind', name: 'Create the "Kind" field', status: fields.Kind ? 'complete' : 'pending' },
    { id: 'appetite', name: 'Create the "Appetite" field', status: fields.Appetite ? 'complete' : 'pending' },
  ]

  return (
    <>
      <Header />

      <div className="flex mt-14 h-full">
        <aside className="pr-4 sm:pr-6 lg:pr-8 border-r border-gray-200">
          <nav className="flex justify-center" aria-label="Progress">
            <ol role="list" className="space-y-6">
              {steps.map((step) => (
                <li key={step.name}>
                  {step.status === 'complete' ? (
                    <a onClick={() => setCurrentStep(step.id)} className="cursor-pointer group">
                      <span className="flex items-start">
                        <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                          <CheckCircleIcon
                            className="h-full w-full text-pink-600 group-hover:text-pink-800"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                          {step.name}
                        </span>
                      </span>
                    </a>
                  ) : currentStep === step.id ? (
                    <a onClick={() => setCurrentStep(step.id)} className="cursor-pointer flex items-start" aria-current="step">
                      <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center" aria-hidden="true">
                        <span className="absolute h-4 w-4 rounded-full bg-pink-200" />
                        <span className="relative block h-2 w-2 rounded-full bg-pink-600" />
                      </span>
                      <span className="ml-3 text-sm font-medium text-pink-600">{step.name}</span>
                    </a>
                  ) : (
                    <a onClick={() => setCurrentStep(step.id)} className="cursor-pointer group">
                      <div className="flex items-start">
                        <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center" aria-hidden="true">
                          <div className="h-2 w-2 rounded-full bg-gray-300 group-hover:bg-gray-400" />
                        </div>
                        <p className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</p>
                      </div>
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <main className="flex-1 px-8">
          {
            currentStep === 'cycle' ? <CycleConfigStep status={steps.find(s => s.id === currentStep).status} project={project} /> :
            currentStep === 'kind' ? <KindConfigStep status={steps.find(s => s.id === currentStep).status} project={project} /> :
            currentStep === 'appetite' ? <AppetiteConfigStep status={steps.find(s => s.id === currentStep)?.status} project={project}  /> :
            currentStep === 'done' ? <AppetiteConfigStep status="complete" project={project}  /> : null
          }
        </main>
      </div>
    </>
  )
}

function CycleConfigStep({ status, project }) {
  if (status === 'complete') {
    return (
      <div className="prose prose-slate">
        <p className="flex">
          <CheckIcon className="w-6 h-6 text-green-500 mr-2" />
          The <strong className="mx-1.5">Cycle</strong> field is present and configured correctly in your project.
        </p>
        <p>You can now <a href={`${project.url}/settings/fields/${project.fields.Cycle.id}`} rel="noreferrer" target="_blank">add iterations to your Cycle field on GitHub</a>, if you haven&apos;t yet.</p>
        <div>
          <Button onClick={() => { window.location.reload() }} text="Take me to the next step" />
        </div>
      </div>
    )
  }

  return (
    <div className="prose prose-slate">
      <p>Make sure you <a href="https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-iteration-fields" rel="noreferrer" target="_blank">add a &quot;Cycle&quot; field to your GitHub project</a>. Its name must be &quot;Cycle&quot; (caps are important) and its type must be &quot;Iteration&quot; or a  &quot;Single Select &quot; .</p>
      <div>
        <Button onClick={() => { window.location.reload() }} text="I have done it!" />
      </div>
    </div>
  )
}

function KindConfigStep({ status }) {
  if (status === 'complete') {
    return (
      <div className="prose prose-slate">
        <p className="flex">
          <CheckIcon className="w-6 h-6 text-green-500 mr-2" />
          The <strong className="mx-1.5">Kind</strong> field is present and configured correctly in your project.
        </p>
        <div>
          <Button onClick={() => { window.location.reload() }} text="Take me to the next step" />
        </div>
      </div>
    )
  }

  return (
    <div className="prose prose-slate">
      <p>Make sure you <a href="https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-single-select-fields" rel="noreferrer" target="_blank">add a &quot;Kind&quot; field to your GitHub project</a>. Its name must be &quot;Kind&quot; (caps are important) and its type must be &quot;Single Select&quot;. Then add two options to the field: &quot;Bet&quot; and &quot;Pitch&quot; (caps are important).</p>
      <div>
        <Button onClick={() => { window.location.reload() }} text="I have done it!" />
      </div>
    </div>
  )
}

function AppetiteConfigStep({ status }) {
  const pathname = usePathname()
  const projectPath = pathname.replace('/configure', '')
  if (status === 'complete') {
    return (
      <div className="prose prose-slate">
        <p className="flex">
          <CheckIcon className="w-6 h-6 text-green-500 mr-2" />
          The <strong className="mx-1.5">Appetite</strong> field is present and configured correctly in your project.
        </p>
        <div>
          <Link href={projectPath}>
            <Button text="Take me to the next step" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="prose prose-slate">
      <p>Make sure you <a href="https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-single-select-fields" rel="noreferrer" target="_blank">add an &quot;Appetite&quot; field to your GitHub project</a>. Its name must be &quot;Appetite&quot; (caps are important) and its type must be &quot;Single Select&quot;.</p>
      <p>You can add as many options to this field as you want but we recommend you to add three: &quot;Small&quot;, &quot;Medium&quot;, and &quot;Big&quot;.</p>
      <p>
        <strong>Tip:</strong> Add emojis and colors to make it more fun:
        <span className="rounded-xl bg-green-100 border border-green-300 text-green-700 font-bold text-xs px-2 py-0.5 ml-2 mr-2">🐇 Small</span>
        <span className="rounded-xl bg-yellow-100 border border-yellow-300 text-yellow-700 font-bold text-xs px-2 py-0.5 mr-2">🐂 Medium</span>
        <span className="rounded-xl bg-orange-100 border border-orange-300 text-orange-700 font-bold text-xs px-2 py-0.5 mr-2">🦑 Big</span>
      </p>
      <div>
        <Button onClick={() => { window.location.reload() }} text="I have done it!" />
      </div>
    </div>
  )
}
