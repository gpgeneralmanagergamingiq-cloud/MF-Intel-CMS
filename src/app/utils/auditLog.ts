import { projectId, publicAnonKey } from "/utils/supabase/info";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  username: string;
  userType: string;
  action: string;
  module: string;
  details: string;
  propertyName: string;
  ipAddress?: string;
}

/**
 * Log an action to the audit log
 */
export async function logAction(
  username: string,
  userType: string,
  action: string,
  module: string,
  details: string,
  propertyName: string
) {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-68939c29/audit-logs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          username,
          userType,
          action,
          module,
          details,
          propertyName,
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to log action:", await response.text());
    }
  } catch (error) {
    console.error("Error logging action:", error);
  }
}

/**
 * Get all audit logs
 */
export async function getAuditLogs(propertyName: string): Promise<AuditLogEntry[]> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-68939c29/audit-logs?property=${encodeURIComponent(propertyName)}`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch audit logs");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }
}

/**
 * Export audit logs to CSV
 */
export function exportLogsToCSV(logs: AuditLogEntry[], filename: string = "audit-logs.csv") {
  // Create CSV header
  const headers = ["Timestamp", "Username", "User Type", "Action", "Module", "Details", "Property"];
  
  // Create CSV rows
  const rows = logs.map(log => [
    new Date(log.timestamp).toLocaleString(),
    log.username,
    log.userType,
    log.action,
    log.module,
    `"${log.details.replace(/"/g, '""')}"`, // Escape quotes in details
    log.propertyName,
  ]);

  // Combine header and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
