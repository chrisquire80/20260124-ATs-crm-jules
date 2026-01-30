'use server'

import prisma from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"

export type MarketDataImportRow = {
  code: string
  name: string
  keywords: string
  demandScore: number
  scarcityScore: number
}

export async function importMarketData(data: MarketDataImportRow[]) {
  try {
    for (const row of data) {
      await prisma.jobCategory.upsert({
        where: { code: row.code },
        update: {
          demandScore: row.demandScore,
          scarcityScore: row.scarcityScore,
          lastUpdated: new Date()
        },
        create: {
          code: row.code,
          name: row.name,
          keywords: row.keywords,
          demandScore: row.demandScore,
          scarcityScore: row.scarcityScore
        }
      })
    }
    revalidatePath('/')
    revalidateTag('job-categories', 'default')
    return { success: true, count: data.length }
  } catch (error) {
    console.error("Import failed:", error)
    return { success: false, error: "Import failed" }
  }
}
