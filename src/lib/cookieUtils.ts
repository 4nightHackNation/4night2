export interface AccessibilitySettings {
  fontSize: "normal" | "large" | "xlarge";
  highContrast: boolean;
}

const COOKIE_NAME = "accessibility";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 rok

/**
 * Zapisuje ustawienia dostępności w ciasteczku
 */
export function setAccessibilityCookie(settings: AccessibilitySettings): void {
  try {
    const json = JSON.stringify(settings);
    const encoded = encodeURIComponent(json);
    document.cookie = `${COOKIE_NAME}=${encoded}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Strict`;
  } catch (error) {
    console.error("Błąd przy zapisie ciasteczka dostępności:", error);
  }
}

/**
 * Odczytuje ustawienia dostępności z ciasteczka
 */
export function getAccessibilityCookie(): AccessibilitySettings | null {
  try {
    const cookies = document.cookie.split(";");
    const accessibilityCookie = cookies.find((c) =>
      c.trim().startsWith(`${COOKIE_NAME}=`)
    );

    if (!accessibilityCookie) return null;

    const value = accessibilityCookie.split("=")[1];
    const decoded = decodeURIComponent(value);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Błąd przy odczytie ciasteczka dostępności:", error);
    return null;
  }
}

/**
 * Usuwa ciasteczko dostępności (wylogowanie)
 */
export function clearAccessibilityCookie(): void {
  try {
    document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Strict`;
  } catch (error) {
    console.error("Błąd przy usuwaniu ciasteczka dostępności:", error);
  }
}
