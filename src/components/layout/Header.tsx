import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, LogOut, Menu, X, Plus, Minus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { sampleActs } from "@/data/mockData";
import { TEST_ACCOUNTS } from "@/data/testData";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

export function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout } = useAuth();
  const { fontSize, setFontSize, highContrast, setHighContrast } =
    useAccessibility();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof sampleActs>([]);
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [citizenEmail, setCitizenEmail] = useState("");
  const [citizenPassword, setCitizenPassword] = useState("");
  const [activeLoginTab, setActiveLoginTab] = useState("citizen");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const results = sampleActs.filter(
        (act) =>
          act.title.toLowerCase().includes(query.toLowerCase()) ||
          act.summary.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleLogin = async () => {
    const email = activeLoginTab === "officer" ? loginEmail : adminEmail;
    const password =
      activeLoginTab === "officer" ? loginPassword : adminPassword;
    const role = activeLoginTab as "officer" | "admin";
    const success = await login(email, password, role);
    if (success) {
      setLoginDialogOpen(false);
      setLoginEmail("");
      setLoginPassword("");
      setAdminEmail("");
      setAdminPassword("");
    }
  };

  const handleCitizenLogin = async () => {
    const success = await login(citizenEmail, citizenPassword, "citizen");
    if (success) {
      setLoginDialogOpen(false);
      setCitizenEmail("");
      setCitizenPassword("");
    }
  };

  const fontSizeLabels = {
    normal: "A",
    large: "A+",
    xlarge: "A++",
  };
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    i18n.language || "pl"
  );

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/8.png"
              alt="Radar Legislacyjny – logo"
              className="w-10 h-10 lg:w-12 lg:h-12 rounded"
            />

            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl font-bold leading-tight">
                {t("site.title")}
              </h1>
              <p className="text-xs lg:text-sm opacity-80">
                {t("header.titleDescription")}
              </p>
            </div>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl mx-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("header.search_placeholder")}
                className="pl-10 bg-primary-foreground text-foreground border-none h-12"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                aria-label="Wyszukaj akty prawne"
              />
            </div>
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {searchResults.map((act) => (
                  <button
                    key={act.id}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-0"
                    onClick={() => {
                      navigate(`/akt/${act.id}`);
                      setShowResults(false);
                      setSearchQuery("");
                    }}
                  >
                    <p className="font-medium text-foreground text-sm">
                      {act.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {act.sponsor}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Accessibility controls - Desktop */}
            <div className="hidden lg:flex items-center gap-2 border-r border-primary-foreground/30 pr-4">
              <span className="text-xs opacity-80">
                {t("header.sizetext")}:
              </span>
              <div className="flex gap-1">
                {(["normal", "large", "xlarge"] as const).map((size) => (
                  <Button
                    key={size}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20",
                      fontSize === size && "bg-primary-foreground/30"
                    )}
                    onClick={() => setFontSize(size)}
                    aria-label={`Rozmiar czcionki ${fontSizeLabels[size]}`}
                  >
                    {fontSizeLabels[size]}
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 text-primary-foreground hover:bg-primary-foreground/20",
                  highContrast && "bg-primary-foreground/30"
                )}
                onClick={() => setHighContrast(!highContrast)}
                aria-label="Wysoki kontrast"
              >
                <Eye className="h-4 w-4 mr-1" />
                <span className="text-xs">{t("header.contrasttext")}</span>
              </Button>
            </div>

            {/* Auth */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {user?.role === "citizen" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/obywatel">Mój profil</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {(user?.role === "officer" || user?.role === "admin") && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/moje-projekty">Moje Projekty</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/edytor">Nowy akt</Link>
                      </DropdownMenuItem>
                      {user?.role === "admin" && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin-zarzadzanie">
                            Zarządzanie kontami
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Wyloguj
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">{t("auth.login")}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Logowanie</DialogTitle>
                  </DialogHeader>
                  <div className="pt-4">
                    <Tabs
                      value={activeLoginTab}
                      onValueChange={setActiveLoginTab}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="officer">Urzędnik</TabsTrigger>
                        <TabsTrigger value="admin">Administrator</TabsTrigger>
                        <TabsTrigger value="citizen">Obywatel</TabsTrigger>
                      </TabsList>

                      {/* Officer Login Tab */}
                      <TabsContent value="officer" className="space-y-4">
                        <div className="bg-muted p-3 rounded-lg border border-border space-y-2">
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">
                              🔑 Konto Urzędnika:
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Email:{" "}
                              <span className="font-mono bg-background px-1 rounded">
                                {TEST_ACCOUNTS.officer.email}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Hasło:{" "}
                              <span className="font-mono bg-background px-1 rounded">
                                {TEST_ACCOUNTS.officer.password}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="officer-email"
                            className="block text-sm font-medium mb-2"
                          >
                            Adres e-mail
                          </label>
                          <Input
                            id="officer-email"
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder={TEST_ACCOUNTS.officer.email}
                            className="h-12"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="officer-password"
                            className="block text-sm font-medium mb-2"
                          >
                            Hasło
                          </label>
                          <Input
                            id="officer-password"
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder={TEST_ACCOUNTS.officer.password}
                            className="h-12"
                          />
                        </div>
                        <Button
                          onClick={handleLogin}
                          className="w-full h-12 bg-primary hover:bg-gov-navy-dark"
                        >
                          Zaloguj się
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          Logowanie dla pracowników administracji publicznej
                        </p>
                      </TabsContent>

                      {/* Admin Login Tab */}
                      <TabsContent value="admin" className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                          <p className="text-sm font-medium text-amber-900 mb-1">
                            👨‍💼 Konto Administratora:
                          </p>
                          <p className="text-xs text-amber-700">
                            Email:{" "}
                            <span className="font-mono bg-white px-1 rounded">
                              {TEST_ACCOUNTS.admin.email}
                            </span>
                          </p>
                          <p className="text-xs text-amber-700">
                            Hasło:{" "}
                            <span className="font-mono bg-white px-1 rounded">
                              {TEST_ACCOUNTS.admin.password}
                            </span>
                          </p>
                          <p className="text-xs text-amber-600 mt-2">
                            Sekcja dla administratorów systemu
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="admin-email"
                            className="block text-sm font-medium mb-2"
                          >
                            Adres e-mail
                          </label>
                          <Input
                            id="admin-email"
                            type="email"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            placeholder={TEST_ACCOUNTS.admin.email}
                            className="h-12"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="admin-password"
                            className="block text-sm font-medium mb-2"
                          >
                            Hasło
                          </label>
                          <Input
                            id="admin-password"
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder={TEST_ACCOUNTS.admin.password}
                            className="h-12"
                          />
                        </div>
                        <Button
                          onClick={handleLogin}
                          className="w-full h-12 bg-amber-600 hover:bg-amber-700"
                        >
                          Zaloguj się
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          Logowanie dla administratorów systemu
                        </p>
                      </TabsContent>

                      {/* Citizen Login Tab */}
                      <TabsContent value="citizen" className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-1">
                            🔑 Konto testowe obywatela:
                          </p>
                          <p className="text-xs text-blue-700">
                            Email:{" "}
                            <span className="font-mono bg-white px-1 rounded">
                              {TEST_ACCOUNTS.citizen.email}
                            </span>
                          </p>
                          <p className="text-xs text-blue-700">
                            Hasło:{" "}
                            <span className="font-mono bg-white px-1 rounded">
                              {TEST_ACCOUNTS.citizen.password}
                            </span>
                          </p>
                          <p className="text-xs text-blue-600 mt-2">
                            Sekcja dla obywateli i organizacji pozarządowych
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="citizen-email"
                            className="block text-sm font-medium mb-2"
                          >
                            Adres e-mail
                          </label>
                          <Input
                            id="citizen-email"
                            type="email"
                            value={citizenEmail}
                            onChange={(e) => setCitizenEmail(e.target.value)}
                            placeholder={TEST_ACCOUNTS.citizen.email}
                            className="h-12"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="citizen-password"
                            className="block text-sm font-medium mb-2"
                          >
                            Hasło
                          </label>
                          <Input
                            id="citizen-password"
                            type="password"
                            value={citizenPassword}
                            onChange={(e) => setCitizenPassword(e.target.value)}
                            placeholder={TEST_ACCOUNTS.citizen.password}
                            className="h-12"
                          />
                        </div>
                        <Button
                          onClick={handleCitizenLogin}
                          className="w-full h-12 bg-primary hover:bg-primary/90"
                        >
                          Zaloguj się
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          Logowanie dla obywateli, organizacji pozarządowych i
                          zainteresowanych stron
                        </p>
                      </TabsContent>
                    </Tabs>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-primary-foreground/20 py-4 animate-fade-in">
            {/* Mobile search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Szukaj aktów prawnych..."
                className="pl-10 bg-primary-foreground text-foreground border-none h-12"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                aria-label="Wyszukaj akty prawne"
              />
            </div>

            {/* Mobile accessibility */}
            <div className="flex items-center justify-between py-3 border-t border-primary-foreground/20">
              <span className="text-sm">Rozmiar czcionki:</span>
              <div className="flex gap-2">
                {(["normal", "large", "xlarge"] as const).map((size) => (
                  <Button
                    key={size}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-10 w-10 p-0 text-primary-foreground hover:bg-primary-foreground/20",
                      fontSize === size && "bg-primary-foreground/30"
                    )}
                    onClick={() => setFontSize(size)}
                  >
                    {fontSizeLabels[size]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-primary-foreground/20">
              <span className="text-sm">Wysoki kontrast:</span>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-10 px-4 text-primary-foreground hover:bg-primary-foreground/20",
                  highContrast && "bg-primary-foreground/30"
                )}
                onClick={() => setHighContrast(!highContrast)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {highContrast ? "Włączony" : "Wyłączony"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
