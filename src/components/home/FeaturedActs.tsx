import { Link } from "react-router-dom";
import { ArrowRight, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { t } from "i18next";
import { useState, useEffect } from "react";
import { API_ENDPOINTS, apiGet } from "@/config/api";
import { sampleActs } from "@/data/mockData";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

function getStatusBadge(progress: string) {
  switch (progress) {
    case "przyjety":
      return <Badge className="bg-status-accepted text-white">Przyjęty</Badge>;
    case "w_toku":
      return <Badge className="bg-status-in-progress text-white">W toku</Badge>;
    case "archiwalny":
      return (
        <Badge className="bg-status-archived text-white">Archiwalny</Badge>
      );
    default:
      return null;
  }
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return format(date, "d MMM yyyy", { locale: pl });
  } catch {
    return dateString;
  }
};

export function FeaturedActs() {
  const [acts, setActs] = useState(sampleActs.slice(0, 4));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet(API_ENDPOINTS.ACTS.LIST)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          // Sortuj po dacie i weź 4 najnowsze
          const sorted = Array.isArray(data) 
            ? data
                .sort((a: any, b: any) => 
                  new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()
                )
                .slice(0, 4)
            : sampleActs.slice(0, 4);
          setActs(sorted);
        } else {
          setActs(sampleActs.slice(0, 4));
        }
      })
      .catch(() => {
        setActs(sampleActs.slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="py-12 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              {t("Najnowsze Akty") || "Najnowsze akty"}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t("Ostatnio dodane projekty ustaw") || "Ostatnio dodane projekty ustaw"}
            </p>
          </div>
          <Link
            to="/wszystkie"
            className="hidden sm:flex items-center gap-2 text-primary hover:text-gov-navy-dark font-medium transition-colors"
          >
            {t("acts.see_all")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {acts.map((act: any, index) => (
            <Link
              key={act.id}
              to={`/akt/${act.id}`}
              className="gov-card group hover:shadow-md transition-all duration-200 hover:border-primary/30 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                {getStatusBadge(act.progress)}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(act.dateSubmitted)}
                </span>
              </div>

              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {act.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {act.summary}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {act.sponsor}
                </span>
                <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  Szczegóły
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <Link
          to="/wszystkie"
          className="sm:hidden flex items-center justify-center gap-2 mt-6 text-primary hover:text-gov-navy-dark font-medium transition-colors"
        >
          Zobacz wszystkie akty
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
