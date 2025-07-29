"use client"

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export default function HomePage() {
  const router = useRouter()

  const checkAuthAndRedirect = useCallback(async () => {
    try {
      const { data: session, error } = await authClient.getSession()
      
      if (error || !session?.user) {
        console.log('No session found, redirecting to signin')
        router.push('/signin')
      } else {
        console.log('Valid session found, redirecting to inbox')
        router.push('/inbox')
      }
    } catch (error) {
      console.error('Auth check error:', error)
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
