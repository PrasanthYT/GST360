import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { CommandMenu } from "@/components/command-menu"
import { UserProfile } from "@/components/user-profile"
import { ModeToggle } from "@/components/mode-toggle"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="hidden md:block md:w-64 lg:w-72">
            <CommandMenu />
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserProfile />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

