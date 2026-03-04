import { useState, useEffect } from "react";
import { Zap, Trophy, Sparkles, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface JackpotLevel {
  name: string;
  color: string;
  currentAmount: number;
}

interface Jackpot {
  id: string;
  name: string;
  type: string;
  status: string;
  levels: JackpotLevel[];
}

interface WinnerCelebration {
  playerName: string;
  jackpotName: string;
  level: string;
  amount: number;
  color: string;
}

export function JackpotDisplay() {
  const [jackpots, setJackpots] = useState<Jackpot[]>([]);
  const [currentWinner, setCurrentWinner] = useState<WinnerCelebration | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Load jackpots from localStorage (or API)
    loadJackpots();
    
    // Update every 2 seconds to show incremental changes
    const interval = setInterval(() => {
      loadJackpots();
      incrementProgressiveJackpots();
    }, 2000);

    // Listen for winner announcements
    window.addEventListener("jackpot-winner", handleWinner as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener("jackpot-winner", handleWinner as EventListener);
    };
  }, []);

  const loadJackpots = () => {
    try {
      const stored = localStorage.getItem("casino_jackpots");
      if (stored) {
        const allJackpots = JSON.parse(stored);
        // Only show active jackpots
        const active = allJackpots.filter((j: Jackpot) => j.status === "active");
        setJackpots(active);
      }
    } catch (error) {
      console.error("Error loading jackpots:", error);
    }
  };

  const incrementProgressiveJackpots = () => {
    // Simulate small increments for progressive jackpots
    setJackpots(prev => prev.map(jackpot => {
      if (jackpot.type === "progressive-theo" || jackpot.type === "progressive-fixed") {
        return {
          ...jackpot,
          levels: jackpot.levels.map(level => ({
            ...level,
            currentAmount: level.currentAmount + Math.random() * 100 + 10 // Random increment
          }))
        };
      }
      return jackpot;
    }));
  };

  const handleWinner = (event: CustomEvent) => {
    const { playerName, jackpotName, level, amount, color } = event.detail;
    setCurrentWinner({ playerName, jackpotName, level, amount, color });
    setShowCelebration(true);

    // Play celebration sound
    playCelebrationSound();

    // Hide celebration after 10 seconds
    setTimeout(() => {
      setShowCelebration(false);
      setTimeout(() => setCurrentWinner(null), 1000);
    }, 10000);
  };

  const playCelebrationSound = () => {
    // In production, you would load and play an actual audio file
    // For now, we'll use the Web Audio API to create a simple celebratory tone
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${Math.floor(amount).toLocaleString()}`;
  };

  const getLevelIcon = (levelName: string) => {
    const name = levelName.toLowerCase();
    if (name.includes("platinum") || name.includes("grand")) {
      return <Sparkles className="w-12 h-12" />;
    } else if (name.includes("gold") || name.includes("major")) {
      return <Trophy className="w-12 h-12" />;
    } else if (name.includes("silver") || name.includes("minor")) {
      return <TrendingUp className="w-12 h-12" />;
    }
    return <Zap className="w-12 h-12" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20
            }}
            animate={{
              y: window.innerHeight + 20,
              x: Math.random() * window.innerWidth
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Winner Celebration */}
      <AnimatePresence>
        {showCelebration && currentWinner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="text-center">
              {/* Confetti Effect */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(100)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"][i % 5],
                      left: `${Math.random() * 100}%`,
                      top: "-10%"
                    }}
                    animate={{
                      y: ["0vh", "110vh"],
                      x: [0, (Math.random() - 0.5) * 200],
                      rotate: [0, Math.random() * 720]
                    }}
                    transition={{
                      duration: Math.random() * 2 + 2,
                      delay: Math.random() * 0.5,
                      repeat: Infinity
                    }}
                  />
                ))}
              </div>

              {/* Winner Announcement */}
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative z-10"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="mb-8"
                >
                  <Trophy className="w-32 h-32 mx-auto text-yellow-400 drop-shadow-2xl" />
                </motion.div>

                <motion.h1
                  className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 mb-4"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: "200% 200%"
                  }}
                >
                  JACKPOT!
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white space-y-4"
                >
                  <p className="text-5xl font-bold">{currentWinner.playerName}</p>
                  <p className="text-3xl text-yellow-400">{currentWinner.jackpotName} - {currentWinner.level}</p>
                  <motion.p
                    className="text-7xl font-black text-yellow-400 drop-shadow-2xl"
                    animate={{
                      scale: [1, 1.05, 1],
                      textShadow: [
                        "0 0 20px rgba(255, 215, 0, 0.5)",
                        "0 0 40px rgba(255, 215, 0, 0.8)",
                        "0 0 20px rgba(255, 215, 0, 0.5)"
                      ]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity
                    }}
                  >
                    FCFA {formatCurrency(currentWinner.amount)}
                  </motion.p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Jackpots Display */}
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 mb-2 drop-shadow-lg">
              🎰 LIVE JACKPOTS 🎰
            </h1>
          </motion.div>
          <p className="text-2xl text-yellow-300 font-semibold">Your chance to WIN BIG!</p>
        </div>

        {/* Jackpots Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {jackpots.map((jackpot) => (
            <motion.div
              key={jackpot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-yellow-500/30"
            >
              {/* Jackpot Name */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-yellow-400 mb-2">{jackpot.name}</h2>
                <p className="text-lg text-slate-300">
                  {jackpot.type === "progressive-theo" && "Progressive - Theo Based"}
                  {jackpot.type === "progressive-fixed" && "Progressive - Fixed Bet"}
                  {jackpot.type === "fixed" && "Fixed Amount"}
                  {jackpot.type === "random" && "Random Jackpot"}
                </p>
              </div>

              {/* Levels */}
              <div className="space-y-4">
                {jackpot.levels.map((level, index) => (
                  <motion.div
                    key={level.name}
                    className="relative overflow-hidden rounded-2xl p-6"
                    style={{
                      background: `linear-gradient(135deg, ${level.color}20 0%, ${level.color}10 100%)`,
                      borderLeft: `4px solid ${level.color}`
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Animated Background */}
                    <motion.div
                      className="absolute inset-0 opacity-10"
                      style={{ backgroundColor: level.color }}
                      animate={{
                        x: ["-100%", "100%"]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: level.color + "30", color: level.color }}
                        >
                          {getLevelIcon(level.name)}
                        </div>
                        <div>
                          <p className="text-xl font-bold text-white">{level.name}</p>
                          <p className="text-sm text-slate-400">Level {index + 1}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">FCFA</p>
                        <motion.p
                          key={level.currentAmount}
                          className="text-4xl font-black"
                          style={{ color: level.color }}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {formatCurrency(level.currentAmount)}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Message */}
        {jackpots.length === 0 && (
          <div className="text-center mt-12">
            <Zap className="w-24 h-24 mx-auto text-yellow-500/50 mb-4" />
            <p className="text-2xl text-slate-400">No active jackpots at the moment</p>
          </div>
        )}

        {jackpots.length > 0 && (
          <motion.div
            className="text-center mt-12"
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <p className="text-2xl text-yellow-400 font-semibold">
              ✨ Play now for your chance to WIN! ✨
            </p>
          </motion.div>
        )}
      </div>

      {/* Ticker with last winners (optional) */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white py-4 overflow-hidden">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{
            x: [0, -1000]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">Recent Winner</span>
              <span>•</span>
              <span>Check the lobby for details!</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
