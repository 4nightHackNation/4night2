import { Link } from "react-router-dom";
import { ArrowRight, Clock, User } from "lucide-react";
import { featuredActs } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

function getStatusBadge(progress: string) {
  switch (progress) {
    case "przyjety":
      return <Badge className="bg-status-accepted text-white">Przyjęty</Badge>;
    case "w_toku":
      return <Badge className="bg-status-in-progress text-white">W toku</Badge>;
    case "archiwalny":
      return <Badge className="bg-status-archived text-white">Archiwalny</Badge>;
    default:
      return null;
  }
}

export function FeaturedActs() {
  return (
    <section className="py-12 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Wyróżnione akty</h2>
            <p className="text-muted-foreground mt-1">Najważniejsze projekty w bieżącej kadencji</p>
          </div>
          <Link
            to="/wszystkie"
            className="hidden sm:flex items-center gap-2 text-primary hover:text-gov-navy-dark font-medium transition-colors"
          >
            Zobacz wszystkie
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredActs.map((act, index) => (
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
                  {act.lastUpdated}
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
