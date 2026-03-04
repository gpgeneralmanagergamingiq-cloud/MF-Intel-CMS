import { useMemo } from "react";
import * as api from "../utils/api";

// Hardcoded property - Grand Palace Casino
const PROPERTY_INTERNAL = "grand_palace";

/**
 * Hook that provides API methods scoped to Grand Palace Casino
 * v2.3.2 - Single property only
 */
export function useApi() {
  return useMemo(() => ({
    // Users
    getUsers: () => api.getUsers(PROPERTY_INTERNAL),
    createUser: (user: any) => api.createUser(PROPERTY_INTERNAL, user),
    updateUser: (username: string, data: any) => api.updateUser(PROPERTY_INTERNAL, username, data),
    deleteUser: (username: string) => api.deleteUser(PROPERTY_INTERNAL, username),
    verifyUserCredentials: (username: string, password: string, requiredRoles?: string[]) => 
      api.verifyUserCredentials(PROPERTY_INTERNAL, username, password, requiredRoles),
    
    // Players
    getPlayers: (property?: string) => api.getPlayers(property || PROPERTY_INTERNAL),
    createPlayer: (player: any) => api.createPlayer(PROPERTY_INTERNAL, player),
    updatePlayer: (id: string, data: any) => api.updatePlayer(PROPERTY_INTERNAL, id, data),
    deletePlayer: (id: string) => api.deletePlayer(PROPERTY_INTERNAL, id),
    
    // Ratings
    getRatings: (property?: string) => api.getRatings(property || PROPERTY_INTERNAL),
    createRating: (rating: any) => api.createRating(PROPERTY_INTERNAL, rating),
    updateRating: (id: string, data: any) => api.updateRating(PROPERTY_INTERNAL, id, data),
    deleteRating: (id: string) => api.deleteRating(PROPERTY_INTERNAL, id),
    
    // Floats
    getFloats: (property?: string) => api.getFloats(property || PROPERTY_INTERNAL),
    createFloat: (float: any) => api.createFloat(PROPERTY_INTERNAL, float),
    updateFloat: (id: string, data: any) => api.updateFloat(PROPERTY_INTERNAL, id, data),
    
    // Drops
    getDrops: (property?: string) => api.getDrops(property || PROPERTY_INTERNAL),
    createDrop: (drop: any) => api.createDrop(PROPERTY_INTERNAL, drop),
    updateDrop: (id: string, data: any) => api.updateDrop(PROPERTY_INTERNAL, id, data),
    deleteDrop: (id: string) => api.deleteDrop(PROPERTY_INTERNAL, id),
    
    // Game Statistics
    getGameStatistics: () => api.getGameStatistics(PROPERTY_INTERNAL),
    saveGameStatistics: (gameStats: any[]) => api.saveGameStatistics(PROPERTY_INTERNAL, gameStats),
    
    // Email Config
    getEmailConfig: () => api.getEmailConfig(PROPERTY_INTERNAL),
    saveEmailConfig: (emailConfig: any) => api.saveEmailConfig(PROPERTY_INTERNAL, emailConfig),
    
    // Cage
    getMainFloat: () => api.getMainFloat(PROPERTY_INTERNAL),
    saveMainFloat: (mainFloat: any) => api.saveMainFloat(PROPERTY_INTERNAL, mainFloat),
    getCageOperations: () => api.getCageOperations(PROPERTY_INTERNAL),
    createCageOperation: (operation: any) => api.createCageOperation(PROPERTY_INTERNAL, operation),
    updateCageOperation: (id: string, data: any) => api.updateCageOperation(PROPERTY_INTERNAL, id, data),
    getAvailableTables: () => api.getAvailableTables(PROPERTY_INTERNAL),
    getBuyInTransactions: () => api.getBuyInTransactions(PROPERTY_INTERNAL),
    createBuyInTransaction: (transaction: any) => api.createBuyInTransaction(PROPERTY_INTERNAL, transaction),
    getCashTransactions: () => api.getCashTransactions(PROPERTY_INTERNAL),
    createCashTransaction: (transaction: any) => api.createCashTransaction(PROPERTY_INTERNAL, transaction),
    getVaultTransfers: () => api.getVaultTransfers(PROPERTY_INTERNAL),
    createVaultTransfer: (transfer: any) => api.createVaultTransfer(PROPERTY_INTERNAL, transfer),
    updateVaultTransfer: (id: string, data: any) => api.updateVaultTransfer(PROPERTY_INTERNAL, id, data),
    getVaultInventory: () => api.getVaultInventory(PROPERTY_INTERNAL),
    updateVaultInventory: (inventory: any) => api.updateVaultInventory(PROPERTY_INTERNAL, inventory),
    getCashierFloats: () => api.getCashierFloats(PROPERTY_INTERNAL),
    createCashierFloat: (cashierFloat: any) => api.createCashierFloat(PROPERTY_INTERNAL, cashierFloat),
    updateCashierFloat: (id: string, data: any) => api.updateCashierFloat(PROPERTY_INTERNAL, id, data),
    
    // Credit Lines
    getCreditLines: () => api.getCreditLines(PROPERTY_INTERNAL),
    createCreditLine: (creditLine: any) => api.createCreditLine(PROPERTY_INTERNAL, creditLine),
    updateCreditLine: (id: string, data: any) => api.updateCreditLine(PROPERTY_INTERNAL, id, data),
    getCreditTransactions: () => api.getCreditTransactions(PROPERTY_INTERNAL),
    createCreditTransaction: (transaction: any) => api.createCreditTransaction(PROPERTY_INTERNAL, transaction),
    updateCreditTransaction: (id: string, data: any) => api.updateCreditTransaction(PROPERTY_INTERNAL, id, data),
    
    // Marketing Campaigns
    getCampaigns: () => api.getCampaigns(PROPERTY_INTERNAL),
    createCampaign: (campaign: any) => api.createCampaign(PROPERTY_INTERNAL, campaign),
    updateCampaign: (id: string, data: any) => api.updateCampaign(PROPERTY_INTERNAL, id, data),
    
    // Jackpots
    getJackpots: () => api.getJackpots(PROPERTY_INTERNAL),
    createJackpot: (jackpot: any) => api.createJackpot(PROPERTY_INTERNAL, jackpot),
    updateJackpot: (id: string, data: any) => api.updateJackpot(PROPERTY_INTERNAL, id, data),
    deleteJackpot: (id: string) => api.deleteJackpot(PROPERTY_INTERNAL, id),
    getJackpotWinners: () => api.getJackpotWinners(PROPERTY_INTERNAL),
    createJackpotWinner: (winner: any) => api.createJackpotWinner(PROPERTY_INTERNAL, winner),
    
    // Table Shifts
    getTableShifts: (tableName?: string) => api.getTableShifts(PROPERTY_INTERNAL, tableName),
    createTableShift: (shift: any) => api.createTableShift(PROPERTY_INTERNAL, shift),
    endTableShift: (id: string) => api.endTableShift(PROPERTY_INTERNAL, id),
    
    // Receipt Fields
    getReceiptFields: () => api.getReceiptFields(PROPERTY_INTERNAL),
    createReceiptField: (field: any) => api.createReceiptField(PROPERTY_INTERNAL, field),
    updateReceiptField: (id: string, data: any) => api.updateReceiptField(PROPERTY_INTERNAL, id, data),
    deleteReceiptField: (id: string) => api.deleteReceiptField(PROPERTY_INTERNAL, id),
    
    // Employees
    getEmployees: () => api.getEmployees(PROPERTY_INTERNAL),
    createEmployee: (employee: any) => api.createEmployee(PROPERTY_INTERNAL, employee),
    updateEmployee: (id: string, data: any) => api.updateEmployee(PROPERTY_INTERNAL, id, data),
    deleteEmployee: (id: string) => api.deleteEmployee(PROPERTY_INTERNAL, id),
    
    // Comps
    getComps: () => api.getComps(PROPERTY_INTERNAL),
    getCompsByPlayer: (playerId: string) => api.getCompsByPlayer(PROPERTY_INTERNAL, playerId),
    createComp: (comp: any) => api.createComp(PROPERTY_INTERNAL, comp),
    deleteComp: (id: string) => api.deleteComp(PROPERTY_INTERNAL, id),
    
    // Comps Menu
    getCompsMenuItems: () => api.getCompsMenuItems(PROPERTY_INTERNAL),
    createCompsMenuItem: (item: any) => api.createCompsMenuItem(PROPERTY_INTERNAL, item),
    updateCompsMenuItem: (id: string, data: any) => api.updateCompsMenuItem(PROPERTY_INTERNAL, id, data),
    deleteCompsMenuItem: (id: string) => api.deleteCompsMenuItem(PROPERTY_INTERNAL, id),
    
    // Comps Cash Sales
    getCompsCashSales: () => api.getCompsCashSales(PROPERTY_INTERNAL),
    createCompsCashSale: (sale: any) => api.createCompsCashSale(PROPERTY_INTERNAL, sale),
    
    // Comps Staff Purchases
    getCompsStaffPurchases: () => api.getCompsStaffPurchases(PROPERTY_INTERNAL),
    createCompsStaffPurchase: (purchase: any) => api.createCompsStaffPurchase(PROPERTY_INTERNAL, purchase),
    
    // Properties - returns only Grand Palace
    getProperties: () => api.getProperties(),
    
    // Property info for components
    currentProperty: "Grand Palace Casino",
    internalPropertyName: PROPERTY_INTERNAL,
    currentUser: null,
  }), []);
}
