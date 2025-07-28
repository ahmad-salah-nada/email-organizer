'use client'

import { useState, useEffect, useCallback } from 'react'
import { authClient } from '@/lib/auth-client'
import { Plus, Building2, CheckIcon } from 'lucide-react'

interface Organization {
  id: string
  name: string
  slug: string
  logo?: string
}

export default function OrganizationSelector() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [activeOrganization, setActiveOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [newOrgSlug, setNewOrgSlug] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Fetch organizations with error handling
  const fetchOrganizations = useCallback(async () => {
    try {
      setError(null)
      setIsLoading(true)
      
      const { data: user } = await authClient.getSession()
      if (!user) {
        setOrganizations([])
        setActiveOrganization(null)
        return
      }

      const { data: userOrgs } = await authClient.organization.list()
      
      if (userOrgs) {
        setOrganizations(userOrgs)
        
        // Set first organization as active if none is set
        if (userOrgs.length > 0 && !activeOrganization) {
          setActiveOrganization(userOrgs[0])
        }
      }
    } catch (err) {
      console.error('Failed to fetch organizations:', err)
      setError('Failed to load organizations')
    } finally {
      setIsLoading(false)
    }
  }, [activeOrganization])

  // Set active organization
  const setActiveOrg = useCallback(async (org: Organization) => {
    try {
      setError(null)
      await authClient.organization.setActive({
        organizationId: org.id
      })
      setActiveOrganization(org)
    } catch (err) {
      console.error('Failed to set active organization:', err)
      setError('Failed to set active organization')
    }
  }, [])

  // Create new organization
  const createOrganization = useCallback(async () => {
    if (!newOrgName.trim() || !newOrgSlug.trim()) return

    try {
      setError(null)
      setIsCreating(true)
      
      const { data: newOrg } = await authClient.organization.create({
        name: newOrgName.trim(),
        slug: newOrgSlug.trim()
      })

      if (newOrg) {
        setOrganizations(prev => [...prev, newOrg])
        await setActiveOrg(newOrg)
        setShowCreateForm(false)
        setNewOrgName('')
        setNewOrgSlug('')
      }
    } catch (err) {
      console.error('Failed to create organization:', err)
      setError('Failed to create organization')
    } finally {
      setIsCreating(false)
    }
  }, [newOrgName, newOrgSlug, setActiveOrg])

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setNewOrgName(value)
    setNewOrgSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  }

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Building2 className="h-4 w-4" />
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-4">
        {error && (
          <div className="text-sm text-red-600 mr-2">
            {error}
          </div>
        )}
        
        {/* Organization Selector */}
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-gray-500" />
          <select
            value={activeOrganization?.id || ''}
            onChange={(e) => {
              const org = organizations.find(o => o.id === e.target.value)
              if (org) setActiveOrg(org)
            }}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {/* Create Organization Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-800"
        >
          <Plus className="h-4 w-4" />
          <span>New Org</span>
        </button>

        {/* Organization Info */}
        {activeOrganization && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <CheckIcon className="h-4 w-4" />
            <span>{activeOrganization.name}</span>
          </div>
        )}
      </div>

      {/* Create Organization Form */}
      {showCreateForm && (
        <div className="absolute top-8 left-0 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createOrganization()
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={newOrgName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter organization name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Slug
              </label>
              <input
                type="text"
                value={newOrgSlug}
                onChange={(e) => setNewOrgSlug(e.target.value)}
                placeholder="organization-slug"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isCreating || !newOrgName.trim()}
                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  setNewOrgName('')
                  setNewOrgSlug('')
                }}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
