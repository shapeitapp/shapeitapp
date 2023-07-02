
import { redirect } from 'next/navigation'
import { fetchProject, isProjectConfigured } from './layout'

export default async function ProjectPage({ params }) {
  const project = await fetchProject(params)
  const projectConfigured = await isProjectConfigured(project);
  if (!projectConfigured) return redirect(`/projects/${params.ownerType}/${params.org}/${params.project}/configure`)
  return redirect(`/projects/${params.ownerType}/${params.org}/${params.project}/cycles/${project.currentCycle.id}`)
}
