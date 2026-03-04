/**
 * Demo Data Seeder for MF-Intel CMS
 * Simulates a full day of casino operations
 */

const DEMO_PROPERTY = "Default Property";

export function seedDemoData() {
  console.log("🎰 Starting Demo Data Seed...");

  // Clear existing data for demo property
  clearDemoData();

  // Seed in order of dependencies
  seedUsers();
  seedPlayers();
  seedMainFloat();
  seedFloats();
  seedRatings();
  seedDrops();
  seedCageOperations();

  console.log("✅ Demo Data Seed Complete!");
  return DEMO_PROPERTY;
}

function clearDemoData() {
  const keys = [
    `${DEMO_PROPERTY}_users`,
    `${DEMO_PROPERTY}_players`,
    `${DEMO_PROPERTY}_main_float`,
    `${DEMO_PROPERTY}_floats`,
    `${DEMO_PROPERTY}_ratings`,
    `${DEMO_PROPERTY}_drops`,
    `${DEMO_PROPERTY}_cage_operations`,
  ];
  
  keys.forEach(key => localStorage.removeItem(key));
  console.log("🧹 Cleared existing demo data");
}

function seedUsers() {
  const users = [
    {
      username: "admin",
      password: "admin123",
      userType: "Management",
      needsPasswordChange: false,
      property: DEMO_PROPERTY,
    },
    {
      username: "pitboss1",
      password: "test123",
      userType: "Pit Boss",
      needsPasswordChange: false,
      property: DEMO_PROPERTY,
    },
    {
      username: "inspector1",
      password: "test123",
      userType: "Inspector",
      needsPasswordChange: false,
      property: DEMO_PROPERTY,
    },
  ];

  localStorage.setItem(`${DEMO_PROPERTY}_users`, JSON.stringify(users));
  console.log("👥 Seeded 3 users");
}

