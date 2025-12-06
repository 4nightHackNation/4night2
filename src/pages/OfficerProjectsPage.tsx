import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { sampleActs } from "@/data/mockData";
import { toast } from "sonner";

export default function OfficerProjectsPage() {
  const { user, isAuthenticated } = useAuth();
  
  // Mock: projekty stworzone przez tego urzędnika
  const myProjects = sampleActs.filter(
    (act) => act.sponsor === "Minister Finansów" || act.sponsor === "Minister Cyfryzacji"
  );

  const [projects, setProjects] = useState(myProjects);

  if (!isAuthenticated || (user?.role !== "officer" && user?.role !== "admin")) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Brak dostępu</h1>
          <p className="text-muted-foreground mb-6">
            Ta strona jest dostępna tylko dla urzędników.
          </p>
          <Link to="/" className="text-primary hover:underline">
            Wróć do strony głównej
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

  const statusLabels: Record<string, string> = {
    planowany: "Planowany",
    procedowany: "Procedowany",
    uchwalony: "Uchwalony",
    odrzucony: "Odrzucony",
    wycofany: "Wycofany",
  };

  const progressLabels: Record<string, string> = {
    przyjety: "Przyjęty",
    w_toku: "W toku",
    archiwalny: "Archiwalny",
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    toast.success("Projekt został usunięty");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Moje Projekty</h1>
            <p className="text-muted-foreground">
              Projekty utworzone przez Ciebie ({projects.length})
            </p>
          </div>
          <Link to="/edytor">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nowy projekt
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{projects.length}</div>
                <p className="text-sm text-muted-foreground mt-2">Wszystkie projekty</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {projects.filter((p) => p.status === "procedowany").length}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Procedowane</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {projects.filter((p) => p.status === "uchwalony").length}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Uchwalone</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {projects.filter((p) => p.hasConsultation).length}
                </div>
                <p className="text-sm text-muted-foreground mt-2">W konsultacjach</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-muted-foreground mb-6">Nie masz jeszcze żadnych projektów</p>
              <Link to="/edytor">
                <Button>Utwórz pierwszy projekt</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
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
                          {statusLabels[project.status]}
                        </Badge>
                        <Badge className={getProgressColor(project.progress)}>
                          {progressLabels[project.progress]}
                        </Badge>
                        {project.priority === "high" && (
                          <Badge variant="outline" className="border-accent text-accent">
                            Priorytet
                          </Badge>
                        )}
                        {project.hasConsultation && (
                          <Badge variant="outline" className="border-primary text-primary">
                            Konsultacje
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Timeline info */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Etap procedury</p>
                      <p className="font-semibold">
                        {project.currentStage} / {project.stages.length}
                      </p>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${(project.currentStage / project.stages.length) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Ostatnia aktualizacja: {project.lastUpdated}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 justify-center">
                      <Link to={`/akt/${project.id}`}>
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Eye className="h-4 w-4" />
                          Podgląd
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        disabled
                      >
                        <Edit2 className="h-4 w-4" />
                        Edytuj
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Usuń
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
