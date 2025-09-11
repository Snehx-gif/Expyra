// Mock AI services for testing

export interface MockSalesPrediction {
  date: string;
  predictedSales: number;
  confidence: number;
  factors: {
    seasonality: number;
    trend: number;
    external: number;
  };
  insights: string;
}

export interface MockExpiryAnalysis {
  productId: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  daysToExpiry: number;
  recommendedAction: 'CONTINUE' | 'DISCOUNT' | 'DONATE' | 'REMOVE';
  confidence: number;
  reasoning: string;
}

export interface MockInventoryOptimization {
  productId: string;
  currentStock: number;
  optimalStock: number;
  recommendedOrder: number;
  savingsPotential: number;
  reasoning: string;
}

// Mock AI prediction service
export class MockAIPredictionService {
  async generateSalesPrediction(params: {
    productId?: string;
    category?: string;
    timeRange: string;
    historicalData?: any[];
    factors?: {
      seasonality: boolean;
      trends: boolean;
      externalFactors: boolean;
    };
  }): Promise<{
    predictions: MockSalesPrediction[];
    summary: {
      averagePredictedSales: number;
      totalPredictedSales: number;
      confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH';
      keyInsights: string[];
    };
  }> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const days = this.parseTimeRange(params.timeRange);
    const predictions: MockSalesPrediction[] = [];
    let totalSales = 0;

    // Generate base sales pattern
    const baseSales = this.getBaseSalesForCategory(params.category);

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      // Calculate factors
      const seasonalityFactor = params.factors?.seasonality ?
        this.getSeasonalityFactor(date) : 1.0;
      const trendFactor = params.factors?.trends ?
        this.getTrendFactor(i, days) : 1.0;
      const externalFactor = params.factors?.externalFactors ?
        this.getExternalFactor(date) : 1.0;

      // Add randomness
      const randomFactor = 0.8 + Math.random() * 0.4;

      // Calculate predicted sales
      const predictedSales = Math.round(
        baseSales * seasonalityFactor * trendFactor * externalFactor * randomFactor
      );

      // Calculate confidence
      const confidence = this.calculateConfidence(
        seasonalityFactor,
        trendFactor,
        externalFactor,
        randomFactor
      );

      // Generate insights
      const insights = this.generateInsights(date, predictedSales, seasonalityFactor, trendFactor);

      predictions.push({
        date: date.toISOString().split('T')[0],
        predictedSales,
        confidence,
        factors: {
          seasonality: seasonalityFactor,
          trend: trendFactor,
          external: externalFactor,
        },
        insights,
      });

