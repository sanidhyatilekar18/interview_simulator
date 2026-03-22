"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Plus,
  History,
  AlertTriangle,
  Trophy,
  Target,
  TrendingUp,
  BrainCircuit,
  ChevronRight,
  Flame,
} from "lucide-react"

function getScoreColor(score: number) {
  if (score >= 8) return "text-green-600"
  if (score >= 6) return "text-yellow-600"
  return "text-red-600"
}

function getAccuracyLabel(accuracy: number) {
  if (accuracy >= 80) return { label: "Excellent", color: "text-green-600" }
  if (accuracy >= 60) return { label: "Good", color: "text-yellow-600" }
  if (accuracy >= 40) return { label: "Fair", color: "text-orange-600" }
  return { label: "Needs Work", color: "text-red-600" }
}

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [weakTopics, setWeakTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then((res) => res.json()),
      fetch("/api/dashboard/weak-topics").then((res) => res.json()),
    ]).then(([statsData, weakData]) => {
      setStats(statsData)
      setWeakTopics(Array.isArray(weakData) ? weakData : weakData.weakTopics || [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-36" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    )
  }

  const accuracyLabel = getAccuracyLabel(stats.avgAccuracy)

  // Get best score from scoresOverTime
  const bestScore =
    stats.scoresOverTime.length > 0
      ? Math.max(...stats.scoresOverTime.map((s: any) => s.score))
      : 0

  // Recent trend — compare last 2 scores
  const recentScores = stats.scoresOverTime.slice(-2)
  const trend =
    recentScores.length === 2
      ? recentScores[1].score - recentScores[0].score
      : null

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your interview performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/interview">
              <Plus className="mr-2 h-4 w-4" />
              New Interview
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/history">
              <History className="mr-2 h-4 w-4" />
              History
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <BrainCircuit className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Total Interviews
                </p>
              </div>
              <p className="text-3xl font-bold">{stats.totalInterviews}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Target className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground">Avg Accuracy</p>
              </div>
              <p className={`text-3xl font-bold ${accuracyLabel.color}`}>
                {stats.avgAccuracy.toFixed(1)}%
              </p>
              <p className={`text-xs font-medium ${accuracyLabel.color}`}>
                {accuracyLabel.label}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                </div>
                <p className="text-xs text-muted-foreground">Best Score</p>
              </div>
              <p className={`text-3xl font-bold ${getScoreColor(bestScore)}`}>
                {bestScore > 0 ? bestScore.toFixed(1) : "—"}
              </p>
              {bestScore > 0 && (
                <p className="text-xs text-muted-foreground">out of 10</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </div>
                <p className="text-xs text-muted-foreground">Recent Trend</p>
              </div>
              <p
                className={`text-3xl font-bold ${
                  trend === null
                    ? "text-muted-foreground"
                    : trend > 0
                    ? "text-green-600"
                    : trend < 0
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {trend === null
                  ? "—"
                  : trend > 0
                  ? `+${trend.toFixed(1)}`
                  : trend.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">
                {trend === null
                  ? "No data yet"
                  : trend > 0
                  ? "Improving 📈"
                  : trend < 0
                  ? "Declining 📉"
                  : "Steady ➡️"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Trend Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Score Trend</CardTitle>
            {stats.scoresOverTime.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {stats.scoresOverTime.length} sessions
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {stats.scoresOverTime.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              No interview data yet. Start your first interview!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={stats.scoresOverTime}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(d) =>
                    new Date(d).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 11 }}
                  tickCount={6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelFormatter={(d) =>
                    new Date(d).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Weak Topics */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Flame className="h-4 w-4 text-red-500" />
                Weak Topics
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/weakness">
                  View All
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {weakTopics.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                🎉 No weak topics yet!
              </div>
            ) : (
              <div className="space-y-2">
                {weakTopics.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between py-1.5"
                  >
                    <span className="text-sm capitalize font-medium">
                      {t.topic}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-red-500/10 text-red-700 border-red-200"
                    >
                      {t.frequency}x
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/interview">
                <Plus className="mr-2 h-4 w-4" />
                Start New Interview
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/history">
                <History className="mr-2 h-4 w-4" />
                View Session History
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/weakness">
                <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                Weakness Engine
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}