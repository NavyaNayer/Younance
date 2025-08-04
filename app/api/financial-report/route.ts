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

    const prompt = `You are a professional financial advisor analyzing a client's financial health. Provide highly personalized insights and recommendations based on their specific data and life circumstances.

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
- Monthly Expenses: $${userData.expenses || 'Not specified'}

FINANCIAL METRICS:
- Health Score: ${healthScore}/100
- Savings Rate: ${metrics.savingsRate.toFixed(1)}%
- Goal Progress: ${progressPercentage.toFixed(1)}%
- Projected Value: $${projectedValue}
- Emergency Fund: ${metrics.emergencyFundMonths.toFixed(1)} months
- Current Streak: ${userProgress.currentStreak} days
- Total Points: ${userProgress.totalPoints}
- Level: ${userProgress.level}

CONTEXT ANALYSIS:
- At age ${userData.age}, ${userData.name} has ${userData.timeframe} years to achieve their ${userData.goal} goal
- Their current savings trajectory projects to $${projectedValue.toFixed(0)} by their target date
- They are ${progressPercentage > 100 ? 'exceeding' : progressPercentage > 80 ? 'on track to meet' : progressPercentage > 50 ? 'making good progress toward' : 'behind on'} their financial goal

Please provide highly personalized content:

1. **Personalized Financial Health Assessment** (3-4 sentences): Address ${userData.name} directly, mention their specific goal, age, and current situation. Reference their exact savings rate, goal progress, and any standout metrics.

2. **Top 4 Personalized Recommendations**: Each must include:
   - Specific dollar amounts based on their income/savings
   - Timeline relevant to their ${userData.timeframe}-year goal
   - Actions tailored to their ${userData.riskTolerance} risk tolerance
   - Consider their age (${userData.age}) for age-appropriate advice

3. **Personalized Suggestions** (5-6 specific suggestions): Based on their exact situation, provide micro-actions like:
   - Specific investment platforms for their risk level
   - Exact percentage increases in savings
   - Account types suitable for their age and timeline
   - Debt strategies if applicable
   - Tax optimization for their income level
   - Emergency fund targets based on their expenses

4. **Market Insights**: Reference current market conditions relevant to their ${userData.riskTolerance} risk tolerance and ${userData.timeframe}-year timeline.

5. **Motivational Insight**: Mention ${userData.name} by name, reference their specific progress metrics, and provide encouragement about their ${userData.goal} goal.

Format as JSON:
{
  "healthAssessment": "string",
  "recommendations": [
    {
      "title": "string",
      "description": "string", 
      "action": "string",
      "priority": "high|medium|low",
      "impact": "string",
      "timeframe": "string",
      "dollarAmount": "string"
    }
  ],
  "personalizedSuggestions": [
    {
      "category": "string",
      "suggestion": "string",
      "benefit": "string",
      "difficulty": "easy|medium|hard"
    }
  ],
  "marketInsights": "string",
  "motivationalInsight": "string"
}
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
        healthAssessment: `${userData.name}, your financial profile shows both strengths and areas for improvement. With your current savings rate of ${metrics.savingsRate.toFixed(1)}%, you're making solid progress toward your ${userData.goal} goal. Focus on consistent saving and strategic planning to reach your $${userData.goalAmount} target.`,
        recommendations: [
          {
            title: "Optimize Emergency Fund",
            description: `Build your emergency fund to 6 months of expenses (approximately $${(parseFloat(userData.income) / 2).toFixed(0)})`,
            action: `Increase monthly emergency savings by $${Math.max(200, parseFloat(userData.monthlySavings) * 0.2).toFixed(0)}`,
            priority: "high",
            impact: "Provides financial security and peace of mind",
            timeframe: "6-12 months",
            dollarAmount: `$${Math.max(200, parseFloat(userData.monthlySavings) * 0.2).toFixed(0)}/month`
          },
          {
            title: "Boost Monthly Savings",
            description: "Accelerate your progress toward your financial goal",
            action: `Consider increasing monthly savings by 10-15% to $${(parseFloat(userData.monthlySavings) * 1.1).toFixed(0)}`,
            priority: "medium",
            impact: "Could reduce timeline to goal by 1-2 years",
            timeframe: "Immediate",
            dollarAmount: `Additional $${(parseFloat(userData.monthlySavings) * 0.1).toFixed(0)}/month`
          }
        ],
        personalizedSuggestions: [
          {
            category: "Savings Optimization",
            suggestion: "Set up automatic transfers on payday to ensure consistent saving",
            benefit: "Removes decision fatigue and ensures consistency",
            difficulty: "easy"
          },
          {
            category: "Investment Strategy", 
            suggestion: `Consider low-cost index funds suitable for ${userData.riskTolerance} risk tolerance`,
            benefit: "Diversification with minimal fees",
            difficulty: "medium"
          },
          {
            category: "Goal Tracking",
            suggestion: "Review and adjust your financial plan quarterly",
            benefit: "Stay on track and make necessary adjustments",
            difficulty: "easy"
          }
        ],
        marketInsights: `Given your ${userData.riskTolerance} risk tolerance and ${userData.timeframe}-year timeline, current market conditions favor a balanced approach with consistent dollar-cost averaging into diversified investments.`,
        motivationalInsight: `${userData.name}, your commitment to saving $${userData.monthlySavings} monthly puts you ahead of most people your age. You're building a strong foundation for your ${userData.goal} goal!`
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
