import { useEffect, useState } from "react";

interface ChipDenomination {
  [key: string]: number;
}

interface ThermalReceiptDualProps {
  type: "cage-operation" | "buy-in" | "cash-transaction" | "vault-transfer" | "float";
  data: any;
  propertyName?: string;
  onPrintComplete?: () => void;
}

export function ThermalReceiptDual({ type, data, propertyName, onPrintComplete }: ThermalReceiptDualProps) {
  const [askForSecondPrint, setAskForSecondPrint] = useState(false);

  // Suppress unused variable warning - type is kept for props validation
  void type;

  useEffect(() => {
    // Auto-print after component mounts - prints ONLY ONE copy
    const timer = setTimeout(() => {
      window.print();
      
      // After first print, ask if user wants to print again
      setTimeout(() => {
        setAskForSecondPrint(true);
      }, 1000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  
  const handlePrintAgain = () => {
    window.print();
    setAskForSecondPrint(false);
    if (onPrintComplete) {
      onPrintComplete();
    }
  };
  
  const handleClose = () => {
    setAskForSecondPrint(false);
    if (onPrintComplete) {
      onPrintComplete();
    }
  };

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

  const renderFloat = () => (
    <>
      <div className="receipt-title">FLOAT TRANSACTION</div>
      <div className="receipt-subtitle">{data.type}</div>
      <div className="receipt-divider">----------------------------------------</div>
      
      <div className="receipt-info">
        <div>Date/Time: {formatDateTime(data.timestamp)}</div>
        <div>Receipt #: {formatReceiptId(data.id)}</div>
        {data.tableName && <div>Table: {data.tableName}</div>}
      </div>

      <div className="receipt-divider">----------------------------------------</div>

      {data.chips && Object.keys(data.chips).length > 0 && (
        <>
          <div className="receipt-section-title">CHIP BREAKDOWN</div>
          {renderChipBreakdown(data.chips, data.currency || "FCFA")}
        </>
      )}

      <div className="receipt-divider">----------------------------------------</div>
      
      <div className="receipt-total">
        <div className="total-label">TOTAL:</div>
        <div className="total-amount">{getCurrencySymbol(data.currency || "FCFA")}{data.amount.toLocaleString()}</div>
      </div>

      <div className="receipt-divider">----------------------------------------</div>

      {/* Transaction Type */}
      <div className="receipt-transaction-type">
        <div style={{ fontWeight: 'bold' }}>TRANSACTION TYPE:</div>
        <div>{data.type || 'N/A'}</div>
      </div>

      <div className="receipt-divider">----------------------------------------</div>

      {/* Staff Information */}
      <div className="receipt-info">
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>STAFF INFORMATION:</div>
        {data.dealerName && <div>Dealer: {data.dealerName}</div>}
        {data.inspectorName && <div>Inspector: {data.inspectorName}</div>}
        {data.pitBoss && <div>Pit Boss: {data.pitBoss}</div>}
      </div>

      {data.notes && (
        <>
          <div className="receipt-divider">----------------------------------------</div>
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
      <div className="thermal-receipts-container">
        {/* Single Receipt - Only print 1 copy */}
        <div className="thermal-receipt">
          <div className="receipt-header">
            <div className="receipt-logo">{propertyName || "MF-INTEL CMS"}</div>
            <div className="receipt-casino">GAMING IQ</div>
          </div>

          <div className="receipt-body">
            {renderFloat()}
          </div>

          <div className="receipt-footer">
            <div className="receipt-divider">----------------------------------------</div>
            
            {/* Inspector Field (previously "Requested By") */}
            <div className="receipt-signature">
              <div style={{ fontWeight: 'bold' }}>Inspector:</div>
              <div className="signature-line">_____________________</div>
              <div style={{ marginTop: '4px' }}>{data.inspectorName || 'N/A'}</div>
            </div>

            <div className="receipt-divider" style={{ margin: '8px 0' }}>----------------------------------------</div>

            {/* Dealer Field (previously "Approved By") */}
            <div className="receipt-signature">
              <div style={{ fontWeight: 'bold' }}>Dealer:</div>
              <div className="signature-line">_____________________</div>
              <div style={{ marginTop: '4px' }}>{data.dealerName || 'N/A'}</div>
            </div>

            <div className="receipt-divider" style={{ marginTop: '12px' }}>----------------------------------------</div>
            <div className="receipt-thank-you">Thank You!</div>
            <div className="receipt-legal">
              Official Receipt - Keep for Records
            </div>
          </div>
        </div>
      </div>

      {/* Ask for second print dialog */}
      {askForSecondPrint && (
        <div className="print-dialog">
          <div className="dialog-content">
            <div className="dialog-title">Print Again?</div>
            <div className="dialog-message">Do you want to print another copy?</div>
            <div className="dialog-buttons">
              <button className="dialog-button" onClick={handlePrintAgain}>Print Again</button>
              <button className="dialog-button" onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Thermal Printer Styles */}
      <style>{`
        /* Hide everything except receipts when printing */
        @media print {
          body * {
            visibility: hidden;
          }
          .thermal-receipts-container,
          .thermal-receipts-container * {
            visibility: visible;
          }
          .thermal-receipts-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          
          .page-break {
            page-break-after: always;
            height: 0;
            margin: 0;
            padding: 0;
          }
        }

        .thermal-receipts-container {
          width: 100%;
        }

        /* Receipt styling for 80mm thermal printer */
        .thermal-receipt {
          width: 80mm;
          max-width: 80mm;
          min-width: 80mm;
          font-family: 'Courier New', Courier, monospace;
          font-size: 13px;
          line-height: 1.6;
          color: #000;
          background: #fff;
          padding: 2mm 1mm;
          margin: 0 auto 20px auto;
          box-sizing: border-box;
        }

        .receipt-header {
          text-align: center;
          margin-bottom: 10px;
          border-bottom: 3px solid #000;
          padding-bottom: 8px;
          width: 100%;
        }

        .receipt-logo {
          font-size: 22px;
          font-weight: bold;
          letter-spacing: 2px;
        }

        .receipt-casino {
          font-size: 15px;
          font-weight: bold;
          margin-top: 4px;
        }

        .receipt-body {
          margin: 10px 0;
          width: 100%;
        }

        .receipt-title {
          text-align: center;
          font-size: 17px;
          font-weight: bold;
          margin: 8px 0;
          letter-spacing: 1px;
        }

        .receipt-subtitle {
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 6px;
        }

        .receipt-divider {
          margin: 8px 0;
          font-size: 12px;
          white-space: nowrap;
          text-align: left;
          width: 100%;
          overflow: visible;
        }

        .receipt-info {
          margin: 10px 0;
          font-size: 12px;
          text-align: center;
        }

        .receipt-info > div {
          margin: 4px 0;
        }

        .copy-number {
          font-weight: bold;
          margin-top: 8px !important;
          font-size: 13px !important;
        }

        .receipt-section-title {
          font-weight: bold;
          margin: 10px 0 6px 0;
          font-size: 13px;
          text-align: center;
          text-decoration: underline;
        }

        .receipt-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 4px 0;
          font-size: 13px;
          padding: 0 2px;
        }

        .receipt-item {
          flex: 0 0 140px;
          text-align: left;
          font-weight: 600;
        }

        .receipt-qty {
          flex: 0 0 60px;
          text-align: center;
          font-weight: normal;
        }

        .receipt-amount {
          flex: 1;
          text-align: right;
          font-weight: 600;
          min-width: 120px;
        }

        .receipt-total {
          display: block;
          text-align: center;
          font-weight: bold;
          margin: 15px 0;
          padding: 12px 0;
          background: #f0f0f0;
          border: 3px solid #000;
          width: 100%;
        }
        
        .total-label {
          font-size: 15px;
          font-weight: bold;
          margin-bottom: 8px;
          letter-spacing: 3px;
        }
        
        .total-amount {
          font-size: 24px;
          font-weight: bold;
          word-wrap: break-word;
          overflow-wrap: break-word;
          letter-spacing: 1px;
        }

        .receipt-notes {
          margin: 8px 0;
          font-size: 11px;
          padding: 4px 0;
          text-align: center;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: pre-wrap;
        }

        .receipt-transaction-type {
          margin: 8px 0;
          font-size: 12px;
          padding: 4px 0;
          text-align: center;
        }

        .receipt-footer {
          margin-top: 12px;
          border-top: 3px solid #000;
          padding-top: 8px;
          width: 100%;
        }

        .receipt-signature {
          text-align: center;
          margin: 10px 0;
          font-size: 12px;
        }

        .signature-line {
          margin: 8px auto 4px auto;
          border-bottom: 2px solid #000;
          width: 80%;
        }

        .receipt-thank-you {
          text-align: center;
          font-size: 17px;
          font-weight: bold;
          margin: 10px 0 8px 0;
        }

        .receipt-legal {
          text-align: center;
          font-size: 10px;
          margin: 8px 0 6px 0;
        }

        /* Print-specific adjustments */
        @media print {
          .thermal-receipt {
            width: 80mm;
            min-width: 80mm;
            max-width: 80mm;
            padding: 1mm;
            margin: 0;
            font-size: 13px;
          }

          .receipt-line {
            width: 100% !important;
          }

          .receipt-body,
          .receipt-header,
          .receipt-footer {
            width: 100% !important;
          }

          @page {
            size: 80mm auto;
            margin: 0;
          }
        }

        /* Print Dialog Styles */
        .print-dialog {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }

        .dialog-content {
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          max-width: 400px;
          width: 90%;
        }

        .dialog-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 12px;
          color: #1e293b;
        }

        .dialog-message {
          font-size: 14px;
          margin-bottom: 20px;
          color: #475569;
        }

        .dialog-buttons {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .dialog-button {
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dialog-button:first-child {
          background: #3b82f6;
          color: white;
        }

        .dialog-button:first-child:hover {
          background: #2563eb;
        }

        .dialog-button:last-child {
          background: #e2e8f0;
          color: #475569;
        }

        .dialog-button:last-child:hover {
          background: #cbd5e1;
        }

        @media print {
          .print-dialog {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}