'use server'

import prisma from "@/lib/prisma"
import { enrichContactData, calculateLeadScore } from "@/lib/intelligence"
import { revalidatePath } from "next/cache"

export async function enrichAndScoreContact(contactId: string) {
    const contact = await prisma.contact.findUnique({
        where: { id: contactId }
    })

    if (!contact) throw new Error("Contact not found")

    // 1. Enrich
    const enrichedData = await enrichContactData(contact.email)

    // Check if company exists, if not create it
    let companyId = contact.companyId
    if (enrichedData.companyName !== 'Unknown Corp') {
        const company = await prisma.company.upsert({
            where: { name: enrichedData.companyName }, // Simplified match by name for demo
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

    // 2. Score
    const newScore = await calculateLeadScore(contactId)

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
