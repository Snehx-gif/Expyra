import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Schema for AI prediction request
const aiPredictionSchema = {
  productId: 'string',
  category: 'string',
  historicalData: 'array',
  timeRange: 'string',
  factors: 'object',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, category, historicalData, timeRange, factors } = body;

    // Initialize ZAI SDK
    const zai = await ZAI.create();

    // Create a prompt for AI prediction
    const prompt = `
You are an AI-powered sales prediction system for a food expiry tracking application. 

Based on the following information, generate accurate sales predictions:

Product Information:
- Product ID: ${productId || 'N/A'}
- Category: ${category || 'General'}
- Time Range: ${timeRange || '30 days'}

Historical Sales Data (last 30 days):
${historicalData ? JSON.stringify(historicalData, null, 2) : 'No historical data available'}

Factors to Consider:
- Seasonality: ${factors?.seasonality ? 'Yes' : 'No'}
- Market Trends: ${factors?.trends ? 'Yes' : 'No'}
- External Factors: ${factors?.externalFactors ? 'Yes' : 'No'}

Please generate a JSON response with the following structure:
{
  "predictions": [
    {
      "date": "YYYY-MM-DD",
      "predictedSales": number,
      "confidence": number (0-1),
      "factors": {
        "seasonality": number,
        "trend": number,
        "external": number
      },
      "insights": "string explaining the prediction"
    }
  ],
  "summary": {
    "averagePredictedSales": number,
    "totalPredictedSales": number,
    "confidenceLevel": "High/Medium/Low",
    "keyInsights": ["insight 1", "insight 2"]
  }
}

Provide realistic predictions based on typical food sales patterns, considering weekends, seasons, and potential expiry-related factors.
`;

    // Get AI completion
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI system for predicting food sales patterns, considering expiry dates, seasonality, and market trends. Provide accurate, data-driven predictions in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Extract the response
    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error('No response from AI');
    }

    // Try to parse JSON from the response
    let aiResponse;
    try {
      // Extract JSON from the response (in case it's wrapped in markdown code blocks)
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return mock data if AI response parsing fails
      aiResponse = generateMockPredictions(timeRange || '30d');
    }

    return NextResponse.json({
      predictions: aiResponse.predictions,
      summary: aiResponse.summary,
      source: 'ai',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in AI prediction:', error);

    // Fallback to mock predictions
    const mockData = generateMockPredictions('30d');

    return NextResponse.json({
      predictions: mockData.predictions,
      summary: mockData.summary,
      source: 'mock',
      error: 'AI prediction failed, using mock data',
      timestamp: new Date().toISOString(),
    });
  }
}

// Helper function to generate mock predictions
function generateMockPredictions(timeRange: string) {
  const days = parseInt(timeRange) || 30;
  const predictions: {
    date: string;
    predictedSales: number;
    confidence: number;
    factors: {
      seasonality: number;
      trend: number;
      external: number;
    };
    insights?: string;
  }[] = [];
  let totalSales = 0;

  for (let i = 0; i < Math.min(days, 30); i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    // Simulate realistic sales patterns
    const baseSales = 100 + Math.random() * 100;
    const weekendFactor = [0, 6].includes(date.getDay()) ? 1.3 : 1.0;
    const seasonalFactor = 1 + 0.2 * Math.sin((date.getMonth() / 12) * 2 * Math.PI);
    const trendFactor = 1 + (i / days) * 0.1;

    const predictedSales = Math.round(baseSales * weekendFactor * seasonalFactor * trendFactor);
    const confidence = 0.8 + Math.random() * 0.15;

    totalSales += predictedSales;

    predictions.push({
      date: date.toISOString().split('T')[0],
      predictedSales,
      confidence,
      factors: {
        seasonality: seasonalFactor,
        trend: trendFactor,
        external: 1 + (Math.random() - 0.5) * 0.2,
      },
      insights: `Prediction based on ${date.getDay() === 0 || date.getDay() === 6 ? 'weekend' : 'weekday'} patterns and seasonal trends`,
    });
  }

  const avgConfidence = predictions.length
    ? predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length
    : 0;

  return {
    predictions,
    summary: {
      averagePredictedSales: Math.round(totalSales / predictions.length),
      totalPredictedSales: totalSales,
      confidenceLevel: avgConfidence > 0.85 ? 'High' : avgConfidence > 0.75 ? 'Medium' : 'Low',
      keyInsights: [
        'Sales tend to be higher on weekends',
        'Seasonal patterns show moderate influence',
        'Overall trend is slightly upward',
      ],
    },
  };
}