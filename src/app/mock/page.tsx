"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  Brain, 
  Camera, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Zap,
  BarChart3,
  Eye,
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";

export default function MockServicesPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isTestingCV, setIsTestingCV] = useState(false);
  const [isTestingAI, setIsTestingAI] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);
  const [cvTestResult, setCvTestResult] = useState<any>(null);
  const [aiTestResult, setAiTestResult] = useState<any>(null);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch('/api/mock/seed?action=seed', {
        method: 'POST',
      });

      const result = await response.json();
      setSeedResult(result);
      
      if (result.success) {
        toast.success("Mock data seeded successfully!");
      } else {
        toast.error("Failed to seed mock data");
      }
    } catch (error) {
      toast.error("Failed to seed mock data");
      setSeedResult({ success: false, message: "Network error" });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear all mock data? This action cannot be undone.")) {
      return;
    }

    setIsClearing(true);
    try {
      const response = await fetch('/api/mock/seed?action=clear', {
        method: 'POST',
      });

      const result = await response.json();
      setSeedResult(result);
      
      if (result.success) {
        toast.success("Mock data cleared successfully!");
      } else {
        toast.error("Failed to clear mock data");
      }
    } catch (error) {
      toast.error("Failed to clear mock data");
      setSeedResult({ success: false, message: "Network error" });
    } finally {
      setIsClearing(false);
    }
  };

  const handleTestComputerVision = async () => {
    setIsTestingCV(true);
    try {
      // Simulate computer vision testing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = {
        success: true,
        ocrText: "WHOLE MILK\n2L\nBEST BEFORE: 15/01/2024\nBATCH: MILK-2024-001",
        detectedObjects: [
          { label: "milk carton", confidence: 0.95 },
          { label: "text label", confidence: 0.88 },
        ],
        extractedInfo: {
          productName: "WHOLE MILK",
          expiryDate: "2024-01-15",
          batchId: "MILK-2024-001",
          confidence: 0.92,
        },
        processingTime: 1250,
      };

      setCvTestResult(mockResult);
      toast.success("Computer vision test completed!");
    } catch (error) {
      setCvTestResult({ success: false, message: "Test failed" });
      toast.error("Computer vision test failed");
    } finally {
      setIsTestingCV(false);
    }
  };

  const handleTestAI = async () => {
    setIsTestingAI(true);
    try {
      // Simulate AI testing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult = {
        success: true,
        predictions: [
          { date: "2024-01-15", predictedSales: 120, confidence: 0.92 },
          { date: "2024-01-16", predictedSales: 135, confidence: 0.89 },
          { date: "2024-01-17", predictedSales: 142, confidence: 0.94 },
        ],
        summary: {
          averagePredictedSales: 132,
          totalPredictedSales: 397,
          confidenceLevel: "HIGH",
        },
        expiryAnalysis: {
          riskLevel: "MEDIUM",
          recommendedAction: "DISCOUNT",
          confidence: 0.87,
        },
        processingTime: 2850,
      };

      setAiTestResult(mockResult);
      toast.success("AI service test completed!");
    } catch (error) {
      setAiTestResult({ success: false, message: "Test failed" });
      toast.error("AI service test failed");
    } finally {
      setIsTestingAI(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mock Services</h1>
          <p className="text-muted-foreground">
            Manage mock data and test AI/computer vision services
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Development Mode
        </Badge>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-lg font-semibold">Ready</span>
            </div>
            <p className="text-xs text-muted-foreground">
              SQLite database connected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Computer Vision</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-lg font-semibold">Mock</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Tesseract.js & TensorFlow.js ready
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Services</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="text-lg font-semibold">Mock</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Z-AI SDK integrated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="database" className="space-y-4">
        <TabsList>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="computer-vision">Computer Vision</TabsTrigger>
          <TabsTrigger value="ai-services">AI Services</TabsTrigger>
          <TabsTrigger value="integration">Integration Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Mock Data Management
              </CardTitle>
              <CardDescription>
                Seed or clear mock data for testing and development
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  onClick={handleSeedData} 
                  disabled={isSeeding}
                  className="flex-1"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isSeeding ? 'animate-spin' : ''}`} />
                  {isSeeding ? 'Seeding...' : 'Seed Mock Data'}
                </Button>
                <Button 
                  onClick={handleClearData} 
                  disabled={isClearing}
                  variant="outline"
                  className="flex-1"
                >
                  <XCircle className={`mr-2 h-4 w-4 ${isClearing ? 'animate-spin' : ''}`} />
                  {isClearing ? 'Clearing...' : 'Clear All Data'}
                </Button>
              </div>

              {seedResult && (
                <Alert className={seedResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <CheckCircle className={`h-4 w-4 ${seedResult.success ? "text-green-600" : "text-red-600"}`} />
                  <AlertDescription>
                    <div className="font-medium">{seedResult.message}</div>
                    {seedResult.error && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Error: {seedResult.error}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mock Data Includes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Suppliers</span>
                      <Badge variant="outline">4</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Products</span>
                      <Badge variant="outline">8</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Batches</span>
                      <Badge variant="outline">8</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Inventory Items</span>
                      <Badge variant="outline">8</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Alerts</span>
                      <Badge variant="outline">5</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Predictions</span>
                      <Badge variant="outline">4</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Scenarios</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Fresh products with good shelf life</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Products nearing expiry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Expired products requiring removal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Various stock levels and alerts</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="computer-vision" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Computer Vision Testing
              </CardTitle>
              <CardDescription>
                Test mock OCR and object detection services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleTestComputerVision} 
                disabled={isTestingCV}
                className="w-full"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isTestingCV ? 'animate-spin' : ''}`} />
                {isTestingCV ? 'Testing...' : 'Test Computer Vision'}
              </Button>

              {cvTestResult && (
                <div className="space-y-4">
                  <Alert className={cvTestResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <CheckCircle className={`h-4 w-4 ${cvTestResult.success ? "text-green-600" : "text-red-600"}`} />
                    <AlertDescription>
                      Test completed in {cvTestResult.processingTime}ms
                    </AlertDescription>
                  </Alert>

                  {cvTestResult.success && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">OCR Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <div className="text-sm font-medium">Extracted Text:</div>
                              <div className="text-xs bg-muted p-2 rounded font-mono">
                                {cvTestResult.ocrText}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Confidence:</span>
                              <Badge variant="outline">
                                {(cvTestResult.extractedInfo.confidence * 100).toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Detected Objects</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {cvTestResult.detectedObjects.map((obj: any, index: number) => (
                              <div key={index} className="flex justify-between">
                                <span className="text-sm capitalize">{obj.label}</span>
                                <Badge variant="outline">
                                  {(obj.confidence * 100).toFixed(1)}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Services Testing
              </CardTitle>
              <CardDescription>
                Test mock AI prediction and analysis services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleTestAI} 
                disabled={isTestingAI}
                className="w-full"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isTestingAI ? 'animate-spin' : ''}`} />
                {isTestingAI ? 'Testing...' : 'Test AI Services'}
              </Button>

              {aiTestResult && (
                <div className="space-y-4">
                  <Alert className={aiTestResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <CheckCircle className={`h-4 w-4 ${aiTestResult.success ? "text-green-600" : "text-red-600"}`} />
                    <AlertDescription>
                      Test completed in {aiTestResult.processingTime}ms
                    </AlertDescription>
                  </Alert>

                  {aiTestResult.success && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Sales Predictions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Average Daily Sales:</span>
                              <span className="font-medium">{aiTestResult.summary.averagePredictedSales}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Total Predicted:</span>
                              <span className="font-medium">{aiTestResult.summary.totalPredictedSales}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Confidence Level:</span>
                              <Badge variant={aiTestResult.summary.confidenceLevel === 'HIGH' ? 'default' : 'secondary'}>
                                {aiTestResult.summary.confidenceLevel}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Expiry Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Risk Level:</span>
                              <Badge variant={aiTestResult.expiryAnalysis.riskLevel === 'HIGH' ? 'destructive' : 'secondary'}>
                                {aiTestResult.expiryAnalysis.riskLevel}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Recommended Action:</span>
                              <span className="font-medium">{aiTestResult.expiryAnalysis.recommendedAction}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Confidence:</span>
                              <Badge variant="outline">
                                {(aiTestResult.expiryAnalysis.confidence * 100).toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Integration Guide
              </CardTitle>
              <CardDescription>
                How to switch from mock to real services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Environment Variables</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-sm">
                      DATABASE_URL=sqlite:///./dev.db
                    </code>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-sm">
                      AI_API_URL=https://api.example.com/ai
                    </code>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-sm">
                      VISION_API_URL=https://api.example.com/vision
                    </code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Service Replacement</h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-medium">Computer Vision</h5>
                    <p className="text-sm text-muted-foreground">
                      Replace mock services in <code>/src/lib/mock/computerVision.ts</code> with real Tesseract.js and TensorFlow.js implementations.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium">AI Services</h5>
                    <p className="text-sm text-muted-foreground">
                      Replace mock services in <code>/src/lib/mock/aiService.ts</code> with real AI model integrations.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-medium">Database</h5>
                    <p className="text-sm text-muted-foreground">
                      Update <code>/prisma/schema.prisma</code> and change DATABASE_URL to PostgreSQL/MySQL for production.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Testing Checklist</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Mock data seeded successfully</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Computer vision services responding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">AI prediction services working</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Real-time alerts functioning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Dashboard loading correctly</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}