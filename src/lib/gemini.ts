import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateQuestions(
  role: string,
  difficulty: string,
  topic: string
) {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

  const prompt = `
Generate 5 ${difficulty} level interview questions for a ${role} role 
focused on ${topic}.

Return ONLY a JSON array like:
[
  { "question": "..." },
  { "question": "..." }
]
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  try {
    const jsonStart = text.indexOf("[")
    const jsonEnd = text.lastIndexOf("]") + 1
    const jsonString = text.slice(jsonStart, jsonEnd)

    return JSON.parse(jsonString)
  } catch (err) {
    console.error("Question parse failed:", text)

    return [
      { question: "Explain basics of the topic." },
      { question: "What are key concepts?" }
    ]
  }

}
export async function evaluateAnswer(
  question: string,
  answer: string
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview"
  })

  const prompt = `
You are a senior technical interviewer at a top tech company.

Evaluate the candidate's answer strictly.

Question:
${question}

Candidate Answer:
${answer}

Scoring Rules:
- correctness: factual accuracy
- clarity: communication quality
- depth: technical depth & examples

Return ONLY valid JSON:
{
  "correctness": number (0-10),
  "clarity": number (0-10),
  "depth": number (0-10),
  "feedback": "detailed constructive feedback",
  "idealAnswer": "concise high-quality answer"
}
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  try {
    const jsonStart = text.indexOf("{")
    const jsonEnd = text.lastIndexOf("}") + 1
    const jsonString = text.slice(jsonStart, jsonEnd)

    return JSON.parse(jsonString)
  } catch (err) {
    console.error("JSON parse failed:", text)

    return {
      correctness: 5,
      clarity: 5,
      depth: 5,
      feedback: "AI parsing failed, default evaluation used.",
      idealAnswer: "N/A"
    }
  }
}
export async function generateFollowUp(
  originalQuestion: string,
  userAnswer: string,
  feedback: string
) {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

  const prompt = `
You are a senior technical interviewer.

The candidate answered a question poorly. Generate ONE targeted follow-up question 
to help them improve on their weak area.

Original Question: ${originalQuestion}
Candidate Answer: ${userAnswer}
Feedback: ${feedback}

Return ONLY a JSON object:
{
  "followUp": "your follow-up question here"
}
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  try {
    const jsonStart = text.indexOf("{")
    const jsonEnd = text.lastIndexOf("}") + 1
    return JSON.parse(text.slice(jsonStart, jsonEnd))
  } catch {
    return { followUp: "Can you explain that concept in more detail?" }
  }
}
export async function generateWeaknessSuggestions(
  topic: string,
  frequency: number
) {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

  const prompt = `
You are a technical interview coach.

A candidate has struggled with "${topic}" ${frequency} time(s) in interviews.

Give a concise improvement plan with:
- Why this topic is important
- 2-3 specific things to study
- 1 practical exercise to improve

Return ONLY a JSON object:
{
  "importance": "one sentence why this matters",
  "studyPoints": ["point 1", "point 2", "point 3"],
  "exercise": "one practical exercise"
}
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  try {
    const jsonStart = text.indexOf("{")
    const jsonEnd = text.lastIndexOf("}") + 1
    return JSON.parse(text.slice(jsonStart, jsonEnd))
  } catch {
    return {
      importance: "This is an important topic for interviews.",
      studyPoints: ["Review fundamentals", "Practice problems", "Build a project"],
      exercise: "Build a small project using this technology.",
    }
  }
}