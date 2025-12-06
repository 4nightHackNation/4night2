import { useState } from "react";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languages } from "@/data/mockData";

export function Footer() {
  const [selectedLanguage, setSelectedLanguage] = useState("pl");

  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
          <img
            src="/8.png"
            alt="Radar Legislacyjny – logo"
            className="w-10 h-10 lg:w-18 lg:h-18 rounded"
          />
              <div>
                <h3 className="font-bold">Radar Legislacyjny</h3>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              System monitorowania procesów legislacyjnych w Polsce. Śledź zmiany prawne od inicjacji do wejścia w życie.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Kontakt</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 opacity-80" />
                <a href="mailto:kontakt@radar-legislacyjny.gov.pl" className="hover:underline">
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
                  Ministerstwo Cyfryzacji<br />
                  ul. Królewska 27<br />
                  00-060 Warszawa
                </span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Przydatne linki</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.gov.pl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                  Portal GOV.PL
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://www.sejm.gov.pl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                  Sejm RP
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://www.senat.gov.pl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                  Senat RP
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://legislacja.rcl.gov.pl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                  RCL - Legislacja
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Language */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Język / Language</h4>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
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
            <p className="text-xs opacity-60 mt-2">
              Aktualnie dostępna tylko wersja polska
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-80">
            © 2025 Radar Legislacyjny. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:underline opacity-80 hover:opacity-100">Polityka prywatności</a>
            <a href="#" className="hover:underline opacity-80 hover:opacity-100">Dostępność</a>
            <a href="#" className="hover:underline opacity-80 hover:opacity-100">Regulamin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
