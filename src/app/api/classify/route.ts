import { NextRequest, NextResponse } from 'next/server'

// Sophisticated mock classification that simulates OpenAI-like behavior
function mockClassifyEmail(subject: string, body: string, sender: string): string {
  const text = `${subject} ${body} ${sender}`.toLowerCase()
  const score = { spam: 0, sales: 0, support: 0, internal: 0, other: 0 }
  
  // Advanced Spam Detection (OpenAI-like patterns)
  const spamPatterns = [
    'free money', 'click now', 'congratulations', 'winner', 'lottery',
    'phish', 'scam', 'urgent action', '!!!', 'act fast', 'limited time',
    'claim now', 'verify account', 'suspended', 'click here immediately'
  ]
  const spamDomains = ['fake', 'scam', 'phish', 'suspicious']
  
  spamPatterns.forEach(pattern => {
    if (text.includes(pattern)) score.spam += 2
  })
  spamDomains.forEach(domain => {
    if (sender.includes(domain)) score.spam += 3
  })
  
  // Advanced Sales Detection
  const salesPatterns = [
    'sale', 'offer', 'discount', 'deal', 'promotion', 'special price',
    'product launch', 'demo', 'trial', 'free', 'save', 'limited offer',
    'business opportunity', 'roi', 'revenue'
  ]
  const salesContext = ['marketing', 'business', 'purchase', 'buy now']
  
  salesPatterns.forEach(pattern => {
    if (text.includes(pattern)) score.sales += 1.5
  })
  salesContext.forEach(context => {
    if (text.includes(context)) score.sales += 1
  })
  
  // Advanced Support Detection
  const supportPatterns = [
    'support', 'ticket', 'help', 'issue', 'problem', 'assistance',
    'troubleshoot', 'error', 'bug', 'feedback', 'complaint',
    'resolve', 'solution', 'fix'
  ]
  const supportIndicators = ['re:', 'fwd:', 'follow-up', 'update']
  
  supportPatterns.forEach(pattern => {
    if (text.includes(pattern)) score.support += 2
  })
  supportIndicators.forEach(indicator => {
    if (text.includes(indicator)) score.support += 0.5
  })
  
  // Advanced Internal Detection
  const internalPatterns = [
    'team', 'meeting', 'internal', 'quarterly', 'report',
    'company', 'office', 'hr', 'admin', 'policy', 'announcement',
    'all-hands', 'standup', 'review', 'planning'
  ]
  const internalDomains = ['company.com', 'internal', 'corp']
  
  internalPatterns.forEach(pattern => {
    if (text.includes(pattern)) score.internal += 1.5
  })
  internalDomains.forEach(domain => {
    if (sender.includes(domain)) score.internal += 2
  })
  
  // Invoice and billing are internal
  if (text.includes('invoice') || text.includes('billing') || text.includes('payment')) {
    score.internal += 2
  }
  
  // Find the highest scoring category
  const maxScore = Math.max(score.spam, score.sales, score.support, score.internal)
  
  if (maxScore === 0) return 'Other'
  if (score.spam === maxScore && score.spam >= 2) return 'Spam'
  if (score.sales === maxScore && score.sales >= 1.5) return 'Sales'
  if (score.support === maxScore && score.support >= 1.5) return 'Support'
  if (score.internal === maxScore && score.internal >= 1.5) return 'Internal'
  
  return 'Other'
}

export async function POST(request: NextRequest) {
  try {
    const { subject, body, sender } = await request.json()
    
    if (!subject || !body || !sender) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, body, sender' },
        { status: 400 }
      )
    }
    
    // Simulate API latency (500ms to 2 seconds)
    const delay = Math.random() * 1500 + 500
    await new Promise(resolve => setTimeout(resolve, delay))
    
    const classification = mockClassifyEmail(subject, body, sender)
    
    return NextResponse.json({
      classification,
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      processing_time_ms: Math.round(delay)
    })
    
  } catch (error) {
    console.error('Classification error:', error)
    return NextResponse.json(
      { error: 'Failed to classify email' },
      { status: 500 }
    )
  }
}
