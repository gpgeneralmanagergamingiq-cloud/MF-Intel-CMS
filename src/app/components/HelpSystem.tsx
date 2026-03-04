import { useState } from 'react';
import { HelpCircle, X, Download, Search, BookOpen, FileText, Video, MessageCircle } from 'lucide-react';
import { generateUserGuide, UserType } from '../utils/pdfGenerator';
import { toast } from 'sonner';

interface HelpSystemProps {
  userType: UserType;
  currentPage?: string;
}

export function HelpSystem({ userType, currentPage }: HelpSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleDownloadGuide = () => {
    try {
      generateUserGuide(userType);
      toast.success('User guide downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate user guide');
    }
  };

  const helpContent = getHelpContent(userType);
  const categories = ['all', ...new Set(helpContent.map(item => item.category))];

  const filteredContent = helpContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        title="Help & Support"
      >
        <HelpCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Help & Support</h2>
              <p className="text-sm text-blue-100">{userType} User Guide</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadGuide}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download PDF Guide</span>
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => toast.info('Video tutorials coming soon!')}
            >
              <Video className="w-4 h-4" />
              <span className="text-sm font-medium">Video Tutorials</span>
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => toast.info('Contact support at support@mf-intel.com')}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Contact Support</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help topics..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {currentPage && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">You're on: {currentPage}</h3>
                  <p className="text-sm text-blue-700">
                    Browse relevant help topics below or use the search to find specific information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No help topics found matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-3 text-blue-600 hover:underline text-sm"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContent.map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <item.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                      
                      {item.steps && item.steps.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Steps:</p>
                          <ol className="space-y-1.5 ml-4">
                            {item.steps.map((step, idx) => (
                              <li key={idx} className="text-sm text-slate-700">
                                <span className="font-semibold text-blue-600">{idx + 1}.</span> {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {item.tips && item.tips.length > 0 && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <p className="text-xs font-semibold text-emerald-800 mb-2">💡 Tips:</p>
                          <ul className="space-y-1">
                            {item.tips.map((tip, idx) => (
                              <li key={idx} className="text-sm text-emerald-700">• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
          <p className="text-xs text-slate-600 text-center">
            MF-Intel CMS v2.1.8 | Need more help? Contact support at{' '}
            <a href="mailto:support@mf-intel.com" className="text-blue-600 hover:underline">
              support@mf-intel.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

interface HelpItem {
  category: string;
  title: string;
  description: string;
  icon: any;
  steps?: string[];
  tips?: string[];
}

function getHelpContent(userType: UserType): HelpItem[] {
  const commonContent: HelpItem[] = [
    {
      category: 'getting-started',
      title: 'Logging In',
      description: 'Access the MF-Intel CMS application',
      icon: HelpCircle,
      steps: [
        'Open your web browser and navigate to the application URL',
        'Select your property from the dropdown',
        'Enter your username and password',
        'Click "Sign In" to access the system',
      ],
      tips: [
        'Change your password after first login',
        'Bookmark the URL for quick access',
        'Always log out when finished',
      ],
    },
    {
      category: 'navigation',
      title: 'Using the Navigation',
      description: 'Navigate between different sections of the application',
      icon: BookOpen,
      steps: [
        'Use the top navigation bar to switch between modules',
        'Click your username in top-right for settings',
        'Click the Help (?) button for instant assistance',
        'Your current property and user type are always displayed',
      ],
    },
  ];

  const userSpecificContent = getUserSpecificHelpContent(userType);
  return [...commonContent, ...userSpecificContent];
}

function getUserSpecificHelpContent(userType: UserType): HelpItem[] {
  switch (userType) {
    case 'Management':
    case 'Pit Manager':
      return [
        {
          category: 'ratings',
          title: 'Starting a Player Rating',
          description: 'Begin tracking a player session for comp calculations',
          icon: FileText,
          steps: [
            'Click "Start Rating" or click an empty seat at a table',
            'Select the player from dropdown or add new player',
            'Choose table and seat number',
            'Select buy-in type (Cash, Credit, or Rebate)',
            'Enter buy-in amount and chip denominations',
            'Click "Start Rating" to begin',
          ],
          tips: [
            'Confirm player identity before starting',
            'Accurately record buy-in amounts',
            'Update average bet throughout session',
          ],
        },
        {
          category: 'ratings',
          title: 'Managing Active Ratings',
          description: 'Update and monitor player sessions',
          icon: FileText,
          steps: [
            'View all active ratings on dashboard',
            'Click rating card to edit details',
            'Update average bet as play progresses',
            'Mark players on break to pause tracking',
            'End rating when player leaves',
          ],
        },
        {
          category: 'tables',
          title: 'Full Screen Table View',
          description: 'Use immersive table view for monitoring',
          icon: BookOpen,
          steps: [
            'Click any table to open Full Screen View',
            'See realistic casino table with all 6 seats',
            'View player ratings at their actual positions',
            'Start ratings by clicking empty seats',
            'Move players between seats using "Change Seat"',
          ],
          tips: [
            'Layout mirrors actual table positions',
            'Quickly identify empty seats',
            'Perfect for active supervision',
          ],
        },
        {
          category: 'floats',
          title: 'Float Management',
          description: 'Manage table chip inventory',
          icon: FileText,
          steps: [
            'Open float at shift start with chip count',
            'Record credit slips during shift',
            'Track holding chips',
            'Close float at shift end',
            'Reconcile final chip count',
          ],
        },
      ];

    case 'Dealer':
      return [
        {
          category: 'shifts',
          title: 'Managing Your Shift',
          description: 'Clock in/out and track your working hours',
          icon: FileText,
          steps: [
            'Clock in at start of shift',
            'Your shift appears on assigned table',
            'Request breaks through system',
            'Wait for Pit Manager approval',
            'Clock out at end of shift',
          ],
          tips: [
            'Clock in/out accurately for payroll',
            'Notify manager of any issues',
            'Keep table organized',
          ],
        },
      ];

    case 'Inspector':
      return [
        {
          category: 'inspection',
          title: 'Inspector Table View',
          description: 'Monitor tables with specialized interface',
          icon: BookOpen,
          steps: [
            'Click table to open Inspector View',
            'See float inventory at table center',
            'View ratings arranged by seat position',
            'Verify chip counts and credit slips',
            'Check rating accuracy',
          ],
          tips: [
            'Focus on high-value tables',
            'Cross-reference with observed play',
            'Document unusual patterns',
          ],
        },
        {
          category: 'inspection',
          title: 'Float Verification',
          description: 'Audit table float operations',
          icon: FileText,
          steps: [
            'Review opening float counts',
            'Verify credit slips match ratings',
            'Check holding chips',
            'Witness float closings',
            'Sign off on reconciliation',
          ],
        },
      ];

    case 'Cashier':
      return [
        {
          category: 'cage',
          title: 'Processing Buy-Ins',
          description: 'Handle player chip purchases',
          icon: FileText,
          steps: [
            'Click "New Buy-In Transaction"',
            'Select or search for player',
            'Enter cash amount received',
            'Select chip denominations to issue',
            'Verify total matches cash',
            'Complete and print receipt',
          ],
          tips: [
            'Count cash twice before issuing chips',
            'Verify identity for large transactions',
            'Keep detailed records',
          ],
        },
        {
          category: 'cage',
          title: 'Vault Transfers',
          description: 'Manage chip transfers with vault',
          icon: FileText,
          steps: [
            'Navigate to Vault Transfers',
            'Select transfer type',
            'Enter denominations and quantities',
            'Get supervisor approval for large amounts',
            'Complete and update inventory',
          ],
        },
      ];

    case 'Marketing':
      return [
        {
          category: 'marketing',
          title: 'Comp Management',
          description: 'Award complimentary services to players',
          icon: FileText,
          steps: [
            'View player theoretical win',
            'Calculate appropriate comp',
            'Issue comp (food, room, cash)',
            'Record details and expiration',
            'Track redemptions',
          ],
          tips: [
            'Base comps on actual play',
            'Use tiered formulas',
            'Track effectiveness',
          ],
        },
      ];

    default:
      return [];
  }
}