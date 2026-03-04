import { Eye, AlertCircle } from "lucide-react";

export function ViewOnlyBanner() {
  return (
    <div className="lg:hidden mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Eye className="w-6 h-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-amber-900 mb-1">View Only Mode</h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            You're viewing data from a mobile device. All editing features are disabled to prevent accidental changes.
            <span className="block mt-1 font-medium">
              Use a desktop browser for full management capabilities.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
