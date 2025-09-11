"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  Calendar, 
  RefreshCw,
  Zap,
  BarChart3,
  Target,
  Lightbulb,
  AlertTriangle
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart
} from "recharts";
import { toast } from "sonner";

interface Prediction {
  date: string;
  predictedSales: number;
  confidence: number;
  factors: {
    seasonality: number;
    trend: number;
    external: number;
  };
  insights?: string;
}

interface PredictionSummary {
  averagePredictedSales: number;
  totalPredictedSales: number;
  confidenceLevel: string;
  keyInsights: string[];
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [summary, setSummary] = useState<PredictionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [aiSource, setAiSource] = useState<"ai" | "mock">("mock");

  const categories = [
    "Dairy",
    "Bakery", 
    "Meat & Poultry",
    "Seafood",
    "Produce",
    "Frozen Foods",
    "Canned Goods",
    "Beverages",
    "Snacks",
    "Other"
  ];

  useEffect(() => {
    generatePredictions();
  }, [selectedCategory, timeRange, selectedProduct]);

  const generatePredictions = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockPredictions: Prediction[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString(),
        predictedSales: Math.floor(Math.random() * 200) + 100,
        confidence: Math.random() * 0.3 + 0.65,
        factors: {
          seasonality: Math.random() * 0.4,
          trend: Math.random() * 0.6 + 0.4,
          external: 0,
        },
        insights: i % 7 === 0 ? "High demand expected due to marketing campaign" : "Standard prediction",
      };
    });

    const totalSales = mockPredictions.reduce((sum, p) => sum + p.predictedSales, 0);
    const avgConfidence = mockPredictions.reduce((sum, p) => sum + p.confidence, 0) / mockPredictions.length;

    const mockSummary: PredictionSummary = {
      averagePredictedSales: Math.round(totalSales / mockPredictions.length),
      totalPredictedSales: totalSales,
      confidenceLevel: avgConfidence > 0.85 ? 'High' : avgConfidence > 0.75 ? 'Medium' : 'Low',
      keyInsights: [
        'Sales forecast indicates a positive trend for the next 30 days.',
        'Marketing campaigns have a noticeable impact on sales predictions.',
        'Confidence levels are generally high, but monitor for external factors.',
      ],
    };

    setPredictions(mockPredictions);
    setSummary(mockSummary);
    setAiSource("mock");
    setLoading(false);
    toast.success("Mock predictions generated successfully");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return "text-green-600";
    if (confidence >= 0.75) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 0.85) return "default";
    if (confidence >= 0.75) return "secondary";
    return "destructive";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Sales Predictions</h1>
          <p className="text-muted-foreground">
            Advanced AI-powered sales forecasting and inventory optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generatePredictions} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating...' : 'Generate Predictions'}
          </Button>
        </div>
      </div>

      {/* AI Source Indicator */}
      <Card className={aiSource === 'ai' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Brain className={`h-5 w-5 ${aiSource === 'ai' ? 'text-green-600' : 'text-blue-600'}`} />
            <div>
              <div className="font-medium">
                {aiSource === 'ai' ? 'AI-Powered Predictions' : 'Mock Predictions'}
              </div>
              <div className="text-sm text-muted-foreground">
                {aiSource === 'ai' 
                  ? 'Predictions generated using advanced AI algorithms' 
                  : 'Simulated predictions for demonstration purposes'
                }
              </div>
            </div>
            <Badge variant={aiSource === 'ai' ? 'default' : 'secondary'}>
              {aiSource === 'ai' ? 'Live AI' : 'Demo Mode'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Prediction Parameters</CardTitle>
          <CardDescription>
            Configure the prediction model parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Next 7 days</SelectItem>
                  <SelectItem value="30d">Next 30 days</SelectItem>
                  <SelectItem value="90d">Next 90 days</SelectItem>
                  <SelectItem value="1y">Next year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">AI Model</label>
              <Select value={aiSource} onValueChange={(value) => setAiSource(value as "ai" | "mock")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai">AI Model (Advanced)</SelectItem>
                  <SelectItem value="mock">Mock Data (Fast)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Daily Sales</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(summary.averagePredictedSales)}</div>
              <p className="text-xs text-muted-foreground">units per day</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Predicted</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(summary.totalPredictedSales)}</div>
              <p className="text-xs text-muted-foreground">total units</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confidence</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.confidenceLevel}</div>
              <p className="text-xs text-muted-foreground">prediction accuracy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Range</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timeRange}</div>
              <p className="text-xs text-muted-foreground">forecast period</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart">Sales Chart</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Prediction Chart</CardTitle>
              <CardDescription>
                Visual representation of predicted sales over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictions.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={predictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number, name: string) => [
                        formatNumber(value),
                        name === 'predictedSales' ? 'Predicted Sales' : name
                      ]}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="predictedSales" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                      name="Predicted Sales"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No predictions available. Generate predictions to see the chart.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Confidence Chart */}
          {predictions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Prediction Confidence</CardTitle>
                <CardDescription>
                  AI model confidence levels for each prediction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis domain={[0.5, 1]} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Confidence']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="confidence" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Confidence Level"
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Data Table</CardTitle>
              <CardDescription>
                Detailed breakdown of all predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Predicted Sales</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Confidence</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Seasonality</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Trend</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Insights</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.map((prediction, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="border border-gray-300 px-4 py-2">
                            {new Date(prediction.date).toLocaleDateString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {formatNumber(prediction.predictedSales)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={getConfidenceBadgeColor(prediction.confidence) as any}>
                                {(prediction.confidence * 100).toFixed(1)}%
                              </Badge>
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {prediction.factors.seasonality.toFixed(2)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {prediction.factors.trend.toFixed(2)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 max-w-xs">
                            <div className="text-sm truncate" title={prediction.insights}>
                              {prediction.insights || 'Standard prediction'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No predictions available. Generate predictions to see the data table.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI Insights & Recommendations
              </CardTitle>
              <CardDescription>
                Key insights and actionable recommendations from the AI model
              </CardDescription>
            </CardHeader>
            <CardContent>
              {summary ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Key Insights</h4>
                    <div className="space-y-2">
                      {summary.keyInsights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                          <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-600" />
                          <p className="text-sm">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Model Performance</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Overall Confidence</span>
                          <Badge variant={summary.confidenceLevel === 'High' ? 'default' : summary.confidenceLevel === 'Medium' ? 'secondary' : 'destructive'}>
                            {summary.confidenceLevel}
                          </Badge>
                        </div>
                        <Progress 
                          value={summary.confidenceLevel === 'High' ? 85 : summary.confidenceLevel === 'Medium' ? 75 : 60} 
                          className="w-full" 
                        />
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Data Quality</span>
                          <Badge variant="default">Good</Badge>
                        </div>
                        <Progress value={80} className="w-full" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Recommendations</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                        <AlertTriangle className="h-4 w-4 mt-0.5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Inventory Optimization</p>
                          <p className="text-sm text-blue-700">
                            Consider adjusting stock levels based on predicted sales patterns to minimize waste.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border-l-4 border-green-500 bg-green-50">
                        <AlertTriangle className="h-4 w-4 mt-0.5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-900">Pricing Strategy</p>
                          <p className="text-sm text-green-700">
                            Implement dynamic pricing for products nearing expiry to maximize revenue.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border-l-4 border-orange-500 bg-orange-50">
                        <AlertTriangle className="h-4 w-4 mt-0.5 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium text-orange-900">Supplier Coordination</p>
                          <p className="text-sm text-orange-700">
                            Coordinate with suppliers based on predicted demand to ensure optimal stock levels.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No insights available. Generate predictions to see AI insights.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}