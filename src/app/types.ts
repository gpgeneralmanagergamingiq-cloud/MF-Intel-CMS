// Shared types for MF-Intel CMS v2.3.2

export interface ChipDenomination {
  [key: string]: number;
}

export interface Player {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  dateOfBirth?: string;
  joinDate: string;
  rating?: string;
  notes?: string;
  preferredGame?: string;
  averageBet?: number;
  totalTheo?: number;
  visitCount?: number;
  lastVisit?: string;
  status?: string;
  profilePicture?: string;
  nationality?: string;
  occupation?: string;
  isBlacklisted?: boolean;
  blacklistReason?: string;
  blacklistDate?: string;
  blacklistedBy?: string;
  bannedUntil?: string;
}

export interface ActiveRating {
  id: string;
  playerId: string;
  playerName: string;
  tableName: string;
  gameType?: string;
  seatNumber?: number;
  averageBet: number;
  startTime: string;
  pitBoss?: string;
  inspector?: string;
  status?: "Active" | "OnBreak" | "Completed";
  isRefused?: boolean;
  refusedReason?: string;
  hoursPlayed?: number;
  buyInAmount?: number;
  buyInTime?: string;
  sessionNotes?: string;
  lastUpdated?: string;
}

export interface CompletedRating {
  id: string;
  playerId: string;
  playerName: string;
  tableName: string;
  gameType?: string;
  seatNumber?: number;
  averageBet: number;
  startTime: string;
  endTime: string;
  hoursPlayed: number;
  totalTheo: number;
  buyInAmount?: number;
  cashOutAmount?: number;
  winLoss?: number;
  pitBoss?: string;
  inspector?: string;
  sessionNotes?: string;
  isRefused?: boolean;
  refusedReason?: string;
}

export interface OpenTable {
  tableName: string;
  gameType: string;
  dealerName: string;
  floatAmount: number;
  openTime: string;
  activeRatings: number;
}

export interface Float {
  id: string;
  tableName: string;
  dealerName: string;
  amount: number;
  currency?: string;
  gameType?: string;
  timestamp: string;
  status: string;
  type: "Open" | "Close" | "Fill" | "Credit";
  chips: ChipDenomination;
  notes: string;
  cashAmount?: number;
  winLoss?: number;
  dropAmount?: number;
  pitBoss?: string;
  inspectorName?: string;
}

export interface DropEntry {
  id: string;
  tableName: string;
  amount: number;
  currency: string;
  chips: ChipDenomination;
  timestamp: string;
  type: string;
  playerName: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  userType: "Management" | "Owner" | "Pit Boss" | "Inspector" | "Host" | "Cashier" | "Waiter";
  status: "Active" | "Inactive";
  createdDate: string;
  mustChangePassword?: boolean;
  needsPasswordChange?: boolean;
  email?: string;
  phone?: string;
  profilePicture?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  status: "Active" | "Inactive" | "On Leave";
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
  profilePicture?: string;
  dateOfBirth?: string;
}