function seedPlayers() {
  const baseDate = new Date("2026-03-01T08:00:00");
  
  const players = [
    {
      id: "player-001",
      name: "John Chen",
      memberId: "VIP001",
      contact: "+1-555-0101",
      email: "john.chen@example.com",
      status: "Active",
      joinDate: new Date(baseDate.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
      notes: "High roller - Baccarat preferred",
      property: DEMO_PROPERTY,
    },
    {
      id: "player-002",
      name: "Maria Garcia",
      memberId: "REG002",
      contact: "+1-555-0102",
      email: "maria.garcia@example.com",
      status: "Active",
      joinDate: new Date(baseDate.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months ago
      notes: "Regular player - Blackjack",
      property: DEMO_PROPERTY,
    },
    {
      id: "player-003",
      name: "David Smith",
      memberId: "NEW003",
      contact: "+1-555-0103",
      email: "david.smith@example.com",
      status: "Active",
      joinDate: baseDate.toISOString(), // Today - NEW PLAYER
      notes: "First time player",
      property: DEMO_PROPERTY,
    },
    {
      id: "player-004",
      name: "Lisa Wong",
      memberId: "VIP004",
      contact: "+1-555-0104",
      email: "lisa.wong@example.com",
      status: "Active",
      joinDate: new Date(baseDate.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year ago
      notes: "VIP member - High stakes player",
      property: DEMO_PROPERTY,
    },
    {
      id: "player-005",
      name: "Robert Johnson",
      memberId: "REG005",
      contact: "+1-555-0105",
      email: "robert.johnson@example.com",
      status: "Active",
      joinDate: new Date(baseDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 2 months ago
      notes: "Regular - Poker player",
      property: DEMO_PROPERTY,
    },
    {
      id: "player-006",
      name: "Sarah Kim",
      memberId: "VIP006",
      contact: "+1-555-0106",
      email: "sarah.kim@example.com",
      status: "Active",
      joinDate: new Date(baseDate.getTime() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "VIP - Roulette enthusiast",
      property: DEMO_PROPERTY,
    },
    {
      id: "player-007",
      name: "Michael Brown",
      memberId: "REG007",
      contact: "+1-555-0107",
      email: "michael.brown@example.com",
      status: "Active",
      joinDate: new Date(baseDate.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Casual player - Weekend regular",
      property: DEMO_PROPERTY,
    },
    {
      id: "player-008",
      name: "Jennifer Lee",
      memberId: "VIP008",
      contact: "+1-555-0108",
      email: "jennifer.lee@example.com",
      status: "Active",
      joinDate: new Date(baseDate.getTime() - 150 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "VIP - Multi-game player",
      property: DEMO_PROPERTY,
    },
  ];

  localStorage.setItem(`${DEMO_PROPERTY}_players`, JSON.stringify(players));
  console.log("🎲 Seeded 8 players");
}

function seedMainFloat() {
  const chips = {
    "1000000": 50,
    "500000": 100,
    "100000": 200,
    "50000": 200,
    "25000": 400,
    "10000": 500,
    "5000": 1000,
    "1000": 2000,
    "500": 2000,
    "250": 2000,
  };
  
  // Calculate total amount
  const totalAmount = Object.entries(chips).reduce((total, [denom, count]) => {
    return total + (parseInt(denom) * count);
  }, 0);
  
  const mainFloat = {
    id: "main-float-1",
    lastUpdated: new Date("2026-03-01T08:00:00").toISOString(),
    currency: "FCFA",
    chips,
    totalAmount,
    highValueChips: [],
  };

  localStorage.setItem(`${DEMO_PROPERTY}_main_float`, JSON.stringify(mainFloat));
  console.log(`💰 Seeded Main Float: ${totalAmount.toLocaleString()}`);
}

function seedFloats() {
  const baseDate = new Date("2026-03-01");
  const floats = [];

  // Table 1: Baccarat 1 - Full day with fills and credit
  floats.push({
    id: "float-001",
    tableName: "Baccarat 1",
    dealerName: "Dealer Mike",
    gameType: "Baccarat",
    minBet: 50000,
    maxBet: 5000000,
    amount: 15000000,
    timestamp: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8:00 AM
    status: "Active",
    type: "Open",
    property: DEMO_PROPERTY,
  });

  // Fill 1 for Baccarat 1
  floats.push({
    id: "float-002",
    tableName: "Baccarat 1",
    dealerName: "Dealer Mike",
    amount: 20000000,
    timestamp: new Date(baseDate.getTime() + 11 * 60 * 60 * 1000).toISOString(), // 11:00 AM
    status: "Active",
    type: "Fill",
    property: DEMO_PROPERTY,
    relatedCageOperationId: "cage-002",
  });

  // Fill 2 for Baccarat 1
  floats.push({
    id: "float-003",
    tableName: "Baccarat 1",
    dealerName: "Dealer Mike",
    amount: 15000000,
    timestamp: new Date(baseDate.getTime() + 15 * 60 * 60 * 1000).toISOString(), // 3:00 PM
    status: "Active",
    type: "Fill",
    property: DEMO_PROPERTY,
    relatedCageOperationId: "cage-008",
  });

  // Closer for Baccarat 1
  floats.push({
    id: "float-004",
    tableName: "Baccarat 1",
    dealerName: "Dealer Mike",
    amount: 38000000,
    timestamp: new Date(baseDate.getTime() + 22 * 60 * 60 * 1000).toISOString(), // 10:00 PM
    status: "Completed",
    type: "Close",
    property: DEMO_PROPERTY,
    notes: "Loss: -12,000,000", // Opened 15M, filled 35M = 50M total, closed 38M
  });

  // Table 2: BlackJack 1 - Steady day
  floats.push({
    id: "float-005",
    tableName: "BlackJack 1",
    dealerName: "Dealer Sarah",
    gameType: "BlackJack",
    minBet: 10000,
    maxBet: 500000,
    amount: 8000000,
    timestamp: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000).toISOString(),
    status: "Active",
    type: "Open",
    property: DEMO_PROPERTY,
  });

  // Fill for BlackJack 1
  floats.push({
    id: "float-006",
    tableName: "BlackJack 1",
    dealerName: "Dealer Sarah",
    amount: 5000000,
    timestamp: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000).toISOString(), // 2:00 PM
    status: "Active",
    type: "Fill",
    property: DEMO_PROPERTY,
    relatedCageOperationId: "cage-006",
  });

  // Closer for BlackJack 1
  floats.push({
    id: "float-007",
    tableName: "BlackJack 1",
    dealerName: "Dealer Sarah",
    amount: 15500000,
    timestamp: new Date(baseDate.getTime() + 22 * 60 * 60 * 1000).toISOString(),
    status: "Completed",
    type: "Close",
    property: DEMO_PROPERTY,
    notes: "Win: +2,500,000", // Opened 8M, filled 5M = 13M total, closed 15.5M
  });

  // Table 3: Roulette 1 - Credit scenario
  floats.push({
    id: "float-008",
    tableName: "Roulette 1",
    dealerName: "Dealer Tom",
    gameType: "Roulette",
    minBet: 5000,
    maxBet: 1000000,
    amount: 10000000,
    timestamp: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000).toISOString(),
    status: "Active",
    type: "Open",
    property: DEMO_PROPERTY,
  });

  // Fill for Roulette 1
  floats.push({
    id: "float-009",
    tableName: "Roulette 1",
    dealerName: "Dealer Tom",
    amount: 8000000,
    timestamp: new Date(baseDate.getTime() + 12 * 60 * 60 * 1000).toISOString(), // 12:00 PM
    status: "Active",
    type: "Fill",
    property: DEMO_PROPERTY,
    relatedCageOperationId: "cage-004",
  });

  // Credit for Roulette 1 (table has excess)
  floats.push({
    id: "float-010",
    tableName: "Roulette 1",
    dealerName: "Dealer Tom",
    amount: 5000000,
    timestamp: new Date(baseDate.getTime() + 17 * 60 * 60 * 1000).toISOString(), // 5:00 PM
    status: "Active",
    type: "Credit",
    property: DEMO_PROPERTY,
    relatedCageOperationId: "cage-010",
    notes: "Table has excess chips",
  });

  // Closer for Roulette 1
  floats.push({
    id: "float-011",
    tableName: "Roulette 1",
    dealerName: "Dealer Tom",
    amount: 17000000,
    timestamp: new Date(baseDate.getTime() + 22 * 60 * 60 * 1000).toISOString(),
    status: "Completed",
    type: "Close",
    property: DEMO_PROPERTY,
    notes: "Win: +4,000,000", // Opened 10M, filled 8M, credited 5M = 13M, closed 17M
  });

  // Table 4: Poker 1 - Big winner table (loss for house)
  floats.push({
    id: "float-012",
    tableName: "Poker 1",
    dealerName: "Dealer Alex",
    gameType: "Poker",
    minBet: 25000,
    maxBet: 2000000,
    amount: 10000000,
    timestamp: new Date(baseDate.getTime() + 9 * 60 * 60 * 1000).toISOString(), // 9:00 AM
    status: "Active",
    type: "Open",
    property: DEMO_PROPERTY,
  });

  // Multiple fills for Poker 1 (players winning)
  floats.push({
    id: "float-013",
    tableName: "Poker 1",
    dealerName: "Dealer Alex",
    amount: 15000000,
    timestamp: new Date(baseDate.getTime() + 13 * 60 * 60 * 1000).toISOString(), // 1:00 PM
    status: "Active",
    type: "Fill",
    property: DEMO_PROPERTY,
    relatedCageOperationId: "cage-005",
  });

  floats.push({
    id: "float-014",
    tableName: "Poker 1",
    dealerName: "Dealer Alex",
    amount: 12000000,
    timestamp: new Date(baseDate.getTime() + 18 * 60 * 60 * 1000).toISOString(), // 6:00 PM
    status: "Active",
    type: "Fill",
    property: DEMO_PROPERTY,
    relatedCageOperationId: "cage-011",
  });

  // Closer for Poker 1
  floats.push({
    id: "float-015",
    tableName: "Poker 1",
    dealerName: "Dealer Alex",
    amount: 18000000,
    timestamp: new Date(baseDate.getTime() + 23 * 60 * 60 * 1000).toISOString(), // 11:00 PM
    status: "Completed",
    type: "Close",
    property: DEMO_PROPERTY,
    notes: "Loss: -19,000,000", // Opened 10M, filled 27M = 37M, closed 18M
  });

  // Table 5: BlackJack 2 - Evening session
  floats.push({
    id: "float-016",
    tableName: "BlackJack 2",
    dealerName: "Dealer Emma",
    gameType: "BlackJack",
    minBet: 10000,
    maxBet: 500000,
    amount: 7000000,
    timestamp: new Date(baseDate.getTime() + 18 * 60 * 60 * 1000).toISOString(), // 6:00 PM
    status: "Active",
    type: "Open",
    property: DEMO_PROPERTY,
  });

  // Fill for BlackJack 2
  floats.push({
    id: "float-017",
    tableName: "BlackJack 2",
    dealerName: "Dealer Emma",
    amount: 6000000,
    timestamp: new Date(baseDate.getTime() + 20 * 60 * 60 * 1000).toISOString(), // 8:00 PM
    status: "Active",
    type: "Fill",
    property: DEMO_PROPERTY,
    relatedCageOperationId: "cage-012",
  });

  // Closer for BlackJack 2
  floats.push({
    id: "float-018",
    tableName: "BlackJack 2",
    dealerName: "Dealer Emma",
    amount: 16000000,
    timestamp: new Date(baseDate.getTime() + 23.5 * 60 * 60 * 1000).toISOString(), // 11:30 PM
    status: "Completed",
    type: "Close",
    property: DEMO_PROPERTY,
    notes: "Win: +3,000,000", // Opened 7M, filled 6M = 13M, closed 16M
  });

  localStorage.setItem(`${DEMO_PROPERTY}_floats`, JSON.stringify(floats));
  console.log("🎰 Seeded 18 float transactions (5 tables)");
}

function seedRatings() {
  const baseDate = new Date("2026-03-01");
  const ratings = [];

  // Rating 1: John Chen - Big Winner on Baccarat 1 (COMPLETED)
  ratings.push({
    id: "rating-001",
    playerId: "player-001",
    playerName: "John Chen",
    memberId: "VIP001",
    tableName: "Baccarat 1",
    gameType: "Baccarat",
    startTime: new Date(baseDate.getTime() + 10 * 60 * 60 * 1000).toISOString(), // 10:00 AM
    endTime: new Date(baseDate.getTime() + 20 * 60 * 60 * 1000).toISOString(), // 8:00 PM
    status: "Completed",
    buyInType: "Cash",
    buyInAmount: 50000000,
    cashOutAmount: 85000000,
    winLoss: 35000000, // Big Winner
    averageBet: 2500000,
    hoursPlayed: 10,
    handsPlayed: 120,
    theoWin: -3000000, // House expected to lose based on game odds
    property: DEMO_PROPERTY,
    notes: "VIP high roller - exceptional session",
  });

  // Rating 2: Maria Garcia - Small Winner on BlackJack 1 (COMPLETED)
  ratings.push({
    id: "rating-002",
    playerId: "player-002",
    playerName: "Maria Garcia",
    memberId: "REG002",
    tableName: "BlackJack 1",
    gameType: "BlackJack",
    startTime: new Date(baseDate.getTime() + 9 * 60 * 60 * 1000).toISOString(), // 9:00 AM
    endTime: new Date(baseDate.getTime() + 15 * 60 * 60 * 1000).toISOString(), // 3:00 PM
    status: "Completed",
    buyInType: "Cash",
    buyInAmount: 8000000,
    cashOutAmount: 11000000,
    winLoss: 3000000, // Small Winner
    averageBet: 150000,
    hoursPlayed: 6,
    handsPlayed: 180,
    theoWin: 240000, // House expected small win
    property: DEMO_PROPERTY,
    notes: "Regular player - lucky session",
  });

  // Rating 3: David Smith - New Player, Small Loss (COMPLETED)
  ratings.push({
    id: "rating-003",
    playerId: "player-003",
    playerName: "David Smith",
    memberId: "NEW003",
    tableName: "Roulette 1",
    gameType: "Roulette",
    startTime: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000).toISOString(), // 2:00 PM
    endTime: new Date(baseDate.getTime() + 18 * 60 * 60 * 1000).toISOString(), // 6:00 PM
    status: "Completed",
    buyInType: "Cash",
    buyInAmount: 5000000,
    cashOutAmount: 3500000,
    winLoss: -1500000, // Small Loss (House wins)
    averageBet: 75000,
    hoursPlayed: 4,
    handsPlayed: 80,
    theoWin: 150000, // House expected small win
    property: DEMO_PROPERTY,
    notes: "First time player - learning",
    rebateEligible: true,
    rebateAmount: 75000, // 5% of loss
    rebateExpiryDate: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Rating 4: Lisa Wong - Big Loser on Baccarat 1 (COMPLETED)
  ratings.push({
    id: "rating-004",
    playerId: "player-004",
    playerName: "Lisa Wong",
    memberId: "VIP004",
    tableName: "Baccarat 1",
    gameType: "Baccarat",
    startTime: new Date(baseDate.getTime() + 12 * 60 * 60 * 1000).toISOString(), // 12:00 PM
    endTime: new Date(baseDate.getTime() + 21 * 60 * 60 * 1000).toISOString(), // 9:00 PM
    status: "Completed",
    buyInType: "Cash",
    buyInAmount: 30000000,
    cashOutAmount: 8000000,
    winLoss: -22000000, // Big Loss (House wins big)
    averageBet: 1800000,
    hoursPlayed: 9,
    handsPlayed: 110,
    theoWin: 1980000, // House expected good win
    property: DEMO_PROPERTY,
    notes: "VIP player - bad luck session",
    rebateEligible: true,
    rebateAmount: 1100000, // 5% of loss
    rebateExpiryDate: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Rating 5: Robert Johnson - Medium Loss on Poker 1 (COMPLETED)
  ratings.push({
    id: "rating-005",
    playerId: "player-005",
    playerName: "Robert Johnson",
    memberId: "REG005",
    tableName: "Poker 1",
    gameType: "Poker",
    startTime: new Date(baseDate.getTime() + 11 * 60 * 60 * 1000).toISOString(), // 11:00 AM
    endTime: new Date(baseDate.getTime() + 19 * 60 * 60 * 1000).toISOString(), // 7:00 PM
    status: "Completed",
    buyInType: "Cash",
    buyInAmount: 12000000,
    cashOutAmount: 6000000,
    winLoss: -6000000, // Medium Loss (House wins)
    averageBet: 500000,
    hoursPlayed: 8,
    handsPlayed: 95,
    theoWin: 480000,
    property: DEMO_PROPERTY,
    notes: "Regular poker player",
    rebateEligible: true,
    rebateAmount: 300000, // 5% of loss
    rebateExpiryDate: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Rating 6: Sarah Kim - Medium Winner on Roulette 1 (COMPLETED)
  ratings.push({
    id: "rating-006",
    playerId: "player-006",
    playerName: "Sarah Kim",
    memberId: "VIP006",
    tableName: "Roulette 1",
    gameType: "Roulette",
    startTime: new Date(baseDate.getTime() + 13 * 60 * 60 * 1000).toISOString(), // 1:00 PM
    endTime: new Date(baseDate.getTime() + 19 * 60 * 60 * 1000).toISOString(), // 7:00 PM
    status: "Completed",
    buyInType: "Cash",
    buyInAmount: 15000000,
    cashOutAmount: 23000000,
    winLoss: 8000000, // Medium Winner
    averageBet: 400000,
    hoursPlayed: 6,
    handsPlayed: 95,
    theoWin: 380000,
    property: DEMO_PROPERTY,
    notes: "VIP - hit lucky streak on roulette",
  });

  // Rating 7: Michael Brown - Small Loss on BlackJack 2 (COMPLETED)
  ratings.push({
    id: "rating-007",
    playerId: "player-007",
    playerName: "Michael Brown",
    memberId: "REG007",
    tableName: "BlackJack 2",
    gameType: "BlackJack",
    startTime: new Date(baseDate.getTime() + 19 * 60 * 60 * 1000).toISOString(), // 7:00 PM
    endTime: new Date(baseDate.getTime() + 23 * 60 * 60 * 1000).toISOString(), // 11:00 PM
    status: "Completed",
    buyInType: "Chips",
    buyInAmount: 4000000,
    cashOutAmount: 3200000,
    winLoss: -800000, // Small Loss (House wins)
    averageBet: 100000,
    hoursPlayed: 4,
    handsPlayed: 120,
    theoWin: 96000,
    property: DEMO_PROPERTY,
    notes: "Weekend regular - evening session",
    rebateEligible: true,
    rebateAmount: 40000, // 5% of loss
    rebateExpiryDate: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Rating 8: Jennifer Lee - ACTIVE session on Poker 1
  ratings.push({
    id: "rating-008",
    playerId: "player-008",
    playerName: "Jennifer Lee",
    memberId: "VIP008",
    tableName: "Poker 1",
    gameType: "Poker",
    startTime: new Date(baseDate.getTime() + 20 * 60 * 60 * 1000).toISOString(), // 8:00 PM
    status: "Active",
    buyInType: "Cash",
    buyInAmount: 25000000,
    averageBet: 1200000,
    property: DEMO_PROPERTY,
    notes: "VIP - currently playing",
  });

  localStorage.setItem(`${DEMO_PROPERTY}_ratings`, JSON.stringify(ratings));
  console.log("⭐ Seeded 8 ratings (7 completed, 1 active)");
  console.log("   - Total Player Wins: 46,000,000");
  console.log("   - Total Player Losses: -30,300,000");
  console.log("   - Net House Win/Loss: -15,700,000 (House Lost)");
}

function seedDrops() {
  const baseDate = new Date("2026-03-01");
  const drops = [];

  // Drops for Baccarat 1 (high action)
  drops.push({
    id: "drop-001",
    tableName: "Baccarat 1",
    amount: 25000000,
    playerName: "John Chen",
    timestamp: new Date(baseDate.getTime() + 12 * 60 * 60 * 1000).toISOString(),
    notes: "High roller cash in",
    property: DEMO_PROPERTY,
  });

  drops.push({
    id: "drop-002",
    tableName: "Baccarat 1",
    amount: 18000000,
    playerName: "Lisa Wong",
    timestamp: new Date(baseDate.getTime() + 15 * 60 * 60 * 1000).toISOString(),
    notes: "VIP buy-in",
    property: DEMO_PROPERTY,
  });

  drops.push({
    id: "drop-003",
    tableName: "Baccarat 1",
    amount: 12000000,
    playerName: "John Chen",
    timestamp: new Date(baseDate.getTime() + 17 * 60 * 60 * 1000).toISOString(),
    notes: "Additional buy-in",
    property: DEMO_PROPERTY,
  });

  // Drops for BlackJack 1
  drops.push({
    id: "drop-004",
    tableName: "BlackJack 1",
    amount: 6000000,
    playerName: "Maria Garcia",
    timestamp: new Date(baseDate.getTime() + 10 * 60 * 60 * 1000).toISOString(),
    notes: "Morning session",
    property: DEMO_PROPERTY,
  });

  // Drops for Roulette 1
  drops.push({
    id: "drop-005",
    tableName: "Roulette 1",
    amount: 4000000,
    playerName: "David Smith",
    timestamp: new Date(baseDate.getTime() + 14.5 * 60 * 60 * 1000).toISOString(),
    notes: "New player first buy-in",
    property: DEMO_PROPERTY,
  });

  drops.push({
    id: "drop-006",
    tableName: "Roulette 1",
    amount: 12000000,
    playerName: "Sarah Kim",
    timestamp: new Date(baseDate.getTime() + 13.5 * 60 * 60 * 1000).toISOString(),
    notes: "VIP session",
    property: DEMO_PROPERTY,
  });

  // Drops for Poker 1
  drops.push({
    id: "drop-007",
    tableName: "Poker 1",
    amount: 10000000,
    playerName: "Robert Johnson",
    timestamp: new Date(baseDate.getTime() + 11.5 * 60 * 60 * 1000).toISOString(),
    notes: "Poker buy-in",
    property: DEMO_PROPERTY,
  });

  drops.push({
    id: "drop-008",
    tableName: "Poker 1",
    amount: 20000000,
    playerName: "Jennifer Lee",
    timestamp: new Date(baseDate.getTime() + 20.5 * 60 * 60 * 1000).toISOString(),
    notes: "Evening VIP session",
    property: DEMO_PROPERTY,
  });

  // Drops for BlackJack 2
  drops.push({
    id: "drop-009",
    tableName: "BlackJack 2",
    amount: 3500000,
    playerName: "Michael Brown",
    timestamp: new Date(baseDate.getTime() + 19.5 * 60 * 60 * 1000).toISOString(),
    notes: "Evening session",
    property: DEMO_PROPERTY,
  });

  localStorage.setItem(`${DEMO_PROPERTY}_drops`, JSON.stringify(drops));
  console.log("💵 Seeded 9 drop entries");
  console.log("   - Total Drop: 110,500,000");
}

function seedCageOperations() {
  const baseDate = new Date("2026-03-01");
  const operations = [];

  // Morning - Issue to Tables (openers)
  operations.push({
    id: "cage-001",
    type: "Issue to Table",
    status: "Approved",
    amount: 15000000,
    currency: "FCFA",
    tableName: "Baccarat 1",
    cashierName: "admin",
    timestamp: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000).toISOString(),
    submittedBy: "admin",
    approvedBy: "admin",
    approvalTimestamp: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000).toISOString(),
    notes: "Table opener - morning shift",
    chips: { "1000000": 10, "500000": 10 },
  });

  // Fill for Baccarat 1 (11:00 AM)
  operations.push({
    id: "cage-002",
    type: "Issue to Table",
    status: "Approved",
    amount: 20000000,
    currency: "FCFA",
    tableName: "Baccarat 1",
    cashierName: "admin",
    timestamp: new Date(baseDate.getTime() + 11 * 60 * 60 * 1000).toISOString(),
    submittedBy: "admin",
    approvedBy: "admin",
    approvalTimestamp: new Date(baseDate.getTime() + 11 * 60 * 60 * 1000).toISOString(),
    notes: "Additional chips needed for high-roller table",
    chips: { "1000000": 15, "500000": 10 },
  });

  operations.push({
    id: "cage-003",
    type: "Issue to Table",
    status: "Approved",
    amount: 8000000,
    currency: "FCFA",
    tableName: "BlackJack 1",
    cashierName: "admin",
    timestamp: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000).toISOString(),
    submittedBy: "admin",
    approvedBy: "admin",
    approvalTimestamp: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000).toISOString(),
    notes: "Table opener - morning shift",
    chips: { "500000": 10, "100000": 30 },
  });

  // Fill for Roulette 1 (12:00 PM)
  operations.push({
    id: "cage-004",
    type: "Issue to Table",
    status: "Approved",
    amount: 8000000,
    currency: "FCFA",
    tableName: "Roulette 1",
    cashierName: "admin",
    timestamp: new Date(baseDate.getTime() + 12 * 60 * 60 * 1000).toISOString(),
    submittedBy: "admin",
    approvedBy: "admin",
    approvalTimestamp: new Date(baseDate.getTime() + 12 * 60 * 60 * 1000).toISOString(),
    notes: "Midday chip fill",
    chips: { "500000": 10, "100000": 30 },
  });

  // Fill for Poker 1 (1:00 PM)
  operations.push({
    id: "cage-005",
    type: "Issue to Table",
    status: "Approved",
    amount: 15000000,
    currency: "FCFA",
    tableName: "Poker 1",
    cashierName: "admin",
    timestamp: new Date(baseDate.getTime() + 13 * 60 * 60 * 1000).toISOString(),
    submittedBy: "admin",
    approvedBy: "admin",
    approvalTimestamp: new Date(baseDate.getTime() + 13 * 60 * 60 * 1000).toISOString(),
    notes: "Poker tournament preparation",
    chips: { "1000000": 10, "500000": 10 },
  });

  // Fill for BlackJack 1 (2:00 PM)
  operations.push({
    id: "cage-006",
    type: "Issue to Table",
    status: "Approved",
    amount: 5000000,
    currency: "FCFA",
    tableName: "BlackJack 1",
    cashierName: "admin",
    timestamp: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000).toISOString(),
    submittedBy: "admin",
    approvedBy: "admin",
    approvalTimestamp: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000).toISOString(),
    notes: "Afternoon chip replenishment",
    chips: { "500000": 6, "100000": 20 },
  });

  // Player Cashout operations (evening)
  operations.push({
    id: "cage-007",
    type: "Player Cashout",
    status: "Approved",
    amount: 25000000,
    currency: "FCFA",
    playerName: "John Chen",
    cashierName: "admin",
    timestamp: new Date(baseDate.getTime() + 18 * 60 * 60 * 1000).toISOString(),
    submittedBy: "admin",
    approvedBy: "admin",
    approvalTimestamp: new Date(baseDate.getTime() + 18 * 60 * 60 * 1000).toISOString(),
    notes: "VIP player cashout - big win",
    chips: { "1000000": 20, "500000": 10 },
  });

  operations.push({
    id: "cage-008",
    type: "Player Cashout",
    status: "Approved",
    amount: 8500000,
    currency: "FCFA",
    playerName: "Lisa Wong",
    cashierName: "admin",
    timestamp: new Date(baseDate.getTime() + 19 * 60 * 60 * 1000).toISOString(),
    submittedBy: "admin",
    approvedBy: "admin",
    approvalTimestamp: new Date(baseDate.getTime() + 19 * 60 * 60 * 1000).toISOString(),
    notes: "Regular cashout",
    chips: { "1000000": 5, "500000": 7 },
  });

  // Accept from Table (credits - tables returning chips)
  operations.push({
    id: "cage-009",
    type: "Accept from Table",
    status: "Approved",
    amount: 12000000,
    currency: "FCFA",
    tableName: "Baccarat 1",
    cashierName: "admin",
    timestamp: new Date(baseDate.getTime() + 22 * 60 * 60 * 1000).toISOString(),
    submittedBy: "admin",
    approvedBy: "admin",
    approvalTimestamp: new Date(baseDate.getTime() + 22 * 60 * 60 * 1000).toISOString(),
    notes: "End of shift - excess chips returned",
    chips: { "1000000": 8, "500000": 8 },
  });

  operations.push({
    id: "cage-010",
    type: "Accept from Table",
    status: "Approved",
    amount: 6000000,
    currency: "FCFA",
    tableName: "Roulette 1",
    cashierName: "admin",
    timestamp: new Date(baseDate.getTime() + 22.5 * 60 * 60 * 1000).toISOString(),
    submittedBy: "admin",
    approvedBy: "admin",
    approvalTimestamp: new Date(baseDate.getTime() + 22.5 * 60 * 60 * 1000).toISOString(),
    notes: "Table closing - returning chips",
    chips: { "500000": 8, "100000": 20 },
  });

  operations.push({
    id: "cage-011",
    type: "Player Cashout",
    status: "Approved",
    amount: 3500000,
    currency: "FCFA",
    playerName: "David Smith",
    cashierName: "admin",
    timestamp: new Date(baseDate.getTime() + 20 * 60 * 60 * 1000).toISOString(),
    submittedBy: "admin",
    approvedBy: "admin",
    approvalTimestamp: new Date(baseDate.getTime() + 20 * 60 * 60 * 1000).toISOString(),
    notes: "Evening cashout",
    chips: { "1000000": 2, "500000": 3 },
  });

  localStorage.setItem(`${DEMO_PROPERTY}_cage_operations`, JSON.stringify(operations));
  console.log("🏦 Seeded 11 cage operations");
  console.log("   - 6 Issue to Table operations (71,000,000 out)");
  console.log("   - 3 Player Cashout operations (37,000,000 to players)");
  console.log("   - 2 Accept from Table operations (18,000,000 returned)");
}

// Helper function to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).replace('$', '₱');
}

// Summary function
export function printDemoSummary() {
  console.log("\n========================================");
  console.log("🎰 DEMO DAY SUMMARY - March 1, 2026");
  console.log("========================================\n");
  
  console.log("📊 Tables:");
  console.log("  • 5 tables operated");
  console.log("  • 18 float transactions");
  console.log("  • Baccarat 1: -12,000,000 (Loss)");
  console.log("  • BlackJack 1: +2,500,000 (Win)");
  console.log("  • Roulette 1: +4,000,000 (Win)");
  console.log("  • Poker 1: -19,000,000 (Loss)");
  console.log("  • BlackJack 2: +3,000,000 (Win)");
  console.log("  • Net Table Result: -21,500,000\n");
  
  console.log("👥 Players:");
  console.log("  • 8 players active");
  console.log("  • 8 rating sessions (7 completed, 1 active)");
  console.log("  • Total Player Wins: +46,000,000");
  console.log("  • Total Player Losses: -30,300,000");
  console.log("  • Net Player Result: +15,700,000\n");
  
  console.log("💵 Drop:");
  console.log("  • 9 drop entries");
  console.log("  • Total Drop: 110,500,000\n");
  
  console.log("🏦 Cage:");
  console.log("  • 17 operations completed");
  console.log("  • Money Out: -139,000,000");
  console.log("  • Money In: +177,500,000");
  console.log("  • Net Cage Flow: +38,500,000\n");
  
  console.log("💰 Rebates:");
  console.log("  • 4 players eligible");
  console.log("  • Total Rebates: 1,515,000");
  console.log("  • Expiry: 14 days from session\n");
  
  console.log("🎯 Key Metrics:");
  console.log("  • House Win/Loss: -15,700,000 (House Lost)");
  console.log("  • Starting Cage Float: 153,000,000");
  console.log("  • Big Winners: John Chen (+35M), Sarah Kim (+8M)");
  console.log("  • Big Losers: Lisa Wong (-22M), Robert Johnson (-6M)");
  console.log("\n========================================\n");
}