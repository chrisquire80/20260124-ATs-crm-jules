// Mock Intelligence Service

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function calculateLeadScore(contactId: string): Promise<number> {
  // In a real app, this would analyze activities, email opens, website visits, etc.
  // For now, return a random score between 10 and 100.
  return Math.floor(Math.random() * 90) + 10;
}

export async function analyzeSentiment(text: string): Promise<'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'> {
  const positiveWords = ['great', 'good', 'happy', 'interested', 'love', 'excited']
  const negativeWords = ['bad', 'poor', 'sad', 'unhappy', 'angry', 'hate', 'no', 'unsubscribe']

  let score = 0
  const words = text.toLowerCase().split(/\s+/)

  words.forEach(word => {
    if (positiveWords.includes(word)) score++
    if (negativeWords.includes(word)) score--
  })

  if (score > 0) return 'POSITIVE'
  if (score < 0) return 'NEGATIVE'
  return 'NEUTRAL'
}

export async function enrichContactData(email: string) {
  // Mock Clearbit/Apollo API
  await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay

  if (email.endsWith('google.com')) {
    return {
      companyName: 'Google',
      logoUrl: 'https://logo.clearbit.com/google.com',
      industry: 'Technology',
      revenue: '$280B',
      employees: '150,000+'
    }
  }

  return {
    companyName: 'Unknown Corp',
    logoUrl: 'https://via.placeholder.com/150',
    industry: 'Unknown',
    revenue: 'Unknown',
    employees: 'Unknown'
  }
}
