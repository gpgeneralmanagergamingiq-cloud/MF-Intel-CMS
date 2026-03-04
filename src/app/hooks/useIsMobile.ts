import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check screen size
      const isSmallScreen = window.innerWidth < 1024; // lg breakpoint
      
      // Check user agent for mobile devices
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // Check if touch device
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsMobile(isSmallScreen && (isMobileDevice || isTouchDevice));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export function useIsViewOnly(userType?: string, pathname?: string) {
  const isMobile = useIsMobile();
  
  // On mobile, always view-only
  if (isMobile) return true;
  
  // Owner is always view-only (except on mobile which is already handled above)
  if (userType === "Owner") return true;
  
  // Host has EDIT access ONLY on Players tab (/players)
  // All other tabs (Ratings, Reports, Comps, Marketing) are VIEW ONLY for Host
  if (userType === "Host" && pathname) {
    return pathname !== "/players"; // View-only on all tabs except Players
  }
  
  return false;
}