"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BrainCircuit, Loader2, Chrome } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!isLogin) {
      // Register
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Registration failed")
        setLoading(false)
        return
      }

      toast.success("Account created! Signing you in...")
    }

    // Sign in
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    if (result?.error) {
      toast.error("Invalid email or password")
      setLoading(false)
      return
    }

    toast.success("Welcome back!")
    router.push("/dashboard")
    router.refresh()
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto">
            <BrainCircuit className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">InterviewAI</h1>
          <p className="text-muted-foreground text-sm">
            {isLogin
              ? "Sign in to continue practicing"
              : "Create your account to get started"}
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {isLogin ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your credentials to access your dashboard"
                : "Fill in your details to create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Google */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogle}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Chrome className="mr-2 h-4 w-4" />
              )}
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                {!isLogin && (
                  <p className="text-xs text-muted-foreground">
                    Minimum 6 characters
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {/* Toggle */}
            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <Link href="/" className="hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  )
}