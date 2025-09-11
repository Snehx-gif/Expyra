// Mock computer vision services for testing

export interface MockOCRResult {
  text: string;
  confidence: number;
  blocks: Array<{
    text: string;
    bbox: [number, number, number, number];
    confidence: number;
  }>;
}

export interface MockObjectDetection {
  objects: Array<{
    label: string;
    confidence: number;
    bbox: [number, number, number, number];
  }>;
}

export interface MockProductInfo {
  productName?: string;
  expiryDate?: string;
  manufacturingDate?: string;
  batchId?: string;
  confidence: number;
}

// Mock OCR service
export class MockOCRService {
  async recognizeText(imageData: string): Promise<MockOCRResult> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Mock OCR results based on common product label patterns
    const mockTexts = [
      {
        text: "WHOLE MILK\n2L\nBEST BEFORE: 15/01/2024\nBATCH: MILK-2024-001\nNET WEIGHT: 2L",
        confidence: 0.92,
      },
      {
        text: "SOURDOUGH BREAD\nARTISAN BAKERY\nUSE BY: 08/01/2024\nBATCH: BREAD-2024-001\nWEIGHT: 500G",
        confidence: 0.88,
      },
      {
        text: "CHICKEN BREAST\nFRESH\nEXPIRY: 10/01/2024\nBATCH: CHICKEN-2024-001\nWEIGHT: 1KG",
        confidence: 0.85,
      },
      {
        text: "ORGANIC APPLES\nPREMIUM QUALITY\nBEST BEFORE: 20/01/2024\nBATCH: APPLES-2024-001\nORIGIN: CHILE",
        confidence: 0.90,
      },
    ];

    const selectedText = mockTexts[Math.floor(Math.random() * mockTexts.length)];

    // Generate mock blocks
    const lines = selectedText.text.split('\n');
    const blocks = lines.map((line, index) => ({
      text: line,
      bbox: [10, 20 + index * 30, 200, 45 + index * 30] as [number, number, number, number],
      confidence: selectedText.confidence + (Math.random() - 0.5) * 0.1,
    }));

    return {
      text: selectedText.text,
      confidence: selectedText.confidence,
      blocks,
    };
  }
}

// Mock object detection service
export class MockObjectDetectionService {
  async detectObjects(imageData: string): Promise<MockObjectDetection> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

    // Mock detected objects
    const mockObjects = [
      {
        label: "milk carton",
        confidence: 0.95,
        bbox: [50, 50, 200, 150] as [number, number, number, number],
      },
      {
        label: "bread loaf",
        confidence: 0.88,
        bbox: [60, 40, 180, 140] as [number, number, number, number],
      },
      {
        label: "meat package",
        confidence: 0.82,
        bbox: [70, 60, 190, 160] as [number, number, number, number],
      },
      {
        label: "apple",
        confidence: 0.91,
        bbox: [40, 30, 160, 130] as [number, number, number, number],
      },
    ];

    // Return 1-3 random objects
    const numObjects = Math.floor(Math.random() * 3) + 1;
    const selectedObjects: MockObjectDetection['objects'] = [];

    for (let i = 0; i < numObjects; i++) {
      const randomObject = mockObjects[Math.floor(Math.random() * mockObjects.length)];
      selectedObjects.push({
        ...randomObject,
        confidence: Math.min(0.99, randomObject.confidence + (Math.random() - 0.5) * 0.1),
      });
    }

    return {
      objects: selectedObjects,
    };
  }
}

