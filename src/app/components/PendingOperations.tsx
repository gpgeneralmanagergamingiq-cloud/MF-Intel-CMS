import { CheckCircle, XCircle, ArrowRight, Package, Send } from "lucide-react";

interface ChipDenomination {
  [key: string]: number;
}

interface CageOperation {
  id: string;
  type: "Table Opener" | "Fill" | "Credit" | "Table Closer" | "Player Cashout" | "Player Buy-in" | "Initial Float" | "Adjustment";
  tableName?: string;
  playerName?: string;
  amount: number;
  currency: string;
  chips: ChipDenomination;
  cashierName: string;
  timestamp: string;
  notes: string;
  status: "Submitted" | "Admitted" | "Issued" | "Received" | "Approved" | "Rejected";
  submittedBy?: string;
  admittedBy?: string;
  admittedTimestamp?: string;
  issuedBy?: string;
  issuedTimestamp?: string;
  receivedBy?: string;
  receivedTimestamp?: string;
  approvedBy?: string;
  approvalTimestamp?: string;
  rejectionReason?: string;
}

interface PendingOperationsProps {
  operations: CageOperation[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onAdmit: (id: string) => void;
  onIssue: (id: string) => void;
  onReceive: (id: string) => void;
  formatCurrency: (amount: number, currency?: string) => string;
  formatTimestamp: (timestamp: string) => string;
  getChipSummary: (chips: ChipDenomination) => string;
}

export function PendingOperations({
  operations,
  onApprove,
  onReject,
  onAdmit,
  onIssue,
  onReceive,
  formatCurrency,
  formatTimestamp,
  getChipSummary,
}: PendingOperationsProps) {
  if (operations.length === 0) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Submitted</span>;
      case "Admitted":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Admitted</span>;
      case "Issued":
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Issued</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-full">{status}</span>;
    }
  };

  const getWorkflowStep = (operation: CageOperation) => {
    if (["Fill", "Credit"].includes(operation.type)) {
      return (
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className={`flex items-center gap-1 ${operation.status === "Submitted" ? "font-bold text-blue-600" : "text-slate-400"}`}>
            <div className={`w-2 h-2 rounded-full ${operation.status === "Submitted" ? "bg-blue-600" : "bg-slate-300"}`}></div>
            Submitted
          </div>
          <ArrowRight className="w-3 h-3" />
          <div className={`flex items-center gap-1 ${operation.status === "Admitted" ? "font-bold text-yellow-600" : "text-slate-400"}`}>
            <div className={`w-2 h-2 rounded-full ${operation.status === "Admitted" ? "bg-yellow-600" : "bg-slate-300"}`}></div>
            Admitted
          </div>
          <ArrowRight className="w-3 h-3" />
          <div className={`flex items-center gap-1 ${operation.status === "Issued" ? "font-bold text-purple-600" : "text-slate-400"}`}>
            <div className={`w-2 h-2 rounded-full ${operation.status === "Issued" ? "bg-purple-600" : "bg-slate-300"}`}></div>
            Issued
          </div>
          <ArrowRight className="w-3 h-3" />
          <div className={`flex items-center gap-1 ${operation.status === "Received" ? "font-bold text-green-600" : "text-slate-400"}`}>
            <div className={`w-2 h-2 rounded-full ${operation.status === "Received" ? "bg-green-600" : "bg-slate-300"}`}></div>
            Received
          </div>
        </div>
      );
    }
    
    // For Table Openers/Closers
    return (
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <div className={`flex items-center gap-1 ${operation.status === "Submitted" ? "font-bold text-blue-600" : "text-slate-400"}`}>
          <div className={`w-2 h-2 rounded-full ${operation.status === "Submitted" ? "bg-blue-600" : "bg-slate-300"}`}></div>
          Submitted
        </div>
        <ArrowRight className="w-3 h-3" />
        <div className={`flex items-center gap-1 ${operation.status === "Approved" ? "font-bold text-green-600" : "text-slate-400"}`}>
          <div className={`w-2 h-2 rounded-full ${operation.status === "Approved" ? "bg-green-600" : "bg-slate-300"}`}></div>
          Approved
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border-2 border-blue-300 rounded-lg overflow-hidden mb-6">
      <div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
        <h3 className="text-lg font-bold text-blue-900">Pending Operations ({operations.length})</h3>
        <p className="text-sm text-blue-700 mt-1">Operations awaiting cage processing</p>
      </div>
      
      <div className="divide-y divide-slate-200">
        {operations.map((op) => (
          <div key={op.id} className="p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                    op.type === "Fill" || op.type === "Table Opener" 
                      ? "bg-red-100 text-red-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {op.type}
                  </span>
                  {getStatusBadge(op.status)}
                  {op.tableName && (
                    <span className="text-sm font-medium text-slate-700">Table: {op.tableName}</span>
                  )}
                </div>
                
                {getWorkflowStep(op)}
              </div>
              
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(op.amount, op.currency)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatTimestamp(op.timestamp)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Chip Breakdown</p>
                <p className="text-sm text-slate-700">{getChipSummary(op.chips)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Submitted By</p>
                <p className="text-sm text-slate-700">{op.submittedBy || op.cashierName}</p>
              </div>
              {op.notes && (
                <div className="md:col-span-2">
                  <p className="text-xs font-medium text-slate-500 mb-1">Notes</p>
                  <p className="text-sm text-slate-700">{op.notes}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
              {/* Table Openers/Closers: Simple Approve/Reject */}
              {(op.type === "Table Opener" || op.type === "Table Closer") && op.status === "Submitted" && (
                <>
                  <button
                    onClick={() => onApprove(op.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt("Enter rejection reason:");
                      if (reason) onReject(op.id, reason);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </>
              )}

              {/* Fills/Credits: Workflow Steps */}
              {(op.type === "Fill" || op.type === "Credit") && (
                <>
                  {op.status === "Submitted" && (
                    <>
                      <button
                        onClick={() => onAdmit(op.id)}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Admit Request
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt("Enter rejection reason:");
                          if (reason) onReject(op.id, reason);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                  
                  {op.status === "Admitted" && (
                    <button
                      onClick={() => onIssue(op.id)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <Package className="w-4 h-4" />
                      Issue {op.type}
                    </button>
                  )}
                  
                  {op.status === "Issued" && (
                    <button
                      onClick={() => onReceive(op.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <Send className="w-4 h-4" />
                      Confirm Receipt at Table
                    </button>
                  )}
                </>
              )}

              {/* Workflow Status Info */}
              {op.admittedBy && (
                <div className="ml-auto text-xs text-slate-600">
                  <p>Admitted by: <span className="font-medium">{op.admittedBy}</span></p>
                  {op.admittedTimestamp && <p>{formatTimestamp(op.admittedTimestamp)}</p>}
                </div>
              )}
              {op.issuedBy && (
                <div className="ml-auto text-xs text-slate-600">
                  <p>Issued by: <span className="font-medium">{op.issuedBy}</span></p>
                  {op.issuedTimestamp && <p>{formatTimestamp(op.issuedTimestamp)}</p>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
