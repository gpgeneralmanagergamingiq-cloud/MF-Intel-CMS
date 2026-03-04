import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, Users, DollarSign, Star, TrendingDown, FileText, Settings, LogOut, User, Building2, Vault, CreditCard, Target, Zap, ScrollText, Wine } from "lucide-react";
import { useState, useEffect } from "react";
import { Login } from "./Login";
import { MobileDashboardSelector } from "./MobileDashboardSelector";
import { useIsMobile, useIsViewOnly } from "../hooks/useIsMobile";
import { Toaster } from "./ui/sonner";
import { HelpSystem } from "./HelpSystem";
import { UserType } from "../utils/pdfGenerator";
import { VersionChecker } from "./VersionChecker";
import { DebugPanel } from "./DebugPanel";

// Check if we're in development mode (localStorage)
const isDevelopmentMode = false; // Match USE_LOCAL_STORAGE in api.ts

// Hardcoded property - Grand Palace Casino
const PROPERTY_NAME = "Grand Palace Casino";
const PROPERTY_URL = "GrandPalace";
const PROPERTY_INTERNAL = "grand_palace";

function RootContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; userType: string; property?: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isViewOnly = useIsViewOnly(currentUser?.userType, location.pathname);

  useEffect(() => {
    // Check if user is already logged in (using localStorage for persistent login)
    const savedAuth = localStorage.getItem("casino_auth");
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setCurrentUser(authData);
      setIsAuthenticated(true);
      
      console.log("🔄 Restoring user session:", authData);
      
      // Redirect to appropriate page if on root path
      if (location.pathname === "/") {
        if (authData.userType === "Inspector") {
          navigate(`/${PROPERTY_URL}/ratings`, { replace: true });
        } else if (authData.userType === "Host") {
          navigate(`/${PROPERTY_URL}/players`, { replace: true });
        } else if (authData.userType === "Cashier") {
          navigate(`/${PROPERTY_URL}/cage`, { replace: true });
        } else if (authData.userType === "Waiter") {
          navigate(`/${PROPERTY_URL}/comps`, { replace: true });
        } else {
          navigate(`/${PROPERTY_URL}`, { replace: true });
        }
      }
    }
  }, [location.pathname, navigate]);

  const handleLogin = (username: string, userType: string, needsPasswordChange: boolean, propertyInternal: string) => {
    console.log("✅ handleLogin called with:", { username, userType, propertyInternal });
    
    // Normal login flow - always authenticate directly
    console.log("✅ Normal login - authenticating user");
    const authData = { username, userType, property: PROPERTY_INTERNAL };
    setCurrentUser(authData);
    setIsAuthenticated(true);
    localStorage.setItem("casino_auth", JSON.stringify(authData));
    
    // Navigate to appropriate default page based on user type
    let targetUrl = `/${PROPERTY_URL}`;
    if (userType === "Inspector") {
      targetUrl = `/${PROPERTY_URL}/ratings`;
    } else if (userType === "Host") {
      targetUrl = `/${PROPERTY_URL}/players`;
    } else if (userType === "Cashier") {
      targetUrl = `/${PROPERTY_URL}/cage`;
    } else if (userType === "Waiter") {
      targetUrl = `/${PROPERTY_URL}/comps`;
    }
    
    console.log("🚀 Navigating to:", targetUrl);
    navigate(targetUrl, { replace: true });
  };

  const handleLogout = () => {
    console.log("🚪 Logging out...");
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("casino_auth");
    // Navigate to root to show login page
    navigate("/", { replace: true });
  };

  // Check if user has access to a specific feature
  const hasAccess = (feature: string): boolean => {
    if (!currentUser) return false;
    
    const userType = currentUser.userType;
    
    // Management has access to everything
    if (userType === "Management") return true;
    
    // Owner has view-only access to everything
    if (userType === "Owner") {
      return true; // Can view all tabs
    }
    
    // Pit Boss: Access to Edit Float Transactions and Ratings. Full view access
    if (userType === "Pit Boss") {
      return true; // Can view and edit floats and ratings, full view access to everything
    }
    
    // Inspector: Access to Edit Ratings. No View (only ratings tab visible)
    if (userType === "Inspector") {
      return feature === "ratings";
    }
    
    // Host: Add Players and Create Rating Cards. View Only for Player Activity. Access to Comps
    if (userType === "Host") {
      return feature === "players" || feature === "ratings" || feature === "reports" || feature === "comps";
    }
    
    // Waiter: Access to Comps only
    if (userType === "Waiter") {
      return feature === "comps";
    }
    
    return false;
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    console.log("Rendering Login component");
    return <Login onLogin={handleLogin} />;
  }

  console.log("Rendering main app layout");
  
  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-slate-50">
      {/* Development Mode Banner */}
      {isDevelopmentMode && (
        <div className="bg-yellow-500 text-yellow-900 px-6 py-2 text-center text-sm font-semibold">
          🔧 DEVELOPMENT MODE - Using LocalStorage (Supabase Disconnected)
        </div>
      )}

      {/* Mobile Dashboard Selector - Only visible on mobile */}
      {isMobile && <MobileDashboardSelector username={currentUser?.username} userType={currentUser?.userType} onLogout={handleLogout} />}

      {/* Header - Hidden on mobile */}
      <header className="hidden lg:block bg-slate-900 text-white shadow-lg">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">MF-Intel CMS</h1>
            <p className="text-xs text-slate-300">for Gaming IQ</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Property Display - Fixed for Grand Palace Casino */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">{PROPERTY_NAME}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{currentUser?.username}</span>
              <span className="text-xs text-slate-400">({currentUser?.userType})</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation - Hidden on mobile */}
      <nav className="hidden lg:block bg-white shadow-md border-b">
        <div className="w-full px-6">
          <div className="flex gap-8">
            {/* Dashboard - visible to Management, Owner, and Pit Boss */}
            {(currentUser?.userType === "Management" || 
              currentUser?.userType === "Owner" || 
              currentUser?.userType === "Pit Boss") && (
              <NavLink
                to={`/${PROPERTY_URL}`}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </NavLink>
            )}
            
            {/* Players - Management, Pit Boss, and Host */}
            {(currentUser?.userType === "Management" || 
              currentUser?.userType === "Pit Boss" ||
              currentUser?.userType === "Host") && (
              <NavLink
                to={`/${PROPERTY_URL}/players`}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                <Users className="w-5 h-5" />
                <span>Players</span>
              </NavLink>
            )}
            
            {/* Floats - Management and Pit Boss (can edit) */}
            {(currentUser?.userType === "Management" || 
              currentUser?.userType === "Pit Boss") && (
              <NavLink
                to={`/${PROPERTY_URL}/floats`}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                <DollarSign className="w-5 h-5" />
                <span>Floats</span>
              </NavLink>
            )}
            
            {/* Ratings - Management, Pit Boss, Inspector, Host */}
            {(currentUser?.userType === "Management" || 
              currentUser?.userType === "Pit Boss" || 
              currentUser?.userType === "Inspector" || 
              currentUser?.userType === "Host") && (
              <NavLink
                to={`/${PROPERTY_URL}/ratings`}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                <Star className="w-5 h-5" />
                <span>Ratings</span>
              </NavLink>
            )}
            
            {/* Drop - Management, Owner, and Pit Boss (view access) */}
            {(currentUser?.userType === "Management" || 
              currentUser?.userType === "Owner" || 
              currentUser?.userType === "Pit Boss") && (
              <NavLink
                to={`/${PROPERTY_URL}/drop`}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                <TrendingDown className="w-5 h-5" />
                <span>Drop</span>
              </NavLink>
            )}
            
            {/* Reports - Management, Owner, Pit Boss, and Host */}
            {(currentUser?.userType === "Management" || 
              currentUser?.userType === "Owner" || 
              currentUser?.userType === "Pit Boss" ||
              currentUser?.userType === "Host") && (
              <NavLink
                to={`/${PROPERTY_URL}/reports`}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                <FileText className="w-5 h-5" />
                <span>Reports</span>
              </NavLink>
            )}
            
            {/* Cage - Management and Cashier */}
            {(currentUser?.userType === "Management" || currentUser?.userType === "Cashier") && (
              <NavLink
                to={`/${PROPERTY_URL}/cage`}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                <Vault className="w-5 h-5" />
                <span>Cage</span>
              </NavLink>
            )}
            
            {/* Comps - Management, Host, and Waiter */}
            {(currentUser?.userType === "Management" || 
              currentUser?.userType === "Host" ||
              currentUser?.userType === "Waiter") && (
              <NavLink
                to={`/${PROPERTY_URL}/comps`}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                <Wine className="w-5 h-5" />
                <span>Comps</span>
              </NavLink>
            )}
            
            {/* Credit Lines - Management, Cashier, Pit Boss */}
            {(currentUser?.userType === "Management" || 
              currentUser?.userType === "Cashier" || 
              currentUser?.userType === "Pit Boss") && (
              <NavLink
                to={`/${PROPERTY_URL}/credit-line-management`}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                <CreditCard className="w-5 h-5" />
                <span>Credit Lines</span>
              </NavLink>
            )}
            
            {/* Marketing Campaigns - Management, Owner, Host */}
            {(currentUser?.userType === "Management" || 
              currentUser?.userType === "Owner" || 
              currentUser?.userType === "Host") && (
              <NavLink
                to={`/${PROPERTY_URL}/marketing-campaigns`}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                <Target className="w-5 h-5" />
                <span>Marketing</span>
              </NavLink>
            )}
            
            {/* Jackpots - Management and Pit Boss */}
            {(currentUser?.userType === "Management" || 
              currentUser?.userType === "Pit Boss") && (
              <NavLink
                to={`/${PROPERTY_URL}/jackpots`}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                <Zap className="w-5 h-5" />
                <span>Jackpots</span>
              </NavLink>
            )}
            
            {/* Setup - Management only */}
            {currentUser?.userType === "Management" && (
              <NavLink
                to={`/${PROPERTY_URL}/setup`}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                <Settings className="w-5 h-5" />
                <span>Setup</span>
              </NavLink>
            )}
            
            {/* Audit Log - Management and Owner only */}
            {(currentUser?.userType === "Management" || 
              currentUser?.userType === "Owner") && (
              <NavLink
                to={`/${PROPERTY_URL}/audit-log`}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                <ScrollText className="w-5 h-5" />
                <span>Audit Log</span>
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        <Outlet context={{ 
          currentUser, 
          hasAccess, 
          isViewOnly,
          currentProperty: PROPERTY_INTERNAL,
          currentPropertyDisplay: PROPERTY_NAME,
        }} />
      </main>
      
      {/* Help System */}
      {currentUser && (
        <HelpSystem 
          userType={currentUser.userType as UserType} 
          currentPage={getCurrentPageName()}
        />
      )}
    </div>
  );
  
  // Helper function to get current page name
  function getCurrentPageName() {
    const path = location.pathname;
    if (path === '/' || path === `/${PROPERTY_URL}`) return 'Dashboard';
    const segments = path.split('/').filter(Boolean);
    // Skip property segment (first segment)
    if (segments.length > 1) {
      const pageName = segments[1]; // Get page name after property
      return pageName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    } else if (segments.length === 1) {
      // Could be property name or page name
      const segment = segments[0];
      // Check if it's a known page
      if (['players', 'floats', 'ratings', 'drop', 'reports', 'cage', 'comps', 'setup', 'jackpots', 'audit-log'].includes(segment)) {
        return segment.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }
      return 'Dashboard'; // It's a property name
    }
    return 'Dashboard';
  }
}

export function Root() {
  return (
    <>
      <RootContent />
      <Toaster richColors position="top-right" />
      <VersionChecker />
      <DebugPanel />
    </>
  );
}
