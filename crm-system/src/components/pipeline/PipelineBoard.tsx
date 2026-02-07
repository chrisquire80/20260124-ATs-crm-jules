"use client"

import React, { useState, useEffect, useMemo, memo } from "react"
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent } from "@dnd-kit/core"
import { updateDealStage } from "@/actions/pipeline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Deal as DealType, Company, Contact } from "@prisma/client"

type DealWithRelations = DealType & { company: Company | null, contact: Contact | null }

const STAGES = ["LEAD", "CONTACTED", "MEETING", "PROPOSAL", "CLOSED", "LOST"]

export function PipelineBoard({ initialDeals }: { initialDeals: DealWithRelations[] }) {
  const [deals, setDeals] = useState<DealWithRelations[]>(initialDeals)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Hydration fix
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Optimization: Group deals by stage using useMemo to avoid re-filtering the deals array
  // on every render (e.g., when dragging starts/stops). This transforms O(N*M) filtering
  // in the render loop to O(N) grouping.
  const dealsByStage = useMemo(() => {
    const grouped: Record<string, DealWithRelations[]> = {}
    STAGES.forEach((stage) => {
      grouped[stage] = []
    })
    deals.forEach((deal) => {
      if (grouped[deal.stage]) {
        grouped[deal.stage].push(deal)
      }
    })
    return grouped
  }, [deals])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleDragStart(event: any) {
    setActiveId(event.active.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const dealId = active.id as string
      const newStage = over.id as string

      // Optimistic update
      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === dealId ? { ...deal, stage: newStage } : deal
        )
      )

      // Server update
      updateDealStage(dealId, newStage)
    }
    setActiveId(null)
  }

  const activeDeal = deals.find((d) => d.id === activeId)

  if (!mounted) return null

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <PipelineColumn key={stage} stage={stage} deals={dealsByStage[stage]} />
        ))}
      </div>
      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

// Optimization: Memoize the column component to prevent unnecessary re-renders when
// other columns or the parent state changes (unless deals for this column change).
const PipelineColumn = memo(function PipelineColumn({ stage, deals }: { stage: string, deals: DealWithRelations[] }) {
  const { setNodeRef } = useDroppable({
    id: stage,
  })

  return (
    <div ref={setNodeRef} className="flex h-full w-80 min-w-[20rem] flex-col rounded-lg bg-muted/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">{stage}</h3>
        <Badge variant="secondary">{deals.length}</Badge>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {deals.map((deal) => (
          <DraggableDealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  )
})

function DraggableDealCard({ deal }: { deal: DealWithRelations }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: deal.id,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <DealCard deal={deal} />
    </div>
  )
}

// Optimization: Memoize the card component to prevent re-rendering the inner content
// when the wrapper (DraggableDealCard) re-renders due to drag transform changes.
const DealCard = memo(function DealCard({ deal }: { deal: DealWithRelations }) {
  return (
    <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium">{deal.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold">{formatCurrency(deal.value)}</div>
        {deal.company && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
             🏢 {deal.company.name}
          </div>
        )}
        {deal.contact && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
               👤 {deal.contact.firstName} {deal.contact.lastName}
            </div>
        )}
      </CardContent>
    </Card>
  )
})
