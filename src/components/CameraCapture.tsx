import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, X, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File, preview: string) => void;
}

export const CameraCapture = ({ isOpen, onClose, onCapture }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.");
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage, startCamera, stopCamera]);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const handleConfirm = useCallback(() => {
    if (capturedImage) {
      // Convert data URL to File
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
          onCapture(file, capturedImage);
          setCapturedImage(null);
          onClose();
        });
    }
  }, [capturedImage, onCapture, onClose]);

  const handleClose = useCallback(() => {
    stopCamera();
    setCapturedImage(null);
    onClose();
  }, [stopCamera, onClose]);

  const toggleFacingMode = useCallback(() => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm border-b border-border">
          <h3 className="font-display font-semibold text-lg">Ambil Foto</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Camera/Preview Area */}
        <div className="flex-1 relative flex items-center justify-center bg-foreground/5 overflow-hidden">
          {error ? (
            <div className="text-center p-8">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-destructive font-medium">{error}</p>
              <button
                onClick={startCamera}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                Coba Lagi
              </button>
            </div>
          ) : capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="max-h-full max-w-full object-contain"
              />
              {/* Scan overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-8 border-2 border-primary/30 rounded-2xl" />
                <div className="absolute left-8 right-8 top-8 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="p-6 bg-card/80 backdrop-blur-sm border-t border-border">
          {capturedImage ? (
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={handleRetake}
                className="flex flex-col items-center gap-2 p-4 hover:bg-muted rounded-xl transition-colors"
              >
                <div className="p-3 bg-muted rounded-full">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">Ulangi</span>
              </button>
              <button
                onClick={handleConfirm}
                className="flex flex-col items-center gap-2 p-4 hover:bg-primary/10 rounded-xl transition-colors"
              >
                <div className="p-4 bg-primary rounded-full text-primary-foreground">
                  <Check className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium text-primary">Gunakan</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={toggleFacingMode}
                className="flex flex-col items-center gap-2 p-4 hover:bg-muted rounded-xl transition-colors"
              >
                <div className="p-3 bg-muted rounded-full">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">Flip</span>
              </button>
              <button
                onClick={handleCapture}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/30 rounded-full animate-pulse-ring" />
                <div className="relative p-5 bg-primary rounded-full text-primary-foreground shadow-lg hover:shadow-glow transition-shadow">
                  <Camera className="w-8 h-8" />
                </div>
              </button>
              <div className="w-[72px]" /> {/* Spacer for alignment */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};