      totalSales += predictedSales;
    }

    // Generate summary
    const averageSales = Math.round(totalSales / predictions.length);
    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;

    const confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH' = avgConfidence > 0.8 ? 'HIGH' : avgConfidence > 0.65 ? 'MEDIUM' : 'LOW';

    const summary = {
      averagePredictedSales: averageSales,
      totalPredictedSales: totalSales,
      confidenceLevel,
      keyInsights: this.generateKeyInsights(predictions, params),
    };

    return { predictions, summary };
  }

  async analyzeExpiryRisk(productId: string, batchId: string): Promise<MockExpiryAnalysis> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Mock expiry risk analysis
    const riskScenarios = [
      {
        riskLevel: 'LOW' as const,
        daysToExpiry: 15 + Math.floor(Math.random() * 20),
        recommendedAction: 'CONTINUE' as const,
        confidence: 0.9 + Math.random() * 0.09,
        reasoning: 'Product has sufficient shelf life. Continue normal sales operations.',
      },
      {
        riskLevel: 'MEDIUM' as const,
        daysToExpiry: 5 + Math.floor(Math.random() * 10),
        recommendedAction: 'DISCOUNT' as const,
        confidence: 0.85 + Math.random() * 0.1,
        reasoning: 'Product approaching expiry. Consider applying discount to accelerate sales.',
      },
      {
        riskLevel: 'HIGH' as const,
        daysToExpiry: 1 + Math.floor(Math.random() * 4),
        recommendedAction: 'DONATE' as const,
        confidence: 0.8 + Math.random() * 0.15,
        reasoning: 'Product nearing expiry. Prepare for donation to minimize waste.',
      },
      {
        riskLevel: 'CRITICAL' as const,
        daysToExpiry: Math.floor(Math.random() * 2),
        recommendedAction: 'REMOVE' as const,
        confidence: 0.95 + Math.random() * 0.04,
        reasoning: 'Product has expired or will expire very soon. Remove from inventory immediately.',
      },
    ];

    // Weight towards more critical scenarios for demonstration
    const weights = [0.2, 0.3, 0.3, 0.2];
    const randomValue = Math.random();
    let cumulativeWeight = 0;

    for (let i = 0; i < riskScenarios.length; i++) {
      cumulativeWeight += weights[i];
      if (randomValue <= cumulativeWeight) {
        return { productId, ...riskScenarios[i] };
      }
    }

    return { productId, ...riskScenarios[0] };
  }

  async optimizeInventory(productId: string): Promise<MockInventoryOptimization> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    // Mock inventory optimization analysis
    const currentStock = 50 + Math.floor(Math.random() * 200);
    const optimalStock = 100 + Math.floor(Math.random() * 150);
    const recommendedOrder = Math.max(0, optimalStock - currentStock);
    const savingsPotential = Math.round(recommendedOrder * 0.1 * (10 + Math.random() * 20));

    const reasoning = [
      'Current stock levels are below optimal. Recommended order will prevent stockouts.',
      'Seasonal demand patterns indicate increased sales in the coming weeks.',
      'Historical data suggests optimal stock level for this product category.',
      'AI analysis shows potential revenue increase with optimized inventory levels.',
    ][Math.floor(Math.random() * 4)];

    return {
      productId,
      currentStock,
      optimalStock,
      recommendedOrder,
      savingsPotential,
      reasoning,
    };
  }

  private parseTimeRange(timeRange: string): number {
    switch (timeRange) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 30;
    }
  }

  private getBaseSalesForCategory(category?: string): number {
    const categoryBaseSales: Record<string, number> = {
      'Dairy': 120,
      'Bakery': 85,
      'Meat & Poultry': 95,
      'Seafood': 75,
      'Produce': 150,
      'Frozen Foods': 110,
      'Canned Goods': 65,
      'Beverages': 140,
      'Snacks': 90,
    };

    return categoryBaseSales[category || ''] || 100;
  }

  private getSeasonalityFactor(date: Date): number {
    const month = date.getMonth();
    const dayOfWeek = date.getDay();

    // Weekend factor
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1.0;

    // Seasonal factor (simplified)
    const seasonalFactor = 1 + 0.2 * Math.sin((month / 12) * 2 * Math.PI);

    return weekendFactor * seasonalFactor;
  }

  private getTrendFactor(dayIndex: number, totalDays: number): number {
    // Slight upward trend
    return 1 + (dayIndex / totalDays) * 0.1;
  }

  private getExternalFactor(date: Date): number {
    // Mock external factors like weather, events, etc.
    return 0.9 + Math.random() * 0.2;
  }

  private calculateConfidence(
    seasonality: number,
    trend: number,
    external: number,
    random: number
  ): number {
    let confidence = 0.7; // Base confidence

    // Higher confidence for stable factors
    if (seasonality > 0.8 && seasonality < 1.2) confidence += 0.1;
    if (trend > 0.9 && trend < 1.1) confidence += 0.1;
    if (external > 0.9 && external < 1.1) confidence += 0.05;
    if (random > 0.8 && random < 1.2) confidence += 0.05;

    return Math.min(0.99, Math.max(0.5, confidence));
  }

  private generateInsights(
    date: Date,
    sales: number,
    seasonality: number,
    trend: number
  ): string {
    const insights = [
      `Sales prediction for ${date.toLocaleDateString()}`,
      seasonality > 1.1 ? 'Higher sales expected due to seasonal factors' : 'Normal seasonal patterns',
      trend > 1.05 ? 'Upward trend detected' : 'Stable trend expected',
      date.getDay() === 0 || date.getDay() === 6 ? 'Weekend sales boost anticipated' : 'Weekday sales pattern',
    ];

    return insights.join('. ') + '.';
  }

  private generateKeyInsights(
    predictions: MockSalesPrediction[],
    params: any
  ): string[] {
    const avgSales = predictions.reduce((sum, p) => sum + p.predictedSales, 0) / predictions.length;
    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;

    const insights = [
      `Average daily sales predicted: ${Math.round(avgSales)} units`,
      `Prediction confidence: ${(avgConfidence * 100).toFixed(1)}%`,
      params.factors?.seasonality ? 'Seasonal patterns significantly impact predictions' : 'Seasonal factors not considered',
      params.factors?.trends ? 'Market trends show positive growth' : 'Trend analysis not enabled',
    ];

    // Add specific insights based on category
    if (params.category) {
      insights.push(`Category-specific patterns identified for ${params.category}`);
    }

    return insights;
  }
}

// Mock AI service that combines all AI capabilities
export class MockAIService {
  private predictionService: MockAIPredictionService;

  constructor() {
    this.predictionService = new MockAIPredictionService();
  }

  async getSalesPrediction(params: any) {
    return this.predictionService.generateSalesPrediction(params);
  }

  async getExpiryAnalysis(productId: string, batchId: string) {
    return this.predictionService.analyzeExpiryRisk(productId, batchId);
  }

  async getInventoryOptimization(productId: string) {
    return this.predictionService.optimizeInventory(productId);
  }

  async getComprehensiveAnalysis(params: {
    productId?: string;
    category?: string;
    timeRange: string;
    includeExpiry: boolean;
    includeInventory: boolean;
  }) {
    const [salesPrediction, expiryAnalysis, inventoryOptimization] = await Promise.all([
      this.getSalesPrediction(params),
      params.includeExpiry && params.productId ?
        this.getExpiryAnalysis(params.productId, 'mock_batch') :
        Promise.resolve(null),
      params.includeInventory && params.productId ?
        this.getInventoryOptimization(params.productId) :
        Promise.resolve(null),
    ]);

    return {
      salesPrediction,
      expiryAnalysis,
      inventoryOptimization,
      generatedAt: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const mockAIService = new MockAIService();