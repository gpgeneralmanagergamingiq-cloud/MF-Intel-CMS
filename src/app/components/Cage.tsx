import { useState, useEffect } from "react";
import { Vault, RefreshCw } from "lucide-react";
import { useOutletContext } from "react-router";

export function Cage() {
  const { currentUser } = useOutletContext<{ currentUser: any }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading cage data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <Vault className="w-7 h-7 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cage Operations</h1>
          <p className="text-slate-600">Manage vault transfers and cage operations</p>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <Vault className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Cage Operations Module</h2>
        <p className="text-slate-500">Module in development</p>
      </div>
    </div>
  );
}