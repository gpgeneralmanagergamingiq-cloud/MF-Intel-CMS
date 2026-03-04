import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";
import * as api from "../utils/api";

interface ChangePasswordFormProps {
  username: string;
  property: string; // This is already the INTERNAL name from Login.tsx
  onPasswordChanged: () => void;
  onBackToLogin?: () => void; // Optional callback to return to login
}

export function ChangePasswordForm({ username, property, onPasswordChanged, onBackToLogin }: ChangePasswordFormProps) {
  // FORCE RELOAD IF CACHE IS STALE - This will ensure latest code runs
  console.log("========================================");
  console.log("🔐 ChangePasswordForm LOADED");
  console.log("Username:", username);
  console.log("Property (should be INTERNAL name like 'grand_palace'):", property);
  console.log("Property type:", typeof property);
  console.log("Property length:", property?.length);
  console.log("========================================");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("🔍 Step 1: Fetching users for property:", property);
      
      // Get users from API with explicit property
      const users = await api.getUsers(property);
      console.log("✅ Step 2: Found", users.length, "users");
      console.log("📋 Available usernames:", users.map((u: any) => u.username).join(", "));
      
      const user = users.find((u: any) => u.username === username);

      if (!user) {
        console.error("❌ ERROR: User not found!");
        console.error("Looking for username:", username);
        console.error("In property:", property);
        console.error("Available users:", users.map((u: any) => ({ username: u.username, property: u.property })));
        setError(`User '${username}' not found in property '${property}'. Check console for details.`);
        setIsLoading(false);
        return;
      }

      console.log("✅ Step 3: Found user:", user.username);

      // Verify current password
      if (user.password !== currentPassword) {
        setError("Current password is incorrect");
        setIsLoading(false);
        return;
      }

      // Validate new password
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("New passwords do not match");
        setIsLoading(false);
        return;
      }

      if (newPassword === currentPassword) {
        setError("New password must be different from current password");
        setIsLoading(false);
        return;
      }

      // Update user password and remove mustChangePassword flag
      console.log("Updating user password for:", user.username, "in property:", property);
      await api.updateUser(property, user.username, {
        ...user,
        password: newPassword,
        needsPasswordChange: false,
        mustChangePassword: false
      });

      console.log("Password changed successfully for user:", username);
      setIsLoading(false);
      onPasswordChanged();
    } catch (error: any) {
      console.error("Error changing password:", error);
      setError(error.message || "Failed to change password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-600 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Change Password</h1>
          <p className="text-slate-600">
            You must change your password before accessing the system
          </p>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 font-medium">
              Logged in as: <span className="font-bold">{username}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter new password (min 6 characters)"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <div className="text-red-600 mt-0.5">⚠️</div>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Password Requirements */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-900 mb-2">Password Requirements:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" />
                At least 6 characters long
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" />
                Different from current password
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" />
                Both new password fields must match
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Changing Password...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Change Password
              </>
            )}
          </button>

          {/* Back to Login Button - Always visible */}
          <button
            type="button"
            onClick={onBackToLogin || (() => window.location.reload())}
            className="w-full bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}