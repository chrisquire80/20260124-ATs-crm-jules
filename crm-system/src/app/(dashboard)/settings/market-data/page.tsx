"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { importMarketData, MarketDataImportRow } from "@/actions/market-data"
import { AlertCircle, CheckCircle2 } from "lucide-react"

const DEFAULT_JSON = `[
  {
    "code": "DEV-001",
    "name": "Software Developer",
    "keywords": "developer, engineer, programmer, full stack, frontend, backend",
    "demandScore": 90,
    "scarcityScore": 80
  },
  {
    "code": "MKT-001",
    "name": "Digital Marketer",
    "keywords": "marketing, seo, sem, social media, growth hacker",
    "demandScore": 70,
    "scarcityScore": 40
  }
]`

export default function MarketDataSettingsPage() {
  const [input, setInput] = useState(DEFAULT_JSON)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleImport = async () => {
    try {
      const data: MarketDataImportRow[] = JSON.parse(input)
      const result = await importMarketData(data)
      if (result.success) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (e) {
      console.error(e)
      setStatus('error')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Market Intelligence Settings</h2>
      <p className="text-muted-foreground">
        Simulate the &quot;Excelsior&quot; file import (n8n integration) by pasting the JSON data below.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Import Market Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={15}
            className="font-mono text-sm"
          />

          <div className="flex items-center gap-4">
            <Button onClick={handleImport}>Import Data</Button>
            {status === 'success' && (
                <div className="flex items-center text-green-600 gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Import Successful
                </div>
            )}
            {status === 'error' && (
                <div className="flex items-center text-red-600 gap-2">
                    <AlertCircle className="h-4 w-4" /> Import Failed (Check JSON)
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
