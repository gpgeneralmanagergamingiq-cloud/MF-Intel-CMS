import { projectId, publicAnonKey } from '/utils/supabase/info';

// ============================================
// DEPLOYMENT MODE CONFIGURATION
// ============================================
// Set to false for production (Supabase)
// Set to true for local development (localStorage)
const USE_LOCAL_STORAGE = false; // PRODUCTION MODE - Using Supabase backend
// ============================================

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-68939c29`;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper function to encode property names for URL safety
function encodeProperty(property: string): string {
  return encodeURIComponent(property);
}

// Helper function to make API calls
async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  // Properly encode the full URL to handle spaces and special characters
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log(`API call: ${method} ${fullUrl}`);
  
  const response = await fetch(fullUrl, options);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const result: ApiResponse<T> = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'API call failed');
  }

  return result.data as T;
}

// ============================================
// USER API
// ============================================

export async function initializeProperty(property: string): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    // Initialize default user for the property
    const usersKey = `${property}_users`;
    const existingUsers = localStorage.getItem(usersKey);
    if (!existingUsers) {
      const defaultUser = {
        username: "admin",
        password: "admin123",
        userType: "Management",
        needsPasswordChange: false,
        property,
      };
      localStorage.setItem(usersKey, JSON.stringify([defaultUser]));
    }
    return;
  }
  await apiCall(`/initialize/${encodeProperty(property)}`, 'POST');
}

export async function login(username: string, password: string, property: string): Promise<{
  username: string;
  userType: string;
  needsPasswordChange: boolean;
}> {
  if (USE_LOCAL_STORAGE) {
    const usersKey = `${property}_users`;
    const usersData = localStorage.getItem(usersKey);
    const users = usersData ? JSON.parse(usersData) : [];
    
    console.log(`Login attempt for property: ${property}`);
    console.log(`Users in storage:`, users.map((u: any) => ({ username: u.username, userType: u.userType })));
    console.log(`Attempting to match username: ${username}`);
    
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (!user) {
      console.error(`Login failed - User not found or password incorrect`);
      console.log(`Available usernames:`, users.map((u: any) => u.username));
      throw new Error("Invalid credentials");
    }
    
    console.log(`Login successful for user: ${user.username}`);
    return {
      username: user.username,
      userType: user.userType,
      needsPasswordChange: user.needsPasswordChange || false,
    };
  }
  return await apiCall('/login', 'POST', { username, password, property });
}

// Verify user credentials and role
export async function verifyUserCredentials(
  property: string,
  username: string, 
  password: string, 
  requiredRoles?: string[]
): Promise<{ valid: boolean; user?: any; signature?: string }> {
  if (USE_LOCAL_STORAGE) {
    const usersKey = `${property}_users`;
    const usersData = localStorage.getItem(usersKey);
    const users = usersData ? JSON.parse(usersData) : [];
    
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (!user) {
      return { valid: false };
    }
    
    // Check if user has required role
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(user.userType)) {
        return { valid: false };
      }
    }
    
    return { 
      valid: true, 
      user,
      signature: user.signature || user.username // Use signature if set, otherwise username
    };
  }
  return await apiCall('/verify-credentials', 'POST', { username, password, property, requiredRoles });
}

export async function getUsers(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_users`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/users/${encodeProperty(property)}`);
}

export async function createUser(property: string, user: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const users = await getUsers(property);
    users.push(user);
    const key = `${property}_users`;
    localStorage.setItem(key, JSON.stringify(users));
    return user;
  }
  return await apiCall(`/users/${encodeProperty(property)}`, 'POST', user);
}

export async function updateUser(property: string, username: string, data: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const users = await getUsers(property);
    const index = users.findIndex((u: any) => u.username === username);
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
      const key = `${property}_users`;
      localStorage.setItem(key, JSON.stringify(users));
      return users[index];
    }
    return data;
  }
  return await apiCall(`/users/${encodeProperty(property)}/${encodeURIComponent(username)}`, 'PUT', data);
}

export async function deleteUser(property: string, username: string): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    const users = await getUsers(property);
    const filtered = users.filter((u: any) => u.username !== username);
    const key = `${property}_users`;
    localStorage.setItem(key, JSON.stringify(filtered));
    return;
  }
  await apiCall(`/users/${encodeProperty(property)}/${encodeURIComponent(username)}`, 'DELETE');
}

// ============================================
// PLAYER API
// ============================================

export async function getPlayers(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_players`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/players/${property}`);
}

export async function createPlayer(property: string, player: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const players = await getPlayers(property);
    players.push(player);
    const key = `${property}_players`;
    localStorage.setItem(key, JSON.stringify(players));
    return player;
  }
  return await apiCall(`/players/${property}`, 'POST', player);
}

export async function updatePlayer(property: string, id: string, data: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const players = await getPlayers(property);
    const index = players.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      players[index] = { ...players[index], ...data };
      const key = `${property}_players`;
      localStorage.setItem(key, JSON.stringify(players));
      return players[index];
    }
    return data;
  }
  return await apiCall(`/players/${property}/${id}`, 'PUT', data);
}

export async function deletePlayer(property: string, id: string): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    const players = await getPlayers(property);
    const filtered = players.filter((p: any) => p.id !== id);
    const key = `${property}_players`;
    localStorage.setItem(key, JSON.stringify(filtered));
    return;
  }
  await apiCall(`/players/${property}/${id}`, 'DELETE');
}

// ============================================
// RATING API
// ============================================

export async function getRatings(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_ratings`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/ratings/${property}`);
}

export async function createRating(property: string, rating: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const ratings = await getRatings(property);
    ratings.push(rating);
    const key = `${property}_ratings`;
    localStorage.setItem(key, JSON.stringify(ratings));
    return rating;
  }
  return await apiCall(`/ratings/${property}`, 'POST', rating);
}

export async function updateRating(property: string, id: string, data: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const ratings = await getRatings(property);
    const index = ratings.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      ratings[index] = { ...ratings[index], ...data };
      const key = `${property}_ratings`;
      localStorage.setItem(key, JSON.stringify(ratings));
      return ratings[index];
    }
    return data;
  }
  return await apiCall(`/ratings/${property}/${id}`, 'PUT', data);
}

export async function deleteRating(property: string, id: string): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    const ratings = await getRatings(property);
    const filtered = ratings.filter((r: any) => r.id !== id);
    const key = `${property}_ratings`;
    localStorage.setItem(key, JSON.stringify(filtered));
    return;
  }
  await apiCall(`/ratings/${property}/${id}`, 'DELETE');
}

// ============================================
// FLOAT API
// ============================================

export async function getFloats(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_floats`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/floats/${property}`);
}

export async function createFloat(property: string, float: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const floats = await getFloats(property);
    floats.push(float);
    const key = `${property}_floats`;
    localStorage.setItem(key, JSON.stringify(floats));
    return float;
  }
  return await apiCall(`/floats/${property}`, 'POST', float);
}

export async function updateFloat(property: string, id: string, data: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const floats = await getFloats(property);
    const index = floats.findIndex((f: any) => f.id === id);
    if (index !== -1) {
      floats[index] = { ...floats[index], ...data };
      const key = `${property}_floats`;
      localStorage.setItem(key, JSON.stringify(floats));
      return floats[index];
    }
    return data;
  }
  return await apiCall(`/floats/${property}/${id}`, 'PUT', data);
}

// ============================================
// DROP API
// ============================================

export async function getDrops(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_drops`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/drops/${property}`);
}

export async function createDrop(property: string, drop: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const drops = await getDrops(property);
    drops.push(drop);
    const key = `${property}_drops`;
    localStorage.setItem(key, JSON.stringify(drops));
    return drop;
  }
  return await apiCall(`/drops/${property}`, 'POST', drop);
}

export async function updateDrop(property: string, id: string, data: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const drops = await getDrops(property);
    const index = drops.findIndex((d: any) => d.id === id);
    if (index !== -1) {
      drops[index] = { ...drops[index], ...data };
      const key = `${property}_drops`;
      localStorage.setItem(key, JSON.stringify(drops));
      return drops[index];
    }
    return data;
  }
  return await apiCall(`/drops/${property}/${id}`, 'PUT', data);
}

export async function deleteDrop(property: string, id: string): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    const drops = await getDrops(property);
    const filtered = drops.filter((d: any) => d.id !== id);
    const key = `${property}_drops`;
    localStorage.setItem(key, JSON.stringify(filtered));
    return;
  }
  await apiCall(`/drops/${property}/${id}`, 'DELETE');
}

// ============================================
// GAME STATISTICS API
// ============================================

export async function getGameStatistics(property: string): Promise<any[]> {
  return await apiCall(`/game-statistics/${property}`);
}

export async function saveGameStatistics(property: string, gameStats: any[]): Promise<any[]> {
  return await apiCall(`/game-statistics/${property}`, 'POST', gameStats);
}

// ============================================
// EMAIL CONFIG API
// ============================================

export async function getEmailConfig(property: string): Promise<any> {
  return await apiCall(`/email-config/${property}`);
}

export async function saveEmailConfig(property: string, emailConfig: any): Promise<any> {
  return await apiCall(`/email-config/${property}`, 'POST', emailConfig);
}

// ============================================
// PROPERTY MANAGEMENT API
// ============================================

export interface Property {
  id: string;
  name: string;
  displayName?: string; // Human-readable name (e.g., "MF-Intel Gaming IQ")
  isDefault?: boolean;
  createdDate: string;
}

export async function getProperties(): Promise<Property[]> {
  if (USE_LOCAL_STORAGE) {
    const key = 'properties';
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    // Return default property if none exist
    const defaultProperty: Property = {
      id: 'default-1',
      name: 'Default Property',
      isDefault: true,
      createdDate: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify([defaultProperty]));
    return [defaultProperty];
  }
  return await apiCall('/properties');
}

export async function createProperty(property: Property): Promise<Property> {
  if (USE_LOCAL_STORAGE) {
    const properties = await getProperties();
    properties.push(property);
    const key = 'properties';
    localStorage.setItem(key, JSON.stringify(properties));
    return property;
  }
  return await apiCall('/properties', 'POST', property);
}

export async function updateProperty(id: string, data: Partial<Property>): Promise<Property> {
  if (USE_LOCAL_STORAGE) {
    const properties = await getProperties();
    const index = properties.findIndex((p: Property) => p.id === id);
    if (index !== -1) {
      properties[index] = { ...properties[index], ...data };
      const key = 'properties';
      localStorage.setItem(key, JSON.stringify(properties));
      return properties[index];
    }
    return data as Property;
  }
  return await apiCall(`/properties/${id}`, 'PUT', data);
}

export async function deleteProperty(id: string): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    const properties = await getProperties();
    const filtered = properties.filter((p: Property) => p.id !== id);
    const key = 'properties';
    localStorage.setItem(key, JSON.stringify(filtered));
    return;
  }
  await apiCall(`/properties/${id}`, 'DELETE');
}

// Delete property and ALL associated data from backend
export async function deletePropertyCompletely(id: string): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    // In localStorage mode, just delete the property (data is scoped separately)
    const properties = await getProperties();
    const filtered = properties.filter((p: Property) => p.id !== id);
    const key = 'properties';
    localStorage.setItem(key, JSON.stringify(filtered));
    return { success: true, message: 'Property deleted from localStorage' };
  }
  // Call the complete deletion endpoint
  return await apiCall(`/properties/${id}/complete`, 'DELETE');
}

// ============================================
// CAGE API
// ============================================

export async function getMainFloat(property: string): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_main_float`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  return await apiCall(`/cage/main-float/${property}`);
}

