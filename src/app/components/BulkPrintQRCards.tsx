import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Printer, Loader2 } from "lucide-react";

interface Player {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  rating?: string;
  joinDate?: string;
  status?: string;
}

interface BulkPrintQRCardsProps {
  players: Player[];
  propertyName?: string;
  onClose: () => void;
}

export function BulkPrintQRCards({ players, propertyName = "MF-INTEL CMS", onClose }: BulkPrintQRCardsProps) {
  const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate all QR codes
    const generateQRCodes = async () => {
      const codes: { [key: string]: string } = {};
      
      for (const player of players) {
        try {
          const url = await QRCode.toDataURL(player.id, {
            width: 200,
            margin: 2,
          });
          codes[player.id] = url;
        } catch (error) {
          console.error(`Error generating QR code for ${player.id}:`, error);
        }
      }
      
      setQrCodes(codes);
      setLoading(false);
    };

    generateQRCodes();
  }, [players]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:bg-white print:p-0">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col print:shadow-none print:max-w-full print:max-h-full">
          {/* Header - Always visible */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 flex items-center justify-between rounded-t-lg flex-shrink-0 print:hidden">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5" />
              <h2 className="text-lg font-bold">Bulk Print Player Cards ({players.length})</h2>
            </div>
            <div className="flex items-center gap-2">
              {!loading && (
                <button
                  onClick={handlePrint}
                  className="text-white hover:bg-white/20 rounded-lg px-3 py-2 transition-colors flex items-center gap-2"
                  title="Print All"
                >
                  <Printer className="w-4 h-4" />
                  <span className="text-sm font-medium">Print</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-700">Generating QR codes...</p>
                <p className="text-sm text-slate-500 mt-2">
                  Processing {players.length} player cards
                </p>
              </div>
            </div>
          )}

          {/* Cards Grid - Scrollable */}
          {!loading && (
            <div className="flex-1 overflow-y-auto p-6 print:overflow-visible print:p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-4">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="border-4 border-purple-600 rounded-xl p-4 bg-gradient-to-br from-purple-50 to-blue-50 break-inside-avoid print:border-purple-800 print:page-break-inside-avoid"
                  >
                    {/* Casino Logo/Name */}
                    <div className="text-center mb-3">
                      <h1 className="text-lg font-bold text-purple-900 mb-1">{propertyName}</h1>
                      <p className="text-xs text-purple-700 font-medium">GAMING IQ - Player Card</p>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center mb-3">
                      <div className="bg-white p-2 rounded-lg shadow-lg border-4 border-purple-300">
                        {qrCodes[player.id] && (
                          <img
                            src={qrCodes[player.id]}
                            alt={`QR Code for ${player.name}`}
                            className="w-[160px] h-[160px]"
                          />
                        )}
                      </div>
                    </div>

                    {/* Player Info */}
                    <div className="bg-white rounded-lg p-3 border-2 border-purple-200 space-y-2">
                      <div>
                        <p className="text-xs text-purple-600 font-medium uppercase">Player Name</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{player.name}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-purple-600 font-medium uppercase">Player ID</p>
                          <p className="text-xs font-mono font-bold text-slate-700 truncate">{player.id}</p>
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
                          <p className="text-xs text-slate-700 truncate">{player.phone}</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-2 pt-2 border-t-2 border-purple-200 text-center">
                      <p className="text-xs text-purple-700 font-medium">
                        Scan QR code for instant lookup
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons - Always visible at bottom */}
          {!loading && (
            <div className="flex justify-between items-center gap-3 px-6 py-4 border-t border-slate-200 flex-shrink-0 print:hidden">
              <div className="text-sm text-slate-600">
                <span className="font-medium">{players.length}</span> player cards ready to print
              </div>
              <div className="flex gap-3">
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
                  Print All Cards
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\\\:bg-white,
          .print\\\\:bg-white * {
            visibility: visible;
          }
          .print\\\\:hidden {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
          .break-inside-avoid,
          .print\\\\:page-break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </>
  );
}