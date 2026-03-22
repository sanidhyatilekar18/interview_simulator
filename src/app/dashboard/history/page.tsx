"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Plus,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Clock,
  Trophy,
  Target,
} from "lucide-react"

function ScoreBadge({ score }: { score: number }) {
  if (score >= 8)
    return (
      <span className="text-2xl font-bold text-green-600">
        {score.toFixed(1)}
      </span>
    )
  if (score >= 6)
    return (
      <span className="text-2xl font-bold text-yellow-600">
        {score.toFixed(1)}
      </span>
    )
  return (
    <span className="text-2xl font-bold text-red-600">
      {score.toFixed(1)}
    </span>
  )
}

function getScoreLabel(score: number) {
  if (score >= 8) return { label: "Excellent", color: "bg-green-500/10 text-green-700 border-green-200" }
  if (score >= 6) return { label: "Good", color: "bg-yellow-500/10 text-yellow-700 border-yellow-200" }
  if (score >= 4) return { label: "Fair", color: "bg-orange-500/10 text-orange-700 border-orange-200" }
  return { label: "Needs Work", color: "bg-red-500/10 text-red-700 border-red-200" }
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        setSessions(Array.isArray(data) ? data : [])
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
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Session History</h1>
          <p className="text-muted-foreground mt-1">
            Track your interview performance over time.
          </p>
        </div>
        <Card>
          <CardContent className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold">No interviews yet</p>
              <p className="text-muted-foreground text-sm mt-1">
                Start your first interview to see your history here.
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/interview">
                <Plus className="mr-2 h-4 w-4" />
                Start Your First Interview
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Stats summary
  const totalSessions = sessions.length
  const scoredSessions = sessions.filter((s) => s.score)
  const avgScore =
    scoredSessions.length > 0
      ? scoredSessions.reduce((acc, s) => acc + s.score.totalScore, 0) /
        scoredSessions.length
      : 0
  const bestScore =
    scoredSessions.length > 0
      ? Math.max(...scoredSessions.map((s) => s.score.totalScore))
      : 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Session History</h1>
          <p className="text-muted-foreground mt-1">
            {totalSessions} interview{totalSessions !== 1 ? "s" : ""} completed
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/interview">
            <Plus className="mr-2 h-4 w-4" />
            New Interview
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Target className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Sessions</p>
                <p className="text-xl font-bold">{totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Score</p>
                <p className="text-xl font-bold">
                  {avgScore > 0 ? avgScore.toFixed(1) : "—"}
                  {avgScore > 0 && (
                    <span className="text-xs text-muted-foreground">/10</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Best Score</p>
                <p className="text-xl font-bold">
                  {bestScore > 0 ? bestScore.toFixed(1) : "—"}
                  {bestScore > 0 && (
                    <span className="text-xs text-muted-foreground">/10</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session List */}
      <div className="space-y-3">
        {sessions.map((session) => {
          const answeredCount = session.questions.filter(
            (q: any) => q.answer?.evaluation
          ).length
          const totalQuestions = session.questions.length
          const scoreLabel = session.score
            ? getScoreLabel(session.score.totalScore)
            : null

          return (
            <Link
              key={session.id}
              href={`/dashboard/history/${session.id}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-all hover:border-primary/30 cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* Left */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{session.role}</span>
                        <Badge variant="secondary" className="text-xs">
                          {session.difficulty}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs text-blue-600 border-blue-200"
                        >
                          {session.topic}
                        </Badge>
                        {scoreLabel && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${scoreLabel.color}`}
                          >
                            {scoreLabel.label}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(session.startedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {answeredCount}/{totalQuestions} answered
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-muted rounded-full h-1.5 max-w-48">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{
                            width: `${
                              totalQuestions > 0
                                ? (answeredCount / totalQuestions) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-4 shrink-0">
                      {session.score ? (
                        <div className="text-right">
                          <div className="flex items-baseline gap-0.5">
                            <ScoreBadge score={session.score.totalScore} />
                            <span className="text-xs text-muted-foreground">
                              /10
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {session.score.accuracy.toFixed(1)}% accuracy
                          </p>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground italic">
                            No score
                          </span>
                        </div>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}