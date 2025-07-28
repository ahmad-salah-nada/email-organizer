'use client'

import { useState } from 'react'
import { Plus, Building2, AlertTriangle } from 'lucide-react'

export default function OrganizationSelector() {
  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <div className="relative">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-amber-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">Organization Feature</span>
        </div>
        
        {/* Organization Selector Placeholder */}
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-gray-400" />
          <select
            disabled
            className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-gray-50 text-gray-500 cursor-not-allowed"
          >
            <option>Personal (Demo Mode)</option>
          </select>
        </div>

        {/* Create Organization Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          disabled
          className="flex items-center space-x-1 text-sm text-gray-400 cursor-not-allowed"
          title="Organization creation will be available in future updates"
        >
          <Plus className="h-4 w-4" />
          <span>New Org (Coming Soon)</span>
        </button>
      </div>

      {/* Create Organization Form Placeholder */}
      {showCreateForm && (
        <div className="absolute top-8 left-0 bg-amber-50 border border-amber-200 rounded-md shadow-lg p-4 z-10">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-medium">Feature Under Development</h3>
            </div>
            <p className="text-sm text-amber-600">
              Multi-organization support is currently being developed and will be available in a future release.
            </p>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-md hover:bg-amber-200"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
