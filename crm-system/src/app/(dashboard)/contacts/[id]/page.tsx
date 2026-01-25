import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageSquare, Plus, Calendar, TrendingUp } from "lucide-react"
import { EnrichmentButton } from "@/components/contacts/EnrichmentButton"
import { format } from "date-fns"
import { getContactMarketData } from "@/actions/intelligence"

export default async function ContactPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
        company: true,
        activities: {
            orderBy: { createdAt: 'desc' }
        },
        deals: true
    }
  })

  if (!contact) notFound()

  const marketData = await getContactMarketData(contact.id)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {/* Left Column: Profile */}
      <div className="col-span-1 space-y-6">
        <Card>
            <CardContent className="pt-6 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="text-xl">{contact.firstName[0]}{contact.lastName[0]}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold">{contact.firstName} {contact.lastName}</h1>
                <p className="text-muted-foreground">{contact.jobTitle}</p>
                {contact.company && (
                    <div className="flex items-center gap-2 mt-2">
                        {contact.company.logoUrl && <img src={contact.company.logoUrl} alt="Logo" className="h-6 w-6" />}
                        <span className="font-medium">{contact.company.name}</span>
                    </div>
                )}

                <div className="mt-6 flex gap-2 w-full justify-center">
                     <Button size="icon" variant="outline"><Mail className="h-4 w-4" /></Button>
                     <Button size="icon" variant="outline"><Phone className="h-4 w-4" /></Button>
                     <Button size="icon" variant="outline"><MessageSquare className="h-4 w-4" /></Button>
                </div>

                <div className="mt-6 w-full">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Lead Score</span>
                        <span className="text-sm font-bold">{contact.score}/100</span>
                     </div>
                     <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${contact.score}%` }}
                        />
                     </div>
                </div>

                {marketData && marketData.categoryName && (
                  <div className="mt-6 w-full p-4 bg-muted/50 rounded-lg">
                     <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" /> Market Intelligence
                     </h4>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span>Category</span>
                            <span className="font-medium">{marketData.categoryName}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Demand</span>
                            <div className="flex items-center gap-2">
                                <span className="font-bold">{marketData.demand}</span>
                                <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${marketData.demand}%` }} />
                                </div>
                            </div>
                        </div>
                         <div className="flex justify-between items-center text-sm">
                            <span>Scarcity</span>
                            <div className="flex items-center gap-2">
                                <span className="font-bold">{marketData.scarcity}</span>
                                <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500" style={{ width: `${marketData.scarcity}%` }} />
                                </div>
                            </div>
                        </div>
                     </div>
                  </div>
                )}

                <div className="mt-6 w-full">
                    <EnrichmentButton contactId={contact.id} />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-sm">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div>
                    <span className="text-muted-foreground block">Email</span>
                    {contact.email}
                </div>
                <div>
                    <span className="text-muted-foreground block">Phone</span>
                    {contact.phone || 'N/A'}
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Middle/Right: Activity & Timeline */}
      <div className="col-span-2 space-y-6">
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Activity Timeline</CardTitle>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-2"/> Note</Button>
                    <Button size="sm" variant="outline"><Calendar className="h-4 w-4 mr-2"/> Meeting</Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-6">
                    {contact.activities.map((activity) => (
                        <div key={activity.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border">
                                    {activity.type === 'EMAIL' && <Mail className="h-4 w-4" />}
                                    {activity.type === 'CALL' && <Phone className="h-4 w-4" />}
                                    {activity.type === 'MEETING' && <Calendar className="h-4 w-4" />}
                                    {activity.type === 'NOTE' && <MessageSquare className="h-4 w-4" />}
                                </div>
                                <div className="w-px h-full bg-border my-2" />
                            </div>
                            <div className="flex-1 pb-4">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-semibold">{activity.title}</h4>
                                    <span className="text-xs text-muted-foreground">{format(activity.createdAt, 'MMM d, h:mm a')}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{activity.content}</p>
                                {activity.sentiment && (
                                    <Badge variant={activity.sentiment === 'POSITIVE' ? 'default' : activity.sentiment === 'NEGATIVE' ? 'destructive' : 'secondary'} className="text-[10px]">
                                        {activity.sentiment}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}

                    {contact.activities.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">
                            No activity yet. Start interacting!
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
