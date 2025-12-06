import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Trash2, Plus, X, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { categories, sampleActs } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function CitizenProfilePage() {
  const { user, isAuthenticated, updateSubscriptions } = useAuth();
  const [activeTab, setActiveTab] = useState<"subscriptions" | "projects">("subscriptions");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(user?.subscriptions || []);
  const [selectedProjects, setSelectedProjects] = useState<string[]>(user?.subscriptions || []);

  if (!isAuthenticated || user?.role !== "citizen") {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Brak dostępu</h1>
          <p className="text-muted-foreground mb-6">
            Ta strona jest dostępna tylko dla zalogowanych obywateli.
          </p>
          <Link to="/" className="text-primary hover:underline">
            Wróć do strony głównej
          </Link>
        </div>
      </Layout>
    );
  }

  const toggleCategory = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newSelected);
  };

  const toggleProject = (projectId: string) => {
    const newSelected = selectedProjects.includes(projectId)
      ? selectedProjects.filter((id) => id !== projectId)
      : [...selectedProjects, projectId];
    setSelectedProjects(newSelected);
  };

  const handleSaveSubscriptions = () => {
    const allSubscriptions = [...new Set([...selectedCategories, ...selectedProjects])];
    updateSubscriptions(allSubscriptions);
  };

  const consultationActs = sampleActs.filter(
    (act) => act.hasConsultation && act.status === "procedowany"
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mój profil</h1>
          <p className="text-muted-foreground">
            Email: <span className="font-medium text-foreground">{user?.email}</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border mb-6">
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={cn(
              "px-4 py-2 border-b-2 font-medium transition-colors",
              activeTab === "subscriptions"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Bell className="inline h-4 w-4 mr-2" />
            Subskrypcje
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={cn(
              "px-4 py-2 border-b-2 font-medium transition-colors",
              activeTab === "projects"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Śledzone projekty
          </button>
        </div>

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Zasubskrybowane kategorie</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCategories.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nie subskrybujesz żadnych kategorii</p>
                    <p className="text-sm text-muted-foreground mt-2">Kliknij poniżej aby dodać subskrypcje</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {categories
                      .filter((cat) => selectedCategories.includes(cat.id))
                      .map((category) => (
                        <button
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className="p-4 rounded-lg border-2 border-primary bg-primary/5 transition-all text-left hover:bg-primary/10"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{category.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{category.count} projektów</p>
                            </div>
                            <Check className="h-5 w-5 text-primary ml-2 flex-shrink-0" />
                          </div>
                        </button>
                      ))}
                  </div>
                )}

                <Card className="bg-muted/50 border-muted">
                  <CardHeader>
                    <CardTitle className="text-base">Dodaj nowe subskrypcje</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories
                        .filter((cat) => !selectedCategories.includes(cat.id))
                        .map((category) => (
                          <button
                            key={category.id}
                            onClick={() => toggleCategory(category.id)}
                            className="p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all text-left"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium">{category.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{category.count} projektów</p>
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleSaveSubscriptions} className="w-full mt-6">
                  Zapisz subskrypcje kategorii
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Śledzone projekty w konsultacjach publicznych</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nie śledzisz żadnych projektów</p>
                    <p className="text-sm text-muted-foreground mt-2">Kliknij poniżej aby dodać projekty do śledzenia</p>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    {consultationActs
                      .filter((act) => selectedProjects.includes(act.id))
                      .map((act) => (
                        <button
                          key={act.id}
                          onClick={() => toggleProject(act.id)}
                          className="w-full p-4 rounded-lg border-2 border-primary bg-primary/5 transition-all text-left hover:bg-primary/10"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium line-clamp-1">{act.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {act.sponsor} • Konsultacje do {act.consultationEnd}
                              </p>
                            </div>
                            <Check className="h-5 w-5 text-primary ml-2 flex-shrink-0" />
                          </div>
                        </button>
                      ))}
                  </div>
                )}

                <Card className="bg-muted/50 border-muted">
                  <CardHeader>
                    <CardTitle className="text-base">Dostępne projekty w konsultacjach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {consultationActs.filter((act) => !selectedProjects.includes(act.id)).length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        Wszystkie projekty w konsultacjach są już śledzone
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {consultationActs
                          .filter((act) => !selectedProjects.includes(act.id))
                          .map((act) => (
                            <button
                              key={act.id}
                              onClick={() => toggleProject(act.id)}
                              className="w-full p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all text-left"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium line-clamp-1">{act.title}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {act.sponsor} • Konsultacje do {act.consultationEnd}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button onClick={handleSaveSubscriptions} className="w-full mt-6">
                  Zapisz śledzenie projektów
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
