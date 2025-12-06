import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CookieConsentContextType {
  isAccepted: boolean;
  isRejected: boolean;
  setAccepted: (accepted: boolean) => void;
  setRejected: (rejected: boolean) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [isAccepted, setIsAccepted] = useState(() => {
    const saved = localStorage.getItem("cookieConsent");
    return saved === "accepted";
  });

  const [isRejected, setIsRejected] = useState(() => {
    const saved = localStorage.getItem("cookieConsent");
    return saved === "rejected";
  });

  // Synchronizuj zmiany z localStorage
  useEffect(() => {
    if (isAccepted) {
      localStorage.setItem("cookieConsent", "accepted");
    } else if (isRejected) {
      localStorage.setItem("cookieConsent", "rejected");
    }
  }, [isAccepted, isRejected]);

  return (
    <CookieConsentContext.Provider
      value={{ isAccepted, isRejected, setAccepted: setIsAccepted, setRejected: setIsRejected }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return context;
}
