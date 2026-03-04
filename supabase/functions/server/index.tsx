import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// In-memory cache to reduce database hits
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5000; // 5 seconds cache
const READ_TIMEOUT = 15000; // 15 seconds for reads
const WRITE_TIMEOUT = 30000; // 30 seconds for writes (larger datasets need more time)

// Helper function to get from cache or database with retry logic
async function getWithRetry(key: string, maxRetries = 3): Promise<any> {
  // Check cache first
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`Cache HIT for key: ${key}`);
    return cached.data;
  }

  // Retry logic with exponential backoff
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} to fetch key: ${key}`);
      const data = await Promise.race([
        kv.get(key),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Request timeout after ${READ_TIMEOUT / 1000}s`)), READ_TIMEOUT)
        )
      ]);
      
      // Update cache
      cache.set(key, { data, timestamp: Date.now() });
      console.log(`Successfully fetched key: ${key}`);
      return data;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed for key ${key}:`, error.message);
      
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

// Helper function to set with retry logic
async function setWithRetry(key: string, value: any, maxRetries = 3): Promise<void> {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} to set key: ${key}`);
      await Promise.race([
        kv.set(key, value),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Write timeout after ${WRITE_TIMEOUT / 1000}s`)), WRITE_TIMEOUT)
        )
      ]);
      
      // Invalidate cache
      cache.delete(key);
      console.log(`Successfully set key: ${key}`);
      return;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed for key ${key}:`, error.message);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-68939c29/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// USER ENDPOINTS
// ============================================

// Get all users (for a specific property)
app.get("/make-server-68939c29/users/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const users = await getWithRetry(`users_${property}`) || [];
    return c.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Login endpoint
app.post("/make-server-68939c29/login", async (c) => {
  try {
    const { username, password, property } = await c.req.json();
    console.log(`Login attempt for user: ${username}, property: ${property}`);
    
    const users = await getWithRetry(`users_${property}`) || [];
    console.log(`Found ${users.length} users for property: ${property}`);
    
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      console.log(`Login successful for user: ${username}`);
      return c.json({ 
        success: true, 
        data: {
          username: user.username,
          userType: user.userType,
          // CRITICAL: Password changes can ONLY be done from Setup by Management
          // Never force password change on login
          needsPasswordChange: false
        }
      });
    } else {
      console.log(`Login failed for user: ${username} - Invalid credentials`);
      return c.json({ success: false, error: "Invalid credentials" }, 401);
    }
  } catch (error) {
    console.error("Error during login:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create user
app.post("/make-server-68939c29/users/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newUser = await c.req.json();
    const users = await getWithRetry(`users_${property}`) || [];
    
    // Check if username already exists
    if (users.find((u: any) => u.username === newUser.username)) {
      return c.json({ success: false, error: "Username already exists" }, 400);
    }
    
    users.push(newUser);
    await setWithRetry(`users_${property}`, users);
    return c.json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update user
app.put("/make-server-68939c29/users/:property/:username", async (c) => {
  try {
    const property = c.req.param("property");
    const username = c.req.param("username");
    const updatedData = await c.req.json();
    const users = await getWithRetry(`users_${property}`) || [];
    
    const index = users.findIndex((u: any) => u.username === username);
    if (index === -1) {
      return c.json({ success: false, error: "User not found" }, 404);
    }
    
    users[index] = { ...users[index], ...updatedData };
    await setWithRetry(`users_${property}`, users);
    return c.json({ success: true, data: users[index] });
  } catch (error) {
    console.error("Error updating user:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete user
app.delete("/make-server-68939c29/users/:property/:username", async (c) => {
  try {
    const property = c.req.param("property");
    const username = c.req.param("username");
    const users = await getWithRetry(`users_${property}`) || [];
    
    const filteredUsers = users.filter((u: any) => u.username !== username);
    await setWithRetry(`users_${property}`, filteredUsers);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// PLAYER ENDPOINTS
// ============================================

// Get all players
app.get("/make-server-68939c29/players/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const players = await getWithRetry(`players_${property}`) || [];
    return c.json({ success: true, data: players });
  } catch (error) {
    console.error("Error fetching players:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create player
app.post("/make-server-68939c29/players/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newPlayer = await c.req.json();
    const players = await getWithRetry(`players_${property}`) || [];
    
    players.push(newPlayer);
    await setWithRetry(`players_${property}`, players);
    return c.json({ success: true, data: newPlayer });
  } catch (error) {
    console.error("Error creating player:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update player
app.put("/make-server-68939c29/players/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const players = await getWithRetry(`players_${property}`) || [];
    
    const index = players.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Player not found" }, 404);
    }
    
    players[index] = { ...players[index], ...updatedData };
    await setWithRetry(`players_${property}`, players);
    return c.json({ success: true, data: players[index] });
  } catch (error) {
    console.error("Error updating player:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete player
app.delete("/make-server-68939c29/players/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const players = await getWithRetry(`players_${property}`) || [];
    
    const filteredPlayers = players.filter((p: any) => p.id !== id);
    await setWithRetry(`players_${property}`, filteredPlayers);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting player:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// RATING ENDPOINTS
// ============================================

// Get all ratings
app.get("/make-server-68939c29/ratings/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const ratings = await getWithRetry(`ratings_${property}`) || [];
    return c.json({ success: true, data: ratings });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create rating
app.post("/make-server-68939c29/ratings/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newRating = await c.req.json();
    const ratings = await getWithRetry(`ratings_${property}`) || [];
    
    ratings.push(newRating);
    await setWithRetry(`ratings_${property}`, ratings);
    return c.json({ success: true, data: newRating });
  } catch (error) {
    console.error("Error creating rating:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update rating
app.put("/make-server-68939c29/ratings/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const ratings = await getWithRetry(`ratings_${property}`) || [];
    
    const index = ratings.findIndex((r: any) => r.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Rating not found" }, 404);
    }
    
    ratings[index] = { ...ratings[index], ...updatedData };
    await setWithRetry(`ratings_${property}`, ratings);
    return c.json({ success: true, data: ratings[index] });
  } catch (error) {
    console.error("Error updating rating:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete rating
app.delete("/make-server-68939c29/ratings/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const ratings = await getWithRetry(`ratings_${property}`) || [];
    
    const filteredRatings = ratings.filter((r: any) => r.id !== id);
    await setWithRetry(`ratings_${property}`, filteredRatings);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting rating:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// FLOAT ENDPOINTS
// ============================================

// Get all floats
app.get("/make-server-68939c29/floats/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const floats = await getWithRetry(`floats_${property}`) || [];
    return c.json({ success: true, data: floats });
  } catch (error) {
    console.error("Error fetching floats:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create float
app.post("/make-server-68939c29/floats/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newFloat = await c.req.json();
    const floats = await getWithRetry(`floats_${property}`) || [];
    
    floats.push(newFloat);
    await setWithRetry(`floats_${property}`, floats);
    return c.json({ success: true, data: newFloat });
  } catch (error) {
    console.error("Error creating float:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update float
app.put("/make-server-68939c29/floats/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const floats = await getWithRetry(`floats_${property}`) || [];
    
    const index = floats.findIndex((f: any) => f.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Float not found" }, 404);
    }
    
    floats[index] = { ...floats[index], ...updatedData };
    await setWithRetry(`floats_${property}`, floats);
    return c.json({ success: true, data: floats[index] });
  } catch (error) {
    console.error("Error updating float:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// DROP ENDPOINTS
// ============================================

// Get all drops
app.get("/make-server-68939c29/drops/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const drops = await getWithRetry(`drops_${property}`) || [];
    return c.json({ success: true, data: drops });
  } catch (error) {
    console.error("Error fetching drops:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create drop
app.post("/make-server-68939c29/drops/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newDrop = await c.req.json();
    const drops = await getWithRetry(`drops_${property}`) || [];
    
    drops.push(newDrop);
    await setWithRetry(`drops_${property}`, drops);
    return c.json({ success: true, data: newDrop });
  } catch (error) {
    console.error("Error creating drop:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update drop
app.put("/make-server-68939c29/drops/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const drops = await getWithRetry(`drops_${property}`) || [];
    
    const index = drops.findIndex((d: any) => d.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Drop not found" }, 404);
    }
    
    drops[index] = { ...drops[index], ...updatedData };
    await setWithRetry(`drops_${property}`, drops);
    return c.json({ success: true, data: drops[index] });
  } catch (error) {
    console.error("Error updating drop:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete drop
app.delete("/make-server-68939c29/drops/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const drops = await getWithRetry(`drops_${property}`) || [];
    
    const filteredDrops = drops.filter((d: any) => d.id !== id);
    await setWithRetry(`drops_${property}`, filteredDrops);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting drop:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// GAME STATISTICS ENDPOINTS
// ============================================

// Get game statistics
app.get("/make-server-68939c29/game-statistics/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const gameStats = await getWithRetry(`game_statistics_${property}`) || [];
    return c.json({ success: true, data: gameStats });
  } catch (error) {
    console.error("Error fetching game statistics:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Save game statistics
app.post("/make-server-68939c29/game-statistics/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const gameStats = await c.req.json();
    await setWithRetry(`game_statistics_${property}`, gameStats);
    return c.json({ success: true, data: gameStats });
  } catch (error) {
    console.error("Error saving game statistics:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// EMAIL CONFIG ENDPOINTS
// ============================================

// Get email config
app.get("/make-server-68939c29/email-config/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const emailConfig = await getWithRetry(`email_config_${property}`) || null;
    return c.json({ success: true, data: emailConfig });
  } catch (error) {
    console.error("Error fetching email config:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Save email config
app.post("/make-server-68939c29/email-config/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const emailConfig = await c.req.json();
    await setWithRetry(`email_config_${property}`, emailConfig);
    return c.json({ success: true, data: emailConfig });
  } catch (error) {
    console.error("Error saving email config:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// CAGE ENDPOINTS
// ============================================

// Get main float
app.get("/make-server-68939c29/cage/main-float/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const mainFloat = await getWithRetry(`cage_main_float_${property}`) || null;
    return c.json({ success: true, data: mainFloat });
  } catch (error) {
    console.error("Error fetching main float:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Save main float
app.post("/make-server-68939c29/cage/main-float/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const mainFloat = await c.req.json();
    await setWithRetry(`cage_main_float_${property}`, mainFloat);
    return c.json({ success: true, data: mainFloat });
  } catch (error) {
    console.error("Error saving main float:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get cage operations
app.get("/make-server-68939c29/cage/operations/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const operations = await getWithRetry(`cage_operations_${property}`) || [];
    return c.json({ success: true, data: operations });
  } catch (error) {
    console.error("Error fetching cage operations:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create cage operation
app.post("/make-server-68939c29/cage/operations/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newOperation = await c.req.json();
    const operations = await getWithRetry(`cage_operations_${property}`) || [];
    operations.unshift(newOperation); // Add to beginning for newest first
    await setWithRetry(`cage_operations_${property}`, operations);
    return c.json({ success: true, data: newOperation });
  } catch (error) {
    console.error("Error creating cage operation:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update cage operation
app.put("/make-server-68939c29/cage/operations/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const operations = await getWithRetry(`cage_operations_${property}`) || [];
    
    const index = operations.findIndex((op: any) => op.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Operation not found" }, 404);
    }
    
    operations[index] = { ...operations[index], ...updatedData };
    await setWithRetry(`cage_operations_${property}`, operations);
    return c.json({ success: true, data: operations[index] });
  } catch (error) {
    console.error("Error updating cage operation:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// INITIALIZE DEFAULT USERS
// ============================================

// Initialize default users for a property (called on first login attempt)
app.post("/make-server-68939c29/initialize/:property", async (c) => {
  try {
    const property = c.req.param("property");
    
    // Check if users already exist for this property
    const existingUsers = await getWithRetry(`users_${property}`) || [];
    
    // If users exist, check if we need to migrate from old default credentials to new ones
    if (existingUsers && existingUsers.length > 0) {
      // Check if the first user is the old "admin" user that needs to be migrated
      const firstUser = existingUsers[0];
      if (firstUser.username === "admin" && firstUser.password === "admin123") {
        console.log(`Migrating old admin user to Marius for property: ${property}`);
        // Update the first user to use new credentials
        existingUsers[0] = { 
          id: "1", 
          username: "Marius", 
          password: "117572", 
          userType: "Management", 
          status: "Active", 
          createdDate: new Date().toISOString(), 
          mustChangePassword: false 
        };
        await setWithRetry(`users_${property}`, existingUsers);
        console.log(`Migration complete for property: ${property}`);
        return c.json({ success: true, message: "Users migrated to new credentials" });
      }
      return c.json({ success: true, message: "Users already initialized" });
    }
    
    // No existing users - create default users with new credentials
    const defaultUsers = [
      { id: "1", username: "Marius", password: "117572", userType: "Management", status: "Active", createdDate: new Date().toISOString(), mustChangePassword: false },
      { id: "2", username: "owner", password: "owner123", userType: "Owner", status: "Active", createdDate: new Date().toISOString(), mustChangePassword: false },
      { id: "3", username: "pitboss", password: "pit123", userType: "Pit Boss", status: "Active", createdDate: new Date().toISOString(), mustChangePassword: false },
      { id: "4", username: "inspector", password: "inspect123", userType: "Inspector", status: "Active", createdDate: new Date().toISOString(), mustChangePassword: false },
      { id: "5", username: "host", password: "host123", userType: "Host", status: "Active", createdDate: new Date().toISOString(), mustChangePassword: false },
    ];
    
    await setWithRetry(`users_${property}`, defaultUsers);
    console.log(`Default users initialized for property: ${property}`);
    return c.json({ success: true, message: "Default users initialized" });
  } catch (error) {
    console.error("Error initializing users:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// PROPERTIES ENDPOINTS
// ============================================

// ============================================
// TABLE SHIFTS ENDPOINTS
// ============================================

// Get active shifts for a table
app.get("/make-server-68939c29/table-shifts/:property/:tableName", async (c) => {
  try {
    const property = c.req.param("property");
    const tableName = c.req.param("tableName");
    const shifts = await getWithRetry(`table_shifts_${property}`) || [];
    const tableShifts = shifts.filter((shift: any) => 
      shift.tableName === tableName && shift.status === "Active"
    );
    return c.json({ success: true, data: tableShifts });
  } catch (error) {
    console.error("Error fetching table shifts:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get all shifts for a property
app.get("/make-server-68939c29/table-shifts/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const shifts = await getWithRetry(`table_shifts_${property}`) || [];
    return c.json({ success: true, data: shifts });
  } catch (error) {
    console.error("Error fetching all shifts:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Start a shift (dealer or inspector joins table)
app.post("/make-server-68939c29/table-shifts/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newShift = await c.req.json();
    const shifts = await getWithRetry(`table_shifts_${property}`) || [];
    
    // End any existing active shift for same person at same table and role
    const updatedShifts = shifts.map((shift: any) => {
      if (shift.tableName === newShift.tableName && 
          shift.userId === newShift.userId && 
          shift.role === newShift.role &&
          shift.status === "Active") {
        return {
          ...shift,
          status: "Ended",
          endTime: new Date().toISOString(),
          totalDuration: new Date().getTime() - new Date(shift.startTime).getTime()
        };
      }
      return shift;
    });
    
    updatedShifts.unshift(newShift);
    await setWithRetry(`table_shifts_${property}`, updatedShifts);
    return c.json({ success: true, data: newShift });
  } catch (error) {
    console.error("Error creating table shift:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// End a shift
app.put("/make-server-68939c29/table-shifts/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const shifts = await getWithRetry(`table_shifts_${property}`) || [];
    
    const updatedShifts = shifts.map((shift: any) => {
      if (shift.id === id) {
        return {
          ...shift,
          status: "Ended",
          endTime: new Date().toISOString(),
          totalDuration: new Date().getTime() - new Date(shift.startTime).getTime()
        };
      }
      return shift;
    });
    
    await setWithRetry(`table_shifts_${property}`, updatedShifts);
    const updatedShift = updatedShifts.find((s: any) => s.id === id);
    return c.json({ success: true, data: updatedShift });
  } catch (error) {
    console.error("Error ending table shift:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// PROPERTIES ENDPOINTS
// ============================================

// Get all properties
app.get("/make-server-68939c29/properties", async (c) => {
  try {
    let properties = await getWithRetry("properties_list") || [];
    
    console.log("=== PROPERTIES DEBUG ===");
    console.log("Raw properties from DB:", JSON.stringify(properties));
    
    // Initialize with default properties if empty
    if (properties.length === 0) {
      console.log("No properties found, creating default...");
      properties = [
        {
          id: "mf-intel-main",
          name: "MF-Intel-Gaming-IQ",
          displayName: "MF-Intel Gaming IQ",
          currency: "FCFA",
          timezone: "Africa/Douala",
          isDefault: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          settings: {
            printerEnabled: false,
            printerModel: "Epson TM-T20III",
            compsEnabled: true,
            compsTheoPercentage: 15,
            compsStaffDiscount: 50,
            minBuyIn: 10000,
            maxBuyIn: 10000000,
            vipThreshold: 1000000,
          }
        }
      ];
      await setWithRetry("properties_list", properties);
    }
    
    // Auto-migration: Add missing fields to existing properties
    let needsUpdate = false;
    properties = properties.map((prop: any) => {
      console.log(`Checking property: ${prop.name}`);
      
      // Migrate old property names
      if (prop.name === "Default Property" || prop.name === "Property 1") {
        console.log(`MIGRATING: "${prop.name}" -> "MF-Intel Gaming IQ"`);
        needsUpdate = true;
        prop.name = "MF-Intel Gaming IQ";
        prop.displayName = "MF-Intel Gaming IQ";
      }
      
      // Add missing fields for backward compatibility
      if (!prop.displayName) {
        prop.displayName = prop.name;
        needsUpdate = true;
      }
      if (!prop.currency) {
        prop.currency = "FCFA";
        needsUpdate = true;
      }
      if (!prop.timezone) {
        prop.timezone = "Africa/Douala";
        needsUpdate = true;
      }
      if (prop.isActive === undefined) {
        prop.isActive = true;
        needsUpdate = true;
      }
      if (!prop.createdAt) {
        prop.createdAt = prop.createdDate || new Date().toISOString();
        needsUpdate = true;
      }
      if (!prop.settings) {
        prop.settings = {
          printerEnabled: false,
          printerModel: "Epson TM-T20III",
          compsEnabled: true,
          compsTheoPercentage: 15,
          compsStaffDiscount: 50,
          minBuyIn: 10000,
          maxBuyIn: 10000000,
          vipThreshold: 1000000,
        };
        needsUpdate = true;
      }
      
      return prop;
    });
    
    if (needsUpdate) {
      console.log("SAVING MIGRATED PROPERTIES:", JSON.stringify(properties));
      await setWithRetry("properties_list", properties);
      console.log("Migration saved successfully!");
    } else {
      console.log("No migration needed");
    }
    
    console.log("Final properties being returned:", JSON.stringify(properties));
    console.log("=== END DEBUG ===");
    
    return c.json({ success: true, data: properties });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create property
app.post("/make-server-68939c29/properties", async (c) => {
  try {
    const newProperty = await c.req.json();
    const properties = await getWithRetry("properties_list") || [];
    
    // Check if property name already exists
    if (properties.find((p: any) => p.name === newProperty.name)) {
      return c.json({ success: false, error: "Property name already exists" }, 400);
    }
    
    properties.push(newProperty);
    await setWithRetry("properties_list", properties);
    return c.json({ success: true, data: newProperty });
  } catch (error) {
    console.error("Error creating property:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update property
app.put("/make-server-68939c29/properties/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const properties = await getWithRetry("properties_list") || [];
    
    const index = properties.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Property not found" }, 404);
    }
    
    // Check if new name conflicts with existing property
    if (updatedData.name && properties.some((p: any, i: number) => i !== index && p.name === updatedData.name)) {
      return c.json({ success: false, error: "Property name already exists" }, 400);
    }
    
    properties[index] = { ...properties[index], ...updatedData };
    await setWithRetry("properties_list", properties);
    return c.json({ success: true, data: properties[index] });
  } catch (error) {
    console.error("Error updating property:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete a property
app.delete("/make-server-68939c29/properties/:id", async (c) => {
  try {
    const id = c.req.param("id");
    let properties = await getWithRetry("properties_list") || [];
    
    const propertyToDelete = properties.find((p: any) => p.id === id);
    
    // Prevent deletion of default property
    if (propertyToDelete?.isDefault) {
      return c.json({ 
        success: false, 
        error: "Cannot delete the default property" 
      }, 400);
    }
    
    properties = properties.filter((p: any) => p.id !== id);
    await setWithRetry("properties_list", properties);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting property:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete property AND all its data completely
app.delete("/make-server-68939c29/properties/:id/complete", async (c) => {
  try {
    const id = c.req.param("id");
    let properties = await getWithRetry("properties_list") || [];
    
    const propertyToDelete = properties.find((p: any) => p.id === id);
    
    if (!propertyToDelete) {
      return c.json({ success: false, error: "Property not found" }, 404);
    }
    
    // Prevent deletion of default property
    if (propertyToDelete?.isDefault) {
      return c.json({ 
        success: false, 
        error: "Cannot delete the default property" 
      }, 400);
    }
    
    const propertyName = propertyToDelete.name;
    console.log(`🗑️ COMPLETE DELETION OF PROPERTY: ${propertyName}`);
    
    // List of all data keys associated with this property
    const keysToDelete = [
      `users_${propertyName}`,
      `players_${propertyName}`,
      `floats_${propertyName}`,
      `ratings_${propertyName}`,
      `drops_${propertyName}`,
      `cage_operations_${propertyName}`,
      `cage_main_float_${propertyName}`,
      `game_statistics_${propertyName}`,
      `email_config_${propertyName}`,
      `table_shifts_${propertyName}`,
      `audit_logs_${propertyName}`,
      `comps_items_${propertyName}`,
      `comps_logs_${propertyName}`,
      `comps_cash_sales_${propertyName}`,
      `comps_staff_purchases_${propertyName}`,
      `vault_transfers_${propertyName}`,
      `jackpots_${propertyName}`,
      `employees_${propertyName}`,
    ];
    
    // Delete all associated data
    console.log(`Deleting ${keysToDelete.length} data keys...`);
    for (const key of keysToDelete) {
      try {
        await kv.del(key);
        console.log(`✅ Deleted: ${key}`);
      } catch (error) {
        console.error(`⚠️ Failed to delete ${key}:`, error.message);
      }
    }
    
    // Remove property from list
    properties = properties.filter((p: any) => p.id !== id);
    await setWithRetry("properties_list", properties);
    console.log(`✅ Property "${propertyName}" removed from properties list`);
    
    console.log(`🎉 COMPLETE DELETION SUCCESSFUL for: ${propertyName}`);
    
    return c.json({ 
      success: true, 
      message: `Property "${propertyName}" and all associated data deleted successfully`,
      deletedKeys: keysToDelete 
    });
  } catch (error) {
    console.error("Error deleting property completely:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// AUDIT LOG ENDPOINTS
// ============================================

// Create an audit log entry
app.post("/make-server-68939c29/audit-logs", async (c) => {
  try {
    const { username, userType, action, module, details, propertyName } = await c.req.json();
    
    // Get existing logs for this property
    const logs = await getWithRetry(`audit_logs_${propertyName}`) || [];
    
    // Create new log entry
    const logEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      username,
      userType,
      action,
      module,
      details,
      propertyName,
      ipAddress: c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown",
    };
    
    // Add to logs array
    logs.push(logEntry);
    
    // Keep only last 10,000 logs to prevent storage issues
    if (logs.length > 10000) {
      logs.shift();
    }
    
    await setWithRetry(`audit_logs_${propertyName}`, logs);
    
    return c.json({ success: true, data: logEntry });
  } catch (error) {
    console.error("Error creating audit log:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get all audit logs for a property
app.get("/make-server-68939c29/audit-logs", async (c) => {
  try {
    const property = c.req.query("property");
    
    if (!property) {
      return c.json({ success: false, error: "Property parameter is required" }, 400);
    }
    
    const logs = await getWithRetry(`audit_logs_${property}`) || [];
    
    // Sort by timestamp descending (newest first)
    logs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return c.json({ success: true, data: logs });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// JACKPOTS ENDPOINTS
// ============================================

// Get all jackpots
app.get("/make-server-68939c29/jackpots/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const jackpots = await getWithRetry(`${property}_jackpots`) || [];
    return c.json({ success: true, data: jackpots });
  } catch (error) {
    console.error("Error fetching jackpots:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create jackpot
app.post("/make-server-68939c29/jackpots/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newJackpot = await c.req.json();
    const jackpots = await getWithRetry(`${property}_jackpots`) || [];
    jackpots.push(newJackpot);
    await setWithRetry(`${property}_jackpots`, jackpots);
    return c.json({ success: true, data: newJackpot });
  } catch (error) {
    console.error("Error creating jackpot:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update jackpot
app.put("/make-server-68939c29/jackpots/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const jackpots = await getWithRetry(`${property}_jackpots`) || [];
    
    const index = jackpots.findIndex((j: any) => j.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Jackpot not found" }, 404);
    }
    
    jackpots[index] = { ...jackpots[index], ...updatedData };
    await setWithRetry(`${property}_jackpots`, jackpots);
    return c.json({ success: true, data: jackpots[index] });
  } catch (error) {
    console.error("Error updating jackpot:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete jackpot
app.delete("/make-server-68939c29/jackpots/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const jackpots = await getWithRetry(`${property}_jackpots`) || [];
    
    const filtered = jackpots.filter((j: any) => j.id !== id);
    await setWithRetry(`${property}_jackpots`, filtered);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting jackpot:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// JACKPOT WINNERS ENDPOINTS
// ============================================

// Get all jackpot winners
app.get("/make-server-68939c29/jackpot-winners/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const winners = await getWithRetry(`${property}_jackpot_winners`) || [];
    return c.json({ success: true, data: winners });
  } catch (error) {
    console.error("Error fetching jackpot winners:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create jackpot winner
app.post("/make-server-68939c29/jackpot-winners/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newWinner = await c.req.json();
    const winners = await getWithRetry(`${property}_jackpot_winners`) || [];
    winners.unshift(newWinner); // Add to beginning for recent winners first
    await setWithRetry(`${property}_jackpot_winners`, winners);
    return c.json({ success: true, data: newWinner });
  } catch (error) {
    console.error("Error creating jackpot winner:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Legacy endpoints (keeping for backwards compatibility)
// Get all winners
app.get("/make-server-68939c29/winners/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const winners = await getWithRetry(`${property}_jackpot_winners`) || [];
    return c.json({ success: true, data: winners });
  } catch (error) {
    console.error("Error fetching winners:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create winner
app.post("/make-server-68939c29/winners/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newWinner = await c.req.json();
    const winners = await getWithRetry(`${property}_jackpot_winners`) || [];
    winners.unshift(newWinner);
    await setWithRetry(`${property}_jackpot_winners`, winners);
    return c.json({ success: true, data: newWinner });
  } catch (error) {
    console.error("Error creating winner:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// MARKETING CAMPAIGNS ENDPOINTS
// ============================================

// Get all campaigns
app.get("/make-server-68939c29/campaigns/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const campaigns = await getWithRetry(`${property}_campaigns`) || [];
    return c.json({ success: true, data: campaigns });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create campaign
app.post("/make-server-68939c29/campaigns/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newCampaign = await c.req.json();
    const campaigns = await getWithRetry(`${property}_campaigns`) || [];
    campaigns.push(newCampaign);
    await setWithRetry(`${property}_campaigns`, campaigns);
    return c.json({ success: true, data: newCampaign });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update campaign
app.put("/make-server-68939c29/campaigns/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const campaigns = await getWithRetry(`${property}_campaigns`) || [];
    
    const index = campaigns.findIndex((c: any) => c.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Campaign not found" }, 404);
    }
    
    campaigns[index] = { ...campaigns[index], ...updatedData };
    await setWithRetry(`${property}_campaigns`, campaigns);
    return c.json({ success: true, data: campaigns[index] });
  } catch (error) {
    console.error("Error updating campaign:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete campaign
app.delete("/make-server-68939c29/campaigns/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const campaigns = await getWithRetry(`${property}_campaigns`) || [];
    
    const filtered = campaigns.filter((c: any) => c.id !== id);
    await setWithRetry(`${property}_campaigns`, filtered);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// VAULT TRANSFER ENDPOINTS
// ============================================

// Get all vault transfers
app.get("/make-server-68939c29/vault-transfers/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const transfers = await getWithRetry(`${property}_vault_transfers`) || [];
    return c.json({ success: true, data: transfers });
  } catch (error) {
    console.error("Error fetching vault transfers:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create vault transfer
app.post("/make-server-68939c29/vault-transfers/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newTransfer = await c.req.json();
    const transfers = await getWithRetry(`${property}_vault_transfers`) || [];
    transfers.push(newTransfer);
    await setWithRetry(`${property}_vault_transfers`, transfers);
    return c.json({ success: true, data: newTransfer });
  } catch (error) {
    console.error("Error creating vault transfer:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update vault transfer
app.put("/make-server-68939c29/vault-transfers/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const transfers = await getWithRetry(`${property}_vault_transfers`) || [];
    
    const index = transfers.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Transfer not found" }, 404);
    }
    
    transfers[index] = { ...transfers[index], ...updatedData };
    await setWithRetry(`${property}_vault_transfers`, transfers);
    return c.json({ success: true, data: transfers[index] });
  } catch (error) {
    console.error("Error updating vault transfer:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// CASH TRANSACTIONS ENDPOINTS
// ============================================

// Get all cash transactions
app.get("/make-server-68939c29/cash-transactions/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const transactions = await getWithRetry(`${property}_cash_transactions`) || [];
    return c.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching cash transactions:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create cash transaction
app.post("/make-server-68939c29/cash-transactions/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newTransaction = await c.req.json();
    const transactions = await getWithRetry(`${property}_cash_transactions`) || [];
    transactions.push(newTransaction);
    await setWithRetry(`${property}_cash_transactions`, transactions);
    return c.json({ success: true, data: newTransaction });
  } catch (error) {
    console.error("Error creating cash transaction:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// RECEIPT FIELDS ENDPOINTS
// ============================================

// Get receipt fields
app.get("/make-server-68939c29/receipt-fields/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const fields = await getWithRetry(`${property}_receipt_fields`) || {
      businessName: "",
      address: "",
      phone: "",
      email: "",
      website: "",
    };
    return c.json({ success: true, data: fields });
  } catch (error) {
    console.error("Error fetching receipt fields:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Save receipt fields
app.post("/make-server-68939c29/receipt-fields/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const fields = await c.req.json();
    await setWithRetry(`${property}_receipt_fields`, fields);
    return c.json({ success: true, data: fields });
  } catch (error) {
    console.error("Error saving receipt fields:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// BUY-IN TRANSACTIONS ENDPOINTS
// ============================================

// Get all buy-in transactions
app.get("/make-server-68939c29/buy-in-transactions/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const transactions = await getWithRetry(`${property}_buy_in_transactions`) || [];
    return c.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching buy-in transactions:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create buy-in transaction
app.post("/make-server-68939c29/buy-in-transactions/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newTransaction = await c.req.json();
    const transactions = await getWithRetry(`${property}_buy_in_transactions`) || [];
    transactions.push(newTransaction);
    await setWithRetry(`${property}_buy_in_transactions`, transactions);
    return c.json({ success: true, data: newTransaction });
  } catch (error) {
    console.error("Error creating buy-in transaction:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// CREDIT LINE ENDPOINTS
// ============================================

// Get all credit lines
app.get("/make-server-68939c29/credit-lines/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const creditLines = await getWithRetry(`${property}_credit_lines`) || [];
    return c.json({ success: true, data: creditLines });
  } catch (error) {
    console.error("Error fetching credit lines:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create credit line
app.post("/make-server-68939c29/credit-lines/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newCreditLine = await c.req.json();
    const creditLines = await getWithRetry(`${property}_credit_lines`) || [];
    creditLines.push(newCreditLine);
    await setWithRetry(`${property}_credit_lines`, creditLines);
    return c.json({ success: true, data: newCreditLine });
  } catch (error) {
    console.error("Error creating credit line:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update credit line
app.put("/make-server-68939c29/credit-lines/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const creditLines = await getWithRetry(`${property}_credit_lines`) || [];
    
    const index = creditLines.findIndex((cl: any) => cl.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Credit line not found" }, 404);
    }
    
    creditLines[index] = { ...creditLines[index], ...updatedData };
    await setWithRetry(`${property}_credit_lines`, creditLines);
    return c.json({ success: true, data: creditLines[index] });
  } catch (error) {
    console.error("Error updating credit line:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// CREDIT TRANSACTION ENDPOINTS
// ============================================

// Get all credit transactions
app.get("/make-server-68939c29/credit-transactions/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const transactions = await getWithRetry(`${property}_credit_transactions`) || [];
    return c.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching credit transactions:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create credit transaction
app.post("/make-server-68939c29/credit-transactions/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newTransaction = await c.req.json();
    const transactions = await getWithRetry(`${property}_credit_transactions`) || [];
    transactions.push(newTransaction);
    await setWithRetry(`${property}_credit_transactions`, transactions);
    return c.json({ success: true, data: newTransaction });
  } catch (error) {
    console.error("Error creating credit transaction:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update credit transaction
app.put("/make-server-68939c29/credit-transactions/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const transactions = await getWithRetry(`${property}_credit_transactions`) || [];
    
    const index = transactions.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Transaction not found" }, 404);
    }
    
    transactions[index] = { ...transactions[index], ...updatedData };
    await setWithRetry(`${property}_credit_transactions`, transactions);
    return c.json({ success: true, data: transactions[index] });
  } catch (error) {
    console.error("Error updating credit transaction:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// CASHIER FLOAT ENDPOINTS
// ============================================

// Get all cashier floats
app.get("/make-server-68939c29/cashier-floats/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const floats = await getWithRetry(`${property}_cashier_floats`) || [];
    return c.json({ success: true, data: floats });
  } catch (error) {
    console.error("Error fetching cashier floats:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create cashier float
app.post("/make-server-68939c29/cashier-floats/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newFloat = await c.req.json();
    const floats = await getWithRetry(`${property}_cashier_floats`) || [];
    floats.push(newFloat);
    await setWithRetry(`${property}_cashier_floats`, floats);
    return c.json({ success: true, data: newFloat });
  } catch (error) {
    console.error("Error creating cashier float:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update cashier float
app.put("/make-server-68939c29/cashier-floats/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const floats = await getWithRetry(`${property}_cashier_floats`) || [];
    
    const index = floats.findIndex((f: any) => f.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Cashier float not found" }, 404);
    }
    
    floats[index] = { ...floats[index], ...updatedData };
    await setWithRetry(`${property}_cashier_floats`, floats);
    return c.json({ success: true, data: floats[index] });
  } catch (error) {
    console.error("Error updating cashier float:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// VAULT INVENTORY ENDPOINTS
// ============================================

// Get vault inventory
app.get("/make-server-68939c29/vault-inventory/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const inventory = await getWithRetry(`${property}_vault_inventory`) || null;
    return c.json({ success: true, data: inventory });
  } catch (error) {
    console.error("Error fetching vault inventory:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update vault inventory
app.post("/make-server-68939c29/vault-inventory/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const inventory = await c.req.json();
    await setWithRetry(`${property}_vault_inventory`, inventory);
    return c.json({ success: true, data: inventory });
  } catch (error) {
    console.error("Error updating vault inventory:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// EMPLOYEE ENDPOINTS
// ============================================

// Get all employees
app.get("/make-server-68939c29/employees/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const employees = await getWithRetry(`${property}_employees`) || [];
    return c.json({ success: true, data: employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create employee
app.post("/make-server-68939c29/employees/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newEmployee = await c.req.json();
    const employees = await getWithRetry(`${property}_employees`) || [];
    employees.push(newEmployee);
    await setWithRetry(`${property}_employees`, employees);
    return c.json({ success: true, data: newEmployee });
  } catch (error) {
    console.error("Error creating employee:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update employee
app.put("/make-server-68939c29/employees/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const employees = await getWithRetry(`${property}_employees`) || [];
    
    const index = employees.findIndex((e: any) => e.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Employee not found" }, 404);
    }
    
    employees[index] = { ...employees[index], ...updatedData };
    await setWithRetry(`${property}_employees`, employees);
    return c.json({ success: true, data: employees[index] });
  } catch (error) {
    console.error("Error updating employee:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete employee
app.delete("/make-server-68939c29/employees/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const employees = await getWithRetry(`${property}_employees`) || [];
    
    const filtered = employees.filter((e: any) => e.id !== id);
    await setWithRetry(`${property}_employees`, filtered);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// COMPS ENDPOINTS
// ============================================

// Get all comps
app.get("/make-server-68939c29/comps/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const comps = await getWithRetry(`comps_${property}`) || [];
    return c.json({ success: true, data: comps });
  } catch (error) {
    console.error("Error fetching comps:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get comps by player ID
app.get("/make-server-68939c29/comps/:property/player/:playerId", async (c) => {
  try {
    const property = c.req.param("property");
    const playerId = c.req.param("playerId");
    const comps = await getWithRetry(`comps_${property}`) || [];
    const playerComps = comps.filter((comp: any) => comp.playerId === playerId);
    return c.json({ success: true, data: playerComps });
  } catch (error) {
    console.error("Error fetching player comps:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create comp
app.post("/make-server-68939c29/comps/:property", async (c) => {
  try {
    const property = c.req.param("property");
    const newComp = await c.req.json();
    const comps = await getWithRetry(`comps_${property}`) || [];
    
    comps.unshift(newComp); // Add to beginning for newest first
    await setWithRetry(`comps_${property}`, comps);
    return c.json({ success: true, data: newComp });
  } catch (error) {
    console.error("Error creating comp:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update comp
app.put("/make-server-68939c29/comps/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const comps = await getWithRetry(`comps_${property}`) || [];
    
    const index = comps.findIndex((comp: any) => comp.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Comp not found" }, 404);
    }
    
    comps[index] = { ...comps[index], ...updatedData };
    await setWithRetry(`comps_${property}`, comps);
    return c.json({ success: true, data: comps[index] });
  } catch (error) {
    console.error("Error updating comp:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete comp
app.delete("/make-server-68939c29/comps/:property/:id", async (c) => {
  try {
    const property = c.req.param("property");
    const id = c.req.param("id");
    const comps = await getWithRetry(`comps_${property}`) || [];
    
    const filteredComps = comps.filter((comp: any) => comp.id !== id);
    await setWithRetry(`comps_${property}`, filteredComps);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting comp:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Global error handler for unhandled exceptions
app.onError((err, c) => {
  console.error("=== UNHANDLED ERROR ===");
  console.error("Error:", err);
  console.error("Stack:", err.stack);
  console.error("======================");
  return c.json(
    { 
      success: false, 
      error: err.message || "Internal server error",
      details: err.stack
    }, 
    500
  );
});

// 404 handler for unknown routes
app.notFound((c) => {
  console.log(`404 Not Found: ${c.req.method} ${c.req.url}`);
  return c.json({ success: false, error: "Route not found" }, 404);
});

Deno.serve(app.fetch);