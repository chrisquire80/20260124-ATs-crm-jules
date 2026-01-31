"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { enrichAndScoreContact } from "@/actions/intelligence"
import { useTransition } from "react"

export function EnrichmentButton({ contactId }: { contactId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleEnrich = () => {
    startTransition(async () => {
      await enrichAndScoreContact(contactId)
    })
  }

  return (
    <Button
        onClick={handleEnrich}
        disabled={isPending}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
    >
      <Sparkles className="mr-2 h-4 w-4" />
      {isPending ? "Analysing..." : "AI Enrich & Score"}
    </Button>
  )
}
