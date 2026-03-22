"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  ChevronRight,
} from "lucide-react"

function getScoreColor(score: number) {
  if (score >= 8) return "text-green-600"
  if (score >= 6) return "text-yellow-600"
  return "text-red-600"
}

function getScoreBg(score: number) {
  if (score >= 8)
    return "bg-green-500/10 text-green-700 border-green-200 dark:border-green-900"
  if (score >= 6)
    return "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:border-yellow-900"
  return "bg-red-500/10 text-red-700 border-red-200 dark:border-red-900"
}

function getScoreLabel(score: number) {
  if (score >= 8) return "Excellent"
  if (score >= 6) return "Good"
  if (score >= 4) return "Fair"
  return "Needs Work"
}

export default function SessionDetailPage() {
  const params = useParams()
  const id = params.id
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/interview/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSession(data)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full rounded-xl" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-56 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Session not found.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/dashboard/history">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Link>
        </Button>
      </div>
    )
  }

  const answeredCount = session.questions.filter(
    (q: any) => q.answer?.evaluation
  ).length
  const totalQuestions = session.questions.length

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Back Button */}
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/dashboard/history">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Link>
      </Button>

      {/* Session Summary Card */}
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{session.role}</h1>
                <Badge variant="secondary">{session.difficulty}</Badge>
                <Badge
                  variant="outline"
                  className="text-blue-600 border-blue-200"
                >
                  {session.topic}
                </Badge>
                {session.score && (
                  <Badge
                    variant="outline"
                    className={getScoreBg(session.score.totalScore)}
                  >
                    {getScoreLabel(session.score.totalScore)}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(session.startedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {answeredCount}/{totalQuestions} evaluated
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-48 bg-muted rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full"
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

            {/* Score display */}
            {session.score && (
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      session.score.totalScore
                    )}`}
                  >
                    {session.score.totalScore.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">out of 10</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      session.score.accuracy / 10
                    )}`}
                  >
                    {session.score.accuracy.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">accuracy</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-5">
        <h2 className="text-lg font-semibold">
          Question Breakdown
        </h2>

        {session.questions.map((q: any, index: number) => (
          <Card
            key={q.id}
            className={
              q.answer?.evaluation
                ? "border-green-200 dark:border-green-900"
                : "border-dashed"
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    q.answer?.evaluation
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {q.answer?.evaluation ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium leading-relaxed">{q.content}</p>
                  {!q.answer && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Not answered
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>

            {q.answer && (
              <CardContent className="space-y-4">
                {/* Score badges */}
                {q.answer.evaluation && (
                  <div className="flex gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={getScoreBg(q.answer.evaluation.correctness)}
                    >
                      Correctness: {q.answer.evaluation.correctness}/10
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getScoreBg(q.answer.evaluation.clarity)}
                    >
                      Clarity: {q.answer.evaluation.clarity}/10
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getScoreBg(q.answer.evaluation.depth)}
                    >
                      Depth: {q.answer.evaluation.depth}/10
                    </Badge>
                  </div>
                )}

                {/* Answer vs Ideal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Your Answer
                    </p>
                    <p className="text-sm leading-relaxed">
                      {q.answer.content}
                    </p>
                  </div>

                  {q.answer.evaluation && (
                    <div className="bg-green-500/5 border border-green-200 dark:border-green-900 rounded-lg p-3 space-y-1">
                      <p className="text-xs font-semibold text-green-600 uppercase">
                        Ideal Answer
                      </p>
                      <p className="text-sm leading-relaxed">
                        {q.answer.evaluation.idealAnswer}
                      </p>
                    </div>
                  )}
                </div>

                {/* Feedback */}
                {q.answer.evaluation && (
                  <div className="bg-yellow-500/5 border border-yellow-200 dark:border-yellow-900 rounded-lg p-3 space-y-1">
                    <p className="text-xs font-semibold text-yellow-600 uppercase">
                      Feedback
                    </p>
                    <p className="text-sm leading-relaxed">
                      {q.answer.evaluation.feedback}
                    </p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="flex gap-3 pb-6">
        <Button asChild variant="outline" className="flex-1">
          <Link href="/dashboard/history">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Sessions
          </Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href="/dashboard/interview">
            Start New Interview
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}