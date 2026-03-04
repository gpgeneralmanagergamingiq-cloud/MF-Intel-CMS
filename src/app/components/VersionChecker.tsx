import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

// Current app version - increment this when making changes
const CURRENT_VERSION = '2.3.2';
const VERSION_CHECK_INTERVAL = 30000; // Check every 30 seconds
const AUTO_RELOAD_DELAY = 5000; // Auto-reload after 5 seconds

interface VersionCheckerProps {
  autoReload?: boolean; // If true, auto-reload without asking
}

export function VersionChecker({ autoReload = true }: VersionCheckerProps) {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_RELOAD_DELAY / 1000);

  useEffect(() => {
    // Store current version in localStorage on first load
    const storedVersion = localStorage.getItem('app_version');
    if (!storedVersion) {
      localStorage.setItem('app_version', CURRENT_VERSION);
    }

    // Check for version changes periodically
    const interval = setInterval(() => {
      checkVersion();
    }, VERSION_CHECK_INTERVAL);

    // Also check immediately on mount
    checkVersion();

    return () => clearInterval(interval);
  }, []);

  // Countdown timer for auto-reload
  useEffect(() => {
    if (newVersionAvailable && autoReload) {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // Countdown finished - reload
        handleReload();
      }
    }
  }, [newVersionAvailable, countdown, autoReload]);

  const checkVersion = () => {
    const storedVersion = localStorage.getItem('app_version');
    
    console.log('[VersionChecker] Current:', CURRENT_VERSION, 'Stored:', storedVersion);
    
    if (storedVersion && storedVersion !== CURRENT_VERSION) {
      console.log('[VersionChecker] NEW VERSION DETECTED! Triggering reload...');
      setNewVersionAvailable(true);
      
      // Show toast notification
      if (autoReload) {
        toast.info(`🔄 New version detected! Auto-reloading in ${AUTO_RELOAD_DELAY / 1000} seconds...`, {
          duration: AUTO_RELOAD_DELAY,
          action: {
            label: 'Reload Now',
            onClick: () => handleReload()
          }
        });
      } else {
        toast.info('🎉 New version available!', {
          duration: Infinity,
          action: {
            label: 'Reload',
            onClick: () => handleReload()
          }
        });
      }
    }
  };

  const handleReload = () => {
    console.log('[VersionChecker] Reloading application...');
    
    // Clear all caches before reload
    try {
      // Clear localStorage except authentication (so user stays logged in)
      const authData = localStorage.getItem('casino_auth');
      localStorage.clear();
      if (authData) {
        localStorage.setItem('casino_auth', authData);
      }
      
      // Update version
      localStorage.setItem('app_version', CURRENT_VERSION);
      
      // Clear session storage
      sessionStorage.clear();
      
      // Force hard reload
      window.location.reload();
    } catch (error) {
      console.error('[VersionChecker] Error during reload:', error);
      // Fallback to simple reload
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setNewVersionAvailable(false);
    // Update version to prevent repeated notifications
    localStorage.setItem('app_version', CURRENT_VERSION);
  };

  // Banner UI (only if not auto-reloading)
  if (newVersionAvailable && !autoReload) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <div>
              <p className="font-semibold">New version available!</p>
              <p className="text-sm text-blue-100">Please reload to get the latest updates.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReload}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Reload Now
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If auto-reload is enabled and countdown is active, show countdown banner
  if (newVersionAvailable && autoReload && countdown > 0) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <div>
              <p className="font-semibold">New version detected!</p>
              <p className="text-sm text-emerald-100">Auto-reloading in {countdown} second{countdown !== 1 ? 's' : ''}...</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReload}
              className="px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
            >
              Reload Now
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}