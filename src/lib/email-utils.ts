import emailsData from '@/data/emails.json'

export interface Email {
  id: string
  subject: string
  sender: string
  body: string
  timestamp: string
  classification: string | null
}

export interface ClassificationResult {
  classification: string
  confidence: number
  processing_time_ms: number
}

export function getEmails(): Email[] {
  return emailsData.map(email => ({
    ...email,
    timestamp: new Date(email.timestamp).toISOString()
  }))
}

export function getEmailById(id: string): Email | null {
  const email = emailsData.find(email => email.id === id)
  return email ? {
    ...email,
    timestamp: new Date(email.timestamp).toISOString()
  } : null
}

export async function classifyEmail(email: Email): Promise<ClassificationResult> {
  const response = await fetch('/api/classify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: email.subject,
      body: email.body,
      sender: email.sender,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to classify email')
  }

  return response.json()
}

export function getClassificationColor(classification: string): string {
  switch (classification.toLowerCase()) {
    case 'sales':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'support':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'internal':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'spam':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
