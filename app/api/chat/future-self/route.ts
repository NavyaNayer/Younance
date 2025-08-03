import { NextRequest, NextResponse } from 'next/server'
import { openai, AI_CONFIGS } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const { messages, userData } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    const futureAge = userData ? Number.parseInt(userData.age) + Number.parseInt(userData.timeframe || "10") : 35
    const goalAmount = userData ? Number.parseFloat(userData.goalAmount) : 100000
    const monthlySavings = userData ? Number.parseFloat(userData.monthlySavings) : 1000

    // Create a personalized system prompt for the future self
    const personalizedPrompt = `${AI_CONFIGS.FUTURE_SELF.systemPrompt}

Context about the user:
- Name: ${userData?.name || "there"}
- Current age: ${userData?.age || "25"}
- Future age: ${futureAge}
- Goal: ${userData?.goal || "financial freedom"}
- Target amount: $${goalAmount?.toLocaleString() || "100,000"}
- Monthly savings: $${monthlySavings?.toLocaleString() || "1,000"}
- Timeframe: ${userData?.timeframe || "10"} years

Remember to speak as their actual future self who achieved these goals through consistent financial discipline.`

    const completion = await openai.chat.completions.create({
      model: AI_CONFIGS.FUTURE_SELF.model,
      messages: [
        { role: 'system', content: personalizedPrompt },
        ...messages
      ],
      temperature: AI_CONFIGS.FUTURE_SELF.temperature,
      max_tokens: AI_CONFIGS.FUTURE_SELF.maxTokens,
      stream: true,
    })

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
