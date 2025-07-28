import { NextResponse } from 'next/server'
import { EmailConnectionService } from '@/lib/email-connection'

export async function GET() {
  try {
    const authUrl = EmailConnectionService.getGmailAuthUrl()
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Gmail auth error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate Gmail authentication. Please check your Google OAuth configuration.' },
      { status: 500 }
    )
  }
}
