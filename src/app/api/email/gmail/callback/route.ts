import { NextRequest, NextResponse } from 'next/server'
import { EmailConnectionService } from '@/lib/email-connection'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      const redirectUrl = new URL('/inbox', request.url)
      redirectUrl.searchParams.set('error', 'gmail_auth_failed')
      return NextResponse.redirect(redirectUrl.toString())
    }

    if (!code) {
      const redirectUrl = new URL('/inbox', request.url)
      redirectUrl.searchParams.set('error', 'no_auth_code')
      return NextResponse.redirect(redirectUrl.toString())
    }

    // Exchange code for tokens
    const tokens = await EmailConnectionService.getGmailTokens(code)
    
    // Here you would typically save the tokens to the user's account in the database
    // For now, we'll redirect with success and store in session/cookies
    
    const redirectUrl = new URL('/inbox', request.url)
    redirectUrl.searchParams.set('gmail_connected', 'true')
    const response = NextResponse.redirect(redirectUrl.toString())
    
    // Store tokens in httpOnly cookies (more secure)
    if (tokens.access_token) {
      response.cookies.set('gmail_access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 // 1 hour
      })
    }
    
    if (tokens.refresh_token) {
      response.cookies.set('gmail_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      })
    }

    return response
  } catch (error) {
    console.error('Gmail callback error:', error)
    const redirectUrl = new URL('/inbox', request.url)
    redirectUrl.searchParams.set('error', 'token_exchange_failed')
    return NextResponse.redirect(redirectUrl.toString())
  }
}
