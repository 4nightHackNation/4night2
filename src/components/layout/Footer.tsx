import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "@/data/mockData";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    i18n.language || "pl"
  );

  useEffect(() => {
    const onLangChanged = (lng: string) => setSelectedLanguage(lng);
    i18n.on("languageChanged", onLangChanged);
    return () => {
      i18n.off("languageChanged", onLangChanged);
    };
  }, []);

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    try {
      localStorage.setItem("appLang", code);
    } catch {
      // Ignore errors if localStorage is not available
    }
    setSelectedLanguage(code);
  };

  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/8.png"
                alt={`${t("site.title")} – logo`}
                className="w-10 h-10 lg:w-18 lg:h-18 rounded"
              />
              <div>
                <h3 className="font-bold">{t("site.title")}</h3>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              {t("site.description")}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 opacity-80" />
                <a
                  href="mailto:kontakt@radar-legislacyjny.gov.pl"
                  className="hover:underline"
                >
                  kontakt@radar-legislacyjny.gov.pl
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 opacity-80" />
                <span>+48 22 123 45 67</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 opacity-80" />
                <span>
                  Ministerstwo Cyfryzacji
                  <br />
                  ul. Królewska 27
                  <br />
                  00-060 Warszawa
                </span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">
              {t("footer.usefullinks")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.gov.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:underline"
                >
                  Portal GOV.PL
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              {/* ... reszta linków */}
            </ul>
          </div>

          {/* Language */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">
              {t("footer.language")}
            </h4>
            <Select value={selectedLanguage} onValueChange={handleChange}>
              <SelectTrigger className="w-full bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-80">
            © 2025 {t("site.title")}. {t("footer.all_rights_reserved")}
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="hover:underline opacity-80 hover:opacity-100"
            >
              {t("footer.privacy")}
            </a>
            <a
              href="#"
              className="hover:underline opacity-80 hover:opacity-100"
            >
              {t("footer.accessibility")}
            </a>
            <a
              href="#"
              className="hover:underline opacity-80 hover:opacity-100"
            >
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
