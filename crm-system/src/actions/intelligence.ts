'use server'

import prisma from "@/lib/prisma"
import { enrichContactData } from "@/lib/intelligence" // Reuse existing enrichment
import { revalidatePath, unstable_cache } from "next/cache"

const getJobCategories = unstable_cache(
  async () => prisma.jobCategory.findMany(),
  ['job-categories-list'],
  { tags: ['job-categories'] }
)

// Basic keyword matching logic
async function getMarketScore(jobTitle: string) {
  if (!jobTitle) return { demand: 50, scarcity: 50, categoryName: null }

  const categories = await getJobCategories()
  const lowerTitle = jobTitle.toLowerCase()

  let matchedCategory = null

  // Find category where keywords match the job title
  for (const cat of categories) {
    const keywords = cat.keywords.toLowerCase().split(',').map(k => k.trim())
    if (keywords.some(k => lowerTitle.includes(k))) {
      matchedCategory = cat
      break
    }
  }

  if (matchedCategory) {
    return {
      demand: matchedCategory.demandScore,
      scarcity: matchedCategory.scarcityScore,
      categoryName: matchedCategory.name
    }
  }

  return { demand: 50, scarcity: 50, categoryName: null }
}

// Internal helper to calculate score from data
// Accepts a partial contact object with activities
async function calculateScoreInternal(contact: {
  jobTitle: string | null;
  activities: { id: string }[]
}) {
  let score = 0

  // 1. Engagement Score (Activities)
  const activityScore = contact.activities.length * 5
  score += Math.min(activityScore, 40) // Cap at 40

  // 2. Market Intelligence Score (Demand + Scarcity)
  if (contact.jobTitle) {
    const { demand, scarcity } = await getMarketScore(contact.jobTitle)

    // Algorithm: High demand + High scarcity = Higher score
    // Normalized contribution: up to 60 points
    // Average demand/scarcity is 50. Range 0-100.
    const marketFactor = (demand + scarcity) / 2
    const weightedMarketScore = (marketFactor / 100) * 60

    score += weightedMarketScore
  } else {
     score += 20 // Base score if no job title
  }

  return Math.min(Math.round(score), 100)
}

export async function calculateLeadScore(contactId: string): Promise<number> {
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    include: { activities: true }
  })

  if (!contact) return 0

  return calculateScoreInternal(contact)
}

export async function enrichAndScoreContact(contactId: string) {
    // Optimized: Fetch activities here to avoid re-fetching in score calculation
    const contact = await prisma.contact.findUnique({
        where: { id: contactId },
        include: { activities: true }
    })

    if (!contact) throw new Error("Contact not found")

    // 1. Enrich
    const enrichedData = await enrichContactData(contact.email)

    // Check if company exists, if not create it
    let companyId = contact.companyId
    if (enrichedData.companyName !== 'Unknown Corp') {
        const company = await prisma.company.upsert({
            where: { name: enrichedData.companyName },
            update: {
                logoUrl: enrichedData.logoUrl,
                industry: enrichedData.industry
            },
            create: {
                name: enrichedData.companyName,
                logoUrl: enrichedData.logoUrl,
                industry: enrichedData.industry,
                domain: contact.email.split('@')[1]
            }
        })
        companyId = company.id
    }

    // 2. Score (now includes Market Logic)
    // Pass the already fetched contact data (including activities)
    const newScore = await calculateScoreInternal(contact)

    await prisma.contact.update({
        where: { id: contactId },
        data: {
            score: newScore,
            companyId: companyId
        }
    })

    revalidatePath(`/contacts/${contactId}`)
    return { success: true }
}

export async function getContactMarketData(contactId: string) {
    const contact = await prisma.contact.findUnique({
        where: { id: contactId }
    })

    if (!contact?.jobTitle) return null

    return await getMarketScore(contact.jobTitle)
}
