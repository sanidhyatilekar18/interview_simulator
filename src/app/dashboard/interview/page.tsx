"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BrainCircuit,
  Timer,
  Layers,
  Gauge,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react"

const roles = ["Frontend", "Backend", "Data Science", "Machine Learning"]
const difficulties = ["Easy", "Medium", "Hard"]
const durations = [5, 10, 15]

const topicsByRole: { [key: string]: { value: string; label: string }[] } = {
  Frontend: [
    { value: "html-css", label: "HTML & CSS" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "react", label: "React" },
    { value: "nextjs", label: "Next.js" },
    { value: "vue", label: "Vue.js" },
    { value: "angular", label: "Angular" },
    { value: "tailwindcss", label: "Tailwind CSS" },
    { value: "web-performance", label: "Web Performance" },
    { value: "accessibility", label: "Accessibility (a11y)" },
    { value: "browser-apis", label: "Browser APIs" },
    { value: "webpack-bundlers", label: "Webpack & Bundlers" },
    { value: "testing-frontend", label: "Frontend Testing" },
    { value: "responsive-design", label: "Responsive Design" },
    { value: "pwa", label: "Progressive Web Apps" },
  ],
  Backend: [
    { value: "nodejs", label: "Node.js" },
    { value: "express", label: "Express.js" },
    { value: "nestjs", label: "NestJS" },
    { value: "python-backend", label: "Python (Django/Flask)" },
    { value: "rest-api", label: "REST API Design" },
    { value: "graphql", label: "GraphQL" },
    { value: "databases", label: "Databases (SQL)" },
    { value: "mongodb", label: "MongoDB" },
    { value: "redis", label: "Redis & Caching" },
    { value: "system-design", label: "System Design" },
    { value: "microservices", label: "Microservices" },
    { value: "docker", label: "Docker & Containers" },
    { value: "aws", label: "AWS & Cloud" },
    { value: "authentication", label: "Auth & Security" },
    { value: "message-queues", label: "Message Queues" },
    { value: "ci-cd", label: "CI/CD Pipelines" },
  ],
  "Data Science": [
    { value: "python-ds", label: "Python for Data Science" },
    { value: "pandas-numpy", label: "Pandas & NumPy" },
    { value: "data-visualization", label: "Data Visualization" },
    { value: "statistics", label: "Statistics & Probability" },
    { value: "sql-ds", label: "SQL for Data Analysis" },
    { value: "data-cleaning", label: "Data Cleaning & EDA" },
    { value: "feature-engineering", label: "Feature Engineering" },
    { value: "scikit-learn", label: "Scikit-learn" },
    { value: "matplotlib-seaborn", label: "Matplotlib & Seaborn" },
    { value: "big-data", label: "Big Data (Spark/Hadoop)" },
    { value: "data-pipelines", label: "Data Pipelines & ETL" },
    { value: "a-b-testing", label: "A/B Testing" },
    { value: "time-series", label: "Time Series Analysis" },
    { value: "nlp-basics", label: "NLP Basics" },
  ],
  "Machine Learning": [
    { value: "ml-fundamentals", label: "ML Fundamentals" },
    { value: "supervised-learning", label: "Supervised Learning" },
    { value: "unsupervised-learning", label: "Unsupervised Learning" },
    { value: "deep-learning", label: "Deep Learning" },
    { value: "neural-networks", label: "Neural Networks" },
    { value: "cnn", label: "CNNs (Computer Vision)" },
    { value: "rnn-lstm", label: "RNNs & LSTMs" },
    { value: "transformers", label: "Transformers & Attention" },
    { value: "nlp", label: "NLP & Text Processing" },
    { value: "pytorch", label: "PyTorch" },
    { value: "tensorflow", label: "TensorFlow & Keras" },
    { value: "model-evaluation", label: "Model Evaluation" },
    { value: "mlops", label: "MLOps & Deployment" },
    { value: "reinforcement-learning", label: "Reinforcement Learning" },
    { value: "generative-ai", label: "Generative AI & LLMs" },
  ],
}

const difficultyColors: { [key: string]: string } = {
  Easy: "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800",
  Medium: "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800",
  Hard: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800",
}

export default function InterviewSetup() {
  const [role, setRole] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [topic, setTopic] = useState("")
  const [duration, setDuration] = useState<number>(10)
  const [recommendation, setRecommendation] = useState<{
    recommended: string
    reason: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/difficulty/recommend")
      .then((res) => res.json())
      .then((data) => {
        setRecommendation(data)
        setDifficulty(data.recommended)
      })
  }, [])

  // Reset topic when role changes
  const handleRoleChange = (newRole: string) => {
    setRole(newRole)
    setTopic("")
  }

  const startInterview = async () => {
    if (!role || !difficulty || !topic) {
      toast.error("Please select all fields")
      return
    }

    setLoading(true)

    const res = await fetch("/api/interview/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, difficulty, topic, duration: duration * 60 }),
    })

    const data = await res.json()
    const sessionId = data.id || data.session?.id

    if (!sessionId) {
      toast.error("Session ID not found")
      setLoading(false)
      return
    }

    window.location.href = `/dashboard/interview/${sessionId}?duration=${duration * 60}`
  }

  const availableTopics = role ? topicsByRole[role] || [] : []
  const isReady = role && difficulty && topic

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">New Interview</h1>
        <p className="text-muted-foreground mt-1">
          Configure your session and let AI generate your questions.
        </p>
      </div>

      {/* AI Recommendation Banner */}
      {recommendation && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-500/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  AI Recommendation
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {recommendation.reason}
                </p>
                <Badge
                  variant="outline"
                  className={`mt-2 text-xs ${difficultyColors[recommendation.recommended]}`}
                >
                  Suggested: {recommendation.recommended}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interview Settings</CardTitle>
          <CardDescription>
            Choose your target role, difficulty, topic and duration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-muted-foreground" />
              Target Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                    role === r
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-border"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              Difficulty
              {recommendation && (
                <span className="text-xs text-blue-500 font-normal">
                  (AI suggested: {recommendation.recommended})
                </span>
              )}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                    difficulty === d
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-border"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Topic — only shows after role selected */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              Topic
              {!role && (
                <span className="text-xs text-muted-foreground font-normal">
                  (select a role first)
                </span>
              )}
            </label>
            {role ? (
              <Select onValueChange={setTopic} value={topic}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select a ${role} topic...`} />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {availableTopics.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="w-full border border-dashed rounded-lg py-3 px-4 text-sm text-muted-foreground text-center">
                Select a role to see available topics
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              Interview Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {durations.map((mins) => (
                <button
                  key={mins}
                  onClick={() => setDuration(mins)}
                  className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                    duration === mins
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-border"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      {isReady && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4 pb-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Session Summary</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{role}</Badge>
                <Badge variant="secondary">{difficulty}</Badge>
                <Badge variant="secondary">
                  {availableTopics.find((t) => t.value === topic)?.label || topic}
                </Badge>
                <Badge variant="secondary">{duration} min</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start Button */}
      <Button
        disabled={!isReady || loading}
        onClick={startInterview}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating questions...
          </>
        ) : (
          <>
            Start Interview
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}