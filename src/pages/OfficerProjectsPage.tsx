import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { sampleActs } from "@/data/mockData";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { API_ENDPOINTS, apiGet, API_URL } from "@/config/api";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export default function OfficerProjectsPage() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date?: string) => {
    if (!date) return "";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return String(date);
    return format(parsed, "d MMMM yyyy, HH:mm", { locale: pl });
  };

  // Pobranie projektów urzędnika z API (teraz pełna lista, każdy może edytować)
  useEffect(() => {
    apiGet(API_ENDPOINTS.ACTS.LIST)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          const normalized = Array.isArray(data) ? data : [];
          setProjects(normalized.length ? normalized : sampleActs);
        } else {
          setProjects(sampleActs);
        }
      })
      .catch(() => {
        setProjects(sampleActs);
      })
      .finally(() => setLoading(false));
  }, []);

  if (
    !isAuthenticated ||
    (user?.role !== "officer" && user?.role !== "admin")
  ) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("officer.access_denied.title")}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t("officer.access_denied.description")}
          </p>
          <Link to="/" className="text-primary hover:underline">
            {t("officer.access_denied.back_home")}
          </Link>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planowany":
        return "bg-gray-100 text-gray-700";
      case "procedowany":
        return "bg-blue-100 text-blue-700";
      case "uchwalony":
        return "bg-green-100 text-green-700";
      case "odrzucony":
        return "bg-red-100 text-red-700";
      case "wycofany":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProgressColor = (progress: string) => {
    switch (progress) {
      case "przyjety":
        return "bg-status-accepted text-white";
      case "w_toku":
        return "bg-status-in-progress text-white";
      case "archiwalny":
        return "bg-status-archived text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Labels using i18n
  const statusLabels: Record<string, string> = {
    planowany: t("status.planowany"),
    procedowany: t("status.procedowany"),
    uchwalony: t("status.uchwalony"),
    odrzucony: t("status.odrzucony"),
    wycofany: t("status.wycofany"),
  };

  const progressLabels: Record<string, string> = {
    przyjety: t("progress.przyjety"),
    w_toku: t("progress.w_toku"),
    archiwalny: t("progress.archiwalny"),
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("officer.confirm.delete_project") || "Czy na pewno chcesz usunąć ten projekt?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}${API_ENDPOINTS.ACTS.DELETE(id)}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setProjects(projects.filter((p) => p.id !== id));
        toast.success(t("officer.toast.project_deleted"));
      } else {
        toast.error(t("officer.toast.delete_failed") || "Nie udało się usunąć projektu");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(t("officer.toast.delete_failed") || "Błąd przy usuwaniu projektu");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t("officer.header.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("officer.header.description", { count: projects.length })}
            </p>
          </div>
          <Link to="/edytor">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("officer.header.new_project")}
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {projects.length}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("officer.stats.all_projects")}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {projects.filter((p) => p.status === "procedowany").length}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("officer.stats.in_progress")}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {projects.filter((p) => p.status === "uchwalony").length}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("officer.stats.passed")}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {projects.filter((p) => p.hasConsultation).length}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("officer.stats.in_consultation")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-muted-foreground mb-6">
                {t("officer.empty.no_projects")}
              </p>
              <Link to="/edytor">
                <Button>{t("officer.empty.create_first")}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Main info */}
                    <div className="lg:col-span-2">
                      <Link to={`/akt/${project.id}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                          {project.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                        {project.summary}
                      </p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <Badge className={getStatusColor(project.status)}>
                          {statusLabels[project.status] || project.status}
                        </Badge>
                        <Badge className={getProgressColor(project.progress)}>
                          {progressLabels[project.progress] || project.progress}
                        </Badge>
                        {project.priority === "high" && (
                          <Badge
                            variant="outline"
                            className="border-accent text-accent"
                          >
                            {t("officer.badges.priority")}
                          </Badge>
                        )}
                        {project.hasConsultation && (
                          <Badge
                            variant="outline"
                            className="border-primary text-primary"
                          >
                            {t("officer.badges.consultation")}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Timeline info */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {t("officer.timeline.stage_label")}
                      </p>
                      {(() => {
                        const stages = Array.isArray(project.stages) ? project.stages : [];
                        
                        // Jeśli nie mamy etapów, pokazujemy "Brak etapu"
                        if (stages.length === 0) {
                          return (
                            <p className="font-semibold text-sm leading-relaxed text-muted-foreground">
                              Brak etapu
                            </p>
                          );
                        }

                        // Pobierz numer obecnego etapu (domyślnie 1)
                        const currentStageNumber = typeof project.currentStage === "number" && project.currentStage > 0
                          ? project.currentStage
                          : 1;
                        
                        // Konwertuj na index (0-based)
                        const currentStageIndex = Math.min(currentStageNumber - 1, stages.length - 1);
                        const currentStage = stages[currentStageIndex];
                        const currentStageName = currentStage?.name || currentStage?.title || "Etap nieznany";

                        return (
                          <p className="font-semibold text-sm leading-relaxed">
                            {currentStageName}
                          </p>
                        );
                      })()}
                      <p className="text-xs text-muted-foreground mt-2">
                        {t("officer.timeline.last_updated")}: {" "}
                        {formatDate(project.lastUpdated)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 justify-center">
                      <Link to={`/akt/${project.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          {t("officer.actions.view")}
                        </Button>
                      </Link>
                      <Link to={`/edytor?actId=${project.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                        >
                          <Edit2 className="h-4 w-4" />
                          {t("officer.actions.edit")}
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("officer.actions.delete")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
