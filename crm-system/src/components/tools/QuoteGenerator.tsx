"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export function QuoteGenerator() {
  const [items, setItems] = useState([{ description: "", quantity: 1, price: 0 }])

  const total = items.reduce((acc, item) => acc + (item.quantity * item.price), 0)

  const addItem = () => setItems([...items, { description: "", quantity: 1, price: 0 }])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>CPQ / Quote Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label>Client Name</Label>
            <Input placeholder="Company Name" />
        </div>

        <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2 text-sm font-medium">
                <div className="col-span-6">Item</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-3">Price</div>
            </div>
            {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2">
                    <div className="col-span-6">
                        <Input
                            value={item.description}
                            onChange={(e) => {
                                const newItems = [...items]
                                newItems[index].description = e.target.value
                                setItems(newItems)
                            }}
                            placeholder="Service/Product"
                        />
                    </div>
                    <div className="col-span-2">
                        <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                                const newItems = [...items]
                                newItems[index].quantity = Number(e.target.value)
                                setItems(newItems)
                            }}
                        />
                    </div>
                    <div className="col-span-3">
                        <Input
                            type="number"
                            value={item.price}
                            onChange={(e) => {
                                const newItems = [...items]
                                newItems[index].price = Number(e.target.value)
                                setItems(newItems)
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>

        <Button variant="outline" onClick={addItem}>+ Add Item</Button>

        <div className="flex justify-end text-xl font-bold">
            Total: {formatCurrency(total)}
        </div>

        <Button className="w-full">Generate & Track Quote Link</Button>
      </CardContent>
    </Card>
  )
}
