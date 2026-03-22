import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BrainCircuit,
  Timer,
  BarChart3,
  MessageSquareMore,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react"

const features = [
  {
    icon: BrainCircuit,
    title: "AI Question Generation",
    description:
      "Gemini AI generates role-specific technical questions tailored to your difficulty level and topic.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: MessageSquareMore,
    title: "Smart Answer Evaluation",
    description:
      "Get instant feedback on correctness, clarity, and depth with an ideal answer comparison.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Timer,
    title: "Timed Interview Modes",
    description:
      "Simulate real interview pressure with 5, 10, or 15 minute timed sessions.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: TrendingUp,
    title: "Adaptive Difficulty",
    description:
      "The system tracks your performance and recommends harder or easier questions automatically.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: BarChart3,
    title: "Progress Dashboard",
    description:
      "Visual charts show your score trends, accuracy, and improvement over time.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Weakness Engine",
    description:
      "AI identifies your weak topics and gives you a personalized improvement plan.",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
]

const steps = [
  {
    step: "01",
    title: "Choose Your Role & Topic",
    description: "Select your target role, difficulty level, and topic to focus on.",
  },
  {
    step: "02",
    title: "Answer AI Questions",
    description: "Get 5 tailored questions and answer them within your chosen time limit.",
  },
  {
    step: "03",
    title: "Get Instant Feedback",
    description: "AI evaluates every answer with scores, feedback, and ideal answers.",
  },
  {
    step: "04",
    title: "Track & Improve",
    description: "Review your history, spot weak areas, and level up with each session.",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-3xl font-bold">
            <span className="font-bold text-3xl">InterviewAI</span>
          </div>
          <div className="flex items-center gap-6 px-6 py-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-xl ">
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/interview">
              <Button size="sm">
                Start Interview
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-40 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
         

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mt-10 ">
            Ace Your Next
            <span className="block text-primary">
              Technical Interview
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Practice with AI-generated questions, get instant feedback, track
            your progress, and eliminate weak spots — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/dashboard/interview">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Start Practicing Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
            {[
              "AI-powered feedback",
              "Adaptive difficulty",
              "Weakness tracking",
              "Session history",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Everything You Need to Prepare
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete AI interview prep system built for developers who want
              to level up fast.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-card border rounded-xl p-5 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Go from zero to interview-ready in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map((s) => (
              <div
                key={s.step}
                className="flex gap-4 p-5 border rounded-xl bg-card hover:shadow-md transition-shadow"
              >
                <span className="text-3xl font-bold text-muted-foreground/30 leading-none">
                  {s.step}
                </span>
                <div className="space-y-1">
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <h2 className="text-3xl font-bold">Ready to Level Up?</h2>
          <p className="text-muted-foreground text-lg">
            Start your first AI-powered mock interview right now. No signup
            required.
          </p>
          <Link href="/dashboard/interview">
            <Button size="lg" className="gap-2">
              Start Your First Interview
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            <span className="font-medium">InterviewAI</span>
          </div>
          <p>Built with Next.js, Prisma & Gemini AI</p>
          <div className="flex gap-4">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/history" className="hover:text-foreground transition-colors">
              History
            </Link>
            <Link href="/dashboard/weakness" className="hover:text-foreground transition-colors">
              Weakness Engine
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}