export async function saveMainFloat(property: string, mainFloat: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_main_float`;
    localStorage.setItem(key, JSON.stringify(mainFloat));
    return mainFloat;
  }
  return await apiCall(`/cage/main-float/${property}`, 'POST', mainFloat);
}

export async function getCageOperations(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_cage_operations`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/cage/operations/${property}`);
}

export async function createCageOperation(property: string, operation: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const operations = await getCageOperations(property);
    const newOperation = {
      ...operation,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    operations.push(newOperation);
    const key = `${property}_cage_operations`;
    localStorage.setItem(key, JSON.stringify(operations));
    return newOperation;
  }
  return await apiCall(`/cage/operations/${property}`, 'POST', operation);
}

export async function updateCageOperation(property: string, id: string, data: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const operations = await getCageOperations(property);
    const index = operations.findIndex((op: any) => op.id === id);
    if (index !== -1) {
      operations[index] = { ...operations[index], ...data };
      const key = `${property}_cage_operations`;
      localStorage.setItem(key, JSON.stringify(operations));
      return operations[index];
    }
    return null;
  }
  return await apiCall(`/cage/operations/${property}/${id}`, 'PUT', data);
}

export async function getAvailableTables(property: string): Promise<string[]> {
  if (USE_LOCAL_STORAGE) {
    // Get all active floats to determine available tables
    const floats = await getFloats(property);
    const activeFloats = floats.filter((f: any) => f.status === "Active");
    
    // Get unique table names from active floats
    const tableNames = [...new Set(activeFloats.map((f: any) => f.tableName))];
    return tableNames as string[];
  }
  return await apiCall(`/cage/available-tables/${property}`);
}

// ============================================
// BUY-IN TRANSACTIONS API
// ============================================

export async function getBuyInTransactions(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_buyin_transactions`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/cage/buyin-transactions/${property}`);
}

export async function createBuyInTransaction(property: string, transaction: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const transactions = await getBuyInTransactions(property);
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    transactions.unshift(newTransaction);
    const key = `${property}_buyin_transactions`;
    localStorage.setItem(key, JSON.stringify(transactions));
    return newTransaction;
  }
  return await apiCall(`/cage/buyin-transactions/${property}`, 'POST', transaction);
}

// ============================================
// CASH TRANSACTIONS API
// ============================================

export async function getCashTransactions(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_cash_transactions`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/cage/cash-transactions/${property}`);
}

export async function createCashTransaction(property: string, transaction: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const transactions = await getCashTransactions(property);
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    transactions.unshift(newTransaction);
    const key = `${property}_cash_transactions`;
    localStorage.setItem(key, JSON.stringify(transactions));
    return newTransaction;
  }
  return await apiCall(`/cage/cash-transactions/${property}`, 'POST', transaction);
}

// ============================================
// VAULT TRANSFERS API
// ============================================

export async function getVaultTransfers(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_vault_transfers`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/cage/vault-transfers/${property}`);
}

export async function createVaultTransfer(property: string, transfer: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const transfers = await getVaultTransfers(property);
    const newTransfer = {
      ...transfer,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: "Pending", // All vault transfers start as pending
    };
    transfers.unshift(newTransfer);
    const key = `${property}_vault_transfers`;
    localStorage.setItem(key, JSON.stringify(transfers));
    return newTransfer;
  }
  return await apiCall(`/cage/vault-transfers/${property}`, 'POST', transfer);
}

export async function updateVaultTransfer(property: string, id: string, data: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const transfers = await getVaultTransfers(property);
    const index = transfers.findIndex((t: any) => t.id === id);
    if (index !== -1) {
      transfers[index] = { ...transfers[index], ...data };
      const key = `${property}_vault_transfers`;
      localStorage.setItem(key, JSON.stringify(transfers));
      return transfers[index];
    }
    throw new Error(`Vault transfer with ID ${id} not found`);
  }
  return await apiCall(`/cage/vault-transfers/${property}/${id}`, 'PUT', data);
}

export async function getVaultInventory(property: string): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_vault_inventory`;
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    // Return default vault inventory if none exists
    return {
      cash: 0,
      chips: {},
      totalChipValue: 0,
      currency: "FCFA",
    };
  }
  return await apiCall(`/cage/vault-inventory/${property}`);
}

