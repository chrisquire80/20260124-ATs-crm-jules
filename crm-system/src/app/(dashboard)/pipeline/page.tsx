import { getDeals } from "@/actions/pipeline"
import { PipelineBoard } from "@/components/pipeline/PipelineBoard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function PipelinePage() {
  const deals = await getDeals()

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Pipeline</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Deal
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <PipelineBoard initialDeals={deals} />
      </div>
    </div>
  )
}