// Mock product information extraction
export class MockProductInfoService {
  async extractProductInfo(ocrText: string, detectedObjects: MockObjectDetection): Promise<MockProductInfo> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 500));

    // Extract information from OCR text
    const productName = this.extractProductName(ocrText);
    const expiryDate = this.extractDate(ocrText, ['best before', 'expiry', 'use by', 'exp']);
    const manufacturingDate = this.extractDate(ocrText, ['manufacturing', 'mfg', 'produced']);
    const batchId = this.extractBatchId(ocrText);

    // Calculate overall confidence based on extraction success
    const confidence = this.calculateConfidence(productName, expiryDate, manufacturingDate, batchId);

    return {
      productName,
      expiryDate,
      manufacturingDate,
      batchId,
      confidence,
    };
  }

  private extractProductName(text: string): string | undefined {
    const productPatterns = [
      /(WHOLE MILK|2L MILK|MILK)/i,
      /(SOURDOUGH BREAD|BREAD LOAF|BREAD)/i,
      /(CHICKEN BREAST|CHICKEN)/i,
      /(ORGANIC APPLES|APPLES)/i,
      /(GREEK YOGURT|YOGURT)/i,
    ];

    for (const pattern of productPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    // Fallback to first line if no pattern matches
    const lines = text.split('\n');
    return lines[0].trim() || undefined;
  }

  private extractDate(text: string, keywords: string[]): string | undefined {
    const lines = text.split('\n');

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      for (const keyword of keywords) {
        if (lowerLine.includes(keyword)) {
          // Extract date pattern (DD/MM/YYYY or MM/DD/YYYY)
          const dateMatch = line.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
          if (dateMatch) {
            const [, day, month, year] = dateMatch;
            // Format as YYYY-MM-DD
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
        }
      }
    }

    // Generate a mock date if none found
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
    return futureDate.toISOString().split('T')[0];
  }

  private extractBatchId(text: string): string | undefined {
    const lines = text.split('\n');

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('batch')) {
        // Extract batch ID pattern
        const batchMatch = line.match(/(?:batch|lot)\s*[:\-]?\s*([A-Z0-9\-]+)/i);
        if (batchMatch) {
          return batchMatch[1];
        }
      }
    }

    // Generate a mock batch ID if none found
    const batchTypes = ['MILK', 'BREAD', 'CHICKEN', 'APPLE', 'YOGURT'];
    const randomType = batchTypes[Math.floor(Math.random() * batchTypes.length)];
    const randomNum = Math.floor(Math.random() * 1000) + 1;
    return `${randomType}-2024-${randomNum.toString().padStart(3, '0')}`;
  }

  private calculateConfidence(
    productName: string | undefined,
    expiryDate: string | undefined,
    manufacturingDate: string | undefined,
    batchId: string | undefined
  ): number {
    let confidence = 0.5; // Base confidence

    // Add confidence for each extracted field
    if (productName) confidence += 0.15;
    if (expiryDate) confidence += 0.2;
    if (manufacturingDate) confidence += 0.1;
    if (batchId) confidence += 0.15;

    // Add some randomness
    confidence += (Math.random() - 0.5) * 0.1;

    return Math.min(0.99, Math.max(0.5, confidence));
  }
}

// Mock computer vision service that combines OCR and object detection
export class MockComputerVisionService {
  private ocrService: MockOCRService;
  private objectDetectionService: MockObjectDetectionService;
  private productInfoService: MockProductInfoService;

  constructor() {
    this.ocrService = new MockOCRService();
    this.objectDetectionService = new MockObjectDetectionService();
    this.productInfoService = new MockProductInfoService();
  }

  async processImage(imageData: string): Promise<{
    ocrResult: MockOCRResult;
    objectDetection: MockObjectDetection;
    productInfo: MockProductInfo;
    processingTime: number;
  }> {
    const startTime = Date.now();

    // Run OCR and object detection in parallel
    const [ocrResult, objectDetection] = await Promise.all([
      this.ocrService.recognizeText(imageData),
      this.objectDetectionService.detectObjects(imageData),
    ]);

    // Extract product information
    const productInfo = await this.productInfoService.extractProductInfo(
      ocrResult.text,
      objectDetection
    );

    const processingTime = Date.now() - startTime;

    return {
      ocrResult,
      objectDetection,
      productInfo,
      processingTime,
    };
  }
}

// Export singleton instance
export const mockComputerVisionService = new MockComputerVisionService();