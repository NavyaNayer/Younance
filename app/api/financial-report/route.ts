import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function POST(req: NextRequest) {
  try {
    // Check if OpenAI is configured
    if (!openai) {
      return NextResponse.json({
        success: false,
        error: "OpenAI API key not configured"
      }, { status: 500 })
    }

    const { userData, userProgress, projectedValue, progressPercentage, metrics, healthScore } = await req.json()

    const prompt = `You are a professional financial advisor analyzing a client's financial health. Provide personalized insights and recommendations based on their data.

CLIENT PROFILE:
- Name: ${userData.name}
- Age: ${userData.age}
- Annual Income: $${userData.income}
- Current Savings: $${userData.currentSavings}
- Monthly Savings: $${userData.monthlySavings}
- Financial Goal: ${userData.goal}
- Goal Amount: $${userData.goalAmount}
- Timeframe: ${userData.timeframe} years
- Risk Tolerance: ${userData.riskTolerance}

FINANCIAL METRICS:
- Health Score: ${healthScore}/100
- Savings Rate: ${metrics.savingsRate.toFixed(1)}%
- Goal Progress: ${progressPercentage.toFixed(1)}%
- Projected Value: $${projectedValue}
- Emergency Fund: ${metrics.emergencyFundMonths.toFixed(1)} months
- Current Streak: ${userProgress.currentStreak} days

Please provide:
1. A personalized financial health assessment (2-3 sentences)
2. Top 3 specific, actionable recommendations with dollar amounts where applicable
3. Market insights relevant to their risk tolerance and timeline
4. One motivational insight about their progress

Format your response as JSON with these keys:
{
  "healthAssessment": "string",
  "recommendations": [
    {
      "title": "string",
      "description": "string",
      "action": "string",
      "priority": "high|medium|low",
      "impact": "string"
    }
  ],
  "marketInsights": "string",
  "motivationalInsight": "string"
}

Keep recommendations practical and specific to their situation. Use encouraging but realistic language.

IMPORTANT: Respond with ONLY the JSON object. Do not include any markdown formatting, backticks, or additional text. Return pure JSON only.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a certified financial planner with 15+ years of experience helping clients achieve their financial goals. You provide practical, personalized advice based on current market conditions and proven financial strategies."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })

    const aiInsights = completion.choices[0]?.message?.content

    if (!aiInsights) {
      throw new Error("No response from OpenAI")
    }

    // Extract JSON from markdown if present
    let jsonContent = aiInsights
    const jsonMatch = aiInsights.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      jsonContent = jsonMatch[1]
    }

    // Parse the JSON response
    let insights
    try {
      insights = JSON.parse(jsonContent)
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError)
      console.error("AI Response:", aiInsights)
      
      // Fallback insights if JSON parsing fails
      insights = {
        healthAssessment: "Your financial profile shows both strengths and areas for improvement. Focus on consistent saving and strategic planning.",
        recommendations: [
          {
            title: "Review Savings Strategy",
            description: "Analyze your current savings approach for optimization opportunities",
            action: "Set up automatic transfers to boost savings consistency",
            priority: "high"
          }
        ],
        marketInsights: "Current market conditions favor long-term, diversified investment strategies.",
        motivationalInsight: "Your commitment to financial planning is the first step toward achieving your goals."
      }
    }

    return NextResponse.json({ success: true, insights })
  } catch (error) {
    console.error("Financial Report API Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate AI insights" },
      { status: 500 }
    )
  }
}
