import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ActFilters } from "@/components/acts/ActFilters";
import { ActCard } from "@/components/acts/ActCard";
import { Button } from "@/components/ui/button";
import { sampleActs } from "@/data/mockData";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

function getActsNoun(count: number, lang: string) {
  const n = Math.abs(count);
  // polski
  if (lang.startsWith("pl") || lang === "pl") {
    if (n % 10 === 1 && n % 100 !== 11) return "akt";
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100))
      return "akty";
    return "aktów";
  }
  // ukraiński (prosty)
  if (lang.startsWith("uk") || lang === "uk") {
    if (n % 10 === 1 && n % 100 !== 11) return "акт";
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100))
      return "акти";
    return "актів";
  }
  // angielski
  if (lang.startsWith("en")) {
    return n === 1 ? "act" : "acts";
  }
  // niemiecki (prosty)
  if (lang.startsWith("de")) {
    return n === 1 ? "Gesetzesvorhaben" : "Gesetzesvorhaben";
  }
  // fallback
  return n === 1 ? "act" : "acts";
}

export default function AllActsPage() {
  const [filters, setFilters] = useState({
    title: "",
    category: "all",
    status: "",
    progress: "",
    sponsor: "",
    typAktu: "",
    kadencja: "",
  });

  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    i18n.language || "pl"
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      title: "",
      category: "all",
      status: "",
      progress: "",
      sponsor: "",
      typAktu: "",
      kadencja: "",
    });
  };

  const filteredActs = useMemo(() => {
    return sampleActs.filter((act) => {
      if (
        filters.title &&
        !act.title.toLowerCase().includes(filters.title.toLowerCase())
      )
        return false;
      if (
        filters.category &&
        filters.category !== "all" &&
        act.category !== filters.category
      )
        return false;
      if (
        filters.status &&
        filters.status !== "all" &&
        act.status !== filters.status
      )
        return false;
      if (
        filters.progress &&
        filters.progress !== "all" &&
        act.progress !== filters.progress
      )
        return false;
      if (
        filters.sponsor &&
        filters.sponsor !== "all" &&
        act.sponsor !== filters.sponsor
      )
        return false;
      if (
        filters.kadencja &&
        filters.kadencja !== "all" &&
        act.kadencja !== filters.kadencja
      )
        return false;
      return true;
    });
  }, [filters]);

  const count = filteredActs.length;
  const formattedCount = new Intl.NumberFormat(i18n.language).format(count);
  const actsWord = getActsNoun(count, i18n.language);

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("header.home", "Strona główna")}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">
              {t("allacts.title")}
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            {t("allacts.title")}
          </h1>
          <p className="opacity-90">
            {t("allacts.title_description", {
              count: count,
              acts: actsWord,
            })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <ActFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {filteredActs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">
              {t(
                "allacts.no_results",
                "Nie znaleziono aktów spełniających kryteria wyszukiwania."
              )}
            </p>
            <Button variant="outline" onClick={handleReset}>
              {t("allacts.clear_filters", "Wyczyść filtry")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredActs.map((act, index) => (
              <div
                key={act.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ActCard act={act} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
