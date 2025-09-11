"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  RefreshCw,
  Package,
  AlertTriangle,
  DollarSign
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { toast } from "sonner";
import { ChartContainer, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

interface AnalyticsData {
  expiryDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  salesPredictions: Array<{
    date: string;
    predicted: number;
    actual: number;
    confidence: number;
  }>;
  stockTrends: Array<{
    category: string;
    current: number;
    optimal: number;
    critical: number;
  }>;
  alertTrends: Array<{
    date: string;
    nearExpiry: number;
    expired: number;
    donationReady: number;
    lowStock: number;
  }>;
  topProducts: Array<{
    name: string;
    alerts: number;
    sales: number;
    accuracy: number;
  }>;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, selectedCategory]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const mockData: AnalyticsData = {
        expiryDistribution: [
          { name: "Fresh", value: 45, color: "hsl(var(--chart-1))" },
          { name: "Near Expiry", value: 25, color: "hsl(var(--chart-2))" },
          { name: "Expiring Soon", value: 20, color: "hsl(var(--chart-3))" },
          { name: "Expired", value: 10, color: "hsl(var(--chart-4))" },
        ],
        salesPredictions: [
          { date: "Jan 1", predicted: 120, actual: 115, confidence: 0.92 },
          { date: "Jan 2", predicted: 135, actual: 128, confidence: 0.89 },
          { date: "Jan 3", predicted: 142, actual: 145, confidence: 0.94 },
          { date: "Jan 4", predicted: 158, actual: 152, confidence: 0.87 },
          { date: "Jan 5", predicted: 165, actual: 160, confidence: 0.91 },
          { date: "Jan 6", predicted: 172, actual: 168, confidence: 0.93 },
          { date: "Jan 7", predicted: 180, actual: 175, confidence: 0.88 },
        ],
        stockTrends: [
          { category: "Dairy", current: 450, optimal: 500, critical: 100 },
          { category: "Bakery", current: 280, optimal: 300, critical: 50 },
          { category: "Meat", current: 180, optimal: 200, critical: 40 },
          { category: "Produce", current: 320, optimal: 350, critical: 70 },
          { category: "Frozen", current: 520, optimal: 600, critical: 100 },
        ],
        alertTrends: [
          { date: "Jan 1", nearExpiry: 12, expired: 3, donationReady: 5, lowStock: 8 },
          { date: "Jan 2", nearExpiry: 15, expired: 2, donationReady: 7, lowStock: 6 },
          { date: "Jan 3", nearExpiry: 18, expired: 4, donationReady: 9, lowStock: 10 },
          { date: "Jan 4", nearExpiry: 14, expired: 1, donationReady: 6, lowStock: 7 },
          { date: "Jan 5", nearExpiry: 20, expired: 5, donationReady: 11, lowStock: 12 },
          { date: "Jan 6", nearExpiry: 16, expired: 2, donationReady: 8, lowStock: 9 },
          { date: "Jan 7", nearExpiry: 22, expired: 6, donationReady: 13, lowStock: 14 },
        ],
        topProducts: [
          { name: "Milk 2L", alerts: 8, sales: 245, accuracy: 94 },
          { name: "Bread Loaf", alerts: 12, sales: 189, accuracy: 87 },
          { name: "Chicken Breast", alerts: 6, sales: 156, accuracy: 92 },
          { name: "Apples", alerts: 4, sales: 134, accuracy: 96 },
          { name: "Yogurt", alerts: 9, sales: 178, accuracy: 89 },
        ]
      };
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(mockData);
    } catch (error) {
      toast.error("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600";
    if (confidence >= 0.8) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <BarChart3 className="h-8 w-8 mx-auto mb-4" />
          <p>No analytics data available</p>
        </div>
      </div>
    );
  }

  const expiryChartConfig: ChartConfig = {
    value: { label: "Products" },
    Fresh: { label: "Fresh", color: "hsl(var(--chart-1))" },
    "Near Expiry": { label: "Near Expiry", color: "hsl(var(--chart-2))" },
    "Expiring Soon": { label: "Expiring Soon", color: "hsl(var(--chart-3))" },
    Expired: { label: "Expired", color: "hsl(var(--chart-4))" },
  };

  const salesChartConfig: ChartConfig = {
    predicted: { label: "Predicted", color: "hsl(var(--chart-1))" },
    actual: { label: "Actual", color: "hsl(var(--chart-2))" },
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your inventory performance and predictions
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalyticsData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+8%</span> from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prediction Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.4%</span> improvement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Reduction</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> saved
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Expiry Distribution
            </CardTitle>
            <CardDescription>
              Current status of products by expiry timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={expiryChartConfig} className="min-h-[300px] w-full">
              <RechartsPieChart>
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={analyticsData.expiryDistribution} dataKey="value" nameKey="name" innerRadius={60}>
                  {analyticsData.expiryDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Predictions vs Actual
            </CardTitle>
            <CardDescription>
              AI-powered sales forecasting accuracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={salesChartConfig} className="min-h-[300px] w-full">
              <LineChart data={analyticsData.salesPredictions} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip content={<ChartTooltipContent indicator="line" />} />
                <Line dataKey="predicted" type="natural" stroke="var(--color-predicted)" strokeWidth={2} dot={false} />
                <Line dataKey="actual" type="natural" stroke="var(--color-actual)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Stock Levels by Category
            </CardTitle>
            <CardDescription>
              Current inventory levels compared to optimal and critical thresholds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.stockTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#3b82f6" name="Current Stock" />
                <Bar dataKey="optimal" fill="#10b981" name="Optimal Level" />
                <Bar dataKey="critical" fill="#ef4444" name="Critical Level" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alert Trends Over Time
            </CardTitle>
            <CardDescription>
              Daily breakdown of different alert types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.alertTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="nearExpiry" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Near Expiry" />
                <Area type="monotone" dataKey="expired" stackId="1" stroke="#ef4444" fill="#ef4444" name="Expired" />
                <Area type="monotone" dataKey="donationReady" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Donation Ready" />
                <Area type="monotone" dataKey="lowStock" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Low Stock" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Products by Performance</CardTitle>
          <CardDescription>
            Products with highest sales and alert activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatNumber(product.sales)} sales
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Alerts</div>
                    <Badge variant={product.alerts > 10 ? "destructive" : "secondary"}>
                      {product.alerts}
                    </Badge>
                  </div>
                  <_div className="text-right">
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                    <div className={`font-medium ${getConfidenceColor(product.accuracy / 100)}`}>
                      {product.accuracy}%
                    </div>
                  </_div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}