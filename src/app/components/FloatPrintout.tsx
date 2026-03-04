import { useEffect } from "react";

interface ChipDenomination {
  [key: string]: number;
}

interface FloatTransaction {
  id: string;
  tableName: string;
  dealerName: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: string;
  type: "Open" | "Close" | "Fill" | "Credit";
  chips: ChipDenomination;
  notes?: string;
  property?: string;
}

interface FloatPrintoutProps {
  transaction: FloatTransaction;
  onClose: () => void;
  currentUserName?: string;
  currentUserSignature?: string;
  inspectorSignature?: string;
  pitManagerSignature?: string;
}

const CHIP_DENOMINATIONS = [10000000, 5000000, 1000000, 500000, 100000, 50000, 25000, 10000, 5000, 1000, 500, 250];

export function FloatPrintout({ 
  transaction, 
  onClose, 
  currentUserName, 
  currentUserSignature, 
  inspectorSignature, 
  pitManagerSignature 
}: FloatPrintoutProps) {
  useEffect(() => {
    // Auto-print when component mounts
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "FCFA": return "CFA ";
      case "PHP": return "₱";
      case "EUR": return "€";
      case "GBP": return "£";
      case "CNY":
      case "JPY": return "¥";
      case "KRW": return "₩";
      default: return "$";
    }
  };

  const getOperationTitle = (type: string) => {
    switch (type) {
      case "Open": return "TABLE OPENING";
      case "Close": return "TABLE CLOSING";
      case "Fill": return "TABLE FILL";
      case "Credit": return "TABLE CREDIT";
      default: return type.toUpperCase();
    }
  };

  const getChipRows = () => {
    return CHIP_DENOMINATIONS.map(denom => ({
      denomination: denom,
      count: transaction.chips[denom.toString()] || 0,
      total: (transaction.chips[denom.toString()] || 0) * denom
    })).filter(row => row.count > 0);
  };

  const chipRows = getChipRows();

  // Single printout template
  const PrintCopy = ({ copyNumber }: { copyNumber: number }) => (
    <div className="printout-copy" style={{ 
      pageBreakAfter: 'avoid',
      pageBreakInside: 'avoid',
      marginBottom: copyNumber === 1 ? '0.5cm' : '0',
      padding: '0.5cm',
      border: '2px solid #000',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white',
      fontSize: '11px'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '0.5cm', borderBottom: '3px double #000', paddingBottom: '0.3cm' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 0.2cm 0' }}>
          {getOperationTitle(transaction.type)}
        </h1>
        <p style={{ fontSize: '12px', margin: '0', color: '#666' }}>
          Copy {copyNumber} of 2
        </p>
      </div>

      {/* Transaction Info */}
      <div style={{ marginBottom: '0.5cm', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3cm' }}>
        <div>
          <p style={{ margin: '0.1cm 0', fontSize: '14px' }}>
            <strong>Table Number:</strong> <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{transaction.tableName}</span>
          </p>
          <p style={{ margin: '0.1cm 0', fontSize: '14px' }}>
            <strong>Pit Manager:</strong> {currentUserName || transaction.dealerName}
          </p>
        </div>
        <div>
          <p style={{ margin: '0.1cm 0', fontSize: '14px' }}>
            <strong>Date:</strong> {new Date(transaction.timestamp).toLocaleDateString()}
          </p>
          <p style={{ margin: '0.1cm 0', fontSize: '14px' }}>
            <strong>Time:</strong> {new Date(transaction.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Chip Breakdown Table */}
      <div style={{ marginBottom: '0.5cm' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '0.2cm', borderBottom: '2px solid #000', paddingBottom: '0.1cm' }}>
          CHIP DENOMINATIONS AND PIECES
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #000', padding: '0.2cm', textAlign: 'left', fontWeight: 'bold' }}>
                Denomination
              </th>
              <th style={{ border: '1px solid #000', padding: '0.2cm', textAlign: 'center', fontWeight: 'bold' }}>
                Pieces
              </th>
              <th style={{ border: '1px solid #000', padding: '0.2cm', textAlign: 'right', fontWeight: 'bold' }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {chipRows.length > 0 ? (
              chipRows.map((row, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #000', padding: '0.2cm', fontWeight: '500' }}>
                    {getCurrencySymbol(transaction.currency)}{row.denomination.toLocaleString()}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '0.2cm', textAlign: 'center', fontWeight: 'bold' }}>
                    {row.count}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '0.2cm', textAlign: 'right' }}>
                    {getCurrencySymbol(transaction.currency)}{row.total.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ border: '1px solid #000', padding: '0.3cm', textAlign: 'center', fontStyle: 'italic', color: '#666' }}>
                  No chips recorded
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#e0e0e0' }}>
              <td colSpan={2} style={{ border: '2px solid #000', padding: '0.3cm', fontWeight: 'bold', fontSize: '15px' }}>
                TOTAL AMOUNT
              </td>
              <td style={{ border: '2px solid #000', padding: '0.3cm', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' }}>
                {getCurrencySymbol(transaction.currency)}{transaction.amount.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Notes */}
      {transaction.notes && (
        <div style={{ marginBottom: '0.5cm', padding: '0.3cm', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
          <p style={{ margin: '0', fontSize: '12px' }}>
            <strong>Notes:</strong> {transaction.notes}
          </p>
        </div>
      )}

      {/* Signatures */}
      <div style={{ marginTop: '0.8cm', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5cm' }}>
        <div>
          <div style={{ borderTop: '2px solid #000', marginTop: '1cm', paddingTop: '0.2cm' }}>
            {inspectorSignature && (
              <p style={{ margin: '0 0 0.3cm 0', fontSize: '14px', fontFamily: 'Brush Script MT, cursive', textAlign: 'center' }}>
                {inspectorSignature}
              </p>
            )}
            <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
              INSPECTOR
            </p>
            <p style={{ margin: '0.1cm 0 0 0', fontSize: '10px', textAlign: 'center', color: '#666' }}>
              Signature & Date
            </p>
          </div>
        </div>
        <div>
          <div style={{ borderTop: '2px solid #000', marginTop: '1cm', paddingTop: '0.2cm' }}>
            {currentUserSignature && (
              <p style={{ margin: '0 0 0.3cm 0', fontSize: '14px', fontFamily: 'Brush Script MT, cursive', textAlign: 'center' }}>
                {currentUserSignature}
              </p>
            )}
            <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
              DEALER
            </p>
            <p style={{ margin: '0.1cm 0 0 0', fontSize: '10px', textAlign: 'center', color: '#666' }}>
              Signature & Date
            </p>
          </div>
        </div>
        <div>
          <div style={{ borderTop: '2px solid #000', marginTop: '1cm', paddingTop: '0.2cm' }}>
            {pitManagerSignature && (
              <p style={{ margin: '0 0 0.3cm 0', fontSize: '14px', fontFamily: 'Brush Script MT, cursive', textAlign: 'center' }}>
                {pitManagerSignature}
              </p>
            )}
            <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
              PIT MANAGER
            </p>
            <p style={{ margin: '0.1cm 0 0 0', fontSize: '10px', textAlign: 'center', color: '#666' }}>
              Signature & Date
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '0.5cm', paddingTop: '0.3cm', borderTop: '1px solid #ccc', textAlign: 'center' }}>
        <p style={{ margin: '0', fontSize: '10px', color: '#666' }}>
          Transaction ID: {transaction.id} | {transaction.type} Operation | Status: {transaction.status}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Print Styles */}
      <style>
        {`
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              height: 100%;
              overflow: hidden;
              margin: 0;
              padding: 0;
            }
            body * {
              visibility: hidden;
            }
            .print-only-container {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: 100% !important;
              display: block !important;
              overflow: hidden !important;
              page-break-after: avoid !important;
            }
            .print-only-container, .print-only-container * {
              visibility: visible !important;
            }
            .printout-copy {
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }
            .no-print, .no-print * {
              display: none !important;
              visibility: hidden !important;
            }
            @page {
              size: A4 portrait;
              margin: 0.5cm;
            }
          }
          @media screen {
            .print-only-container {
              display: none !important;
            }
            .screen-preview-container {
              max-width: 21cm;
              margin: 0 auto;
              background: white;
            }
          }
        `}
      </style>

      {/* Screen View with Close Button */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
            <h3 className="text-xl font-bold text-slate-900">Print Preview</h3>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Print
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
          
          <div className="p-6 bg-slate-100">
            <div className="screen-preview-container">
              <PrintCopy copyNumber={1} />
              <PrintCopy copyNumber={2} />
            </div>
          </div>
        </div>
      </div>

      {/* Print View (hidden on screen, visible when printing) */}
      <div className="print-only-container">
        <PrintCopy copyNumber={1} />
        <PrintCopy copyNumber={2} />
      </div>
    </>
  );
}