export async function updateVaultInventory(property: string, inventory: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_vault_inventory`;
    localStorage.setItem(key, JSON.stringify(inventory));
    return inventory;
  }
  return await apiCall(`/cage/vault-inventory/${property}`, 'PUT', inventory);
}

// ============================================
// CASHIER FLOAT API
// ============================================

export async function getCashierFloats(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_cashier_floats`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/cage/cashier-floats/${property}`);
}

export async function createCashierFloat(property: string, cashierFloat: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const floats = await getCashierFloats(property);
    const newFloat = {
      ...cashierFloat,
      id: cashierFloat.id || crypto.randomUUID(),
    };
    floats.unshift(newFloat);
    const key = `${property}_cashier_floats`;
    localStorage.setItem(key, JSON.stringify(floats));
    return newFloat;
  }
  return await apiCall(`/cage/cashier-floats/${property}`, 'POST', cashierFloat);
}

export async function updateCashierFloat(property: string, id: string, data: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const floats = await getCashierFloats(property);
    const index = floats.findIndex((f: any) => f.id === id);
    if (index !== -1) {
      floats[index] = { ...floats[index], ...data };
      const key = `${property}_cashier_floats`;
      localStorage.setItem(key, JSON.stringify(floats));
      return floats[index];
    }
    return null;
  }
  return await apiCall(`/cage/cashier-floats/${property}/${id}`, 'PUT', data);
}

// ============================================
// CREDIT LINE API
// ============================================

export async function getCreditLines(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_credit_lines`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/credit-lines/${property}`);
}

export async function createCreditLine(property: string, creditLine: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const creditLines = await getCreditLines(property);
    const newCreditLine = {
      ...creditLine,
      id: creditLine.id || Date.now().toString(),
    };
    creditLines.push(newCreditLine);
    const key = `${property}_credit_lines`;
    localStorage.setItem(key, JSON.stringify(creditLines));
    return newCreditLine;
  }
  return await apiCall(`/credit-lines/${property}`, 'POST', creditLine);
}

export async function updateCreditLine(property: string, id: string, data: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const creditLines = await getCreditLines(property);
    const index = creditLines.findIndex((cl: any) => cl.id === id);
    if (index !== -1) {
      creditLines[index] = { ...creditLines[index], ...data };
      const key = `${property}_credit_lines`;
      localStorage.setItem(key, JSON.stringify(creditLines));
      return creditLines[index];
    }
    return null;
  }
  return await apiCall(`/credit-lines/${property}/${id}`, 'PUT', data);
}

export async function getCreditTransactions(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_credit_transactions`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/credit-transactions/${property}`);
}

export async function createCreditTransaction(property: string, transaction: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const transactions = await getCreditTransactions(property);
    const newTransaction = {
      ...transaction,
      id: transaction.id || Date.now().toString(),
    };
    transactions.push(newTransaction);
    const key = `${property}_credit_transactions`;
    localStorage.setItem(key, JSON.stringify(transactions));
    return newTransaction;
  }
  return await apiCall(`/credit-transactions/${property}`, 'POST', transaction);
}

export async function updateCreditTransaction(property: string, id: string, data: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const transactions = await getCreditTransactions(property);
    const index = transactions.findIndex((t: any) => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...data };
      const key = `${property}_credit_transactions`;
      localStorage.setItem(key, JSON.stringify(transactions));
      return transactions[index];
    }
    return null;
  }
  return await apiCall(`/credit-transactions/${property}/${id}`, 'PUT', data);
}

// Marketing Campaigns
export async function getCampaigns(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_campaigns`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/campaigns/${property}`);
}

export async function createCampaign(property: string, campaign: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const campaigns = await getCampaigns(property);
    const newCampaign = {
      ...campaign,
      id: campaign.id || Date.now().toString(),
    };
    campaigns.push(newCampaign);
    const key = `${property}_campaigns`;
    localStorage.setItem(key, JSON.stringify(campaigns));
    return newCampaign;
  }
  return await apiCall(`/campaigns/${property}`, 'POST', campaign);
}

export async function updateCampaign(property: string, id: string, data: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const campaigns = await getCampaigns(property);
    const index = campaigns.findIndex((c: any) => c.id === id);
    if (index !== -1) {
      campaigns[index] = { ...campaigns[index], ...data };
      const key = `${property}_campaigns`;
      localStorage.setItem(key, JSON.stringify(campaigns));
      return campaigns[index];
    }
    return null;
  }
  return await apiCall(`/campaigns/${property}/${id}`, 'PUT', data);
}

// Jackpots
export async function getJackpots(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_jackpots`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/jackpots/${property}`);
}

export async function createJackpot(property: string, jackpot: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const jackpots = await getJackpots(property);
    const newJackpot = {
      ...jackpot,
      id: jackpot.id || Date.now().toString(),
    };
    jackpots.push(newJackpot);
    const key = `${property}_jackpots`;
    localStorage.setItem(key, JSON.stringify(jackpots));
    return newJackpot;
  }
  return await apiCall(`/jackpots/${property}`, 'POST', jackpot);
}

export async function updateJackpot(property: string, id: string, data: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const jackpots = await getJackpots(property);
    const index = jackpots.findIndex((j: any) => j.id === id);
    if (index !== -1) {
      jackpots[index] = { ...jackpots[index], ...data };
      const key = `${property}_jackpots`;
      localStorage.setItem(key, JSON.stringify(jackpots));
      return jackpots[index];
    }
    return null;
  }
  return await apiCall(`/jackpots/${property}/${id}`, 'PUT', data);
}

export async function deleteJackpot(property: string, id: string): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    const jackpots = await getJackpots(property);
    const filtered = jackpots.filter((j: any) => j.id !== id);
    const key = `${property}_jackpots`;
    localStorage.setItem(key, JSON.stringify(filtered));
    return;
  }
  return await apiCall(`/jackpots/${property}/${id}`, 'DELETE');
}

export async function getJackpotWinners(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_jackpot_winners`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/jackpot-winners/${property}`);
}

export async function createJackpotWinner(property: string, winner: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const winners = await getJackpotWinners(property);
    const newWinner = {
      ...winner,
      id: winner.id || Date.now().toString(),
    };
    winners.unshift(newWinner); // Add to beginning for recent winners
    const key = `${property}_jackpot_winners`;
    localStorage.setItem(key, JSON.stringify(winners));
    return newWinner;
  }
  return await apiCall(`/jackpot-winners/${property}`, 'POST', winner);
}

// ============================================
// TABLE SHIFTS API
// ============================================

export async function getTableShifts(property: string, tableName?: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_table_shifts`;
    const data = localStorage.getItem(key);
    const shifts = data ? JSON.parse(data) : [];
    if (tableName) {
      return shifts.filter((s: any) => s.tableName === tableName && s.status === "Active");
    }
    return shifts;
  }
  const endpoint = tableName ? `/table-shifts/${property}/${tableName}` : `/table-shifts/${property}`;
  return await apiCall(endpoint);
}

