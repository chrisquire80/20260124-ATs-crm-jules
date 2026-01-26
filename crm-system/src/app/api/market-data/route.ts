import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

const marketDataSchema = z.array(
  z.object({
    code: z.string().min(1),
    name: z.string().min(1),
    keywords: z.string().optional(),
    demandScore: z.number().min(0).max(100).optional(),
    scarcityScore: z.number().min(0).max(100).optional(),
  })
)

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parseResult = marketDataSchema.safeParse(json)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid data format", details: parseResult.error.format() },
        { status: 400 }
      )
    }

    const body = parseResult.data

    // Chunk operations to avoid transaction limits
    const CHUNK_SIZE = 50
    let count = 0

    for (let i = 0; i < body.length; i += CHUNK_SIZE) {
      const chunk = body.slice(i, i + CHUNK_SIZE)
      const operations = chunk.map((row) =>
        prisma.jobCategory.upsert({
          where: { code: row.code },
          update: {
            demandScore: row.demandScore ?? 50,
            scarcityScore: row.scarcityScore ?? 50,
            lastUpdated: new Date(),
          },
          create: {
            code: row.code,
            name: row.name,
            keywords: row.keywords || row.name,
            demandScore: row.demandScore ?? 50,
            scarcityScore: row.scarcityScore ?? 50,
          },
        })
      )
      await prisma.$transaction(operations)
      count += operations.length
    }

    return NextResponse.json({
      success: true,
      count,
      message: "Market data updated successfully",
    })
  } catch (error) {
    console.error("API Import failed:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
