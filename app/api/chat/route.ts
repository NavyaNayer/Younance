import { NextRequest, NextResponse } from 'next/server'
import { openai, AI_CONFIGS } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const { messages, userData, assistantType = 'FINANCIAL_ADVISOR' } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    const config = AI_CONFIGS[assistantType as keyof typeof AI_CONFIGS] || AI_CONFIGS.FINANCIAL_ADVISOR

    // Add user context to the system prompt if provided
    let systemPrompt = config.systemPrompt
    if (userData) {
      systemPrompt += `\n\nUser Context:
- Name: ${userData.name || 'User'}
- Age: ${userData.age || 'Not provided'}
- Monthly Income: ${userData.income ? `$${userData.income}` : 'Not provided'}
- Monthly Savings: ${userData.monthlySavings ? `$${userData.monthlySavings}` : 'Not provided'}
- Financial Goal: ${userData.goal || 'Not specified'}
- Risk Tolerance: ${userData.riskTolerance || 'Not specified'}

Use this context to provide more personalized advice.`
    }

    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
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
    return NextResponse.json({ 
      error: 'Failed to process chat request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
