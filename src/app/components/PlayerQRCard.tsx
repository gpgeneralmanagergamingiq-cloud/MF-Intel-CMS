import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { QrCode, Printer, X } from "lucide-react";

interface Player {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  rating?: string;
  joinDate?: string;
  status?: string;
}

interface PlayerQRCardProps {
  player: Player;
  propertyName?: string;
  onClose: () => void;
}

export function PlayerQRCard({ player, propertyName = "MF-INTEL CMS", onClose }: PlayerQRCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    // Generate QR code
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, player.id, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Also generate data URL for print
      QRCode.toDataURL(player.id, {
        width: 200,
        margin: 2,
      }).then(setQrCodeUrl);
    }
  }, [player.id]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:bg-white print:p-0">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] flex flex-col print:shadow-none print:max-w-full print:max-h-full">
          {/* Header - Always visible, not scrollable */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 flex items-center justify-between rounded-t-lg flex-shrink-0 print:hidden">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              <h2 className="text-lg font-bold">Player QR Card</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                title="Print Card"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 p-6 print:overflow-visible print:p-0">
            {/* Printable Player Card */}
            <div className="border-4 border-purple-600 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-blue-50 print:border-purple-800">
              {/* Casino Logo/Name */}
              <div className="text-center mb-4">
                <h1 className="text-xl font-bold text-purple-900 mb-1">{propertyName}</h1>
                <p className="text-xs text-purple-700 font-medium">GAMING IQ - Player Card</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-4">
                <div className="bg-white p-3 rounded-lg shadow-lg border-4 border-purple-300">
                  <canvas ref={canvasRef} className="hidden" />
                  {qrCodeUrl && (
                    <img src={qrCodeUrl} alt="Player QR Code" className="w-[180px] h-[180px]" />
                  )}
                </div>
              </div>

              {/* Player Info */}
              <div className="bg-white rounded-lg p-4 border-2 border-purple-200 space-y-2">
                <div>
                  <p className="text-xs text-purple-600 font-medium uppercase">Player Name</p>
                  <p className="text-base font-bold text-slate-900">{player.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-purple-600 font-medium uppercase">Player ID</p>
                    <p className="text-xs font-mono font-bold text-slate-700">{player.id}</p>
                  </div>
                  {player.status && (
                    <div>
                      <p className="text-xs text-purple-600 font-medium uppercase">Status</p>
                      <p className="text-xs font-bold text-slate-700">{player.status}</p>
                    </div>
                  )}
                </div>

                {player.phone && (
                  <div>
                    <p className="text-xs text-purple-600 font-medium uppercase">Contact</p>
                    <p className="text-xs text-slate-700">{player.phone}</p>
                  </div>
                )}

                {player.joinDate && (
                  <div>
                    <p className="text-xs text-purple-600 font-medium uppercase">Member Since</p>
                    <p className="text-xs text-slate-700">
                      {new Date(player.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t-2 border-purple-200 text-center">
                <p className="text-xs text-purple-700 font-medium">
                  Scan this QR code at any terminal for instant player lookup
                </p>
              </div>
            </div>

            {/* Instructions - Hidden when printing */}
            <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-3 print:hidden">
              <p className="text-sm text-blue-800 mb-2">
                <span className="font-bold">How to use:</span>
              </p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Print this card</li>
                <li>Attach to physical player card or badge</li>
                <li>Scan QR code at any terminal to instantly load player info</li>
              </ol>
            </div>
          </div>

          {/* Action Buttons - Always visible at bottom */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 flex-shrink-0 print:hidden">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Card
            </button>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:bg-white,
          .print\\:bg-white * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 20mm;
          }
        }
      `}</style>
    </>
  );
}