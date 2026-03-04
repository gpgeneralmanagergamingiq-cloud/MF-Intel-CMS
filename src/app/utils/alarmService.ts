import emailjs from "@emailjs/browser";

interface AlarmEmailData {
  playerName: string;
  tableName: string;
  game: string;
  buyInAmount: number;
  averageBet: number;
  currency: string;
}

// Check if a rating triggers the big player alarm
export function checkBigPlayerAlarm(
  averageBet: number,
  buyInAmount: number
): boolean {
  // Alarm triggers if:
  // 1. Average bet > 500,000 OR
  // 2. Buy In > 5,000,000
  return averageBet > 500000 || buyInAmount > 5000000;
}

// Send alarm email to all users with email addresses (Owner and Management)
export async function sendBigPlayerAlarm(data: AlarmEmailData): Promise<void> {
  // Get email configuration
  const emailConfig = localStorage.getItem("casino_email_config");
  if (!emailConfig) {
    console.log("Email configuration not set. Skipping alarm email.");
    return;
  }

  const config = JSON.parse(emailConfig);
  if (!config.serviceId || !config.publicKey) {
    console.log("EmailJS not configured. Skipping alarm email.");
    return;
  }

  // Get all users with email addresses (Owner and Management roles)
  const usersData = localStorage.getItem("casino_users");
  if (!usersData) {
    console.log("No users found. Skipping alarm email.");
    return;
  }

  const users = JSON.parse(usersData);
  const recipientUsers = users.filter(
    (user: any) =>
      (user.userType === "Owner" || user.userType === "Management") &&
      user.email &&
      user.status === "Active"
  );

  if (recipientUsers.length === 0) {
    console.log("No Owner/Management users with email addresses. Skipping alarm email.");
    return;
  }

  // Format currency symbol
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "FCFA":
        return "CFA ";
      case "PHP":
        return "₱";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "CNY":
      case "JPY":
        return "¥";
      case "KRW":
        return "₩";
      default:
        return "$";
    }
  };

  const currencySymbol = getCurrencySymbol(data.currency);

  // Create email body
  const emailBody = `
🚨 BIG PLAYER ALERT 🚨

A high-value player has been detected on the floor!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLAYER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Player Name:     ${data.playerName}
Table Number:    ${data.tableName}
Game:            ${data.game}

Buy In Amount:   ${currencySymbol}${data.buyInAmount.toLocaleString()}
Average Bet:     ${currencySymbol}${data.averageBet.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Time: ${new Date().toLocaleString()}

This player has exceeded the thresholds for high-value activity.
Please ensure appropriate attention and service.

─────────────────────────────────────
MF-Intel CMS for Gaming IQ
Automated Alert System
  `.trim();

  // Initialize EmailJS
  emailjs.init(config.publicKey);

  // Send email to each recipient
  const emailPromises = recipientUsers.map((user: any) => {
    const templateParams = {
      to_email: user.email,
      to_name: user.username,
      subject: "Alarm - Big Player",
      message: emailBody,
      player_name: data.playerName,
      table_name: data.tableName,
      game: data.game,
      buy_in: `${currencySymbol}${data.buyInAmount.toLocaleString()}`,
      average_bet: `${currencySymbol}${data.averageBet.toLocaleString()}`,
      timestamp: new Date().toLocaleString(),
    };

    return emailjs
      .send(config.serviceId, config.templateId, templateParams)
      .then((response) => {
        console.log(
          `Alarm email sent successfully to ${user.email}`,
          response.status,
          response.text
        );
        return { success: true, email: user.email };
      })
      .catch((error) => {
        console.error(`Failed to send alarm email to ${user.email}:`, error);
        return { success: false, email: user.email, error };
      });
  });

  // Wait for all emails to be sent
  try {
    const results = await Promise.all(emailPromises);
    const successCount = results.filter((r) => r.success).length;
    console.log(
      `Big Player Alarm: Sent ${successCount}/${results.length} emails successfully`
    );
  } catch (error) {
    console.error("Error sending alarm emails:", error);
  }
}

// Track which ratings have already triggered alarms to avoid duplicates
const sentAlarms = new Set<string>();

export function markAlarmSent(ratingId: string): void {
  sentAlarms.add(ratingId);
}

export function hasAlarmBeenSent(ratingId: string): boolean {
  return sentAlarms.has(ratingId);
}

// Clear alarm tracking (e.g., on app restart)
export function clearAlarmTracking(): void {
  sentAlarms.clear();
}
