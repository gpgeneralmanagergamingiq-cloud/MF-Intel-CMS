import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera, AlertCircle, Loader2 } from "lucide-react";

interface QRScannerProps {
  onScan: (playerId: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const manualInputRef = useRef<HTMLInputElement>(null);
  const qrCodeRegionId = "qr-reader";

  useEffect(() => {
    startScanning();
    
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Create scanner instance
      const scanner = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = scanner;

      // Request camera permissions explicitly
      try {
        await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      } catch (permissionError) {
        console.error("Camera permission denied:", permissionError);
        setError("Camera access denied. Please allow camera access in your browser settings and try again.");
        setIsLoading(false);
        return;
      }

      // Start scanning with back camera
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Success callback - QR code detected
          if (decodedText) {
            stopScanning();
            onScan(decodedText);
          }
        },
        (errorMessage) => {
          // Error callback - scanning in progress
          // We can ignore this as it just means no QR code detected yet
        }
      );

      setIsScanning(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Error starting scanner:", err);
      setError("Camera access denied or not available. Please allow camera access and try again.");
      setIsLoading(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleClose = async () => {
    await stopScanning();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[95vh] flex flex-col">
        {/* Header - Always visible */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 flex items-center justify-between rounded-t-lg flex-shrink-0">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            <h2 className="text-lg font-bold">Scan Player QR Code</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Instructions */}
          <div className="mb-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Position the QR code within the camera frame. The player will be automatically loaded when detected.
              </span>
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center p-12 bg-slate-50 rounded-lg border-4 border-purple-300">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-600">Starting camera...</p>
              </div>
            </div>
          )}

          {/* QR Scanner */}
          <div className="relative">
            <div 
              id={qrCodeRegionId} 
              className="rounded-lg overflow-hidden border-4 border-purple-300"
              style={{ display: isLoading ? 'none' : 'block' }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </p>
            </div>
          )}

          {/* Alternative Input */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-medium">Or enter manually</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Player ID
              </label>
              <input
                type="text"
                placeholder="Enter player ID manually"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                ref={manualInputRef}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    await stopScanning();
                    onScan(e.currentTarget.value);
                    onClose();
                  } else if (e.key === "Escape") {
                    await handleClose();
                  }
                }}
              />
              <p className="text-xs text-slate-500 mt-1">
                Press Enter to search
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Always visible at bottom */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}