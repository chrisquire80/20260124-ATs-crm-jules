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
    const BATCH_SIZE = 50
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE)
      const transaction = batch.map((row) =>
        prisma.jobCategory.upsert({
          where: { code: row.code },
          update: {
            demandScore: row.demandScore,
            scarcityScore: row.scarcityScore,
            lastUpdated: new Date(),
          },
          create: {
            code: row.code,
            name: row.name,
            keywords: row.keywords,
            demandScore: row.demandScore,
            scarcityScore: row.scarcityScore,
          },
        })
      )
      await prisma.$transaction(transaction)
    }
    revalidatePath('/')
    revalidateTag('job-categories', 'default')
    return { success: true, count: data.length }
  } catch (error) {
    console.error("Import failed:", error)
    return { success: false, error: "Import failed" }
  }
}
