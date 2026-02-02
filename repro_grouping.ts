
const STAGES = ["LEAD", "CONTACTED", "MEETING", "PROPOSAL", "CLOSED", "LOST"]

type Deal = {
  id: string;
  stage: string;
  title: string;
}

const deals: Deal[] = [
  { id: '1', stage: 'LEAD', title: 'Deal 1' },
  { id: '2', stage: 'LEAD', title: 'Deal 2' },
  { id: '3', stage: 'MEETING', title: 'Deal 3' },
  { id: '4', stage: 'CLOSED', title: 'Deal 4' },
]

function groupDeals(deals: Deal[]) {
  const grouped: Record<string, Deal[]> = {}
  STAGES.forEach(stage => grouped[stage] = [])
  deals.forEach(deal => {
    if (grouped[deal.stage]) {
      grouped[deal.stage].push(deal)
    }
  })
  return grouped
}

const grouped = groupDeals(deals)

console.log(JSON.stringify(grouped, null, 2))

// Check if all stages are present
STAGES.forEach(stage => {
  if (!grouped[stage]) {
    console.error(`Missing stage: ${stage}`)
    process.exit(1)
  }
})

// Check if deals are correctly placed
if (grouped['LEAD'].length !== 2) throw new Error('Wrong count for LEAD')
if (grouped['MEETING'].length !== 1) throw new Error('Wrong count for MEETING')
if (grouped['CLOSED'].length !== 1) throw new Error('Wrong count for CLOSED')
if (grouped['CONTACTED'].length !== 0) throw new Error('Wrong count for CONTACTED')

console.log("Verification successful")
