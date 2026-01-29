import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const company = await prisma.company.upsert({
    where: { name: 'Tech Innovators Inc.' },
    update: {},
    create: {
      name: 'Tech Innovators Inc.',
      domain: 'techinnovators.com',
      industry: 'Software',
      address: '123 Tech Lane, Silicon Valley',
      logoUrl: 'https://via.placeholder.com/50'
    }
  })

  const contact = await prisma.contact.create({
    data: {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@techinnovators.com',
      jobTitle: 'CTO',
      companyId: company.id,
      score: 85,
      sentiment: 'POSITIVE',
      lastContactedAt: new Date()
    }
  })

  await prisma.deal.create({
    data: {
      title: 'Enterprise License',
      value: 50000,
      stage: 'PROPOSAL',
      contactId: contact.id,
      companyId: company.id
    }
  })

  await prisma.activity.create({
    data: {
      type: 'EMAIL',
      title: 'Intro Meeting',
      content: 'Discussed the requirements.',
      sentiment: 'POSITIVE',
      contactId: contact.id
    }
  })

  const company2 = await prisma.company.upsert({
    where: { name: 'Global Corp' },
    update: {},
    create: {
      name: 'Global Corp',
      domain: 'globalcorp.com',
      industry: 'Manufacturing',
      address: '456 Ind Drive',
    }
  })

  const contact2 = await prisma.contact.create({
      data: {
          firstName: 'Bob',
          lastName: 'Jones',
          email: 'bob@globalcorp.com',
          jobTitle: 'Purchasing Manager',
          companyId: company2.id,
          score: 40,
          sentiment: 'NEUTRAL'
      }
  })

    await prisma.deal.create({
    data: {
      title: 'Machinery Order',
      value: 120000,
      stage: 'LEAD',
      contactId: contact2.id,
      companyId: company2.id
    }
  })

  console.log('Seed data created.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
