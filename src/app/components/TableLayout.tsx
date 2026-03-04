import { useState } from "react";
import { User, X, Plus } from "lucide-react";

export interface Seat {
  seatNumber: number;
  playerId: string | null;
  playerName: string | null;
}

interface TableLayoutProps {
  gameType: string;
  seats: Seat[];
  onSeatClick: (seatNumber: number) => void;
  availablePlayers: Array<{ id: string; name: string }>;
  onPlayerSelect: (seatNumber: number, playerId: string, playerName: string) => void;
  onRemovePlayer: (seatNumber: number) => void;
}

export function TableLayout({
  gameType,
  seats,
  onSeatClick,
  availablePlayers,
  onPlayerSelect,
  onRemovePlayer,
}: TableLayoutProps) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  // Determine number of seats based on game type
  const seatCount =
    gameType === "Texas Hold'em" || gameType === "Roulette" ? 10 : 6;

  // Get table color based on game type
  const getTableColor = () => {
    switch (gameType) {
      case "Texas Hold'em":
        return "bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-700";
      case "Roulette":
        return "bg-gradient-to-br from-red-800 via-red-700 to-red-900";
      case "Blackjack":
        return "bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800";
      case "Baccarat":
        return "bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800";
      default:
        return "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700";
    }
  };

  // Calculate seat positions around the table
  const getSeatPosition = (seatNumber: number) => {
    if (seatCount === 10) {
      // 10 seats - semicircle layout (Texas Hold'em, Roulette)
      const positions = [
        { top: "65%", left: "3%", transform: "translate(-50%, -50%)" }, // Seat 1 - Left side
        { top: "50%", left: "7%", transform: "translate(-50%, -50%)" }, // Seat 2
        { top: "30%", left: "15%", transform: "translate(-50%, -50%)" }, // Seat 3
        { top: "15%", left: "25%", transform: "translate(-50%, -50%)" }, // Seat 4
        { top: "8%", left: "40%", transform: "translate(-50%, -50%)" }, // Seat 5
        { top: "8%", left: "60%", transform: "translate(-50%, -50%)" }, // Seat 6
        { top: "15%", left: "75%", transform: "translate(-50%, -50%)" }, // Seat 7
        { top: "30%", left: "85%", transform: "translate(-50%, -50%)" }, // Seat 8
        { top: "50%", left: "93%", transform: "translate(-50%, -50%)" }, // Seat 9
        { top: "65%", left: "97%", transform: "translate(-50%, -50%)" }, // Seat 10 - Right side
      ];
      return positions[seatNumber - 1];
    } else {
      // 6 seats - smaller semicircle layout (other games)
      const positions = [
        { top: "60%", left: "8%", transform: "translate(-50%, -50%)" }, // Seat 1
        { top: "30%", left: "18%", transform: "translate(-50%, -50%)" }, // Seat 2
        { top: "10%", left: "35%", transform: "translate(-50%, -50%)" }, // Seat 3
        { top: "10%", left: "65%", transform: "translate(-50%, -50%)" }, // Seat 4
        { top: "30%", left: "82%", transform: "translate(-50%, -50%)" }, // Seat 5
        { top: "60%", left: "92%", transform: "translate(-50%, -50%)" }, // Seat 6
      ];
      return positions[seatNumber - 1];
    }
  };

  const handleSeatClick = (seatNumber: number) => {
    setSelectedSeat(seatNumber);
    onSeatClick(seatNumber);
  };

  const handlePlayerSelect = (playerId: string) => {
    if (selectedSeat !== null) {
      const player = availablePlayers.find((p) => p.id === playerId);
      if (player) {
        onPlayerSelect(selectedSeat, player.id, player.name);
        setSelectedSeat(null);
      }
    }
  };

  const handleRemovePlayer = (seatNumber: number) => {
    onRemovePlayer(seatNumber);
    setSelectedSeat(null);
  };

  return (
    <div className="space-y-4">
      {/* Table Layout */}
      <div className="relative w-full aspect-[2/1] bg-slate-800 rounded-2xl shadow-2xl border-8 border-slate-900 overflow-hidden">
        {/* Dealer Position Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-amber-500 text-slate-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-amber-600">
            DEALER
          </div>
        </div>

        {/* Table Surface */}
        <div
          className={`absolute inset-8 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] ${getTableColor()} shadow-inner border-4 border-slate-800`}
        >
          {/* Table Center Label */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-center">
              <div className="text-white text-2xl font-bold opacity-30 tracking-wider">
                {gameType.toUpperCase()}
              </div>
              {gameType === "Texas Hold'em" && (
                <div className="flex gap-2 justify-center mt-2 opacity-30">
                  <div className="w-8 h-12 bg-white rounded shadow-md"></div>
                  <div className="w-8 h-12 bg-white rounded shadow-md"></div>
                  <div className="w-8 h-12 bg-white rounded shadow-md"></div>
                  <div className="w-8 h-12 bg-white rounded shadow-md"></div>
                  <div className="w-8 h-12 bg-white rounded shadow-md"></div>
                </div>
              )}
              {gameType === "Roulette" && (
                <div className="flex gap-1 mt-2 opacity-30">
                  <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white"></div>
                </div>
              )}
            </div>
          </div>

          {/* Betting Area Markings */}
          {(gameType === "Blackjack" || gameType === "Baccarat") && (
            <div className="absolute inset-4 border-2 border-white/10 rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"></div>
          )}
        </div>

        {/* Seats */}
        {seats.map((seat) => {
          const position = getSeatPosition(seat.seatNumber);
          const isOccupied = seat.playerId !== null;
          const isSelected = selectedSeat === seat.seatNumber;

          return (
            <div
              key={seat.seatNumber}
              className="absolute"
              style={position}
            >
              <button
                onClick={() => handleSeatClick(seat.seatNumber)}
                className={`relative flex flex-col items-center justify-center w-20 h-20 rounded-lg transition-all duration-200 ${
                  isOccupied
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg hover:shadow-xl hover:scale-105"
                    : "bg-slate-700 border-2 border-slate-600 hover:border-emerald-500 hover:shadow-lg hover:scale-105"
                } ${
                  isSelected
                    ? "ring-4 ring-yellow-400 scale-110"
                    : ""
                }`}
                title={
                  isOccupied
                    ? `Seat ${seat.seatNumber}: ${seat.playerName}`
                    : `Seat ${seat.seatNumber}: Empty`
                }
              >
                {/* Seat Number Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-md z-10">
                  {seat.seatNumber}
                </div>

                {isOccupied ? (
                  <>
                    {/* Player Icon */}
                    <User className="w-8 h-8 text-white mb-1" />
                    {/* Player Name */}
                    <div className="text-white text-xs font-semibold text-center px-1 truncate max-w-full">
                      {seat.playerName}
                    </div>
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePlayer(seat.seatNumber);
                      }}
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10"
                      title="Remove player"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Empty Seat Icon */}
                    <Plus className="w-8 h-8 text-slate-400" />
                    <div className="text-slate-400 text-xs font-medium">Empty</div>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Player Selection Panel */}
      {selectedSeat !== null && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Assign Player to Seat {selectedSeat}
            </h4>
            <button
              onClick={() => setSelectedSeat(null)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
            {availablePlayers.length === 0 ? (
              <div className="col-span-full text-center text-slate-500 py-4">
                No available players
              </div>
            ) : (
              availablePlayers.map((player) => {
                // Check if player is already seated
                const isAlreadySeated = seats.some(
                  (s) => s.playerId === player.id && s.seatNumber !== selectedSeat
                );

                return (
                  <button
                    key={player.id}
                    onClick={() => handlePlayerSelect(player.id)}
                    disabled={isAlreadySeated}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isAlreadySeated
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-white text-slate-900 hover:bg-blue-500 hover:text-white border-2 border-blue-200 hover:border-blue-500"
                    }`}
                  >
                    {player.name}
                    {isAlreadySeated && (
                      <span className="block text-xs">(Seated)</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Seat Occupancy Summary */}
      <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-100 rounded-lg p-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-blue-600"></div>
            <span>Occupied: {seats.filter((s) => s.playerId).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-700 border-2 border-slate-600"></div>
            <span>Empty: {seats.filter((s) => !s.playerId).length}</span>
          </div>
        </div>
        <div className="font-semibold">
          Total Seats: {seatCount}
        </div>
      </div>
    </div>
  );
}
