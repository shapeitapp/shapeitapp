import { redirect } from 'next/navigation'
import { fetchProject } from './layout'

export default async function ProjectPage({ params }) {
  const project = await fetchProject(params)
  if (!project.currentCycle) return redirect(`/projects/${params.ownerType}/${params.org}/${params.project}/configure`)
  return redirect(`/projects/${params.ownerType}/${params.org}/${params.project}/cycles/${project.currentCycle.id}`)
}
