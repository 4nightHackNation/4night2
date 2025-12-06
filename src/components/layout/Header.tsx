import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, LogOut, Menu, X, Plus, Minus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { sampleActs } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout } = useAuth();
  const { fontSize, setFontSize, highContrast, setHighContrast } = useAccessibility();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof sampleActs>([]);
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

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
    const success = await login(loginEmail, loginPassword);
    if (success) {
      setLoginDialogOpen(false);
      setLoginEmail("");
      setLoginPassword("");
    }
  };

  const fontSizeLabels = {
    normal: "A",
    large: "A+",
    xlarge: "A++",
  };

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
            <h1 className="text-lg lg:text-xl font-bold leading-tight">Radar Legislacyjny</h1>
            <p className="text-xs lg:text-sm opacity-80">Śledzenie procesów prawnych</p>
          </div>
        </Link>


          {/* Search - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl mx-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Szukaj aktów prawnych..."
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
                    <p className="font-medium text-foreground text-sm">{act.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{act.sponsor}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Accessibility controls - Desktop */}
            <div className="hidden lg:flex items-center gap-2 border-r border-primary-foreground/30 pr-4">
              <span className="text-xs opacity-80">Rozmiar:</span>
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
                <span className="text-xs">Kontrast</span>
              </Button>
            </div>

            {/* Auth */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20">
                    <User className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/edytor">Nowy akt</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/moje-subskrypcje">Moje subskrypcje</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Wyloguj
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20">
                    <User className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Zaloguj się</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Logowanie</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    {/* Demo account info */}
                    <div className="bg-muted p-3 rounded-lg border border-border">
                      <p className="text-sm font-medium text-foreground mb-1">🔑 Konto demo:</p>
                      <p className="text-xs text-muted-foreground">Email: <span className="font-mono bg-background px-1 rounded">demo@gov.pl</span></p>
                      <p className="text-xs text-muted-foreground">Hasło: <span className="font-mono bg-background px-1 rounded">demo123</span></p>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Adres e-mail
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="demo@gov.pl"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium mb-2">
                        Hasło
                      </label>
                      <Input
                        id="password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="demo123"
                        className="h-12"
                      />
                    </div>
                    <Button onClick={handleLogin} className="w-full h-12 bg-primary hover:bg-gov-navy-dark">
                      Zaloguj się
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Logowanie przeznaczone dla pracowników administracji publicznej
                    </p>
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
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
