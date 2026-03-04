import emailjs from "@emailjs/browser";

interface EmailSettings {
  serviceId: string;
  templateId: string;
  publicKey: string;
  enabled: boolean;
}

interface TablePerformance {
  tableName: string;
  drop: number;
  winLoss: number;
  holdPercentage: number;
}

export function getEmailSettings(): EmailSettings | null {
  const saved = localStorage.getItem("casino_email_settings");
  if (!saved) return null;
  
  const settings = JSON.parse(saved);
  
  // Validate that all required fields are present
  if (!settings.enabled || !settings.serviceId || !settings.templateId || !settings.publicKey) {
    return null;
  }
  
  return settings;
}

export function generateCSV(data: TablePerformance[]): string {
  // CSV Header
  let csv = "Table Name,Drop (CFA),Win/Loss (CFA),Hold %\n";
  
  // CSV Data Rows
  data.forEach((row) => {
    csv += `"${row.tableName}",${row.drop},${row.winLoss},${row.holdPercentage.toFixed(2)}%\n`;
  });
  
  return csv;
}

export function generateSummary(data: TablePerformance[]): string {
  const totalDrop = data.reduce((sum, row) => sum + row.drop, 0);
  const totalWinLoss = data.reduce((sum, row) => sum + row.winLoss, 0);
  const avgHold = totalDrop > 0 ? (totalWinLoss / totalDrop) * 100 : 0;
  
  return `Total Tables: ${data.length}
Total Drop: CFA ${totalDrop.toLocaleString()}
Total Win/Loss: CFA ${totalWinLoss.toLocaleString()}
Average Hold: ${avgHold.toFixed(2)}%`;
}

export async function sendEndOfDayEmail(
  recipientEmail: string,
  shiftDate: string,
  tableData: TablePerformance[]
): Promise<{ success: boolean; error?: string }> {
  const settings = getEmailSettings();
  
  if (!settings) {
    return {
      success: false,
      error: "Email settings not configured. Please configure email settings in Setup tab.",
    };
  }
  
  try {
    const csvData = generateCSV(tableData);
    const summary = generateSummary(tableData);
    
    const templateParams = {
      to_email: recipientEmail,
      shift_date: shiftDate,
      csv_data: csvData,
      summary: summary,
    };
    
    // Initialize EmailJS with public key
    emailjs.init(settings.publicKey);
    
    // Send email
    const response = await emailjs.send(
      settings.serviceId,
      settings.templateId,
      templateParams
    );
    
    if (response.status === 200) {
      return { success: true };
    } else {
      return {
        success: false,
        error: `Email service returned status ${response.status}`,
      };
    }
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export async function sendEndOfDayReportToManagement(
  tableData: TablePerformance[],
  shiftDate: string
): Promise<{ sent: string[]; failed: string[]; downloaded: boolean }> {
  // Get all users
  const savedUsers = localStorage.getItem("casino_users");
  if (!savedUsers) {
    return { sent: [], failed: [], downloaded: false };
  }
  
  const users = JSON.parse(savedUsers);
  
  // Filter Owner and Management with email addresses
  const managementUsers = users.filter(
    (u: any) =>
      (u.userType === "Owner" || u.userType === "Management") &&
      u.email &&
      u.status === "Active"
  );
  
  if (managementUsers.length === 0) {
    console.warn("No Owner/Management users with email addresses found");
    return { sent: [], failed: [], downloaded: false };
  }
  
  // Check if email is configured
  const settings = getEmailSettings();
  const sent: string[] = [];
  const failed: string[] = [];
  
  if (settings) {
    // Send emails to all management users
    for (const user of managementUsers) {
      const result = await sendEndOfDayEmail(user.email, shiftDate, tableData);
      
      if (result.success) {
        sent.push(user.email);
      } else {
        failed.push(user.email);
        console.error(`Failed to send email to ${user.email}:`, result.error);
      }
    }
  } else {
    // Email not configured, mark all as failed
    managementUsers.forEach((u: any) => failed.push(u.email));
  }
  
  // If any failed or email not configured, provide CSV download as fallback
  let downloaded = false;
  if (failed.length > 0 || !settings) {
    const csvContent = generateCSV(tableData);
    const filename = `end_of_day_report_${shiftDate.replace(/\//g, "-")}.csv`;
    downloadCSV(csvContent, filename);
    downloaded = true;
  }
  
  return { sent, failed, downloaded };
}
