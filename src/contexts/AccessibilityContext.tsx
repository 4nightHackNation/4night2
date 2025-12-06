import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAccessibilityCookie, setAccessibilityCookie } from "@/lib/cookieUtils";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

type FontSize = "normal" | "large" | "xlarge";

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const { isAccepted, isRejected } = useCookieConsent();

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    // Czytaj dane TYLKO jeśli zaakceptowano ciasteczka
    if (isAccepted) {
      const fromCookie = getAccessibilityCookie();
      if (fromCookie?.fontSize) return fromCookie.fontSize;
    }
    
    return "normal"; // Domyślna wartość
  });

  const [highContrast, setHighContrast] = useState(() => {
    // Czytaj dane TYLKO jeśli zaakceptowano ciasteczka
    if (isAccepted) {
      const fromCookie = getAccessibilityCookie();
      if (fromCookie?.highContrast !== undefined) return fromCookie.highContrast;
    }
    
    return false; // Domyślna wartość
  });

  useEffect(() => {
    // Zapisz TYLKO jeśli zaakceptowano ciasteczka
    if (isAccepted) {
      localStorage.setItem("fontSize", fontSize);
      setAccessibilityCookie({ fontSize, highContrast });
    } else {
      // Jeśli odrzucił - wyczyść localStorage dla opcjonalnych danych
      localStorage.removeItem("fontSize");
    }
    
    document.documentElement.classList.remove("font-size-normal", "font-size-large", "font-size-xlarge");
    document.documentElement.classList.add(`font-size-${fontSize}`);
  }, [fontSize, isAccepted, highContrast]);

  useEffect(() => {
    // Zapisz TYLKO jeśli zaakceptowano ciasteczka
    if (isAccepted) {
      localStorage.setItem("highContrast", String(highContrast));
      setAccessibilityCookie({ fontSize, highContrast });
    } else {
      // Jeśli odrzucił - wyczyść localStorage dla opcjonalnych danych
      localStorage.removeItem("highContrast");
    }
    
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast, isAccepted, fontSize]);

  return (
    <AccessibilityContext.Provider value={{ fontSize, setFontSize, highContrast, setHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
}
