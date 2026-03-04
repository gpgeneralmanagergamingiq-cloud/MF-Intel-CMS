import { useEffect, useRef } from "react";
import { APP_CURRENCY } from "../utils/currency";
import { useApi } from "../hooks/useApi";
import { ReceiptField } from "./ReceiptFieldsManagement";

interface ChipDenomination {
  [key: string]: number;
}

interface BillDenomination {
  [key: string]: number;
}

interface ThermalReceiptProps {
  type: "cage-operation" | "buy-in" | "cash-transaction" | "vault-transfer" | "float";
  data: any;
  propertyName?: string;
  copyNumber?: number; // 1 or 2 for tracking which copy is printing
  onPrintComplete?: () => void;
}

export function ThermalReceipt({ type, data, propertyName, copyNumber, onPrintComplete }: ThermalReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-print after component mounts
    const timer = setTimeout(() => {
      window.print();
      if (onPrintComplete) {
        // Call after print dialog closes
        setTimeout(onPrintComplete, 1000);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [onPrintComplete]);

  const getCurrencySymbol = (currency: string) => {
    if (currency === "FCFA") return "CFA ";
    if (currency === "PHP") return "₱";
    if (currency === "EUR") return "€";
    if (currency === "GBP") return "£";
    if (currency === "CNY" || currency === "JPY") return "¥";
    if (currency === "KRW") return "₩";
    return "$";
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatReceiptId = (id: string) => {
    // Shorten ID to first 8 characters for thermal receipt
    return id.substring(0, 8).toUpperCase();
  };

  const renderChipBreakdown = (chips: ChipDenomination, currency: string) => {
    const denominations = [10000000, 5000000, 1000000, 500000, 100000, 50000, 25000, 10000, 5000, 1000, 500, 250];
    const symbol = getCurrencySymbol(currency);
    
    return denominations.map((denom) => {
      const qty = chips[denom.toString()] || 0;
      if (qty === 0) return null;
      const subtotal = denom * qty;
      
      return (
        <div key={denom} className="receipt-line">
          <span className="receipt-item">{symbol}{denom.toLocaleString()}</span>
          <span className="receipt-qty">x {qty}</span>
          <span className="receipt-amount">{symbol}{subtotal.toLocaleString()}</span>
        </div>
      );
    }).filter(Boolean);
  };

  const renderCashBreakdown = (bills: BillDenomination, currency: string) => {
    const denominations = [10000, 5000, 2000, 1000, 500, 100];
    const symbol = getCurrencySymbol(currency);
    
    return denominations.map((denom) => {
      const qty = bills[denom.toString()] || 0;
      if (qty === 0) return null;
      const subtotal = denom * qty;
      
      return (
        <div key={denom} className="receipt-line">
          <span className="receipt-item">{symbol}{denom.toLocaleString()}</span>
          <span className="receipt-qty">x {qty}</span>
          <span className="receipt-amount">{symbol}{subtotal.toLocaleString()}</span>
        </div>
      );
    }).filter(Boolean);
  };

  const renderCageOperation = () => (
    <>
      <div className="receipt-title">CAGE OPERATION</div>
      <div className="receipt-subtitle">{data.type}</div>
      <div className="receipt-divider">----------------------------</div>
      
      <div className="receipt-info">
        <div>Date/Time: {formatDateTime(data.timestamp)}</div>
        <div>Receipt #: {formatReceiptId(data.id)}</div>
        {data.tableName && <div>Table: {data.tableName}</div>}
        {data.playerName && <div>Player: {data.playerName}</div>}
        <div>Cashier: {data.cashierName}</div>
      </div>

      <div className="receipt-divider">----------------------------</div>

      {data.chips && Object.keys(data.chips).length > 0 && (
        <>
          <div className="receipt-section-title">CHIP BREAKDOWN</div>
          {renderChipBreakdown(data.chips, data.currency)}
        </>
      )}

      <div className="receipt-divider">----------------------------</div>
      
      <div className="receipt-total">
        <div className="total-label">TOTAL:</div>
        <div className="total-amount">{getCurrencySymbol(data.currency)}{data.amount.toLocaleString()}</div>
      </div>

      <div className="receipt-divider">----------------------------</div>

      {/* Transaction Type */}
      <div className="receipt-transaction-type">
        <div style={{ fontWeight: 'bold' }}>TRANSACTION TYPE:</div>
        <div>{data.type || 'N/A'}</div>
      </div>

      {data.notes && (
        <>
          <div className="receipt-divider">----------------------------</div>
          <div className="receipt-notes">
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>NOTES:</div>
            <div>{data.notes}</div>
          </div>
        </>
      )}
    </>
  );

  const renderBuyIn = () => (
    <>
      <div className="receipt-title">PLAYER BUY-IN</div>
      <div className="receipt-divider">----------------------------</div>
      
      <div className="receipt-info">
        <div>Date/Time: {formatDateTime(data.timestamp)}</div>
        <div>Receipt #: {formatReceiptId(data.id)}</div>
        <div>Player: {data.playerName}</div>
        <div>Cashier: {data.cashierName}</div>
        {data.paymentType && <div>Payment: {data.paymentType}</div>}
      </div>

      <div className="receipt-divider">----------------------------</div>

      {data.cashBills && Object.values(data.cashBills).some((v: any) => v > 0) && (
        <>
          <div className="receipt-section-title">CASH RECEIVED</div>
          {renderCashBreakdown(data.cashBills, data.currency)}
          <div className="receipt-divider">- - - - - - - - - - - - -</div>
        </>
      )}

      {data.chips && Object.keys(data.chips).length > 0 && (
        <>
          <div className="receipt-section-title">CHIPS ISSUED</div>
          {renderChipBreakdown(data.chips, data.currency)}
        </>
      )}

      <div className="receipt-divider">----------------------------</div>
      
      <div className="receipt-total">
        <div className="total-label">TOTAL:</div>
        <div className="total-amount">{getCurrencySymbol(data.currency)}{data.amount.toLocaleString()}</div>
      </div>

      <div className="receipt-divider">----------------------------</div>

      {/* Transaction Type */}
      <div className="receipt-transaction-type">
        <div style={{ fontWeight: 'bold' }}>TRANSACTION TYPE:</div>
        <div>{data.type || 'N/A'}</div>
      </div>

      {data.notes && (
        <>
          <div className="receipt-divider">----------------------------</div>
          <div className="receipt-notes">
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>NOTES:</div>
            <div>{data.notes}</div>
          </div>
        </>
      )}
    </>
  );

  const renderCashTransaction = () => (
    <>
      <div className="receipt-title">CASH TRANSACTION</div>
      <div className="receipt-subtitle">{data.type}</div>
      <div className="receipt-divider">----------------------------</div>
      
      <div className="receipt-info">
        <div>Date/Time: {formatDateTime(data.timestamp)}</div>
        <div>Receipt #: {formatReceiptId(data.id)}</div>
        {data.playerName && <div>Player: {data.playerName}</div>}
        <div>Cashier: {data.cashierName}</div>
      </div>

      <div className="receipt-divider">----------------------------</div>

      {data.cashBills && Object.values(data.cashBills).some((v: any) => v > 0) && (
        <>
          <div className="receipt-section-title">CASH BREAKDOWN</div>
          {renderCashBreakdown(data.cashBills, data.currency)}
        </>
      )}

      {data.chips && Object.keys(data.chips).length > 0 && (
        <>
          <div className="receipt-section-title">CHIP BREAKDOWN</div>
          {renderChipBreakdown(data.chips, data.currency)}
        </>
      )}

      <div className="receipt-divider">----------------------------</div>
      
      <div className="receipt-total">
        <div className="total-label">TOTAL:</div>
        <div className="total-amount">{getCurrencySymbol(data.currency)}{data.amount.toLocaleString()}</div>
      </div>

      <div className="receipt-divider">----------------------------</div>

      {/* Transaction Type */}
      <div className="receipt-transaction-type">
        <div style={{ fontWeight: 'bold' }}>TRANSACTION TYPE:</div>
        <div>{data.type || 'N/A'}</div>
      </div>

      {data.notes && (
        <>
          <div className="receipt-divider">----------------------------</div>
          <div className="receipt-notes">
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>NOTES:</div>
            <div>{data.notes}</div>
          </div>
        </>
      )}
    </>
  );

  const renderVaultTransfer = () => (
    <>
      <div className="receipt-title">VAULT TRANSFER</div>
      <div className="receipt-subtitle">{data.type} - {data.status}</div>
      <div className="receipt-divider">----------------------------</div>
      
      <div className="receipt-info">
        <div>Date/Time: {formatDateTime(data.timestamp)}</div>
        <div>Transfer #: {formatReceiptId(data.id)}</div>
        <div>Cashier: {data.cashierName}</div>
        <div>Asset: {data.assetType}</div>
      </div>

      <div className="receipt-divider">----------------------------</div>

      {data.assetType === "Cash" && data.cashBills && (
        <>
          <div className="receipt-section-title">CASH BREAKDOWN</div>
          {renderCashBreakdown(data.cashBills, data.currency)}
        </>
      )}

      {data.assetType === "Chips" && data.chips && (
        <>
          <div className="receipt-section-title">CHIP BREAKDOWN</div>
          {renderChipBreakdown(data.chips, data.currency)}
        </>
      )}

      <div className="receipt-divider">----------------------------</div>
      
      <div className="receipt-total">
        <div className="total-label">TOTAL:</div>
        <div className="total-amount">{getCurrencySymbol(data.currency)}{data.amount.toLocaleString()}</div>
      </div>

      <div className="receipt-divider">----------------------------</div>

      {/* Transaction Type */}
      <div className="receipt-transaction-type">
        <div style={{ fontWeight: 'bold' }}>TRANSACTION TYPE:</div>
        <div>{data.type || 'N/A'}</div>
      </div>

      {data.notes && (
        <>
          <div className="receipt-divider">----------------------------</div>
          <div className="receipt-notes">
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>NOTES:</div>
            <div>{data.notes}</div>
          </div>
        </>
      )}

      {data.status === "Pending" && (
        <>
          <div className="receipt-divider">----------------------------</div>
          <div className="receipt-warning">
            ⚠ PENDING APPROVAL REQUIRED ⚠
          </div>
        </>
      )}
    </>
  );

  const renderFloat = () => (
    <>
      <div className="receipt-title">FLOAT TRANSACTION</div>
      <div className="receipt-subtitle">{data.type}</div>
      <div className="receipt-divider">----------------------------</div>
      
      <div className="receipt-info">
        <div>Date/Time: {formatDateTime(data.timestamp)}</div>
        <div>Receipt #: {formatReceiptId(data.id)}</div>
        {data.tableName && <div>Table: {data.tableName}</div>}
        {data.dealerName && <div>Dealer: {data.dealerName}</div>}
        {copyNumber && <div className="font-bold">COPY {copyNumber} of 2</div>}
      </div>

      <div className="receipt-divider">----------------------------</div>

      {data.chips && Object.keys(data.chips).length > 0 && (
        <>
          <div className="receipt-section-title">CHIP BREAKDOWN</div>
          {renderChipBreakdown(data.chips, data.currency || "FCFA")}
        </>
      )}

      <div className="receipt-divider">----------------------------</div>
      
      <div className="receipt-total">
        <div className="total-label">TOTAL:</div>
        <div className="total-amount">{getCurrencySymbol(data.currency || "FCFA")}{data.amount.toLocaleString()}</div>
      </div>

      <div className="receipt-divider">----------------------------</div>

      {/* Transaction Type */}
      <div className="receipt-transaction-type">
        <div style={{ fontWeight: 'bold' }}>TRANSACTION TYPE:</div>
        <div>{data.type || 'N/A'}</div>
      </div>

      {data.notes && (
        <>
          <div className="receipt-divider">----------------------------</div>
          <div className="receipt-notes">
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>NOTES:</div>
            <div>{data.notes}</div>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      <div ref={receiptRef} className="thermal-receipt">
        <div className="receipt-header">
          <div className="receipt-logo">{propertyName || "MF-INTEL CMS"}</div>
          <div className="receipt-casino">GAMING IQ</div>
        </div>

        <div className="receipt-body">
          {type === "cage-operation" && renderCageOperation()}
          {type === "buy-in" && renderBuyIn()}
          {type === "cash-transaction" && renderCashTransaction()}
          {type === "vault-transfer" && renderVaultTransfer()}
          {type === "float" && renderFloat()}
        </div>

        <div className="receipt-footer">
          <div className="receipt-divider">----------------------------</div>
          
          {/* Requested By Field */}
          <div className="receipt-signature">
            <div style={{ fontWeight: 'bold' }}>Requested By:</div>
            <div className="signature-line">________________</div>
            <div style={{ fontSize: '9px', marginTop: '2px' }}>(Print Name)</div>
          </div>

          <div className="receipt-divider" style={{ margin: '8px 0' }}>----------------------------</div>

          {/* Cashier Signature */}
          <div className="receipt-signature">
            <div style={{ fontWeight: 'bold' }}>Cashier Signature:</div>
            <div className="signature-line">________________</div>
            <div style={{ marginTop: '4px' }}>{data.cashierName}</div>
          </div>

          <div className="receipt-divider" style={{ margin: '8px 0' }}>----------------------------</div>

          {/* Approval Signature */}
          <div className="receipt-signature">
            <div style={{ fontWeight: 'bold' }}>Approved By:</div>
            <div className="signature-line">________________</div>
            <div style={{ fontSize: '9px', marginTop: '2px' }}>(Management Signature)</div>
          </div>

          <div className="receipt-divider" style={{ marginTop: '12px' }}>----------------------------</div>
          <div className="receipt-thank-you">Thank You!</div>
          <div className="receipt-legal">
            Official Receipt - Keep for Records
          </div>
        </div>
      </div>

      {/* Thermal Printer Styles */}
      <style jsx>{`
        /* Hide everything except receipt when printing */
        @media print {
          body * {
            visibility: hidden;
          }
          .thermal-receipt,
          .thermal-receipt * {
            visibility: visible;
          }
          .thermal-receipt {
            position: absolute;
            left: 0;
            top: 0;
          }
        }

        /* Receipt styling for 80mm thermal printer */
        .thermal-receipt {
          width: 80mm;
          max-width: 80mm;
          font-family: 'Courier New', Courier, monospace;
          font-size: 11px;
          line-height: 1.4;
          color: #000;
          background: #fff;
          padding: 2mm 4mm;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .receipt-header {
          text-align: center;
          margin-bottom: 8px;
          border-bottom: 2px solid #000;
          padding-bottom: 6px;
        }

        .receipt-logo {
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 2px;
        }

        .receipt-casino {
          font-size: 12px;
          font-weight: bold;
          margin-top: 2px;
        }

        .receipt-body {
          margin: 8px 0;
        }

        .receipt-title {
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          margin: 6px 0;
          letter-spacing: 1px;
        }

        .receipt-subtitle {
          text-align: center;
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 6px;
        }

        .receipt-divider {
          margin: 6px 0;
          font-size: 10px;
          overflow: hidden;
          white-space: nowrap;
          text-align: center;
        }

        .receipt-info {
          margin: 6px 0;
          font-size: 10px;
          text-align: center;
        }

        .receipt-info > div {
          margin: 3px 0;
        }

        .receipt-section-title {
          font-weight: bold;
          margin: 6px 0 3px 0;
          font-size: 10px;
          text-align: center;
        }

        .receipt-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 2px 0;
          font-size: 10px;
          padding: 0 2px;
        }

        .receipt-item {
          flex: 0 0 120px;
          text-align: left;
          font-weight: 500;
        }

        .receipt-qty {
          flex: 0 0 50px;
          text-align: center;
          font-weight: normal;
        }

        .receipt-amount {
          flex: 1;
          text-align: right;
          font-weight: 500;
          min-width: 100px;
        }

        .receipt-total {
          display: block;
          text-align: center;
          font-weight: bold;
          margin: 12px 0;
          padding: 8px 0;
          background: #f0f0f0;
          border: 2px solid #000;
        }
        
        .total-label {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 6px;
          letter-spacing: 2px;
        }
        
        .total-amount {
          font-size: 18px;
          font-weight: bold;
          word-wrap: break-word;
          overflow-wrap: break-word;
          letter-spacing: 1px;
        }

        .receipt-notes {
          margin: 6px 0;
          font-size: 9px;
          padding: 3px 0;
          text-align: center;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: pre-wrap;
        }

        .receipt-transaction-type {
          margin: 6px 0;
          font-size: 10px;
          padding: 3px 0;
          text-align: center;
        }

        .receipt-footer {
          margin-top: 10px;
          border-top: 2px solid #000;
          padding-top: 6px;
        }

        .receipt-signature {
          text-align: center;
          margin: 8px 0;
          font-size: 10px;
        }

        .signature-line {
          margin: 6px auto 3px auto;
          border-bottom: 1px solid #000;
          width: 60%;
        }

        .receipt-thank-you {
          text-align: center;
          font-size: 13px;
          font-weight: bold;
          margin: 8px 0 6px 0;
        }

        .receipt-legal {
          text-align: center;
          font-size: 8px;
          margin: 6px 0 4px 0;
        }

        .receipt-warning {
          text-align: center;
          font-weight: bold;
          font-size: 11px;
          margin: 8px 0;
        }

        /* Print-specific adjustments */
        @media print {
          .thermal-receipt {
            width: 80mm;
            padding: 0;
            margin: 0;
            font-size: 11px;
          }

          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
    </>
  );
}