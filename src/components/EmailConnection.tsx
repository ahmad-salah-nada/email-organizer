"use client"

import { useState, useEffect, useCallback } from 'react'
import { Mail, CheckCircle, AlertCircle, Loader2, Settings } from 'lucide-react'

interface ConnectedEmail {
  id: string
  subject: string
  sender: string
  body: string
  date: Date
  read: boolean
  classification?: string
}

interface EmailConnectionProps {
  onEmailsFetched?: (emails: ConnectedEmail[]) => void
}

export default function EmailConnection({ onEmailsFetched }: EmailConnectionProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emails, setEmails] = useState<ConnectedEmail[]>([])
  const [emailSource, setEmailSource] = useState<'real_gmail' | 'real_imap' | 'simulated'>('simulated')
  const [showImapForm, setShowImapForm] = useState(false)
  
  const [imapConfig, setImapConfig] = useState({
    host: '',
    port: 993,
    user: '',
    password: '',
    tls: true
  })

  const fetchEmails = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/email/fetch?provider=gmail&limit=20')
      const result = await response.json()

      if (response.ok) {
        setEmails(result.emails)
        setIsConnected(true)
        setEmailSource(result.source || 'simulated')
        onEmailsFetched?.(result.emails)
        
        if (result.source === 'real_gmail') {
          console.log('Successfully fetched real Gmail emails!')
        }
      } else {
        setError(result.error || 'Failed to fetch emails')
      }
    } catch {
      setError('Failed to fetch emails')
    } finally {
      setLoading(false)
    }
  }, [onEmailsFetched])

  useEffect(() => {
    // Check URL params for connection status
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('gmail_connected') === 'true') {
      setIsConnected(true)
      setEmailSource('real_gmail')
      fetchEmails() // Automatically fetch emails after successful connection
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const connectGmail = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Redirect to Gmail OAuth
      window.location.href = '/api/email/gmail/auth'
    } catch {
      setError('Failed to initiate Gmail connection')
      setLoading(false)
    }
  }

  const connectIMAP = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/email/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'imap',
          config: imapConfig
        })
      })

      const result = await response.json()

      if (response.ok) {
        setEmails(result.emails)
        setIsConnected(true)
        setEmailSource(result.source || 'real_imap')
        setShowImapForm(false)
        onEmailsFetched?.(result.emails)
        
        if (result.source === 'real_imap') {
          console.log('Successfully connected to real IMAP server!')
        }
      } else {
        setError(result.error || 'Failed to connect to IMAP server')
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleImapInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setImapConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'port' ? parseInt(value) || 993 : value)
    }))
  }

  const getConnectionStatusText = () => {
    switch (emailSource) {
      case 'real_gmail':
        return 'Real Gmail Connected'
      case 'real_imap':
        return 'Real IMAP Connected'
      default:
        return 'Simulated Data'
    }
  }

  const getConnectionStatusColor = () => {
    switch (emailSource) {
      case 'real_gmail':
      case 'real_imap':
        return 'text-green-600'
      default:
        return 'text-yellow-600'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Mail className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Email Connections</h2>
        </div>
        
        {isConnected && (
          <div className={`flex items-center space-x-2 ${getConnectionStatusColor()}`}>
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{getConnectionStatusText()} ({emails.length} emails)</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-red-700 font-medium mb-2">{error}</div>
              
              {(error.includes('access_denied') || error.includes('403') || error.includes('Access blocked')) && (
                <div className="text-xs text-red-600 bg-red-100 p-2 rounded border">
                  <strong>OAuth Setup Required:</strong>
                  <ol className="mt-1 ml-4 list-decimal space-y-1">
                    <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                    <li>Navigate to APIs & Services → OAuth consent screen</li>
                    <li>Scroll to &quot;Test users&quot; and click &quot;ADD USERS&quot;</li>
                    <li>Add your email address: <code className="bg-white px-1 rounded">ahmed4play@gmail.com</code></li>
                    <li>Save and try connecting again</li>
                  </ol>
                  <div className="mt-2 text-xs">
                    <a href="/GMAIL_OAUTH_SETUP.md" target="_blank" className="underline">View detailed setup guide</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Connect your email account to fetch and organize real emails.
        </div>
        
        {/* Gmail Connection */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Gmail</h3>
              <p className="text-sm text-gray-500">Connect via OAuth2 for real email access</p>
            </div>
            <button
              onClick={emailSource === 'real_gmail' ? fetchEmails : connectGmail}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              <span>{emailSource === 'real_gmail' ? 'Refresh' : 'Connect Gmail'}</span>
            </button>
          </div>
        </div>

        {/* IMAP Connection */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium text-gray-900">IMAP</h3>
              <p className="text-sm text-gray-500">Connect any email provider via IMAP</p>
            </div>
            <button
              onClick={() => setShowImapForm(!showImapForm)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Configure IMAP</span>
            </button>
          </div>

          {showImapForm && (
            <div className="space-y-3 pt-3 border-t">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="host"
                  placeholder="IMAP Host (e.g., imap.gmail.com)"
                  value={imapConfig.host}
                  onChange={handleImapInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="number"
                  name="port"
                  placeholder="Port (993)"
                  value={imapConfig.port}
                  onChange={handleImapInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              
              <input
                type="email"
                name="user"
                placeholder="Email address"
                value={imapConfig.user}
                onChange={handleImapInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              
              <input
                type="password"
                name="password"
                placeholder="Password (use app password for Gmail)"
                value={imapConfig.password}
                onChange={handleImapInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="tls"
                  checked={imapConfig.tls}
                  onChange={handleImapInputChange}
                  className="rounded border-gray-300"
                />
                <label className="text-sm text-gray-700">Use TLS encryption</label>
              </div>
              
              <button
                onClick={connectIMAP}
                disabled={loading || !imapConfig.host || !imapConfig.user || !imapConfig.password}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                <span>Connect IMAP</span>
              </button>
            </div>
          )}
        </div>

        {/* Status */}
        {emails.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-700">
                Successfully fetched {emails.length} emails ({getConnectionStatusText().toLowerCase()})
              </span>
            </div>
          </div>
        )}

        {/* Setup Instructions */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="text-sm text-blue-700">
            <strong>Setup Instructions:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>For Gmail: Set up OAuth2 credentials in Google Cloud Console</li>
              <li>For IMAP: Use app-specific passwords for Gmail/Yahoo, or regular password for others</li>
              <li>Current status: {emailSource === 'simulated' ? 'Using simulated data' : 'Real connection established'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
