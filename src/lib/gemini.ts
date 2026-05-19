import { GoogleGenAI } from '@google/genai'

const API_KEY = process.env.API_KEY || ''

let ai: GoogleGenAI | null = null

function getAI(): GoogleGenAI | null {
  if (!API_KEY) return null
  if (!ai) ai = new GoogleGenAI({ apiKey: API_KEY })
  return ai
}

export async function sendChatMessage(message: string, history: { role: string; text: string }[]) {
  const client = getAI()
  if (!client) {
    return { text: 'AI chat is not configured. Add GEMINI_API_KEY to .env file.' }
  }

  try {
    const contents = [
      ...history.map((h) => ({
        role: h.role as 'user' | 'model',
        parts: [{ text: h.text }],
      })),
      { role: 'user' as const, parts: [{ text: message }] },
    ]

    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
    })

    return { text: response.text || 'No response generated.' }
  } catch (error) {
    console.error('Gemini error:', error)
    return { text: 'Sorry, I encountered an error. Please try again.' }
  }
}
