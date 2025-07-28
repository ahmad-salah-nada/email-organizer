import { NextRequest, NextResponse } from 'next/server'
import { EmailConnectionService } from '@/lib/email-connection'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const provider = searchParams.get('provider') || 'gmail'
    const limit = parseInt(searchParams.get('limit') || '10')

    if (provider === 'gmail') {
      // Try to get real tokens from cookies
      const cookieStore = await cookies()
      const accessToken = cookieStore.get('gmail_access_token')?.value
      const refreshToken = cookieStore.get('gmail_refresh_token')?.value

      if (accessToken && refreshToken) {
        // Use real Gmail API
        console.log('Using real Gmail tokens to fetch emails...')
        const emails = await EmailConnectionService.fetchGmailEmails(
          accessToken, 
          refreshToken, 
          limit
        )

        return NextResponse.json({
          provider: 'gmail',
          emails,
          count: emails.length,
          source: 'real_gmail'
        })
      } else {
        // Fallback to simulated emails with explanation
        console.log('No Gmail tokens found, using simulated emails...')
        const emails = await EmailConnectionService.fetchGmailEmails(
          'no_token', 
          'no_token', 
          limit
        )

        return NextResponse.json({
          provider: 'gmail',
          emails,
          count: emails.length,
          source: 'simulated',
          message: 'Connect your Gmail account to fetch real emails'
        })
      }
    }

    if (provider === 'imap') {
      // For IMAP, we need configuration from the request body or user settings
      // For now, try with demo config and fallback to simulation
      const emails = await EmailConnectionService.connectIMAP({
        host: 'imap.gmail.com',
        port: 993,
        user: 'demo@example.com',
        password: 'demo-app-password',
        tls: true
      })

      return NextResponse.json({
        provider: 'imap',
        emails,
        count: emails.length,
        source: 'imap_attempt'
      })
    }

    // Handle other providers
    return NextResponse.json(
      { error: 'Provider not supported yet' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Email fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emails', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Handle IMAP configuration
export async function POST(request: NextRequest) {
  try {
    const { provider, config } = await request.json()

    if (provider === 'imap') {
      console.log('Attempting real IMAP connection with provided config...')
      const emails = await EmailConnectionService.connectIMAP(config)
      
      return NextResponse.json({
        success: true,
        provider: 'imap',
        emails,
        count: emails.length,
        source: 'real_imap'
      })
    }

    return NextResponse.json(
      { error: 'Provider not supported' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Email connection error:', error)
    return NextResponse.json(
      { error: 'Connection failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
