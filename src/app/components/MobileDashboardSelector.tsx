import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Star, 
  TrendingDown, 
  FileText,
  Settings,
  Menu,
  X,
  Eye,
  Smartphone,
  Vault,
  CreditCard,
  Target,
  LogOut,
  User
} from "lucide-react";

interface DashboardOption {
  path: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface MobileDashboardSelectorProps {
  username?: string;
  userType?: string;
  onLogout: () => void;
}

const dashboards: DashboardOption[] = [
  {
    path: "/",
    name: "Dashboard",
    icon: <LayoutDashboard className="w-6 h-6" />,
    description: "Overview & Analytics"
  },
  {
    path: "/players",
    name: "Players",
    icon: <Users className="w-6 h-6" />,
    description: "Player Management"
  },
  {
    path: "/floats",
    name: "Float Management",
    icon: <DollarSign className="w-6 h-6" />,
    description: "Table Floats & Tips"
  },
  {
    path: "/ratings",
    name: "Ratings",
    icon: <Star className="w-6 h-6" />,
    description: "Player Ratings"
  },
  {
    path: "/drop",
    name: "Drop",
    icon: <TrendingDown className="w-6 h-6" />,
    description: "Drop Tracking"
  },
  {
    path: "/reports",
    name: "Reports",
    icon: <FileText className="w-6 h-6" />,
    description: "Reports & Analytics"
  },
  {
    path: "/cage",
    name: "Cage",
    icon: <Vault className="w-6 h-6" />,
    description: "Main Float & Operations"
  },
  {
    path: "/credit-line-management",
    name: "Credit Lines",
    icon: <CreditCard className="w-6 h-6" />,
    description: "Credit Management"
  },
  {
    path: "/marketing-campaigns",
    name: "Marketing",
    icon: <Target className="w-6 h-6" />,
    description: "Campaign Management"
  },
  {
    path: "/setup",
    name: "Setup",
    icon: <Settings className="w-6 h-6" />,
    description: "System Configuration"
  }
];

export function MobileDashboardSelector({ username, userType, onLogout }: MobileDashboardSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentDashboard = dashboards.find(d => {
    if (d.path === "/" && location.pathname === "/") return true;
    if (d.path !== "/" && location.pathname.startsWith(d.path)) return true;
    return false;
  }) || dashboards[0];

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header Bar - Only visible on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6" />
            <div>
              <h1 className="text-sm font-bold">MF-Intel CMS</h1>
              <p className="text-xs opacity-90">
                {username && userType ? `${username} (${userType})` : 'View Only Mode'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Current Dashboard Indicator */}
        <div className="px-4 pb-3 border-t border-white/20">
          <div className="flex items-center gap-2 mt-2">
            {currentDashboard.icon}
            <div className="flex-1">
              <p className="text-sm font-semibold">{currentDashboard.name}</p>
              <p className="text-xs opacity-75">{currentDashboard.description}</p>
            </div>
            <Eye className="w-5 h-5 opacity-75" />
          </div>
        </div>
      </div>

      {/* Spacer for fixed header - Only on mobile */}
      <div className="lg:hidden h-32"></div>

      {/* Mobile Dashboard Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu Panel */}
          <div className="lg:hidden fixed top-32 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto">
            <div className="p-4">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Select Dashboard</h2>
                <p className="text-sm text-slate-600">Choose which section to view</p>
              </div>

              <div className="space-y-2">
                {dashboards.map((dashboard) => {
                  const isActive = dashboard.path === currentDashboard.path;
                  return (
                    <button
                      key={dashboard.path}
                      onClick={() => handleSelect(dashboard.path)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        isActive
                          ? "bg-blue-50 border-blue-500 shadow-md"
                          : "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isActive ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        {dashboard.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className={`font-semibold ${
                          isActive ? "text-blue-900" : "text-slate-900"
                        }`}>
                          {dashboard.name}
                        </h3>
                        <p className="text-sm text-slate-600">{dashboard.description}</p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Logout Button - HIGH PRIORITY - Before View Only Notice */}
              <div className="mt-6 mb-6">
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-red-500 bg-red-50 text-red-900 font-semibold transition-all hover:bg-red-100 active:bg-red-200 shadow-md"
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-red-500 text-white">
                    <LogOut className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-red-900">Logout</h3>
                    <p className="text-sm text-red-700">Sign out of your account</p>
                  </div>
                </button>
              </div>

              {/* View Only Notice */}
              <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900 mb-1">View Only Mode</h4>
                    <p className="text-xs text-amber-700">
                      Mobile devices have read-only access. All editing features are disabled to prevent accidental changes.
                      Use a desktop browser for full management capabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}