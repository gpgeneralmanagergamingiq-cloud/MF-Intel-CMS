import { useState, useEffect, useRef } from "react";
import { X, Printer, Calendar, User, Download } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";
import QRCode from "qrcode";

// Hardcoded property - Grand Palace Casino v2.3.2
const PROPERTY_NAME = "Grand Palace Casino";

interface Player {
  id: string;
  name: string;
  memberId: string;
  joinDate: string;
}

interface PlayerTicketPrintModalProps {
  onClose: () => void;
  players: Player[];
  preselectedPlayer?: Player | null;
}

export function PlayerTicketPrintModal({ onClose, players, preselectedPlayer }: PlayerTicketPrintModalProps) {
  const api = useApi();
  
  const [mode, setMode] = useState<'all' | 'single'>(preselectedPlayer ? 'single' : 'all');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(preselectedPlayer || null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set default date range (today)
    const today = new Date().toISOString().split('T')[0];
    setDateFrom(today);
    setDateTo(today);
  }, []);

  const getFilteredPlayers = () => {
    if (mode === 'single' && selectedPlayer) {
      return [selectedPlayer];
    }

    // For 'all' mode, filter by join date
    if (!dateFrom && !dateTo) return players;

    return players.filter(player => {
      const joinDate = new Date(player.joinDate);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      if (fromDate && joinDate < fromDate) return false;
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (joinDate > endOfDay) return false;
      }

      return true;
    });
  };

  const handlePrint = () => {
    const filteredPlayers = getFilteredPlayers();
    
    if (filteredPlayers.length === 0) {
      toast.error("No players found for the selected criteria");
      return;
    }

    setShowPreview(true);
    
    // Trigger print after a short delay to allow rendering
    setTimeout(() => {
      window.print();
      toast.success(`Printing ${filteredPlayers.length} player ticket(s)`);
    }, 500);
  };

  const handleExportPDF = () => {
    const filteredPlayers = getFilteredPlayers();
    
    if (filteredPlayers.length === 0) {
      toast.error("No players found for the selected criteria");
      return;
    }

    setShowPreview(true);
    
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const filteredPlayers = getFilteredPlayers();
  const today = new Date();
  const printDate = today.toLocaleDateString();

  if (showPreview) {
    return (
      <>
        {/* Print styles */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-container, .print-container * {
              visibility: visible;
            }
            .print-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .player-ticket {
              page-break-after: always;
              page-break-inside: avoid;
              width: 100%;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .player-ticket:last-child {
              page-break-after: auto;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>

        {/* Preview Modal */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Player Tickets Preview</h2>
                <p className="text-sm text-slate-600">{filteredPlayers.length} ticket(s) ready to print</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {filteredPlayers.map((player, index) => (
                <div 
                  key={player.id}
                  className="mb-8 border-2 border-slate-300 rounded-lg p-8 bg-white"
                  style={{ pageBreakAfter: 'always' }}
                >
                  <div className="text-center space-y-6">
                    {/* Property Name */}
                    <div className="border-b-2 border-slate-300 pb-4">
                      <h1 className="text-3xl font-bold text-slate-900">{PROPERTY_NAME}</h1>
                      <p className="text-lg text-slate-600 mt-2">Player Membership Ticket</p>
                    </div>

                    {/* Player ID (Large and prominent) */}
                    <div className="my-8">
                      <p className="text-sm text-slate-600 uppercase tracking-wide mb-2">Member ID</p>
                      <p className="text-6xl font-bold text-blue-600 tracking-wider">{player.memberId}</p>
                    </div>

                    {/* Player Name */}
                    <div className="my-6">
                      <p className="text-sm text-slate-600 uppercase tracking-wide mb-2">Player Name</p>
                      <p className="text-4xl font-bold text-slate-900">{player.name}</p>
                    </div>

                    {/* Dates Section */}
                    <div className="grid grid-cols-2 gap-6 my-8 pt-6 border-t-2 border-slate-300">
                      <div className="text-center">
                        <p className="text-sm text-slate-600 uppercase tracking-wide mb-2">Date Earned</p>
                        <p className="text-2xl font-semibold text-slate-900">
                          {new Date(player.joinDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-600 uppercase tracking-wide mb-2">Date Printed</p>
                        <p className="text-2xl font-semibold text-slate-900">
                          {today.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t-2 border-slate-300">
                      <p className="text-xs text-slate-500">
                        This ticket was generated by MF-Intel CMS v2.3.0
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Ticket #{index + 1} of {filteredPlayers.length}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hidden print content */}
        <div ref={printRef} className="print-container" style={{ display: 'none' }}>
          {filteredPlayers.map((player, index) => (
            <div key={player.id} className="player-ticket">
              <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '60px' }}>
                <div style={{ textAlign: 'center' }}>
                  {/* Property Name */}
                  <div style={{ borderBottom: '3px solid #333', paddingBottom: '30px', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0', color: '#000' }}>{PROPERTY_NAME}</h1>
                    <p style={{ fontSize: '24px', marginTop: '15px', color: '#666' }}>Player Membership Ticket</p>
                  </div>

                  {/* Player ID */}
                  <div style={{ margin: '60px 0' }}>
                    <p style={{ fontSize: '16px', color: '#666', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Member ID</p>
                    <p style={{ fontSize: '96px', fontWeight: 'bold', color: '#2563eb', letterSpacing: '8px', margin: '0' }}>{player.memberId}</p>
                  </div>

                  {/* Player Name */}
                  <div style={{ margin: '50px 0' }}>
                    <p style={{ fontSize: '16px', color: '#666', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Player Name</p>
                    <p style={{ fontSize: '56px', fontWeight: 'bold', color: '#000', margin: '0' }}>{player.name}</p>
                  </div>

                  {/* Dates */}
                  <div style={{ display: 'flex', justifyContent: 'space-around', margin: '60px 0', paddingTop: '40px', borderTop: '3px solid #333' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '16px', color: '#666', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Date Earned</p>
                      <p style={{ fontSize: '32px', fontWeight: '600', color: '#000', margin: '0' }}>
                        {new Date(player.joinDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '16px', color: '#666', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Date Printed</p>
                      <p style={{ fontSize: '32px', fontWeight: '600', color: '#000', margin: '0' }}>
                        {today.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ marginTop: '60px', paddingTop: '30px', borderTop: '3px solid #333' }}>
                    <p style={{ fontSize: '14px', color: '#999', margin: '5px 0' }}>
                      This ticket was generated by MF-Intel CMS v2.3.0
                    </p>
                    <p style={{ fontSize: '14px', color: '#999', margin: '5px 0' }}>
                      Ticket #{index + 1} of {filteredPlayers.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Printer className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Print Player Tickets</h2>
              <p className="text-sm text-slate-600 mt-1">Generate membership tickets for players</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Print Mode
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setMode('all');
                  setSelectedPlayer(null);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  mode === 'all'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">All Players</div>
                <div className="text-xs text-slate-600 mt-1">Print for date range</div>
              </button>
              <button
                onClick={() => setMode('single')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  mode === 'single'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Single Player</div>
                <div className="text-xs text-slate-600 mt-1">Print for one player</div>
              </button>
            </div>
          </div>

          {/* Single Player Selection */}
          {mode === 'single' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Player *
              </label>
              <select
                value={selectedPlayer?.id || ''}
                onChange={(e) => {
                  const player = players.find(p => p.id === e.target.value);
                  setSelectedPlayer(player || null);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a player...</option>
                {players.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} - {player.memberId}
                  </option>
                ))}
              </select>
              {selectedPlayer && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{selectedPlayer.name}</p>
                      <p className="text-sm text-slate-600">ID: {selectedPlayer.memberId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-600">Joined</p>
                      <p className="text-sm font-medium text-slate-900">
                        {new Date(selectedPlayer.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Date Range (for All Players mode) */}
          {mode === 'all' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  From Date (Join Date)
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  To Date (Join Date)
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Preview Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Tickets to Print</p>
                <p className="text-2xl font-bold text-blue-600">{filteredPlayers.length}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-600">Print Date</p>
                <p className="text-sm font-semibold text-slate-900">{printDate}</p>
              </div>
            </div>
            {mode === 'all' && filteredPlayers.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-300">
                <p className="text-xs text-slate-600">
                  Players who joined between {dateFrom ? new Date(dateFrom).toLocaleDateString() : 'any date'} and {dateTo ? new Date(dateTo).toLocaleDateString() : 'any date'}
                </p>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Ticket Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Each ticket includes Player ID, Name, Date Earned (Join Date), and Print Date</li>
              <li>• Tickets are formatted for standard letter-size paper (8.5" x 11")</li>
              <li>• One player per page for easy cutting and distribution</li>
              <li>• Perfect for membership cards or player records</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            disabled={mode === 'single' && !selectedPlayer}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="w-4 h-4" />
            Print {filteredPlayers.length} Ticket{filteredPlayers.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}