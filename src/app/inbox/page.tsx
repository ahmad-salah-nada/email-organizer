"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  getEmails, 
  classifyEmail, 
  getClassificationColor, 
  formatTimestamp,
  type Email,
  type ClassificationResult 
} from '@/lib/email-utils'
import { type ConnectedEmail } from '@/lib/email-connection'
import OrganizationSelector from '@/components/OrganizationSelector'
import EmailConnection from '@/components/EmailConnection'
import { 
  Mail, 
  LogOut, 
  User, 
  Loader2, 
  RefreshCw,
  Building,
  Clock,
  AlertCircle
} from 'lucide-react'

interface UserType {
  id: string
  email: string
  name: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  image?: string | null
}

export default function InboxPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [emails, setEmails] = useState<Email[]>([])
  const [realEmails, setRealEmails] = useState<ConnectedEmail[]>([])
  const [emailSource, setEmailSource] = useState<'mock' | 'real'>('mock')
  const [loading, setLoading] = useState(true)
  const [classifying, setClassifying] = useState<Set<string>>(new Set())
  const [classifications, setClassifications] = useState<Record<string, ClassificationResult>>({})
  const [oauthError, setOauthError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadEmails()
    checkForOAuthErrors()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/get-session')
      const session = await response.json()
      
      if (!session?.user) {
        router.push('/signin')
      } else {
        setUser(session.user)
      }
    } catch {
      router.push('/signin')
    }
  }

  const checkForOAuthErrors = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    
    if (error) {
      let errorMessage = ''
      switch (error) {
        case 'gmail_auth_failed':
          errorMessage = 'Gmail authentication failed. Please check your Google Cloud Console setup and ensure your email is added as a test user.'
          break
        case 'no_auth_code':
          errorMessage = 'No authorization code received from Google. Please try the connection process again.'
          break
        case 'token_exchange_failed':
          errorMessage = 'Failed to exchange authorization code for access tokens. Please check your OAuth credentials.'
          break
        default:
          errorMessage = 'An error occurred during Gmail connection. Please try again.'
      }
      setOauthError(errorMessage)
      
      // Clear the error from URL after a delay
      setTimeout(() => {
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)
        setOauthError(null)
      }, 10000) // Clear after 10 seconds
    }
  }

  const loadEmails = async () => {
    try {
      const emailData = getEmails()
      setEmails(emailData)
    } catch (error) {
      console.error('Failed to load emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRealEmailsFetched = useCallback((fetchedEmails: ConnectedEmail[]) => {
    // Convert real emails to our Email format
    const convertedEmails: Email[] = fetchedEmails.map((email, index) => ({
      id: email.id || `real-${index}`,
      subject: email.subject,
      sender: email.sender,
      body: email.body,
      timestamp: email.date ? new Date(email.date).toISOString() : new Date().toISOString(),
      read: email.read || false,
      classification: email.classification || 'Unclassified'
    }))
    
    setRealEmails(fetchedEmails)
    setEmails(convertedEmails)
    setEmailSource('real')
  }, [])

  const switchToMockEmails = () => {
    const emailData = getEmails()
    setEmails(emailData)
    setEmailSource('mock')
  }

  const handleClassifyEmail = async (email: Email) => {
    if (classifying.has(email.id)) return

    setClassifying(prev => new Set(prev).add(email.id))
    
    try {
      const result = await classifyEmail(email)
      setClassifications(prev => ({
        ...prev,
        [email.id]: result
      }))
    } catch (error) {
      console.error('Failed to classify email:', error)
    } finally {
      setClassifying(prev => {
        const newSet = new Set(prev)
        newSet.delete(email.id)
        return newSet
      })
    }
  }

  const handleClassifyAll = async () => {
    const unclassifiedEmails = emails.filter(email => !classifications[email.id])
    
    for (const email of unclassifiedEmails) {
      if (!classifying.has(email.id)) {
        handleClassifyEmail(email)
        // Add small delay to simulate real processing
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }

  const handleSignOut = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    router.push('/signin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading inbox...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Email Organizer</h1>
                <OrganizationSelector 
                  onOrganizationChange={() => {}} 
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleClassifyAll}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Classify All
              </button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* OAuth Error Display */}
        {oauthError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-red-700 font-medium mb-2">Gmail Connection Failed</div>
                <div className="text-sm text-red-600">{oauthError}</div>
                <div className="mt-3 text-xs text-red-600 bg-red-100 p-2 rounded border">
                  <strong>Quick Fix:</strong>
                  <ol className="mt-1 ml-4 list-decimal space-y-1">
                    <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                    <li>Navigate to APIs & Services → OAuth consent screen</li>
                    <li>Add your email as a test user: <code className="bg-white px-1 rounded">ahmed4play@gmail.com</code></li>
                  </ol>
                </div>
              </div>
              <button 
                onClick={() => setOauthError(null)}
                className="text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Email Connection */}
        <div className="mb-6">
          <EmailConnection onEmailsFetched={handleRealEmailsFetched} />
        </div>

        {/* Email Source Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Inbox</h2>
            <p className="text-gray-600 mt-1">
              {emails.length} emails ({emailSource === 'real' ? 'Connected Account' : 'Sample Data'})
            </p>
          </div>
          
          {realEmails.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={switchToMockEmails}
                className={`px-3 py-1 text-sm rounded-md ${
                  emailSource === 'mock' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Sample Data
              </button>
              <button
                onClick={() => {
                  const convertedEmails: Email[] = realEmails.map((email, index) => ({
                    id: email.id || `real-${index}`,
                    subject: email.subject,
                    sender: email.sender,
                    body: email.body,
                    timestamp: email.date ? new Date(email.date).toISOString() : new Date().toISOString(),
                    read: email.read || false,
                    classification: email.classification || 'Unclassified'
                  }))
                  setEmails(convertedEmails)
                  setEmailSource('real')
                }}
                className={`px-3 py-1 text-sm rounded-md ${
                  emailSource === 'real' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Real Emails
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
        </div>

        {/* Email List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {emails.map((email) => {
              const classification = classifications[email.id]
              const isClassifying = classifying.has(email.id)
              
              return (
                <div key={email.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {email.subject}
                        </h3>
                        <div className="flex items-center space-x-3 ml-4">
                          {/* Classification Badge */}
                          {classification ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getClassificationColor(classification.classification)}`}>
                              {classification.classification}
                            </span>
                          ) : isClassifying ? (
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              Classifying...
                            </div>
                          ) : (
                            <button
                              onClick={() => handleClassifyEmail(email)}
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              Classify
                            </button>
                          )}
                          
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimestamp(email.timestamp)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Building className="h-4 w-4 mr-2" />
                        <span className="font-medium">{email.sender}</span>
                      </div>
                      
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                        {email.body}
                      </p>
                      
                      {classification && (
                        <div className="mt-3 text-xs text-gray-500">
                          Confidence: {Math.round(classification.confidence * 100)}% • 
                          Processed in {classification.processing_time_ms}ms
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