export async function createTableShift(property: string, shift: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const shifts = await getTableShifts(property);
    
    // End any existing active shift for same person at same table and role
    const updatedShifts = shifts.map((s: any) => {
      if (s.tableName === shift.tableName && 
          s.userId === shift.userId && 
          s.role === shift.role &&
          s.status === "Active") {
        return {
          ...s,
          status: "Ended",
          endTime: new Date().toISOString(),
          totalDuration: new Date().getTime() - new Date(s.startTime).getTime()
        };
      }
      return s;
    });
    
    const newShift = {
      ...shift,
      id: shift.id || `shift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    updatedShifts.unshift(newShift);
    const key = `${property}_table_shifts`;
    localStorage.setItem(key, JSON.stringify(updatedShifts));
    return newShift;
  }
  return await apiCall(`/table-shifts/${property}`, 'POST', shift);
}

export async function endTableShift(property: string, id: string): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const shifts = await getTableShifts(property);
    const updatedShifts = shifts.map((s: any) => {
      if (s.id === id) {
        return {
          ...s,
          status: "Ended",
          endTime: new Date().toISOString(),
          totalDuration: new Date().getTime() - new Date(s.startTime).getTime()
        };
      }
      return s;
    });
    const key = `${property}_table_shifts`;
    localStorage.setItem(key, JSON.stringify(updatedShifts));
    return updatedShifts.find((s: any) => s.id === id);
  }
  return await apiCall(`/table-shifts/${property}/${id}`, 'PUT');
}

// ============================================
// RECEIPT FIELDS API
// ============================================

export async function getReceiptFields(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_receipt_fields`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/receipt-fields/${property}`, 'GET');
}

export async function createReceiptField(property: string, field: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const fields = await getReceiptFields(property);
    const newField = {
      ...field,
      id: field.id || `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    fields.push(newField);
    const key = `${property}_receipt_fields`;
    localStorage.setItem(key, JSON.stringify(fields));
    return newField;
  }
  return await apiCall(`/receipt-fields/${property}`, 'POST', field);
}

