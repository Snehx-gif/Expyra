"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Upload,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface ScanResult {
  productName?: string;
  expiryDate?: string;
  manufacturingDate?: string;
  batchId?: string;
  confidence?: number;
  status: 'idle' | 'scanning' | 'success' | 'error';
  message?: string;
}

interface DetectedProduct {
  name: string;
  confidence: number;
  bbox: [number, number, number, number];
}

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult>({ status: 'idle' });
  const [detectedProducts, setDetectedProducts] = useState<DetectedProduct[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (isCameraActive) {
        stopCamera();
      }
    };
  }, [isCameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        toast.success("Camera started successfully");
      }
    } catch (error) {
      toast.error("Failed to access camera");
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context?.drawImage(video, 0, 0);

    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setSelectedImage(imageDataUrl);
    processImage(imageDataUrl);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setSelectedImage(imageDataUrl);
      processImage(imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageDataUrl: string) => {
    setScanResult({ status: 'scanning' });
    setProgress(0);

    try {
      // Simulate processing progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Mock OCR and object detection processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setProgress(100);

      // Mock detected products (in real implementation, this would use TensorFlow.js)
      const mockDetectedProducts: DetectedProduct[] = [
        {
          name: "Dairy Milk",
          confidence: 0.95,
          bbox: [50, 50, 200, 150]
        },
        {
          name: "Best Before",
          confidence: 0.88,
          bbox: [50, 160, 150, 180]
        }
      ];

      // Mock OCR result (in real implementation, this would use Tesseract.js)
      const mockOCRResult = {
        productName: "Dairy Milk Chocolate",
        manufacturingDate: "2024-01-15",
        expiryDate: "2024-07-15",
        batchId: "DM20240115",
        confidence: 0.92
      };

      setDetectedProducts(mockDetectedProducts);
      setScanResult({
        ...mockOCRResult,
        status: 'success',
        message: 'Product successfully scanned and identified'
      });

      toast.success("Product scanned successfully!");
    } catch (error) {
      setScanResult({
        status: 'error',
        message: 'Failed to process image. Please try again.'
      });
      toast.error("Failed to process image");
      console.error("Processing error:", error);
    }
  };

  const resetScan = () => {
    setScanResult({ status: 'idle' });
    setDetectedProducts([]);
    setProgress(0);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusIcon = () => {
    switch (scanResult.status) {
      case 'scanning':
        return <RefreshCw className="h-5 w-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  const getStatusColor = () => {
    switch (scanResult.status) {
      case 'scanning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scan Product</h1>
          <p className="text-muted-foreground">
            Use AI-powered computer vision to scan and identify products
          </p>
        </div>
        <Button onClick={resetScan} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Camera Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Camera Input
            </CardTitle>
            <CardDescription>
              Use your device camera or upload an image to scan products
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera Preview */}
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Scanned product"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p>Camera inactive</p>
                  </div>
                </div>
              )}
              
              {/* Detection Overlay */}
              {detectedProducts.length > 0 && selectedImage && (
                <div className="absolute inset-0">
                  <svg className="w-full h-full">
                    {detectedProducts.map((product, index) => {
                      const [x, y, width, height] = product.bbox;
                      return (
                        <g key={index}>
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                          />
                          <text
                            x={x}
                            y={y - 5}
                            fill="#10b981"
                            fontSize="12"
                            fontWeight="bold"
                          >
                            {product.name} ({Math.round(product.confidence * 100)}%)
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Controls */}
            <div className="flex gap-2">
              {!isCameraActive ? (
                <Button onClick={startCamera} className="flex-1">
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>
              ) : (
                <>
                  <Button onClick={captureImage} className="flex-1">
                    <Zap className="mr-2 h-4 w-4" />
                    Capture & Scan
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    Stop Camera
                  </Button>
                </>
              )}
            </div>

            {/* File Upload */}
            <div className="border-t pt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Scan Results
            </CardTitle>
            <CardDescription>
              AI-powered product detection and information extraction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Processing Progress */}
            {scanResult.status === 'scanning' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing image...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {/* Status Alert */}
            {scanResult.status !== 'idle' && (
              <Alert className={getStatusColor()}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {scanResult.message || 'Ready to scan'}
                </AlertDescription>
              </Alert>
            )}

            {/* Detected Products */}
            {detectedProducts.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Detected Items</h4>
                <div className="space-y-2">
                  {detectedProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">{product.name}</span>
                      <Badge variant="outline">
                        {Math.round(product.confidence * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Information */}
            {scanResult.status === 'success' && (
              <div className="space-y-4">
                <h4 className="font-medium">Extracted Information</h4>
                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product Name:</span>
                    <span className="font-medium">{scanResult.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Batch ID:</span>
                    <span className="font-medium">{scanResult.batchId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Manufacturing Date:</span>
                    <span className="font-medium">{scanResult.manufacturingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiry Date:</span>
                    <span className="font-medium text-red-600">{scanResult.expiryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence:</span>
                    <Badge variant="outline">
                      {Math.round((scanResult.confidence || 0) * 100)}%
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">
                    Add to Inventory
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {scanResult.status === 'idle' && (
              <div className="text-center py-8 text-muted-foreground">
                <Camera className="h-12 w-12 mx-auto mb-2" />
                <p>Start camera or upload an image to begin scanning</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Technology Info */}
      <Card>
        <CardHeader>
          <CardTitle>Powered by AI & Computer Vision</CardTitle>
          <CardDescription>
            Our scanning technology uses advanced AI models for accurate product detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium">Object Detection</h4>
              <p className="text-sm text-muted-foreground">
                TensorFlow.js identifies products in images
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium">OCR Technology</h4>
              <p className="text-sm text-muted-foreground">
                Tesseract.js extracts text from labels
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium">Smart Processing</h4>
              <p className="text-sm text-muted-foreground">
                AI algorithms validate and structure data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}