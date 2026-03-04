import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

export type UserType = 'Management' | 'Pit Manager' | 'Dealer' | 'Inspector' | 'Cashier' | 'Marketing';

export function generateUserGuide(userType: UserType) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 20;

  // Header
  doc.setFontSize(24);
  doc.setTextColor(31, 41, 55); // slate-800
  doc.text('MF-Intel CMS for Gaming IQ', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(16);
  doc.setTextColor(59, 130, 246); // blue-500
  doc.text(`${userType} User Guide`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 5;
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Version 2.1.8 | Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;

  // Add horizontal line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.line(15, yPosition, pageWidth - 15, yPosition);
  yPosition += 10;

  // Content based on user type
  const content = getUserGuideContent(userType);

  // Table of Contents
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Table of Contents', 15, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  content.sections.forEach((section, index) => {
    doc.setTextColor(59, 130, 246);
    doc.text(`${index + 1}. ${section.title}`, 20, yPosition);
    yPosition += 6;
  });

  // Add page break
  doc.addPage();
  yPosition = 20;

  // Sections
  content.sections.forEach((section, index) => {
    // Section Header
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text(`${index + 1}. ${section.title}`, 15, yPosition);
    yPosition += 8;

    // Section Content
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105); // slate-600
    
    if (section.description) {
      const lines = doc.splitTextToSize(section.description, pageWidth - 30);
      doc.text(lines, 15, yPosition);
      yPosition += lines.length * 6 + 5;
    }

    // Steps
    if (section.steps && section.steps.length > 0) {
      section.steps.forEach((step, stepIndex) => {
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setTextColor(59, 130, 246);
        doc.setFont(undefined, 'bold');
        doc.text(`Step ${stepIndex + 1}:`, 20, yPosition);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(71, 85, 105);
        
        const stepLines = doc.splitTextToSize(step, pageWidth - 40);
        doc.text(stepLines, 45, yPosition);
        yPosition += stepLines.length * 6 + 3;
      });
      yPosition += 5;
    }

    // Tips
    if (section.tips && section.tips.length > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      doc.setTextColor(16, 185, 129); // emerald-500
      doc.setFont(undefined, 'bold');
      doc.text('💡 Tips:', 20, yPosition);
      doc.setFont(undefined, 'normal');
      yPosition += 7;

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      section.tips.forEach((tip) => {
        const tipLines = doc.splitTextToSize(`• ${tip}`, pageWidth - 40);
        doc.text(tipLines, 25, yPosition);
        yPosition += tipLines.length * 6 + 2;
      });
      yPosition += 5;
    }

    // Tables
    if (section.table) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      autoTable(doc, {
        startY: yPosition,
        head: [section.table.headers],
        body: section.table.rows,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        margin: { left: 20, right: 20 },
      });
      yPosition = doc.lastAutoTable.finalY + 10;
    }

    yPosition += 5;

    // Add page break between major sections
    if (index < content.sections.length - 1 && yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
  });

  // Footer on last page
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `Page ${i} of ${pageCount} | MF-Intel CMS © ${new Date().getFullYear()}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  doc.save(`MF-Intel-CMS-${userType.replace(' ', '-')}-Guide.pdf`);
}

interface Section {
  title: string;
  description?: string;
  steps?: string[];
  tips?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
}

interface GuideContent {
  sections: Section[];
}

function getUserGuideContent(userType: UserType): GuideContent {
  const commonSections: Section[] = [
    {
      title: 'Getting Started',
      description: 'Welcome to MF-Intel CMS for Gaming IQ. This comprehensive casino management system helps you efficiently manage all casino operations.',
      steps: [
        'Open your web browser and navigate to the MF-Intel CMS application',
        'Select your property from the dropdown menu',
        'Enter your username and password (default: admin/admin123)',
        'Click "Sign In" to access the system',
      ],
      tips: [
        'Change your password after first login for security',
        'Bookmark the application URL for quick access',
        'Always log out when finished to protect sensitive data',
      ],
    },
    {
      title: 'Navigation & Interface',
      description: 'The system features a user-friendly navigation bar with role-based access.',
      steps: [
        'Use the top navigation bar to switch between different modules',
        'Click on your username in the top-right corner to access settings',
        'Use the Help button (?) for instant assistance on any page',
        'The system displays your current property and user type at all times',
      ],
    },
  ];

  switch (userType) {
    case 'Management':
      return {
        sections: [
          ...commonSections,
          {
            title: 'Dashboard Overview',
            description: 'Management has full access to all features and analytics.',
            steps: [
              'View real-time statistics on active tables and total revenue',
              'Monitor all active player ratings across all tables',
              'Access comprehensive reports and analytics',
              'Manage users, players, and system settings',
            ],
          },
          {
            title: 'Player Management',
            description: 'Add, edit, and manage player information.',
            steps: [
              'Navigate to the "Players" section',
              'Click "Add New Player" to register a new player',
              'Fill in player details including name, contact, and tier',
              'Click "Save" to add the player to the system',
              'Edit existing players by clicking the edit icon',
              'View player history and statistics by clicking on their name',
            ],
            tips: [
              'Keep player information up to date for accurate comp calculations',
              'Use the search function to quickly find players',
              'Assign appropriate player tiers for comp tracking',
            ],
          },
          {
            title: 'Ratings System',
            description: 'Monitor and manage all player ratings across the casino floor.',
            steps: [
              'Navigate to the "Ratings" section',
              'View all active ratings in real-time',
              'Click "Start Rating" to begin tracking a new player session',
              'Select the player, table, and buy-in details',
              'Monitor average bet, time played, and theoretical win',
              'End ratings when players leave the table',
            ],
            table: {
              headers: ['Buy-In Type', 'Description', 'Impact'],
              rows: [
                ['Cash', 'Player buys in with cash', 'Creates drop entry'],
                ['Credit', 'Player uses casino credit', 'Links to credit account'],
                ['Rebate', 'Player uses rebate chips', 'Deducts from rebate balance'],
              ],
            },
          },
          {
            title: 'Float Management',
            description: 'Track and manage table floats and chip inventory.',
            steps: [
              'Navigate to "Float" section',
              'Click "Open Float" to start a new table float',
              'Enter chip denominations and quantities',
              'Record credit slips issued during the shift',
              'Close float at end of shift and reconcile chips',
              'Review variance reports for discrepancies',
            ],
            tips: [
              'Always verify chip counts before opening/closing floats',
              'Record credit slips immediately to avoid errors',
              'Investigate any variances promptly',
            ],
          },
          {
            title: 'Reports & Analytics',
            description: 'Access comprehensive business intelligence and reporting.',
            steps: [
              'Navigate to "Reports" section',
              'Select report type (Daily, Weekly, Monthly, Custom)',
              'Apply filters for date range, table, or player',
              'Click "Generate Report" to view data',
              'Export reports to PDF or Excel for distribution',
            ],
          },
          {
            title: 'User Management',
            description: 'Create and manage system users with role-based permissions.',
            steps: [
              'Navigate to "Settings" > "Users"',
              'Click "Add New User" button',
              'Enter username, password, and select user type',
              'Assign appropriate permissions based on role',
              'Click "Create User" to save',
              'Edit or deactivate users as needed',
            ],
            table: {
              headers: ['User Type', 'Access Level', 'Key Functions'],
              rows: [
                ['Management', 'Full Access', 'All features, reports, settings'],
                ['Pit Manager', 'Floor Operations', 'Ratings, floats, players'],
                ['Dealer', 'Table Operations', 'View assignments, breaks'],
                ['Inspector', 'Monitoring', 'View ratings, floats, shifts'],
                ['Cashier', 'Cage Operations', 'Buy-ins, cash transactions'],
                ['Marketing', 'Player Relations', 'Players, campaigns, comps'],
              ],
            },
          },
          {
            title: 'Cage Operations',
            description: 'Manage main cage float and all financial transactions.',
            steps: [
              'Navigate to "Cage" section',
              'Monitor main cage float inventory',
              'Process player buy-in transactions',
              'Handle cash transactions and chip exchanges',
              'Manage vault transfers and reconciliation',
              'Generate end-of-day cashier reports',
            ],
          },
          {
            title: 'Jackpot System',
            description: 'Configure and manage progressive jackpots.',
            steps: [
              'Navigate to "Jackpots" section',
              'Click "Create Jackpot" to add new jackpot',
              'Set seed amount, increment rate, and trigger conditions',
              'Assign jackpot to specific tables or games',
              'Record jackpot wins and reset amounts',
              'View jackpot history and analytics',
            ],
          },
          {
            title: 'Shift Management',
            description: 'Track dealer and inspector shifts across all tables.',
            steps: [
              'Navigate to "Shifts" section',
              'View active dealer shifts by table',
              'Click "Start Shift" to begin a new dealer shift',
              'Record breaks and shift changes',
              'End shifts when staff completes their rotation',
              'Review shift reports for labor tracking',
            ],
          },
        ],
      };

    case 'Pit Manager':
      return {
        sections: [
          ...commonSections,
          {
            title: 'Floor Supervision',
            description: 'Manage all active games and player ratings on the casino floor.',
            steps: [
              'Monitor all active tables from the dashboard',
              'Start and manage player ratings in real-time',
              'Supervise dealer shifts and table assignments',
              'Handle player requests and issues',
              'Coordinate with dealers and inspectors',
            ],
          },
          {
            title: 'Starting a Player Rating',
            description: 'Begin tracking a player\'s session for comp calculations.',
            steps: [
              'Click "Start Rating" or click on empty seat at a table',
              'Select the player from the dropdown (or add new player)',
              'Choose the table and seat number',
              'Select buy-in type (Cash, Credit, or Rebate)',
              'Enter buy-in amount and chip denominations',
              'Click "Start Rating" to begin tracking',
            ],
            tips: [
              'Confirm player identity before starting rating',
              'Accurately record buy-in amounts for drop calculation',
              'Update average bet throughout the session for accuracy',
            ],
          },
          {
            title: 'Managing Active Ratings',
            description: 'Monitor and update player sessions during play.',
            steps: [
              'View all active ratings on the dashboard',
              'Click on a rating card to view/edit details',
              'Update average bet as play progresses',
              'Mark players on break to pause time tracking',
              'Resume ratings when players return from break',
              'End rating when player leaves the table',
            ],
          },
          {
            title: 'Full Screen Table View',
            description: 'Use the immersive table view for detailed monitoring.',
            steps: [
              'Click on any table to open Full Screen Table View',
              'View realistic casino table layout with all 6 seats',
              'See player ratings positioned at their actual seats',
              'Start new ratings by clicking empty seats',
              'Move players between seats using "Change Seat" button',
              'Exit full screen view using the back button',
            ],
            tips: [
              'Use full screen view for active table supervision',
              'The layout mirrors actual table positions for easy reference',
              'Quickly identify empty seats and table capacity',
            ],
          },
          {
            title: 'Float Operations',
            description: 'Manage table chip inventory and reconciliation.',
            steps: [
              'Open float at start of shift with initial chip count',
              'Record all credit slips issued during shift',
              'Track holding chips (temporary chip holds)',
              'Close float at end of shift',
              'Enter final chip count for reconciliation',
              'Review and resolve any variances',
            ],
          },
          {
            title: 'Player Management',
            description: 'Maintain accurate player records and information.',
            steps: [
              'Access player database from Players section',
              'Add new players with complete information',
              'Update player tiers and contact details',
              'View player rating history and statistics',
              'Manage player preferences and notes',
            ],
          },
          {
            title: 'Using the Help System',
            description: 'Get instant assistance anywhere in the application.',
            steps: [
              'Click the floating Help (?) button on any page',
              'Search for specific topics or browse categories',
              'View step-by-step instructions with screenshots',
              'Access context-aware help based on current page',
              'Download PDF guides for offline reference',
            ],
          },
        ],
      };

    case 'Dealer':
      return {
        sections: [
          ...commonSections,
          {
            title: 'Your Role',
            description: 'As a dealer, you can view your assignments and manage breaks.',
            steps: [
              'View your current table assignment',
              'See active players at your table',
              'Request breaks when needed',
              'View your shift schedule',
            ],
          },
          {
            title: 'Shift Management',
            description: 'Track your working hours and breaks.',
            steps: [
              'Clock in at the start of your shift',
              'Your shift automatically appears on your assigned table',
              'Request breaks through the system',
              'Pit Manager will approve and track break times',
              'Clock out at end of shift',
            ],
            tips: [
              'Always clock in/out accurately for payroll',
              'Notify Pit Manager of any table issues',
              'Keep the table organized and professional',
            ],
          },
          {
            title: 'Table View',
            description: 'Monitor players at your table.',
            steps: [
              'View all active players and their seats',
              'See player buy-in amounts and time played',
              'Note players on break (displayed with yellow indicator)',
              'Report any rating discrepancies to Pit Manager',
            ],
          },
          {
            title: 'Break Procedures',
            description: 'How to take breaks during your shift.',
            steps: [
              'Notify Pit Manager when you need a break',
              'Wait for relief dealer to arrive at your table',
              'Ensure smooth handoff of game state',
              'Return promptly when break time is complete',
            ],
          },
        ],
      };

    case 'Inspector':
      return {
        sections: [
          ...commonSections,
          {
            title: 'Inspector Duties',
            description: 'Monitor floor operations and verify accuracy of all transactions.',
            steps: [
              'Review all active player ratings',
              'Verify float operations and chip counts',
              'Monitor dealer shifts and compliance',
              'Report discrepancies to Pit Manager',
              'Ensure adherence to casino policies',
            ],
          },
          {
            title: 'Inspector Table View',
            description: 'Use the specialized inspector interface for table monitoring.',
            steps: [
              'Click on any table to open Inspector View',
              'See float inventory positioned at table center',
              'View player ratings arranged around the table by seat',
              'Verify chip counts and credit slip amounts',
              'Check for rating accuracy and compliance',
              'Exit inspector view when done',
            ],
            tips: [
              'Focus on high-value tables and transactions',
              'Cross-reference ratings with actual play observed',
              'Document any unusual patterns or discrepancies',
            ],
          },
          {
            title: 'Float Verification',
            description: 'Audit table float operations for accuracy.',
            steps: [
              'Review opening float chip counts',
              'Verify all credit slips match player ratings',
              'Check holding chips against temporary holds',
              'Witness float closings and final counts',
              'Confirm drop calculations are accurate',
              'Sign off on float reconciliation reports',
            ],
          },
          {
            title: 'Rating Audits',
            description: 'Ensure player ratings are accurate and complete.',
            steps: [
              'Verify player identification at table',
              'Confirm buy-in amounts and types',
              'Observe and verify average bet entries',
              'Check time tracking accuracy (including breaks)',
              'Validate theoretical win calculations',
              'Report rating errors immediately',
            ],
          },
          {
            title: 'Shift Monitoring',
            description: 'Track dealer and inspector shift compliance.',
            steps: [
              'Monitor dealer clock-in/clock-out times',
              'Verify break durations and frequencies',
              'Ensure proper shift handoffs occur',
              'Track inspector rotation schedule',
              'Report time discrepancies to management',
            ],
          },
          {
            title: 'Compliance & Reporting',
            description: 'Maintain regulatory compliance and documentation.',
            steps: [
              'Document all inspections and findings',
              'Report suspicious activities immediately',
              'Verify compliance with gaming regulations',
              'Maintain inspection logs and reports',
              'Assist with regulatory audits when required',
            ],
          },
        ],
      };

    case 'Cashier':
      return {
        sections: [
          ...commonSections,
          {
            title: 'Cage Operations',
            description: 'Manage main cage float and process all financial transactions.',
            steps: [
              'Access the Cage section from navigation',
              'Monitor main cage float inventory',
              'Process player chip buy-ins',
              'Handle chip redemptions and cash-outs',
              'Manage vault transfers',
              'Generate end-of-shift reconciliation',
            ],
          },
          {
            title: 'Processing Buy-Ins',
            description: 'Handle player chip purchase transactions.',
            steps: [
              'Click "New Buy-In Transaction"',
              'Select or search for the player',
              'Enter the cash amount received',
              'Select chip denominations to issue',
              'Verify total matches cash received',
              'Complete transaction and print receipt',
              'Update cage float inventory',
            ],
            tips: [
              'Always count cash twice before issuing chips',
              'Verify player identity for large transactions',
              'Keep detailed records of all transactions',
            ],
          },
          {
            title: 'Cash Transactions',
            description: 'Process cash-outs and chip redemptions.',
            steps: [
              'Click "Cash Transaction"',
              'Select transaction type (Cash Out, Exchange, etc.)',
              'Enter chip denominations received from player',
              'Calculate total cash to pay',
              'Count cash payment carefully',
              'Have player verify amount',
              'Complete transaction and update float',
            ],
          },
          {
            title: 'Vault Transfers',
            description: 'Manage chip and cash transfers with the vault.',
            steps: [
              'Navigate to "Vault Transfers"',
              'Select transfer type (To Vault or From Vault)',
              'Enter denominations and quantities',
              'Get supervisor approval for large transfers',
              'Complete transfer and update inventory',
              'Print transfer receipt for records',
            ],
          },
          {
            title: 'Main Float Management',
            description: 'Monitor and maintain cage chip inventory.',
            steps: [
              'View current float inventory in real-time',
              'Set par levels for each chip denomination',
              'Request vault transfers when below par',
              'Record all fills and credits',
              'Reconcile float at end of shift',
              'Report any variances to supervisor',
            ],
          },
          {
            title: 'Credit Line Processing',
            description: 'Handle player credit transactions.',
            steps: [
              'Verify player has approved credit line',
              'Check available credit balance',
              'Process credit marker issuance',
              'Record marker details and player signature',
              'Update credit balance',
              'Track credit repayments',
            ],
            tips: [
              'Never exceed approved credit limits',
              'Verify player ID for all credit transactions',
              'Ensure markers are properly documented',
            ],
          },
          {
            title: 'End-of-Shift Reconciliation',
            description: 'Balance your cash drawer at shift end.',
            steps: [
              'Count all cash and chips in your drawer',
              'Enter counts into the system',
              'Review all transactions from your shift',
              'Calculate expected vs. actual totals',
              'Investigate any discrepancies',
              'Complete shift report and get supervisor sign-off',
              'Prepare drawer for next shift or deposit',
            ],
          },
          {
            title: 'Security & Compliance',
            description: 'Follow proper cash handling and security procedures.',
            steps: [
              'Keep cash drawer locked when not in use',
              'Never leave cage unattended',
              'Verify large bills for authenticity',
              'Follow CTR reporting requirements',
              'Report suspicious transactions',
              'Maintain customer confidentiality',
            ],
          },
        ],
      };

    case 'Marketing':
      return {
        sections: [
          ...commonSections,
          {
            title: 'Player Relations',
            description: 'Build and maintain relationships with casino players.',
            steps: [
              'Access comprehensive player database',
              'View player history and lifetime value',
              'Track player preferences and notes',
              'Manage comp point balances',
              'Issue complimentary services and rewards',
              'Schedule player events and promotions',
            ],
          },
          {
            title: 'Comp Management',
            description: 'Award and track complimentary services.',
            steps: [
              'View player theoretical win and actual loss',
              'Calculate appropriate comp based on play',
              'Issue comps for food, beverage, rooms, or cash',
              'Record comp details and expiration dates',
              'Track comp redemptions',
              'Monitor comp budgets and utilization',
            ],
            tips: [
              'Base comps on actual play, not requests',
              'Use tiered comp formulas for consistency',
              'Track comp effectiveness and player retention',
            ],
          },
          {
            title: 'Campaign Management',
            description: 'Create and manage marketing campaigns.',
            steps: [
              'Navigate to "Marketing Campaigns"',
              'Click "Create Campaign" to start new promotion',
              'Define campaign name, dates, and objectives',
              'Set target player segments and criteria',
              'Configure rewards and incentives',
              'Track campaign performance and ROI',
              'Analyze results and optimize future campaigns',
            ],
          },
          {
            title: 'Player Segmentation',
            description: 'Categorize players for targeted marketing.',
            steps: [
              'Review player tiers and status levels',
              'Analyze play patterns and preferences',
              'Segment players by value, frequency, and recency',
              'Create custom player groups for campaigns',
              'Assign personalized offers and incentives',
              'Monitor segment performance and adjust',
            ],
          },
          {
            title: 'Rebate System',
            description: 'Manage player rebate programs and balances.',
            steps: [
              'View player rebate balances',
              'Calculate rebate earnings based on play',
              'Issue rebate chips to eligible players',
              'Track rebate redemptions at tables',
              'Reconcile rebate chip usage',
              'Generate rebate program reports',
            ],
          },
          {
            title: 'Player Events',
            description: 'Organize and execute special player events.',
            steps: [
              'Plan event details and guest list',
              'Send invitations to targeted players',
              'Track RSVPs and attendance',
              'Coordinate event logistics and comps',
              'Collect player feedback post-event',
              'Measure event success and player engagement',
            ],
          },
          {
            title: 'Reporting & Analytics',
            description: 'Analyze player data for marketing insights.',
            steps: [
              'Access player performance reports',
              'View acquisition and retention metrics',
              'Analyze comp effectiveness and ROI',
              'Track player lifetime value trends',
              'Identify high-value player opportunities',
              'Generate executive summary reports',
            ],
          },
        ],
      };

    default:
      return {
        sections: commonSections,
      };
  }
}
