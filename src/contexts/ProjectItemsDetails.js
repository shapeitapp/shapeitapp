'use client';

import { createContext, useContext } from 'react'

export const ProjectItemsDetailsContext = createContext({})

export function ProjectItemsDetailsProvider({ children, value = {} }) {
  return <ProjectItemsDetailsContext.Provider value={value}>{children}</ProjectItemsDetailsContext.Provider>
}

export function useProjectItemsDetails() {
  return useContext(ProjectItemsDetailsContext)
}