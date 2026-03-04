import { useState } from "react";
import { Bug, RefreshCw } from "lucide-react";
import * as api from "../utils/api";

export function DebugPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await api.getUsers("grand_palace");
      setUsers(allUsers);
      console.log("🔍 DEBUG - All users:", allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          fetchUsers();
        }}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Debug Panel"
      >
        <Bug className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl p-4 max-w-2xl max-h-96 overflow-auto z-50 border-2 border-purple-600">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-lg">Debug Panel - Users</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 rounded transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-slate-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
      </div>

      <div className="text-sm space-y-2">
        <div className="bg-purple-50 border border-purple-200 rounded p-2">
          <strong>Total Users:</strong> {users.length}
        </div>

        {users.length === 0 ? (
          <div className="text-slate-500 text-center py-8">
            {isLoading ? "Loading..." : "No users found in database"}
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 rounded p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <strong className="text-purple-600">Username:</strong> {user.username}
                  </div>
                  <div>
                    <strong className="text-purple-600">User Type:</strong> {user.userType}
                  </div>
                  <div>
                    <strong className="text-purple-600">Status:</strong> {user.status || "Active"}
                  </div>
                  <div>
                    <strong className="text-purple-600">Password Set:</strong>{" "}
                    {user.password ? `✅ (${user.password.length} chars)` : "❌ No password"}
                  </div>
                  <div className="col-span-2">
                    <strong className="text-purple-600">Email:</strong> {user.email || "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <button
          onClick={() => {
            console.log("📋 Full user data:", users);
            alert("User data logged to console. Press F12 to view.");
          }}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          📋 Log Full Data to Console
        </button>
      </div>
    </div>
  );
}
