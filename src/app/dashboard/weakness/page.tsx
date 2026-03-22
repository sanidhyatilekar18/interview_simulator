"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertTriangle,
  BookOpen,
  ChevronRight,
  Dumbbell,
  Lightbulb,
  Plus,
  Trophy,
} from "lucide-react"

const BAR_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
]

export default function WeaknessPage() {
  const [weakTopics, setWeakTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/weakness")
      .then((res) => res.json())
      .then((data) => {
        setWeakTopics(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (weakTopics.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Weakness Engine</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered analysis of your weak areas.
          </p>
        </div>
        <Card>
          <CardContent className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <Trophy className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-semibold">No weak topics found!</p>
              <p className="text-muted-foreground text-sm mt-1">
                Complete more interviews to track and improve your weak areas.
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/interview">
                <Plus className="mr-2 h-4 w-4" />
                Start Interview
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weakness Engine</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered analysis of your weak areas.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/interview">
            <Plus className="mr-2 h-4 w-4" />
            Practice Now
          </Link>
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Weak Topics</p>
                <p className="text-xl font-bold">{weakTopics.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Dumbbell className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Struggles</p>
                <p className="text-xl font-bold">
                  {weakTopics.reduce((acc, t) => acc + t.frequency, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Biggest Weakness</p>
                <p className="text-sm font-bold capitalize truncate">
                  {weakTopics[0]?.topic || "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weak Topics Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={weakTopics}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border"
              />
              <XAxis
                dataKey="topic"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="frequency" radius={[4, 4, 0, 0]}>
                {weakTopics.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Improvement Plans */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Improvement Plans</h2>

        {weakTopics.map((t, index) => (
          <Card key={t.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      backgroundColor: BAR_COLORS[index % BAR_COLORS.length],
                    }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold capitalize text-lg">{t.topic}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant="outline"
                        className="text-xs bg-red-500/10 text-red-700 border-red-200"
                      >
                        Struggled {t.frequency}x
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/interview?topic=${t.topic}`}>
                    Practice Topic
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>

            {t.suggestion && (
              <CardContent className="space-y-3 pt-0">
                {/* Why it matters */}
                <div className="bg-blue-500/5 border border-blue-200 dark:border-blue-900 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-blue-500" />
                    <p className="text-xs font-semibold text-blue-600 uppercase">
                      Why It Matters
                    </p>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {t.suggestion.importance}
                  </p>
                </div>

                {/* Study Points */}
                <div className="bg-yellow-500/5 border border-yellow-200 dark:border-yellow-900 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-yellow-600" />
                    <p className="text-xs font-semibold text-yellow-600 uppercase">
                      What To Study
                    </p>
                  </div>
                  <ul className="space-y-1.5">
                    {t.suggestion.studyPoints?.map(
                      (point: string, i: number) => (
                        <li
                          key={i}
                          className="text-sm flex items-start gap-2"
                        >
                          <span className="text-yellow-500 font-bold mt-0.5">
                            {i + 1}.
                          </span>
                          <span>{point}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Exercise */}
                <div className="bg-green-500/5 border border-green-200 dark:border-green-900 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Dumbbell className="h-3.5 w-3.5 text-green-600" />
                    <p className="text-xs font-semibold text-green-600 uppercase">
                      Practical Exercise
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed">
                    {t.suggestion.exercise}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}