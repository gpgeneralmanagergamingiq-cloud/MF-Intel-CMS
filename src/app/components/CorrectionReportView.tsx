import { X, FileText, AlertTriangle, Printer } from "lucide-react";
import { useEffect } from "react";

interface ChipDenomination {
  [key: string]: number;
}

interface CorrectionReport {
  id: string;
  floatId: string;
  tableName: string;
  originalAmount: number;
  correctedAmount: number;
  originalChips: ChipDenomination;
  correctedChips: ChipDenomination;
  reason: string;
  correctedBy: string;
  timestamp: string;
}

interface CorrectionReportViewProps {
  report: CorrectionReport;
  onClose: () => void;
}

export function CorrectionReportView({ report, onClose }: CorrectionReportViewProps) {
  useEffect(() => {
    // Auto-print when component mounts
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const difference = report.correctedAmount - report.originalAmount;

  return (
    <>
      {/* Close button - only visible on screen, not in print */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:hidden">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-red-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-xl font-bold">Opening Float Correction Report</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-red-700 p-1 rounded transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <CorrectionReportContent report={report} difference={difference} />
          </div>
        </div>
      </div>

      {/* Print version - hidden on screen, only shows when printing */}
      <div className="hidden print:block">
        <CorrectionReportContent report={report} difference={difference} isPrint />
      </div>
    </>
  );
}

function CorrectionReportContent({ 
  report, 
  difference, 
  isPrint = false 
}: { 
  report: CorrectionReport; 
  difference: number; 
  isPrint?: boolean;
}) {
  return (
    <div style={isPrint ? { 
      padding: '1cm',
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      color: '#000'
    } : undefined}>
      {/* Header */}
      <div style={isPrint ? { 
        textAlign: 'center',
        marginBottom: '1cm',
        borderBottom: '2px solid #dc2626',
        paddingBottom: '0.5cm'
      } : { 
        textAlign: 'center',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #dc2626'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.75rem',
          marginBottom: '0.5rem'
        }}>
          {!isPrint && <AlertTriangle className="w-8 h-8 text-red-600" />}
          <h1 style={{ 
            fontSize: isPrint ? '20px' : '1.5rem',
            fontWeight: 'bold',
            color: '#dc2626',
            margin: 0
          }}>
            OPENING FLOAT CORRECTION REPORT
          </h1>
        </div>
        <p style={{ 
          fontSize: isPrint ? '11px' : '0.875rem',
          color: '#991b1b',
          margin: 0
        }}>
          Official Documentation of Float Adjustment
        </p>
      </div>

      {/* Report Details */}
      <div style={isPrint ? { 
        marginBottom: '0.8cm',
        padding: '0.4cm',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '4px'
      } : {
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '0.5rem'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: isPrint ? '0.3cm' : '1rem'
        }}>
          <div>
            <p style={{ 
              fontSize: isPrint ? '10px' : '0.75rem',
              color: '#7f1d1d',
              fontWeight: '600',
              marginBottom: isPrint ? '0.1cm' : '0.25rem'
            }}>
              Report ID
            </p>
            <p style={{ 
              fontSize: isPrint ? '11px' : '0.875rem',
              color: '#1f2937',
              margin: 0
            }}>
              {report.id}
            </p>
          </div>
          <div>
            <p style={{ 
              fontSize: isPrint ? '10px' : '0.75rem',
              color: '#7f1d1d',
              fontWeight: '600',
              marginBottom: isPrint ? '0.1cm' : '0.25rem'
            }}>
              Date & Time
            </p>
            <p style={{ 
              fontSize: isPrint ? '11px' : '0.875rem',
              color: '#1f2937',
              margin: 0
            }}>
              {new Date(report.timestamp).toLocaleString()}
            </p>
          </div>
          <div>
            <p style={{ 
              fontSize: isPrint ? '10px' : '0.75rem',
              color: '#7f1d1d',
              fontWeight: '600',
              marginBottom: isPrint ? '0.1cm' : '0.25rem'
            }}>
              Table Name
            </p>
            <p style={{ 
              fontSize: isPrint ? '11px' : '0.875rem',
              color: '#1f2937',
              fontWeight: 'bold',
              margin: 0
            }}>
              {report.tableName}
            </p>
          </div>
          <div>
            <p style={{ 
              fontSize: isPrint ? '10px' : '0.75rem',
              color: '#7f1d1d',
              fontWeight: '600',
              marginBottom: isPrint ? '0.1cm' : '0.25rem'
            }}>
              Corrected By
            </p>
            <p style={{ 
              fontSize: isPrint ? '11px' : '0.875rem',
              color: '#1f2937',
              fontWeight: 'bold',
              margin: 0
            }}>
              {report.correctedBy}
            </p>
          </div>
        </div>
      </div>

      {/* Amounts Comparison */}
      <div style={isPrint ? { 
        marginBottom: '0.8cm',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '0.4cm'
      } : {
        marginBottom: '1.5rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '1rem'
      }}>
        <div style={isPrint ? { 
          padding: '0.4cm',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '4px'
        } : {
          padding: '1rem',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem'
        }}>
          <p style={{ 
            fontSize: isPrint ? '10px' : '0.75rem',
            color: '#4b5563',
            marginBottom: isPrint ? '0.2cm' : '0.5rem'
          }}>
            Original Amount
          </p>
          <p style={{ 
            fontSize: isPrint ? '16px' : '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
          }}>
            CFA {report.originalAmount.toLocaleString()}
          </p>
        </div>

        <div style={isPrint ? { 
          padding: '0.4cm',
          backgroundColor: difference >= 0 ? '#dcfce7' : '#fee2e2',
          border: `1px solid ${difference >= 0 ? '#86efac' : '#fecaca'}`,
          borderRadius: '4px'
        } : {
          padding: '1rem',
          backgroundColor: difference >= 0 ? '#dcfce7' : '#fee2e2',
          border: `1px solid ${difference >= 0 ? '#86efac' : '#fecaca'}`,
          borderRadius: '0.5rem'
        }}>
          <p style={{ 
            fontSize: isPrint ? '10px' : '0.75rem',
            color: difference >= 0 ? '#166534' : '#991b1b',
            marginBottom: isPrint ? '0.2cm' : '0.5rem'
          }}>
            Corrected Amount
          </p>
          <p style={{ 
            fontSize: isPrint ? '16px' : '1.5rem',
            fontWeight: 'bold',
            color: difference >= 0 ? '#166534' : '#991b1b',
            margin: 0
          }}>
            CFA {report.correctedAmount.toLocaleString()}
          </p>
        </div>

        <div style={isPrint ? { 
          padding: '0.4cm',
          backgroundColor: difference >= 0 ? '#dcfce7' : '#fee2e2',
          border: `2px solid ${difference >= 0 ? '#16a34a' : '#dc2626'}`,
          borderRadius: '4px'
        } : {
          padding: '1rem',
          backgroundColor: difference >= 0 ? '#dcfce7' : '#fee2e2',
          border: `2px solid ${difference >= 0 ? '#16a34a' : '#dc2626'}`,
          borderRadius: '0.5rem'
        }}>
          <p style={{ 
            fontSize: isPrint ? '10px' : '0.75rem',
            color: difference >= 0 ? '#166534' : '#991b1b',
            fontWeight: '600',
            marginBottom: isPrint ? '0.2cm' : '0.5rem'
          }}>
            Difference
          </p>
          <p style={{ 
            fontSize: isPrint ? '16px' : '1.5rem',
            fontWeight: 'bold',
            color: difference >= 0 ? '#16a34a' : '#dc2626',
            margin: 0
          }}>
            {difference >= 0 ? '+' : ''}CFA {difference.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chip Breakdown Comparison */}
      <div style={isPrint ? { 
        marginBottom: '0.8cm'
      } : {
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ 
          fontSize: isPrint ? '13px' : '1.125rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: isPrint ? '0.3cm' : '0.75rem'
        }}>
          Chip Count Comparison
        </h3>
        <div style={isPrint ? { 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.4cm'
        } : {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem'
        }}>
          {/* Original Chips */}
          <div style={isPrint ? { 
            padding: '0.4cm',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: '#f9fafb'
          } : {
            padding: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb'
          }}>
            <p style={{ 
              fontSize: isPrint ? '11px' : '0.875rem',
              fontWeight: '600',
              color: '#4b5563',
              marginBottom: isPrint ? '0.3cm' : '0.75rem'
            }}>
              Original Chip Count
            </p>
            <div style={{ 
              fontSize: isPrint ? '10px' : '0.75rem',
              color: '#1f2937'
            }}>
              {Object.entries(report.originalChips)
                .filter(([_, count]) => count > 0)
                .map(([denom, count]) => (
                  <div key={denom} style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: isPrint ? '0.1cm 0' : '0.25rem 0',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <span>CFA {parseInt(denom).toLocaleString()}</span>
                    <span style={{ fontWeight: '600' }}>{count} chips</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Corrected Chips */}
          <div style={isPrint ? { 
            padding: '0.4cm',
            border: '2px solid #dc2626',
            borderRadius: '4px',
            backgroundColor: '#fef2f2'
          } : {
            padding: '1rem',
            border: '2px solid #dc2626',
            borderRadius: '0.5rem',
            backgroundColor: '#fef2f2'
          }}>
            <p style={{ 
              fontSize: isPrint ? '11px' : '0.875rem',
              fontWeight: '600',
              color: '#991b1b',
              marginBottom: isPrint ? '0.3cm' : '0.75rem'
            }}>
              Corrected Chip Count
            </p>
            <div style={{ 
              fontSize: isPrint ? '10px' : '0.75rem',
              color: '#1f2937'
            }}>
              {Object.entries(report.correctedChips)
                .filter(([_, count]) => count > 0)
                .map(([denom, count]) => {
                  const originalCount = report.originalChips[denom] || 0;
                  const changed = count !== originalCount;
                  return (
                    <div key={denom} style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: isPrint ? '0.1cm 0' : '0.25rem 0',
                      borderBottom: '1px solid #fecaca',
                      backgroundColor: changed ? '#fee2e2' : 'transparent',
                      paddingLeft: changed ? (isPrint ? '0.2cm' : '0.5rem') : 0,
                      paddingRight: changed ? (isPrint ? '0.2cm' : '0.5rem') : 0,
                      fontWeight: changed ? '700' : 'normal'
                    }}>
                      <span>CFA {parseInt(denom).toLocaleString()}</span>
                      <span style={{ 
                        fontWeight: '600',
                        color: changed ? '#dc2626' : 'inherit'
                      }}>
                        {count} chips {changed && `(was ${originalCount})`}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Reason for Correction */}
      <div style={isPrint ? { 
        marginBottom: '0.8cm',
        padding: '0.4cm',
        backgroundColor: '#fffbeb',
        border: '2px solid #fbbf24',
        borderRadius: '4px'
      } : {
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#fffbeb',
        border: '2px solid #fbbf24',
        borderRadius: '0.5rem'
      }}>
        <p style={{ 
          fontSize: isPrint ? '11px' : '0.875rem',
          fontWeight: '600',
          color: '#78350f',
          marginBottom: isPrint ? '0.2cm' : '0.5rem'
        }}>
          Reason for Correction:
        </p>
        <p style={{ 
          fontSize: isPrint ? '11px' : '0.875rem',
          color: '#1f2937',
          lineHeight: 1.6,
          margin: 0
        }}>
          {report.reason}
        </p>
      </div>

      {/* Signatures */}
      <div style={isPrint ? { 
        marginTop: '1.5cm',
        paddingTop: '0.5cm',
        borderTop: '1px solid #d1d5db'
      } : {
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid #d1d5db'
      }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: isPrint ? '2cm' : '2rem'
        }}>
          <div>
            <p style={{ 
              fontSize: isPrint ? '10px' : '0.75rem',
              color: '#6b7280',
              marginBottom: isPrint ? '1cm' : '2rem'
            }}>
              Corrected By:
            </p>
            <div style={{ 
              borderTop: '1px solid #000',
              paddingTop: isPrint ? '0.2cm' : '0.5rem'
            }}>
              <p style={{ 
                fontSize: isPrint ? '11px' : '0.875rem',
                fontWeight: '600',
                margin: 0
              }}>
                {report.correctedBy}
              </p>
              <p style={{ 
                fontSize: isPrint ? '9px' : '0.75rem',
                color: '#6b7280',
                margin: 0
              }}>
                Pit Boss / Supervisor
              </p>
            </div>
          </div>

          <div>
            <p style={{ 
              fontSize: isPrint ? '10px' : '0.75rem',
              color: '#6b7280',
              marginBottom: isPrint ? '1cm' : '2rem'
            }}>
              Verified By:
            </p>
            <div style={{ 
              borderTop: '1px solid #000',
              paddingTop: isPrint ? '0.2cm' : '0.5rem'
            }}>
              <p style={{ 
                fontSize: isPrint ? '11px' : '0.875rem',
                fontWeight: '600',
                margin: 0
              }}>
                _________________________
              </p>
              <p style={{ 
                fontSize: isPrint ? '9px' : '0.75rem',
                color: '#6b7280',
                margin: 0
              }}>
                Management / Inspector
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={isPrint ? { 
        marginTop: '1cm',
        paddingTop: '0.3cm',
        borderTop: '1px solid #d1d5db',
        textAlign: 'center',
        fontSize: '9px',
        color: '#6b7280'
      } : {
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid #d1d5db',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: '#6b7280'
      }}>
        <p style={{ margin: 0 }}>
          This is an official correction report. All changes are logged and auditable.
        </p>
        <p style={{ margin: 0 }}>
          Report generated on {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}
