"use client"

import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

const pageTitles: { [key: string]: string } = {
  "/dashboard": "Dashboard",
  "/dashboard/interview": "New Interview",
  "/dashboard/history": "Session History",
  "/dashboard/weakness": "Weakness Engine",
}

const pageDescriptions: { [key: string]: string } = {
  "/dashboard": "Overview of your interview performance",
  "/dashboard/interview": "Configure and start a new AI interview",
  "/dashboard/history": "Review your past interview sessions",
  "/dashboard/weakness": "AI-powered weak area analysis",
}

export function Navbar() {
  const pathname = usePathname()

  const isInterviewSession = pathname.startsWith("/dashboard/interview/")
  const isHistoryDetail = pathname.startsWith("/dashboard/history/")

  const title =
    Object.entries(pageTitles).find(([key]) => pathname === key)?.[1] ||
    (isHistoryDetail
      ? "Session Detail"
      : isInterviewSession
      ? "Interview Session"
      : "InterviewAI")

  const description =
    Object.entries(pageDescriptions).find(([key]) => pathname === key)?.[1] ||
    (isHistoryDetail
      ? "Detailed breakdown of your interview"
      : isInterviewSession
      ? "Answer questions and get AI feedback"
      : "")

  return (
    <header className="fixed top-0 left-64 right-0 h-16 border-b bg-background/80 backdrop-blur-md z-30 flex items-center justify-between px-6">
      {/* Left — Page Title */}
      <div className="flex flex-col justify-center">
        <h1 className="font-semibold text-base leading-tight">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground hidden sm:block">
            {description}
          </p>
        )}
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        {/* Show New Interview button only on non-interview pages */}
        {pathname === "/dashboard" ||
        pathname === "/dashboard/history" ||
        pathname === "/dashboard/weakness" ? (
          <Button asChild size="sm" variant="outline" className="hidden sm:flex">
            <Link href="/dashboard/interview">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Interview
            </Link>
          </Button>
        ) : null}
        <ThemeToggle />
      </div>
    </header>
  )
}