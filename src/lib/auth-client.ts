"use client"

import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [organizationClient()]
})

// Export individual methods
export const signIn = authClient.signIn
export const signUp = authClient.signUp
export const signOut = authClient.signOut
export const useSession = authClient.useSession
export const getSession = authClient.getSession

// Export organization methods
export const createOrganization = authClient.organization.create
export const getFullOrganization = authClient.organization.getFullOrganization
export const listOrganizations = authClient.organization.list
export const setActiveOrganization = authClient.organization.setActive
export const inviteMember = authClient.organization.inviteMember
export const listMembers = authClient.organization.listMembers
export const removeMember = authClient.organization.removeMember
export const updateMemberRole = authClient.organization.updateMemberRole
