"use client"

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  const checkAuthAndRedirect = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/get-session')
      const session = await response.json()
      
      if (session?.user) {
        router.push('/inbox')
      } else {
        router.push('/signin')
      }
    } catch {
      router.push('/signin')
    }
  }, [router])

  useEffect(() => {
    checkAuthAndRedirect()
  }, [checkAuthAndRedirect])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
