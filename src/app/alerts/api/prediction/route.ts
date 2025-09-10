import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Schema for prediction request
const predictionSchema = z.object({
  productId: z.string().optional(),
  category: z.string().optional(),
  timeRange: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  factors: z.object({
    seasonality: z.boolean().default(true),
    trends: z.boolean().default(true),
    externalFactors: z.boolean().default(false),
  }).default({}),
});

// Mock AI prediction data generator
const generateMockPrediction = (params: any) => {
  const baseSales = Math.floor(Math.random() * 200) + 100;
  const days = parseInt(params.timeRange) || 30;
  const predictions = [];
  
  for (let i = 0; i < Math.min(days, 30); i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Add some realistic variation
    const seasonalFactor = params.factors.seasonality ? 
      1 + 0.3 * Math.sin((i / 30) * 2 * Math.PI) : 1;
    const trendFactor = params.factors.trends ? 
      1 + (i / days) * 0.2 : 1;
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    const predictedSales = Math.round(baseSales * seasonalFactor * trendFactor * randomFactor);
    const confidence = Math.max(0.7, Math.min(0.95, 0.85 + (Math.random() - 0.5) * 0.2));
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      predictedSales,
      confidence,
      factors: {
        seasonality: seasonalFactor,
        trend: trendFactor,
        random: randomFactor,
      },
    });
  }
  
  return predictions;
};

// GET all predictions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const category = searchParams.get('category');
    const timeRange = searchParams.get('timeRange') || '30d';

    // Build where clause
    const where: any = {};
    
    if (productId) {
      where.productId = productId;
    }
    
    if (category) {
      where.product = {
        category: { contains: category, mode: 'insensitive' }
      };
    }

    // Get predictions from database
    const predictions = await db.salesPrediction.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            sku: true,
          },
        },
      },
      orderBy: {
        predictedDate: 'asc',
      },
      take: 50, // Limit to prevent too much data
    });

    // If no predictions exist, generate mock data
    if (predictions.length === 0) {
      const mockPredictions = generateMockPrediction({
        productId,
        category,
        timeRange,
        factors: {
          seasonality: true,
          trends: true,
          externalFactors: false,
        },
      });

      return NextResponse.json({
        predictions: mockPredictions,
        source: 'mock',
        message: 'No historical data found, showing mock predictions',
      });
    }

    return NextResponse.json({
      predictions,
      source: 'database',
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}

// POST create new prediction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = predictionSchema.parse(body);

    // Generate predictions using AI (mock for now)
    const predictions = generateMockPrediction(validatedData);

    // If productId is provided, save predictions to database
    if (validatedData.productId) {
      // Check if product exists
      const product = await db.product.findUnique({
        where: { id: validatedData.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      // Save predictions to database
      const savedPredictions = await Promise.all(
        predictions.map(async (prediction) => {
          return await db.salesPrediction.create({
            data: {
              productId: validatedData.productId!,
              predictedDate: new Date(prediction.date),
              predictedSales: prediction.predictedSales,
              confidence: prediction.confidence,
              factors: JSON.stringify(prediction.factors),
            },
          });
        })
      );

      return NextResponse.json({
        predictions: savedPredictions,
        message: 'Predictions generated and saved successfully',
      });
    }

    // Return mock predictions without saving
    return NextResponse.json({
      predictions,
      message: 'Mock predictions generated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating predictions:', error);
    return NextResponse.json(
      { error: 'Failed to create predictions' },
      { status: 500 }
    );
  }
}