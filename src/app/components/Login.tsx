import { useState } from "react";
import { LogIn, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import * as api from "../utils/api";

interface LoginProps {
  onLogin: (username: string, userType: string, mustChangePassword: boolean, property: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log(`=== LOGIN ATTEMPT START ===`);
      console.log(`Username: ${username}`);
      
      // First, get all available properties
      const properties = await api.getProperties();
      console.log(`Found ${properties.length} properties:`, properties);
      
      if (properties.length === 0) {
        throw new Error("No properties found. Please contact administrator.");
      }
      
      // Try to login against each property until we find the user
      let loginSuccess = false;
      let userData = null;
      let userProperty = null; // Track which property the user belongs to
      let lastError = null;
      let attemptedProperties: string[] = [];
      
      for (const property of properties) {
        try {
          // Use the internal 'name' field for API calls
          const propName = property.name;
          const displayName = property.displayName || property.name;
          attemptedProperties.push(displayName);
          console.log(`\n--- Trying property: ${propName} (Display: ${displayName}) ---`);
          
          // Initialize property if needed (this will create default admin user)
          console.log(`Initializing property: ${propName}`);
          await api.initializeProperty(propName);
          console.log(`Property initialized successfully`);
          
          // Attempt login - this will throw on 401 but we want to catch it
          console.log(`Attempting login with username: ${username}`);
          userData = await api.login(username, password, propName);
          
          console.log(`✅ Login SUCCESSFUL with property: ${propName} (${displayName})`);
          loginSuccess = true;
          userProperty = propName; // Save the INTERNAL name (not display name)
          break; // Stop trying other properties
        } catch (err: any) {
          // Save error and continue trying other properties
          lastError = err;
          const displayName = property.displayName || property.name;
          console.log(`❌ Login FAILED for property ${displayName}: ${err.message}`);
          // Continue to next property
        }
      }
      
      console.log(`\n=== LOGIN ATTEMPT END ===`);
      console.log(`Success: ${loginSuccess}`);
      console.log(`User property: ${userProperty}`);
      console.log(`Attempted properties: ${attemptedProperties.join(', ')}`);
      
      if (!loginSuccess || !userData || !userProperty) {
        // If all properties failed, show error
        console.error(`All login attempts failed. Last error:`, lastError);
        throw new Error("Invalid username or password. Please check your credentials.");
      }
      
      console.log("Final login data:", userData);
      console.log("User property:", userProperty);
      
      // IMPORTANT: Password changes are ONLY done from Setup by Management
      // IGNORE needsPasswordChange flag from API - always set to false
      // Pass the ACTUAL property where the user was found
      onLogin(userData.username, userData.userType, false, userProperty);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">MF-Intel CMS</h1>
          <p className="text-slate-600">for Gaming IQ</p>
          <p className="text-sm text-slate-500 mt-1">Sign in to access the system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}