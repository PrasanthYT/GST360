"use client"

import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { CommandMenu } from "@/components/command-menu"
import { UserProfile } from "@/components/user-profile"
import { ModeToggle } from "@/components/mode-toggle"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { GSTExpert } from "@/components/chatbot/gst-expert"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { Toasts } = useToast()

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col bg-muted/30">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <div className="hidden md:block md:w-64 lg:w-72">
            <CommandMenu />
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                3
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>
            <ModeToggle />
            <UserProfile />
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
        <Toasts />
      </div>
      <GSTExpert />
    </div>
  )
}