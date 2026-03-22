"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import InterviewTimer from "@/components/InterviewTimer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CheckCircle2,
  Loader2,
  MessageSquare,
  RotateCcw,
  Trophy,
  ArrowRight,
  ChevronRight,
} from "lucide-react"

export default function InterviewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id
  const duration = parseInt(searchParams.get("duration") || "600")

  const [session, setSession] = useState<any>(null)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [score, setScore] = useState<any>(null)
  const [scoreGenerated, setScoreGenerated] = useState(false)
  const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({})
  const [timeUp, setTimeUp] = useState(false)
  const [followUps, setFollowUps] = useState<{ [key: string]: string }>({})
  const [followUpAnswers, setFollowUpAnswers] = useState<{ [key: string]: string }>({})
  const [followUpEvals, setFollowUpEvals] = useState<{ [key: string]: any }>({})
  const [followUpSubmitting, setFollowUpSubmitting] = useState<{ [key: string]: boolean }>({})

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const generateScore = useCallback(async (sessionId: string) => {
    const res = await fetch("/api/interview/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
    const data = await res.json()
    setScore(data)
  }, [])

  const fetchFollowUp = async (questionId: string) => {
    const res = await fetch("/api/followup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId }),
    })
    const data = await res.json()
    if (data.followUp) {
      setFollowUps((prev) => ({ ...prev, [questionId]: data.followUp }))
    }
  }

  const submitAnswer = async (questionId: string) => {
    const content = answers[questionId]
    if (!content) {
      toast.error("Please write an answer")
      return
    }
    setSubmitting((prev) => ({ ...prev, [questionId]: true }))

    await fetch("/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, content }),
    })

    await fetch("/api/answer/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId }),
    })

    toast.success("Answer evaluated ✅")
    await fetchFollowUp(questionId)

    const resSession = await fetch(`/api/interview/${id}`)
    const updatedSession = await resSession.json()
    setSession(updatedSession)
    setSubmitting((prev) => ({ ...prev, [questionId]: false }))
  }

  const submitFollowUp = async (questionId: string) => {
    const content = followUpAnswers[questionId]
    if (!content) {
      toast.error("Please write a follow-up answer")
      return
    }
    setFollowUpSubmitting((prev) => ({ ...prev, [questionId]: true }))

    const evalRes = await fetch("/api/followup/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: followUps[questionId],
        answer: content,
      }),
    })

    const evalData = await evalRes.json()
    setFollowUpEvals((prev) => ({ ...prev, [questionId]: evalData }))
    setFollowUpSubmitting((prev) => ({ ...prev, [questionId]: false }))
    toast.success("Follow-up evaluated ✅")
  }

  const handleTimeUp = useCallback(async () => {
    setTimeUp(true)
    toast.error("⏰ Time's up! Auto-submitting answered questions...")
    if (!session) return

    const unanswered = session.questions.filter(
      (q: any) => !q.answer?.evaluation && answers[q.id]
    )
    for (const q of unanswered) {
      await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q.id, content: answers[q.id] }),
      })
      await fetch("/api/answer/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q.id }),
      })
    }
    await generateScore(session.id)
  }, [session, answers, generateScore])

  useEffect(() => {
    if (!id) return
    fetch(`/api/interview/${id}`)
      .then((res) => res.json())
      .then(setSession)
  }, [id])

  useEffect(() => {
    if (!id) return
    fetch(`/api/interview/score/${id}`)
      .then((res) => res.json())
      .then((data) => { if (data) setScore(data) })
  }, [id])

  useEffect(() => {
    if (!session || scoreGenerated) return
    const allEvaluated = session.questions.every(
      (q: any) => q.answer?.evaluation
    )
    if (allEvaluated && session.questions.length > 0) {
      generateScore(session.id)
      setScoreGenerated(true)
    }
  }, [session, scoreGenerated, generateScore])

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-green-500/10 text-green-700 border-green-200"
    if (score >= 6) return "bg-yellow-500/10 text-yellow-700 border-yellow-200"
    return "bg-red-500/10 text-red-700 border-red-200"
  }

  const answeredCount = session?.questions?.filter(
    (q: any) => q.answer?.evaluation
  ).length || 0

  const totalQuestions = session?.questions?.length || 0

  // Loading state
  if (!session) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full rounded-xl" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (!session.questions) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-muted-foreground">
        No questions found for this session.
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Interview Session</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="secondary">{session.role}</Badge>
            <Badge variant="secondary">{session.difficulty}</Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {session.topic}
            </Badge>
            {!score && (
              <span className="text-sm text-muted-foreground">
                {answeredCount}/{totalQuestions} answered
              </span>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        {!score && (
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-muted-foreground">Progress</span>
            <div className="flex gap-1">
              {session.questions.map((q: any, i: number) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    q.answer?.evaluation
                      ? "bg-green-500"
                      : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Timer */}
      {!score && (
        <InterviewTimer
          durationSeconds={duration}
          onTimeUp={handleTimeUp}
        />
      )}

      {/* Time up banner */}
      {timeUp && !score && (
        <Card className="border-red-200 bg-red-500/5">
          <CardContent className="py-4 text-center">
            <p className="text-red-600 font-semibold">
              ⏰ Time's up! Calculating your score...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Questions */}
      {session.questions.map((q: any, index: number) => (
        <Card
          key={q.id}
          className={`transition-all ${
            q.answer?.evaluation ? "border-green-200 dark:border-green-900" : ""
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                q.answer?.evaluation
                  ? "bg-green-500 text-white"
                  : "bg-primary text-primary-foreground"
              }`}>
                {q.answer?.evaluation ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <p className="font-medium leading-relaxed pt-0.5">{q.content}</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {!q.answer?.evaluation ? (
              <>
                <textarea
                  className="w-full border border-input bg-background rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  rows={4}
                  placeholder="Type your answer here..."
                  disabled={timeUp}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
                <Button
                  onClick={() => submitAnswer(q.id)}
                  disabled={submitting[q.id] || timeUp || !answers[q.id]}
                  size="sm"
                >
                  {submitting[q.id] ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-3.5 w-3.5" />
                      Submit Answer
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                {/* Score Badges */}
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

                {/* Feedback */}
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Feedback
                  </p>
                  <p className="text-sm">{q.answer.evaluation.feedback}</p>
                </div>

                {/* Ideal Answer */}
                <div className="bg-green-500/5 border border-green-200 dark:border-green-900 rounded-lg p-3 space-y-1">
                  <p className="text-xs font-semibold text-green-600 uppercase">
                    Ideal Answer
                  </p>
                  <p className="text-sm">{q.answer.evaluation.idealAnswer}</p>
                </div>
              </div>
            )}

            {/* Follow-up Question */}
            {followUps[q.id] && !followUpEvals[q.id] && (
              <div className="border border-orange-200 dark:border-orange-900 bg-orange-500/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-3.5 w-3.5 text-orange-500" />
                  <p className="text-xs font-semibold text-orange-600 uppercase">
                    Follow-up Question
                  </p>
                </div>
                <p className="font-medium text-sm">{followUps[q.id]}</p>
                <textarea
                  className="w-full border border-input bg-background rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                  placeholder="Answer the follow-up..."
                  value={followUpAnswers[q.id] || ""}
                  onChange={(e) =>
                    setFollowUpAnswers((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                />
                <Button
                  onClick={() => submitFollowUp(q.id)}
                  disabled={followUpSubmitting[q.id] || !followUpAnswers[q.id]}
                  size="sm"
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                >
                  {followUpSubmitting[q.id] ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <ChevronRight className="mr-2 h-3.5 w-3.5" />
                      Submit Follow-up
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Follow-up Evaluation */}
            {followUpEvals[q.id] && (
              <div className="border border-orange-200 dark:border-orange-900 bg-orange-500/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-3.5 w-3.5 text-orange-500" />
                  <p className="text-xs font-semibold text-orange-600 uppercase">
                    Follow-up Result
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={getScoreBg(followUpEvals[q.id].correctness)}
                  >
                    Correctness: {followUpEvals[q.id].correctness}/10
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getScoreBg(followUpEvals[q.id].clarity)}
                  >
                    Clarity: {followUpEvals[q.id].clarity}/10
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getScoreBg(followUpEvals[q.id].depth)}
                  >
                    Depth: {followUpEvals[q.id].depth}/10
                  </Badge>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Feedback
                  </p>
                  <p className="text-sm">{followUpEvals[q.id].feedback}</p>
                </div>
                <div className="bg-green-500/5 border border-green-200 dark:border-green-900 rounded-lg p-3 space-y-1">
                  <p className="text-xs font-semibold text-green-600 uppercase">
                    Ideal Answer
                  </p>
                  <p className="text-sm">{followUpEvals[q.id].idealAnswer}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Final Score */}
      {score && (
        <Card className="border-green-200 dark:border-green-900 bg-green-500/5">
          <CardContent className="pt-6 pb-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
                  Interview Complete!
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Here's how you performed
                </p>
              </div>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <p className={`text-4xl font-bold ${getScoreColor(score.totalScore)}`}>
                    {score.totalScore.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">out of 10</p>
                </div>
                <div className="text-center">
                  <p className={`text-4xl font-bold ${getScoreColor(score.accuracy / 10)}`}>
                    {score.accuracy.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">accuracy</p>
                </div>
              </div>
              <Button asChild className="mt-2">
                <a href="/dashboard/history">
                  View Full Breakdown
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}