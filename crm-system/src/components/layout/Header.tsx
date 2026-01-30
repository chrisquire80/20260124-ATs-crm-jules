import { CommandMenu } from "./CommandMenu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6 bg-background sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle could go here */}
        <CommandMenu />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
