import { QuoteGenerator } from "@/components/tools/QuoteGenerator"

export default function QuotesPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Quotes</h2>
      <QuoteGenerator />
    </div>
  )
}
