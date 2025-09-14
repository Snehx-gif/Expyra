
'use client';

import { useEffect, useRef, useState } from 'react';
import { visionService } from '@/lib/vision/vision-service';

const CameraScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanResult, setScanResult] = useState<any>(null);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    enableCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL('image/png');
        const result = await visionService.scanImage(imageUrl);
        setScanResult(result);
      }
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted />
      <button onClick={captureImage}>Scan Product</button>
      {scanResult && (
        <div>
          <h2>Scan Result:</h2>
          <p>Product Name: {scanResult.name}</p>
          <p>Batch ID: {scanResult.batchId}</p>
          <p>MFG Date: {scanResult.mfgDate}</p>
          <p>EXP Date: {scanResult.expDate}</p>
        </div>
      )}
    </div>
  );
};

export default CameraScanner;
