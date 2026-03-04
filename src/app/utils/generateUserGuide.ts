import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type UserType = 'Management' | 'Pit Manager' | 'Dealer' | 'Inspector' | 'Cashier' | 'Marketing';

interface GuideSection {
  title: string;
  content: string[];
  subsections?: { title: string; items: string[] }[];
}

const userGuides: Record<UserType, GuideSection[]> = {
  'Management': [
    {
      title: 'Overview',
      content: [
        'Welcome to MF-Intel CMS for Gaming IQ! As a Management user, you have full access to all system features including analytics, reporting, user management, and system configuration.',
        'This guide will help you navigate the system effectively and make the most of your administrative privileges.'
      ]
    },
    {
      title: 'Dashboard Navigation',
      content: [
        'The main dashboard provides quick access to all major features through the top navigation bar.',
        'Key sections include: Players, Ratings, Floats, Reports, Analytics, Jackpots, Cage, Marketing, Users, and Settings.'
      ]
    },
    {
      title: 'Player Management',
      subsections: [
        {
          title: 'Adding New Players',
          items: [
            '1. Click "Players" in the main navigation',
            '2. Click the "+ New Player" button',
            '3. Fill in player details: Name, Email, Phone, Player Card #, VIP Status',
            '4. Add notes if needed',
            '5. Click "Add Player" to save'
          ]
        },
        {
          title: 'Managing Player Records',
          items: [
            'Edit: Click the pencil icon next to any player',
            'Delete: Click the trash icon (requires confirmation)',
            'Search: Use the search bar to find players quickly',
            'Filter: Filter by VIP status or other criteria'
          ]
        }
      ]
    },
    {
      title: 'Ratings System',
      subsections: [
        {
          title: 'Starting a Rating',
          items: [
            '1. Navigate to "Ratings" section',
            '2. Click "Start Rating" button',
            '3. Select table and seat number',
            '4. Choose player from dropdown',
            '5. Enter buy-in details (Cash or Marker)',
            '6. Set average bet amount',
            '7. Click "Start" to begin tracking'
          ]
        },
        {
          title: 'Monitoring Active Ratings',
          items: [
            'View all active ratings in real-time',
            'Track time at table and break times',
            'Monitor win/loss amounts',
            'See rebate calculations automatically',
            'Toggle break status with one click'
          ]
        },
        {
          title: 'Ending a Rating',
          items: [
            '1. Click "End" on the active rating card',
            '2. Enter final chip count by denomination',
            '3. System calculates win/loss automatically',
            '4. Review rebate calculation',
            '5. Confirm to complete rating'
          ]
        }
      ]
    },
    {
      title: 'Float Management',
      subsections: [
        {
          title: 'Opening Table Float',
          items: [
            '1. Go to "Floats" section',
            '2. Click "Open Float" button',
            '3. Select table name',
            '4. Enter opening chip amounts by denomination',
            '5. System calculates total automatically',
            '6. Assign dealer (optional)',
            '7. Click "Open Float" to confirm'
          ]
        },
        {
          title: 'Float Operations',
          items: [
            'Credits: Add chips to a table float',
            'Fills: Transfer chips from cage to table',
            'Drops: Record cash collected from table',
            'Close Float: End of shift reconciliation'
          ]
        }
      ]
    },
    {
      title: 'Reports & Analytics',
      subsections: [
        {
          title: 'Daily Reports',
          items: [
            'View daily performance metrics',
            'Track total drop amounts',
            'Monitor table performance',
            'See player rating summaries',
            'Export to Excel format'
          ]
        },
        {
          title: 'Analytics Dashboard',
          items: [
            'Revenue trends over time',
            'Player behavior analysis',
            'Table utilization metrics',
            'Peak hours identification',
            'Top players by volume'
          ]
        }
      ]
    },
    {
      title: 'Jackpot Management',
      content: [
        'Configure jackpot types and amounts',
        'Record jackpot winners',
        'Track progressive jackpot growth',
        'Generate winner reports',
        'Manage payout approvals'
      ]
    },
    {
      title: 'Cage Operations',
      content: [
        'Monitor main float inventory',
        'Process buy-in transactions',
        'Handle cash transactions',
        'Manage vault transfers',
        'Track cashier float assignments',
        'Process credit line requests'
      ]
    },
    {
      title: 'User Management',
      subsections: [
        {
          title: 'Creating Users',
          items: [
            '1. Navigate to "Users" section',
            '2. Click "Add User" button',
            '3. Enter username and initial password',
            '4. Select user type: Management, Pit Manager, Dealer, Inspector, Cashier, Marketing',
            '5. Enable "Force Password Change" if desired',
            '6. Click "Create User"'
          ]
        },
        {
          title: 'User Types & Permissions',
          items: [
            'Management: Full system access',
            'Pit Manager: Player/ratings management, reports',
            'Dealer: View ratings, manage breaks',
            'Inspector: Full-screen table view, monitor floats',
            'Cashier: Cage operations, transactions',
            'Marketing: Campaign management, player analysis'
          ]
        }
      ]
    },
    {
      title: 'System Settings',
      content: [
        'Configure chip denominations',
        'Set currency (FCFA default)',
        'Customize table names',
        'Define rebate calculation rules',
        'Configure email notifications',
        'Manage property settings',
        'Set up game statistics tracking'
      ]
    },
    {
      title: 'Best Practices',
      content: [
        '• Start each shift with accurate float openings',
        '• Monitor active ratings regularly',
        '• Process breaks promptly to maintain accurate time tracking',
        '• Reconcile floats at end of shift',
        '• Review daily reports for anomalies',
        '• Back up data regularly',
        '• Train staff on their specific user roles',
        '• Update player information as needed'
      ]
    },
    {
      title: 'Troubleshooting',
      subsections: [
        {
          title: 'Common Issues',
          items: [
            'Login Issues: Check username/password, verify property selection',
            'Missing Data: Ensure proper property is selected',
            'Calculation Errors: Verify chip denominations are correct',
            'Report Export: Check browser popup blocker settings',
            'Float Discrepancies: Review all credit/fill/drop transactions'
          ]
        }
      ]
    },
    {
      title: 'Contact & Support',
      content: [
        'For technical support or questions:',
        '• Use the Help button (?) in the top navigation',
        '• Contact your system administrator',
        '• Refer to the online documentation',
        '• Email: support@mfintel.com'
      ]
    }
  ],
  
  'Pit Manager': [
    {
      title: 'Overview',
      content: [
        'As a Pit Manager, you have access to player management, ratings, floats, and reporting features.',
        'Your role focuses on floor operations, player tracking, and ensuring smooth table operations.'
      ]
    },
    {
      title: 'Main Responsibilities',
      content: [
        '• Monitor active ratings across all tables',
        '• Manage player ratings and buy-ins',
        '• Track float operations and cash drops',
        '• Generate shift reports',
        '• Coordinate with dealers and inspectors',
        '• Approve rebate calculations'
      ]
    },
    {
      title: 'Player Ratings',
      subsections: [
        {
          title: 'Starting Ratings',
          items: [
            '1. Click "Ratings" tab',
            '2. Click "Start Rating"',
            '3. Select table and seat',
            '4. Choose player (or add new)',
            '5. Enter buy-in: Cash or Marker',
            '6. Set average bet',
            '7. Click "Start"'
          ]
        },
        {
          title: 'Managing Active Ratings',
          items: [
            'Monitor real-time play duration',
            'Track break times (auto-calculated)',
            'Adjust average bet if needed',
            'View current win/loss estimates',
            'Switch players to different seats',
            'End ratings at cash-out'
          ]
        },
        {
          title: 'Ending Ratings',
          items: [
            '1. Click "End" on rating card',
            '2. Count chips by denomination',
            '3. Enter amounts in form',
            '4. Review calculated win/loss',
            '5. Check rebate amount',
            '6. Confirm and complete'
          ]
        }
      ]
    },
    {
      title: 'Float Management',
      subsections: [
        {
          title: 'Daily Float Operations',
          items: [
            'Open floats at start of shift',
            'Record fills from cage',
            'Track credit transactions',
            'Document cash drops',
            'Close floats at end of shift',
            'Reconcile discrepancies'
          ]
        },
        {
          title: 'Drop Recording',
          items: [
            '1. When cash is collected from table',
            '2. Record amount immediately',
            '3. Note if related to player buy-in',
            '4. Ensure drop box is secured',
            '5. Update float inventory'
          ]
        }
      ]
    },
    {
      title: 'Reports',
      content: [
        'Daily Drop Report: Total cash collected',
        'Player Activity: Ratings by player',
        'Table Performance: Win/loss by table',
        'Shift Summary: Overall shift metrics',
        'Export options: Excel, PDF'
      ]
    },
    {
      title: 'Table View',
      content: [
        'Click any table to see full-screen view',
        'Visual representation of all 6 seats',
        'Active ratings displayed at each position',
        'Float information at center',
        'Quick actions: Start rating, toggle break',
        'Real-time updates'
      ]
    },
    {
      title: 'Best Practices',
      content: [
        '• Verify player identity before starting rating',
        '• Record breaks accurately',
        '• Count chips carefully at rating end',
        '• Review daily reports before shift end',
        '• Communicate with dealers about player behavior',
        '• Document unusual situations in notes',
        '• Keep float reconciliations current'
      ]
    },
    {
      title: 'Quick Tips',
      content: [
        '• Use search function to find players quickly',
        '• Filters help narrow down active ratings',
        '• Color coding indicates status: Active (green), On Break (yellow)',
        '• Rebates calculate automatically based on time and average bet',
        '• All times are tracked precisely including breaks'
      ]
    }
  ],
  
  'Dealer': [
    {
      title: 'Overview',
      content: [
        'As a Dealer, you can view active ratings at your table and manage player breaks.',
        'Your access is focused on table-level operations during your shift.'
      ]
    },
    {
      title: 'Shift Start',
      content: [
        '1. Log in with your dealer credentials',
        '2. Select your assigned table',
        '3. Review active float information',
        '4. Check for any active ratings',
        '5. Verify chip inventory matches float record'
      ]
    },
    {
      title: 'Viewing Active Ratings',
      content: [
        'See all players currently rated at your table',
        'View buy-in amounts and average bets',
        'Check play duration for each player',
        'Monitor break status',
        'Note: You cannot start or end ratings'
      ]
    },
    {
      title: 'Managing Breaks',
      subsections: [
        {
          title: 'Marking Player on Break',
          items: [
            '1. Player leaves table temporarily',
            '2. Click "Break" button on their rating card',
            '3. System starts tracking break time',
            '4. Break time is excluded from play duration',
            '5. Card turns yellow to indicate break status'
          ]
        },
        {
          title: 'Returning from Break',
          items: [
            '1. Player returns to table',
            '2. Click "Return" button on rating card',
            '3. System resumes play time tracking',
            '4. Card returns to active (green) status',
            '5. Total break time is accumulated'
          ]
        }
      ]
    },
    {
      title: 'Table View',
      content: [
        'Full-screen view shows your table layout',
        '6 seats arranged in realistic casino formation',
        'Float inventory displayed at center',
        'Player ratings at their respective positions',
        'Easy-to-read information at a glance'
      ]
    },
    {
      title: 'Communication',
      content: [
        'Report player requests to Pit Manager:',
        '• Buy-in requests',
        '• Rating start/end',
        '• Chip color-ups',
        '• Cash-out requests',
        '• Unusual betting patterns',
        '• Player disputes'
      ]
    },
    {
      title: 'Best Practices',
      content: [
        '• Mark breaks promptly when players leave',
        '• Return players from break immediately upon return',
        '• Alert pit manager of rating requests',
        '• Keep track of chip inventory',
        '• Report any discrepancies',
        '• Maintain professional communication',
        '• Focus on game integrity'
      ]
    },
    {
      title: 'Important Notes',
      content: [
        '• You cannot modify ratings or buy-ins',
        '• All rating changes must go through Pit Manager',
        '• Float operations are managed by management',
        '• Break tracking is your primary responsibility',
        '• Accurate break times ensure proper rebate calculations'
      ]
    }
  ],
  
  'Inspector': [
    {
      title: 'Overview',
      content: [
        'As an Inspector, you have a comprehensive view of all table operations.',
        'Your role is to monitor multiple tables, verify float accuracy, and ensure proper procedures.'
      ]
    },
    {
      title: 'Main Dashboard',
      content: [
        'View all open tables simultaneously',
        'Click any table for detailed full-screen view',
        'Monitor float inventories across all tables',
        'Track active ratings in real-time',
        'Identify tables needing attention'
      ]
    },
    {
      title: 'Full-Screen Table View',
      subsections: [
        {
          title: 'Layout Features',
          items: [
            'Realistic casino table representation',
            'Brown oval border with green felt interior',
            '6 seats positioned clockwise from Seat 1',
            'Float inventory at center of table',
            'Player ratings at their seat positions',
            'All chip denominations visible'
          ]
        },
        {
          title: 'Float Monitoring',
          items: [
            'View current chip inventory by denomination',
            'See opening float amounts',
            'Track credits and fills',
            'Monitor drops recorded',
            'Calculate expected vs actual inventory',
            'Identify discrepancies quickly'
          ]
        }
      ]
    },
    {
      title: 'Rating Oversight',
      content: [
        'View all active player ratings',
        'Monitor play duration and break times',
        'Verify average bet amounts',
        'Check buy-in documentation',
        'Review rebate calculations',
        'Ensure proper procedures followed'
      ]
    },
    {
      title: 'Inspection Procedures',
      subsections: [
        {
          title: 'Float Verification',
          items: [
            '1. Select table to inspect',
            '2. Review float inventory on screen',
            '3. Physically count chips at table',
            '4. Compare actual count to system record',
            '5. Document any discrepancies',
            '6. Report variances to management'
          ]
        },
        {
          title: 'Rating Verification',
          items: [
            '1. Observe player at table',
            '2. Verify seat number matches rating',
            '3. Confirm player identity',
            '4. Check average bet accuracy',
            '5. Ensure break status is correct',
            '6. Report any issues to pit manager'
          ]
        }
      ]
    },
    {
      title: 'Multi-Table Monitoring',
      content: [
        'Switch between tables quickly using navigation',
        'Prioritize tables with:',
        '  • High-value players',
        '  • Large float inventories',
        '  • Multiple active ratings',
        '  • Recent discrepancies',
        '  • New dealers',
        'Document observations in audit log'
      ]
    },
    {
      title: 'Reporting Issues',
      subsections: [
        {
          title: 'When to Report',
          items: [
            'Float count does not match system',
            'Player rating at wrong seat',
            'Excessive break time',
            'Unrated player receiving comps',
            'Unusual betting patterns',
            'Procedural violations',
            'Chip inventory concerns'
          ]
        },
        {
          title: 'How to Report',
          items: [
            '1. Document specific details',
            '2. Note table, time, and personnel',
            '3. Contact pit manager immediately for urgent issues',
            '4. Use audit log for documentation',
            '5. Follow up on corrective actions'
          ]
        }
      ]
    },
    {
      title: 'Best Practices',
      content: [
        '• Conduct regular table inspections',
        '• Verify floats at shift changes',
        '• Monitor high-limit tables more frequently',
        '• Check rating accuracy during rounds',
        '• Document all inspections',
        '• Maintain objectivity',
        '• Report issues promptly',
        '• Follow chain of command'
      ]
    },
    {
      title: 'Access Privileges',
      content: [
        'View-only access to most features',
        'Cannot modify ratings or floats',
        'Cannot start or end player sessions',
        'Can view all tables simultaneously',
        'Can access historical data',
        'Can generate inspection reports'
      ]
    }
  ],
  
  'Cashier': [
    {
      title: 'Overview',
      content: [
        'As a Cashier, you manage cage operations including buy-ins, cash transactions, vault transfers, and float assignments.',
        'Your role is critical for cash handling and maintaining accurate chip inventory.'
      ]
    },
    {
      title: 'Cage Dashboard',
      content: [
        'Access main cage operations from the "Cage" tab',
        'Key sections:',
        '  • Main Float: Central chip inventory',
        '  • Buy-Ins: Player chip purchases',
        '  • Cash Transactions: Cash in/out',
        '  • Vault Transfers: Vault operations',
        '  • Cashier Floats: Individual cashier banks'
      ]
    },
    {
      title: 'Main Float Management',
      subsections: [
        {
          title: 'Viewing Inventory',
          items: [
            'See total chip inventory by denomination',
            'Monitor stock levels',
            'Check for low inventory warnings',
            'View transaction history',
            'Calculate total value'
          ]
        },
        {
          title: 'Adjusting Inventory',
          items: [
            '1. Click "Adjust Inventory"',
            '2. Enter new amounts by denomination',
            '3. Add reason for adjustment',
            '4. System logs all changes',
            '5. Confirm adjustment'
          ]
        }
      ]
    },
    {
      title: 'Processing Buy-Ins',
      subsections: [
        {
          title: 'Cash Buy-In',
          items: [
            '1. Click "New Buy-In" button',
            '2. Select player from list',
            '3. Choose "Cash" as payment type',
            '4. Enter cash amount received',
            '5. Select chip denominations to issue',
            '6. Verify total matches',
            '7. Complete transaction',
            '8. Issue chips to player'
          ]
        },
        {
          title: 'Marker Buy-In',
          items: [
            '1. Select "Marker" as payment type',
            '2. Verify player credit line availability',
            '3. Enter marker amount',
            '4. Get player signature',
            '5. Select chips to issue',
            '6. Complete transaction',
            '7. File marker properly'
          ]
        }
      ]
    },
    {
      title: 'Cash Transactions',
      subsections: [
        {
          title: 'Cash In',
          items: [
            'Recording cash received',
            'Player deposits',
            'Chip redemptions',
            'Fill repayments',
            'Document source'
          ]
        },
        {
          title: 'Cash Out',
          items: [
            'Player withdrawals',
            'Chip purchases for table fills',
            'Expense payments',
            'Verify authorization',
            'Count carefully'
          ]
        }
      ]
    },
    {
      title: 'Vault Operations',
      subsections: [
        {
          title: 'Vault Transfers',
          items: [
            '1. Click "New Vault Transfer"',
            '2. Select transfer type: To Vault or From Vault',
            '3. Enter amounts by denomination',
            '4. Require dual authorization',
            '5. Document reason',
            '6. Update main float inventory',
            '7. Record in vault log'
          ]
        },
        {
          title: 'Vault Inventory',
          items: [
            'Monitor vault chip levels',
            'Conduct periodic counts',
            'Reconcile against records',
            'Report discrepancies',
            'Maintain security protocols'
          ]
        }
      ]
    },
    {
      title: 'Cashier Float Assignment',
      content: [
        'Open cashier float at shift start',
        'Receive chip bank from main float',
        'Track all transactions during shift',
        'Reconcile at shift end',
        'Return bank to main float',
        'Document any overages/shortages'
      ]
    },
    {
      title: 'Credit Line Management',
      subsections: [
        {
          title: 'Checking Credit',
          items: [
            '1. Navigate to "Credit Lines"',
            '2. Search for player',
            '3. View credit limit and available credit',
            '4. Check payment history',
            '5. Verify account status'
          ]
        },
        {
          title: 'Processing Payments',
          items: [
            '1. Click "New Payment" on credit line',
            '2. Enter payment amount',
            '3. Select payment method',
            '4. Update available credit',
            '5. Provide receipt to player'
          ]
        }
      ]
    },
    {
      title: 'End of Shift Procedures',
      content: [
        '1. Count cashier float',
        '2. Reconcile against transaction log',
        '3. Document all transactions',
        '4. Investigate any discrepancies',
        '5. Return float to main cage',
        '6. Complete shift report',
        '7. Secure all documentation'
      ]
    },
    {
      title: 'Security & Compliance',
      content: [
        '• Always count cash twice',
        '• Verify player identity for large transactions',
        '• Follow anti-money laundering protocols',
        '• Report suspicious activity',
        '• Maintain dual control for vault access',
        '• Never leave cash unattended',
        '• Keep cage window secure',
        '• Document everything'
      ]
    },
    {
      title: 'Best Practices',
      content: [
        '• Keep work area organized',
        '• Count carefully and deliberately',
        '• Double-check all amounts',
        '• Maintain professional demeanor',
        '• Process transactions efficiently',
        '• Communicate clearly with players',
        '• Ask for help with large transactions',
        '• Keep supervisor informed of issues'
      ]
    }
  ],
  
  'Marketing': [
    {
      title: 'Overview',
      content: [
        'As a Marketing user, you have access to player analytics, campaign management, and promotional tools.',
        'Your role focuses on player development, retention, and marketing effectiveness.'
      ]
    },
    {
      title: 'Player Analytics',
      subsections: [
        {
          title: 'Player Profiles',
          items: [
            'View comprehensive player history',
            'Track total play time',
            'Monitor average bet trends',
            'Calculate theoretical win',
            'See win/loss history',
            'Review rebate totals'
          ]
        },
        {
          title: 'Segmentation',
          items: [
            'Identify VIP players',
            'Find high-value prospects',
            'Track visit frequency',
            'Analyze betting patterns',
            'Segment by game preference',
            'Create targeted lists'
          ]
        }
      ]
    },
    {
      title: 'Campaign Management',
      subsections: [
        {
          title: 'Creating Campaigns',
          items: [
            '1. Click "Marketing" then "Campaigns"',
            '2. Click "New Campaign"',
            '3. Enter campaign name and description',
            '4. Set start and end dates',
            '5. Define target audience',
            '6. Set budget and goals',
            '7. Choose campaign type',
            '8. Launch campaign'
          ]
        },
        {
          title: 'Campaign Types',
          items: [
            'Email promotions',
            'Special events',
            'Birthday bonuses',
            'Loss rebates',
            'Tier upgrades',
            'Referral programs',
            'Seasonal promotions'
          ]
        }
      ]
    },
    {
      title: 'Reporting & Analytics',
      content: [
        'Player Activity Reports:',
        '  • Daily/weekly/monthly summaries',
        '  • Player ranking by value',
        '  • Visit frequency analysis',
        '',
        'Campaign Performance:',
        '  • Response rates',
        '  • ROI calculations',
        '  • Player acquisition costs',
        '  • Retention metrics'
      ]
    },
    {
      title: 'Player Development',
      subsections: [
        {
          title: 'Identifying Prospects',
          items: [
            'Review new player list',
            'Track play patterns',
            'Identify upward trends',
            'Note visit frequency',
            'Monitor average bets',
            'Flag for outreach'
          ]
        },
        {
          title: 'Retention Strategies',
          items: [
            'Birthday programs',
            'Milestone rewards',
            'Loss recovery offers',
            'Personalized promotions',
            'Exclusive events',
            'Tiered benefits'
          ]
        }
      ]
    },
    {
      title: 'Email Marketing',
      content: [
        'Configure email settings in system',
        'Create email templates',
        'Build recipient lists from player segments',
        'Schedule send times',
        'Track open rates',
        'Monitor click-through rates',
        'Measure conversion'
      ]
    },
    {
      title: 'VIP Program Management',
      content: [
        'Define tier levels',
        'Set qualification criteria',
        'Assign tier benefits',
        'Monitor tier movements',
        'Plan VIP events',
        'Provide concierge services',
        'Track VIP satisfaction'
      ]
    },
    {
      title: 'Analytics Dashboard',
      content: [
        'Key metrics to monitor:',
        '  • Total player database size',
        '  • Active player count',
        '  • New player acquisition rate',
        '  • Player retention rate',
        '  • Average player value',
        '  • Campaign ROI',
        '  • Email engagement rates',
        '  • Visit frequency trends'
      ]
    },
    {
      title: 'Best Practices',
      content: [
        '• Regularly review player data',
        '• Segment players for targeted campaigns',
        '• Personalize communications',
        '• Test different offers',
        '• Track campaign results',
        '• Respond to player feedback',
        '• Coordinate with floor staff',
        '• Maintain player privacy',
        '• Update player preferences',
        '• Celebrate player milestones'
      ]
    },
    {
      title: 'Compliance',
      content: [
        '• Respect player opt-out preferences',
        '• Follow responsible gaming guidelines',
        '• Protect player data privacy',
        '• Comply with marketing regulations',
        '• Document promotional offers',
        '• Maintain audit trail',
        '• Report issues to management'
      ]
    }
  ]
};

