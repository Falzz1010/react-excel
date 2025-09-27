import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      try {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      } catch (error) {
        console.warn('Error in mobile detection:', error);
        setIsMobile(false);
      }
    };
    
    try {
      mql.addEventListener("change", onChange);
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    } catch (error) {
      console.warn('Error setting up mobile detection:', error);
      setIsMobile(false);
    }
    
    return () => {
      try {
        mql.removeEventListener("change", onChange);
      } catch (error) {
        console.warn('Error cleaning up mobile detection:', error);
      }
    };
  }, []);

  return !!isMobile;
}
