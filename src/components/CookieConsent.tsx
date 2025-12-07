import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const { setAccepted, setRejected } = useCookieConsent();

  useEffect(() => {
    // Sprawdzenie, czy użytkownik już zaakceptował lub odrzucił ciasteczka
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    setAccepted(true);
    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    setIsOpen(false);
  };

  const handleReject = () => {
    setRejected(true);
    localStorage.setItem("cookieConsent", "rejected");
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Polityka Ciasteczek</AlertDialogTitle>
          <AlertDialogDescription className="text-base mt-4 space-y-4">
            <div>
              <p className="font-semibold text-foreground mb-2">Używamy ciasteczek, aby:</p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>Utrzymać sesję logowania</strong> - ciasteczka sesji przechowują token autoryzacji, umożliwiając Ci pozostanie zalogowanym</li>
                <li><strong>Zapamiętać Twoje preferencje</strong> - np. tryb dostępności (rozmiar czcionki, wysoki kontrast), wybrane kategorie i ustawienia wyświetlania</li>
                <li><strong>Analityka</strong> - anonimowe dane o użytkowaniu strony, aby poprawiać jej funkcjonalność</li>
              </ul>
            </div>

            <div className="bg-accent/50 p-3 rounded-md">
              <p className="text-sm">
                <strong>Ciasteczka niezbędne:</strong> Są wymagane do prawidłowego działania strony i nie można ich wyłączyć (sesja logowania).
              </p>
              <p className="text-sm mt-2">
                <strong>Ciasteczka preferencji:</strong> Przechowują Twoje ustawienia dostępności i preferencje (rozmiar czcionki, kontrast, itp.).
              </p>
              <p className="text-sm mt-2">
                <strong>Ciasteczka analityczne:</strong> Pomagają nam zrozumieć, jak używasz naszej strony.
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Szczegółowe informacje znajdują się w naszej{" "}
              <a href="/polityka-prywatnosci" target="_blank" className="underline hover:text-foreground">
                Polityce Prywatności
              </a>
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-3 pt-4">
          <AlertDialogAction onClick={handleAccept} className="bg-primary">
            Zaakceptuj Wszystkie
          </AlertDialogAction>
          <AlertDialogCancel onClick={handleReject} className="bg-secondary">
            Odrzuć Opcjonalne
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
