import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentFiled() {
  return (
    <div className="space-y-8">
      {recentlyFiled.map((item) => (
        <div key={item.id} className="flex items-center">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={item.avatar} alt="Avatar" />
            <AvatarFallback>{item.initial}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.date}</p>
          </div>
          <div className="ml-auto font-medium">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                item.status === "Approved"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

const recentlyFiled = [
  {
    id: "1",
    name: "GSTR-1 (Oct 2023)",
    date: "Filed on Nov 11, 2023",
    status: "Approved",
    avatar: "/placeholder.svg?height=32&width=32",
    initial: "G1",
  },
  {
    id: "2",
    name: "GSTR-3B (Oct 2023)",
    date: "Filed on Nov 20, 2023",
    status: "Approved",
    avatar: "/placeholder.svg?height=32&width=32",
    initial: "G3",
  },
  {
    id: "3",
    name: "GSTR-1 (Sep 2023)",
    date: "Filed on Oct 11, 2023",
    status: "Approved",
    avatar: "/placeholder.svg?height=32&width=32",
    initial: "G1",
  },
  {
    id: "4",
    name: "GSTR-3B (Sep 2023)",
    date: "Filed on Oct 20, 2023",
    status: "Approved",
    avatar: "/placeholder.svg?height=32&width=32",
    initial: "G3",
  },
  {
    id: "5",
    name: "GSTR-9 (FY 2022-23)",
    date: "Filed on Sep 30, 2023",
    status: "Under Review",
    avatar: "/placeholder.svg?height=32&width=32",
    initial: "G9",
  },
]

