"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

import { Button } from "@/components/ui/button";

export const CameraScanner = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsCameraOpen(false);
    }
  };

  return (
    <div>
      {isCameraOpen ? (
        <div className="flex flex-col items-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-auto max-w-md rounded-lg"
          />
          <Button onClick={handleCapture} className="mt-4">
            Capture
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Button onClick={() => setIsCameraOpen(true)}>
            Open Camera
          </Button>
          {capturedImage && (
            <div className="mt-4">
              <img src={capturedImage} alt="Captured" className="w-full h-auto max-w-md rounded-lg"/>
            </div>
          )}
        </div>
      )}
    </div>
  );
};