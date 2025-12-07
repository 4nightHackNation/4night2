import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Trash2, Plus, X, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { categories, sampleActs } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { API_ENDPOINTS, apiGet } from "@/config/api";

export default function CitizenProfilePage() {
  const { user, isAuthenticated, updateSubscriptions } = useAuth();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<"subscriptions" | "projects">(
    "subscriptions"
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    user?.subscriptions || []
  );
  const [selectedProjects, setSelectedProjects] = useState<string[]>(
    user?.subscriptions || []
  );
  const [consultationActs, setConsultationActs] = useState(sampleActs);
  const [loading, setLoading] = useState(true);

  // Pobranie aktów konsultacyjnych z API
  useEffect(() => {
    apiGet(API_ENDPOINTS.ACTS.LIST)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setConsultationActs(
            data.filter((act: any) => act.hasConsultation && act.status === "procedowany")
          );
        } else {
          setConsultationActs(
            sampleActs.filter(
              (act) => act.hasConsultation && act.status === "procedowany"
            )
          );
        }
      })
      .catch(() => {
        setConsultationActs(
          sampleActs.filter(
            (act) => act.hasConsultation && act.status === "procedowany"
          )
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (!isAuthenticated || user?.role !== "citizen") {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("citizen.access_denied.title")}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t("citizen.access_denied.description")}
          </p>
          <Link to="/" className="text-primary hover:underline">
            {t("citizen.access_denied.back_home")}
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
    const allSubscriptions = [
      ...new Set([...selectedCategories, ...selectedProjects]),
    ];
    updateSubscriptions(allSubscriptions);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t("citizen.header.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("citizen.header.email")}:{" "}
            <span className="font-medium text-foreground">{user?.email}</span>
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
            {t("citizen.tabs.subscriptions")}
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
            {t("citizen.tabs.projects")}
          </button>
        </div>

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("citizen.subscriptions.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCategories.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {t("citizen.subscriptions.empty")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t("citizen.subscriptions.empty_hint")}
                    </p>
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
                              <p className="text-xs text-muted-foreground mt-1">
                                {t("citizen.subscriptions.category_count", {
                                  count: category.count,
                                })}
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
                    <CardTitle className="text-base">
                      {t("citizen.subscriptions.add_new_title")}
                    </CardTitle>
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
                                <p className="text-xs text-muted-foreground mt-1">
                                  {t("citizen.subscriptions.category_count", {
                                    count: category.count,
                                  })}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleSaveSubscriptions}
                  className="w-full mt-6"
                >
                  {t("citizen.subscriptions.save_button")}
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
                <CardTitle>{t("citizen.projects.tracking_title")}</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {t("citizen.projects.empty")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t("citizen.projects.empty_hint")}
                    </p>
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
                              <p className="font-medium line-clamp-1">
                                {act.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {act.sponsor} •{" "}
                                {t("citizen.projects.consultation_until", {
                                  date: act.consultationEnd,
                                })}
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
                    <CardTitle className="text-base">
                      {t("citizen.projects.available_title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {consultationActs.filter(
                      (act) => !selectedProjects.includes(act.id)
                    ).length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        {t("citizen.projects.all_tracked")}
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
                                  <p className="font-medium line-clamp-1">
                                    {act.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {act.sponsor} •{" "}
                                    {t("citizen.projects.consultation_until", {
                                      date: act.consultationEnd,
                                    })}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button
                  onClick={handleSaveSubscriptions}
                  className="w-full mt-6"
                >
                  {t("citizen.projects.save_button")}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
