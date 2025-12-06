import { useParams, Link } from "react-router-dom";
import { ChevronRight, Bell, BellOff } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ActFilters } from "@/components/acts/ActFilters";
import { ActCard } from "@/components/acts/ActCard";
import { Button } from "@/components/ui/button";
import { categories, sampleActs } from "@/data/mockData";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categories.find((c) => c.id === categoryId);
  const [subscribed, setSubscribed] = useState(false);

  const [filters, setFilters] = useState({
    title: "",
    category: categoryId || "all",
    status: "",
    progress: "",
    sponsor: "",
    typAktu: "",
    kadencja: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      title: "",
      category: categoryId || "all",
      status: "",
      progress: "",
      sponsor: "",
      typAktu: "",
      kadencja: "",
    });
  };

  const filteredActs = useMemo(() => {
    return sampleActs.filter((act) => {
      if (categoryId && act.category !== categoryId) return false;
      if (filters.title && !act.title.toLowerCase().includes(filters.title.toLowerCase())) return false;
      if (filters.status && filters.status !== "all" && act.status !== filters.status) return false;
      if (filters.progress && filters.progress !== "all" && act.progress !== filters.progress) return false;
      if (filters.sponsor && filters.sponsor !== "all" && act.sponsor !== filters.sponsor) return false;
      if (filters.kadencja && filters.kadencja !== "all" && act.kadencja !== filters.kadencja) return false;
      return true;
    });
  }, [categoryId, filters]);

  const handleSubscribe = () => {
    setSubscribed(!subscribed);
    if (!subscribed) {
      toast.success(`Zasubskrybowano kategorię "${category?.name}"`, {
        description: "Będziesz otrzymywać powiadomienia o nowych aktach.",
      });
    } else {
      toast.info(`Anulowano subskrypcję kategorii "${category?.name}"`);
    }
  };

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Kategoria nie znaleziona</h1>
          <Link to="/" className="text-primary hover:underline">
            Wróć do strony głównej
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Strona główna
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">{category.name}</h1>
              <p className="opacity-90">
                {filteredActs.length}{" "}
                {filteredActs.length === 1 ? "akt" : filteredActs.length < 5 ? "akty" : "aktów"} prawnych
              </p>
            </div>
            <Button
              variant="outline"
              className={`border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 ${
                subscribed ? "bg-primary-foreground/20" : ""
              }`}
              onClick={handleSubscribe}
            >
              {subscribed ? (
                <>
                  <Bell className="h-5 w-5 mr-2 fill-current" />
                  Subskrybujesz
                </>
              ) : (
                <>
                  <BellOff className="h-5 w-5 mr-2" />
                  Subskrybuj kategorię
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <ActFilters filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />

        {filteredActs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">
              Nie znaleziono aktów spełniających kryteria wyszukiwania.
            </p>
            <Button variant="outline" onClick={handleReset}>
              Wyczyść filtry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredActs.map((act, index) => (
              <div key={act.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <ActCard act={act} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
