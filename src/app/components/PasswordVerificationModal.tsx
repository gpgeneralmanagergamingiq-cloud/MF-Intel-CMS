import { useState } from "react";
import { X, Lock, AlertTriangle } from "lucide-react";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

interface PasswordVerificationModalProps {
  onVerify: (username: string, password: string) => Promise<boolean>;
  onCancel: () => void;
  title?: string;
  message?: string;
  requiredRole?: string;
}

export function PasswordVerificationModal({
  onVerify,
  onCancel,
  title = "Approval Required",
  message = "Please enter your credentials to approve this action",
  requiredRole
}: PasswordVerificationModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const isValid = await onVerify(username, password);
      if (!isValid) {
        setError("Invalid credentials or insufficient permissions");
        setIsVerifying(false);
      }
      // If valid, the parent component will close the modal
    } catch (err: any) {
      setError(err.message || "Verification failed");
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              {requiredRole && (
                <p className="text-xs text-amber-600 font-medium">
                  {requiredRole} authorization required
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            disabled={isVerifying}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-slate-600">{message}</p>

          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Verification Failed</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter your username"
              disabled={isVerifying}
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter your password"
              disabled={isVerifying}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              disabled={isVerifying}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isVerifying}
            >
              <Lock className="w-5 h-5" />
              {isVerifying ? "Verifying..." : "Approve"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}