export async function updateReceiptField(property: string, id: string, data: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const fields = await getReceiptFields(property);
    const updatedFields = fields.map((f: any) => f.id === id ? { ...f, ...data } : f);
    const key = `${property}_receipt_fields`;
    localStorage.setItem(key, JSON.stringify(updatedFields));
    return updatedFields.find((f: any) => f.id === id);
  }
  return await apiCall(`/receipt-fields/${property}/${id}`, 'PUT', data);
}

export async function deleteReceiptField(property: string, id: string): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    const fields = await getReceiptFields(property);
    const updatedFields = fields.filter((f: any) => f.id !== id);
    const key = `${property}_receipt_fields`;
    localStorage.setItem(key, JSON.stringify(updatedFields));
    return;
  }
  return await apiCall(`/receipt-fields/${property}/${id}`, 'DELETE');
}

// ============================================
// EMPLOYEES API
// ============================================

export async function getEmployees(property: string): Promise<any[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_employees`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/employees/${property}`);
}

export async function createEmployee(property: string, employee: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const employees = await getEmployees(property);
    const newEmployee = {
      ...employee,
      id: employee.id || `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    employees.push(newEmployee);
    const key = `${property}_employees`;
    localStorage.setItem(key, JSON.stringify(employees));
    return newEmployee;
  }
  return await apiCall(`/employees/${property}`, 'POST', employee);
}

export async function updateEmployee(property: string, id: string, data: any): Promise<any> {
  if (USE_LOCAL_STORAGE) {
    const employees = await getEmployees(property);
    const updatedEmployees = employees.map((e: any) => e.id === id ? { ...e, ...data } : e);
    const key = `${property}_employees`;
    localStorage.setItem(key, JSON.stringify(updatedEmployees));
    return updatedEmployees.find((e: any) => e.id === id);
  }
  return await apiCall(`/employees/${property}/${id}`, 'PUT', data);
}

export async function deleteEmployee(property: string, id: string): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    const employees = await getEmployees(property);
    const updatedEmployees = employees.filter((e: any) => e.id !== id);
    const key = `${property}_employees`;
    localStorage.setItem(key, JSON.stringify(updatedEmployees));
    return;
  }
  return await apiCall(`/employees/${property}/${id}`, 'DELETE');
}

// ============================================
// COMPS API
// ============================================

export interface CompItem {
  id: string;
  property: string;
  playerId: string;
  playerName: string;
  memberId: string;
  type: 'drink' | 'cigarette' | 'food';
  itemName: string;
  quantity: number;
  value: number; // Value in FCFA - calculated as 15% of Theo
  theoAmount?: number; // The Theo amount this comp is based on (if applicable)
  notes?: string;
  location?: string; // Table number or location where comp was given
  givenBy: string; // Username of staff who gave the comp
  timestamp: string;
}

export async function getComps(property: string): Promise<CompItem[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `comps_${property}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/comps/${property}`);
}

export async function getCompsByPlayer(property: string, playerId: string): Promise<CompItem[]> {
  if (USE_LOCAL_STORAGE) {
    const comps = await getComps(property);
    return comps.filter(comp => comp.playerId === playerId);
  }
  return await apiCall(`/comps/${property}/player/${playerId}`);
}

export async function createComp(property: string, comp: CompItem): Promise<CompItem> {
  if (USE_LOCAL_STORAGE) {
    const comps = await getComps(property);
    comps.unshift(comp); // Add to beginning for newest first
    const key = `comps_${property}`;
    localStorage.setItem(key, JSON.stringify(comps));
    return comp;
  }
  return await apiCall(`/comps/${property}`, 'POST', comp);
}

export async function updateComp(property: string, id: string, data: Partial<CompItem>): Promise<CompItem> {
  if (USE_LOCAL_STORAGE) {
    const comps = await getComps(property);
    const index = comps.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Comp not found');
    
    comps[index] = { ...comps[index], ...data };
    const key = `comps_${property}`;
    localStorage.setItem(key, JSON.stringify(comps));
    return comps[index];
  }
  return await apiCall(`/comps/${property}/${id}`, 'PUT', data);
}

export async function deleteComp(property: string, id: string): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    const comps = await getComps(property);
    const updatedComps = comps.filter(c => c.id !== id);
    const key = `comps_${property}`;
    localStorage.setItem(key, JSON.stringify(updatedComps));
    return;
  }
  return await apiCall(`/comps/${property}/${id}`, 'DELETE');
}

// ============================================
// COMPS MENU API
// ============================================

export interface CompsMenuItem {
  id: string;
  property: string;
  type: 'drink' | 'cigarette' | 'food';
  itemName: string;
  price: number; // Price in FCFA
  available: boolean;
}

export async function getCompsMenuItems(property: string): Promise<CompsMenuItem[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `comps_menu_${property}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/comps-menu/${property}`);
}

export async function createCompsMenuItem(property: string, item: CompsMenuItem): Promise<CompsMenuItem> {
  if (USE_LOCAL_STORAGE) {
    const items = await getCompsMenuItems(property);
    items.unshift(item);
    const key = `comps_menu_${property}`;
    localStorage.setItem(key, JSON.stringify(items));
    return item;
  }
  return await apiCall(`/comps-menu/${property}`, 'POST', item);
}

export async function updateCompsMenuItem(property: string, id: string, data: Partial<CompsMenuItem>): Promise<CompsMenuItem> {
  if (USE_LOCAL_STORAGE) {
    const items = await getCompsMenuItems(property);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Menu item not found');
    
    items[index] = { ...items[index], ...data };
    const key = `comps_menu_${property}`;
    localStorage.setItem(key, JSON.stringify(items));
    return items[index];
  }
  return await apiCall(`/comps-menu/${property}/${id}`, 'PUT', data);
}

export async function deleteCompsMenuItem(property: string, id: string): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    const items = await getCompsMenuItems(property);
    const updatedItems = items.filter(i => i.id !== id);
    const key = `comps_menu_${property}`;
    localStorage.setItem(key, JSON.stringify(updatedItems));
    return;
  }
  return await apiCall(`/comps-menu/${property}/${id}`, 'DELETE');
}

// ============================================
// COMPS CASH SALES API
// ============================================

export interface CompsCashSale {
  id: string;
  property: string;
  playerId?: string;
  playerName?: string;
  memberId?: string;
  items: {
    type: 'drink' | 'cigarette' | 'food';
    itemName: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  discount: number; // For VIP overrides
  total: number;
  paymentMethod: 'cash';
  vipOverride?: {
    approvedBy: string;
    reason: string;
    discountPercent: number;
  };
  waiterName: string;
  timestamp: string;
}

export async function getCompsCashSales(property: string): Promise<CompsCashSale[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `comps_cash_sales_${property}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/comps-cash-sales/${property}`);
}

export async function createCompsCashSale(property: string, sale: CompsCashSale): Promise<CompsCashSale> {
  if (USE_LOCAL_STORAGE) {
    const sales = await getCompsCashSales(property);
    sales.unshift(sale);
    const key = `comps_cash_sales_${property}`;
    localStorage.setItem(key, JSON.stringify(sales));
    return sale;
  }
  return await apiCall(`/comps-cash-sales/${property}`, 'POST', sale);
}

// ============================================
// COMPS STAFF PURCHASES API
// ============================================

export interface CompsStaffPurchase {
  id: string;
  property: string;
  employeeId: string;
  employeeName: string;
  employeeCardId: string;
  department: string;
  position: string;
  items: {
    type: 'drink' | 'cigarette' | 'food';
    itemName: string;
    quantity: number;
    originalPrice: number;
    discountedPrice: number;
    total: number;
  }[];
  subtotal: number;
  discountPercent: number; // Always 50% for staff
  discount: number;
  total: number;
  paymentMethod: 'cash';
  processedBy: string;
  timestamp: string;
}

export async function getCompsStaffPurchases(property: string): Promise<CompsStaffPurchase[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `comps_staff_purchases_${property}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/comps-staff-purchases/${property}`);
}

export async function createCompsStaffPurchase(property: string, purchase: CompsStaffPurchase): Promise<CompsStaffPurchase> {
  if (USE_LOCAL_STORAGE) {
    const purchases = await getCompsStaffPurchases(property);
    purchases.unshift(purchase);
    const key = `comps_staff_purchases_${property}`;
    localStorage.setItem(key, JSON.stringify(purchases));
    return purchase;
  }
  return await apiCall(`/comps-staff-purchases/${property}`, 'POST', purchase);
}

// ============================================
// AUDIT LOG API (for tracking edits)
// ============================================

export interface AuditLogEntry {
  id: string;
  property: string;
  recordType: 'rating' | 'float' | 'drop' | 'cage' | 'comp' | 'player' | 'vault' | 'credit' | 'other';
  recordId: string;
  action: 'edit' | 'delete' | 'create';
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  editedBy: string;
  editReason: string;
  timestamp: string;
}

export async function getAuditLogs(property: string): Promise<AuditLogEntry[]> {
  if (USE_LOCAL_STORAGE) {
    const key = `${property}_audit_logs`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  return await apiCall(`/audit-logs/${property}`);
}

export async function getAuditLogsByRecord(property: string, recordType: string, recordId: string): Promise<AuditLogEntry[]> {
  if (USE_LOCAL_STORAGE) {
    const logs = await getAuditLogs(property);
    return logs.filter(log => log.recordType === recordType && log.recordId === recordId);
  }
  return await apiCall(`/audit-logs/${property}/${recordType}/${recordId}`);
}

export async function createAuditLog(property: string, log: AuditLogEntry): Promise<AuditLogEntry> {
  if (USE_LOCAL_STORAGE) {
    const logs = await getAuditLogs(property);
    logs.unshift(log);
    const key = `${property}_audit_logs`;
    localStorage.setItem(key, JSON.stringify(logs));
    return log;
  }
  return await apiCall(`/audit-logs/${property}`, 'POST', log);
}

// Helper function to track edits with audit logging
export async function updateRecordWithAudit(
  property: string,
  recordType: 'rating' | 'float' | 'drop' | 'cage' | 'comp' | 'player' | 'vault' | 'credit',
  recordId: string,
  oldData: any,
  newData: any,
  editedBy: string,
  editReason: string
): Promise<any> {
  // Calculate changes
  const changes: { field: string; oldValue: any; newValue: any }[] = [];
  
  for (const field in newData) {
    if (oldData[field] !== newData[field]) {
      changes.push({
        field,
        oldValue: oldData[field],
        newValue: newData[field]
      });
    }
  }
  
  // Create audit log entry
  const auditLog: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    property,
    recordType,
    recordId,
    action: 'edit',
    changes,
    editedBy,
    editReason,
    timestamp: new Date().toISOString()
  };
  
  // Save audit log
  await createAuditLog(property, auditLog);
  
  // Update the actual record with edit metadata
  const updatedData = {
    ...newData,
    lastEditedBy: editedBy,
    lastEditedAt: new Date().toISOString(),
    isEdited: true,
    editHistory: [...(oldData.editHistory || []), auditLog.id]
  };
  
  // Update based on record type
  switch (recordType) {
    case 'rating':
      return await updateRating(property, recordId, updatedData);
    case 'float':
      return await updateFloat(property, recordId, updatedData);
    case 'drop':
      return await updateDrop(property, recordId, updatedData);
    case 'cage':
      return await updateCageOperation(property, recordId, updatedData);
    case 'comp':
      return await updateComp(property, recordId, updatedData);
    case 'player':
      return await updatePlayer(property, recordId, updatedData);
    case 'vault':
      return await updateVaultTransfer(property, recordId, updatedData);
    case 'credit':
      return await updateCreditTransaction(property, recordId, updatedData);
    default:
      throw new Error(`Unknown record type: ${recordType}`);
  }
}