'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getDeals() {
  return await prisma.deal.findMany({
    include: {
      company: true,
      contact: true
    }
  })
}

export async function updateDealStage(dealId: string, stage: string) {
  await prisma.deal.update({
    where: { id: dealId },
    data: { stage }
  })
  revalidatePath('/pipeline')
}

export async function createDeal(data: { title: string, value: number, companyId?: string, contactId?: string }) {
    await prisma.deal.create({
        data: {
            title: data.title,
            value: data.value,
            stage: 'LEAD',
            companyId: data.companyId,
            contactId: data.contactId
        }
    })
    revalidatePath('/pipeline')
}
