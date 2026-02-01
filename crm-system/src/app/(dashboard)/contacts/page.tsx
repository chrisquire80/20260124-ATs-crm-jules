import prisma from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({
    include: {
        company: true
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
        <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
            <Link key={contact.id} href={`/contacts/${contact.id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <Avatar>
                            <AvatarFallback>{contact.firstName[0]}{contact.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base">{contact.firstName} {contact.lastName}</CardTitle>
                            <p className="text-sm text-muted-foreground">{contact.jobTitle}</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            {contact.email}
                        </div>
                        {contact.company && (
                            <div className="mt-2 text-xs font-medium bg-secondary inline-block px-2 py-1 rounded">
                                {contact.company.name}
                            </div>
                        )}
                         <div className="mt-4 flex items-center justify-between text-xs">
                             <span>Score: <span className="font-bold">{contact.score}</span></span>
                             <span className={contact.sentiment === 'POSITIVE' ? 'text-green-600' : 'text-gray-500'}>{contact.sentiment}</span>
                         </div>
                    </CardContent>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  )
}
