import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation: Ensure body is an array
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid format. Expected an array of market data objects." },
        { status: 400 }
      )
    }

    const operations = body
      .filter((row: { code: string; name: string }) => row.code && row.name)
      .map((row: {
        code: string
        name: string
        keywords?: string
        demandScore?: number
        scarcityScore?: number
      }) =>
        prisma.jobCategory.upsert({
          where: { code: row.code },
          update: {
            demandScore: row.demandScore || 50,
            scarcityScore: row.scarcityScore || 50,
            lastUpdated: new Date()
          },
          create: {
            code: row.code,
            name: row.name,
            keywords: row.keywords || row.name, // Fallback
            demandScore: row.demandScore || 50,
            scarcityScore: row.scarcityScore || 50
          },
        })
      )

    await prisma.$transaction(operations)

    const count = operations.length

    return NextResponse.json({ success: true, count, message: "Market data updated successfully" })
  } catch (error) {
    console.error("API Import failed:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
