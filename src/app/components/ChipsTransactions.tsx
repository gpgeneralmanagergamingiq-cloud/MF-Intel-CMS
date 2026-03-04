import { Coins, Plus } from "lucide-react";

interface ChipsTransactionsProps {
  onNewTransaction: () => void;
  isViewOnly: boolean;
}

export function ChipsTransactions({ onNewTransaction, isViewOnly }: ChipsTransactionsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900">Chip Transactions</h3>
        <p className="text-sm text-slate-600 mt-1">
          Fills, Credits, Table Open, Table Close
        </p>
      </div>

      {/* Transaction Types Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-purple-600" />
            <h4 className="font-bold text-purple-900">Fill</h4>
          </div>
          <p className="text-xs text-purple-700">
            Issue chips to tables when they need more inventory
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-blue-900">Credit</h4>
          </div>
          <p className="text-xs text-blue-700">
            Accept chips back from tables when they have excess
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-green-600" />
            <h4 className="font-bold text-green-900">Table Open</h4>
          </div>
          <p className="text-xs text-green-700">
            Issue opening float when a table starts operations
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-amber-600" />
            <h4 className="font-bold text-amber-900">Table Close</h4>
          </div>
          <p className="text-xs text-amber-700">
            Accept all chips when a table closes for the day
          </p>
        </div>
      </div>

      {/* Placeholder for actual transactions list */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-8 text-center">
        <Coins className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600">
          Chip transaction history will be displayed here
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Click the Chips Transactions button to create a new transaction
        </p>
      </div>
    </div>
  );
}