export function generateUserGuidePDF(userType: UserType): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;
  
  // Title Page
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('MF-Intel CMS', pageWidth / 2, 40, { align: 'center' });
  
  doc.setFontSize(20);
  doc.text('for Gaming IQ', pageWidth / 2, 55, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(`${userType} User Guide`, pageWidth / 2, 75, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Version 2.1.8`, pageWidth / 2, 90, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 100, { align: 'center' });
  
  // Add decorative line
  doc.setLineWidth(0.5);
  doc.line(40, 110, pageWidth - 40, 110);
  
  // Footer on title page
  doc.setFontSize(8);
  doc.text('© 2026 MF-Intel Casino Management Systems', pageWidth / 2, pageHeight - 20, { align: 'center' });
  doc.text('Confidential - For Authorized Use Only', pageWidth / 2, pageHeight - 15, { align: 'center' });
  
  // Table of Contents
  doc.addPage();
  yPosition = 20;
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Table of Contents', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const sections = userGuides[userType];
  sections.forEach((section, index) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`${index + 1}. ${section.title}`, 25, yPosition);
    yPosition += 7;
  });
  
  // Content pages
  sections.forEach((section, sectionIndex) => {
    doc.addPage();
    yPosition = 20;
    
    // Section title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${sectionIndex + 1}. ${section.title}`, 20, yPosition);
    yPosition += 10;
    
    // Add decorative line under section title
    doc.setLineWidth(0.3);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Section content
    section.content.forEach(paragraph => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      const lines = doc.splitTextToSize(paragraph, pageWidth - 40);
      lines.forEach((line: string) => {
        doc.text(line, 20, yPosition);
        yPosition += 6;
      });
      yPosition += 3;
    });
    
    // Subsections
    if (section.subsections) {
      section.subsections.forEach(subsection => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }
        
        yPosition += 5;
        doc.setFont('helvetica', 'bold');
        doc.text(subsection.title, 25, yPosition);
        yPosition += 7;
        
        doc.setFont('helvetica', 'normal');
        subsection.items.forEach(item => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
          }
          
          const lines = doc.splitTextToSize(item, pageWidth - 60);
          lines.forEach((line: string, idx: number) => {
            doc.text(idx === 0 ? `  • ${line}` : `    ${line}`, 30, yPosition);
            yPosition += 6;
          });
        });
        yPosition += 3;
      });
    }
    
    // Footer on each page
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `MF-Intel CMS ${userType} Guide - Page ${doc.getCurrentPageInfo().pageNumber}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  });
  
  // Save the PDF
  doc.save(`MF-Intel_CMS_${userType.replace(' ', '_')}_Guide.pdf`);
}
