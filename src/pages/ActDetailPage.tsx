import { useParams, Link } from "react-router-dom";
import { ChevronRight, Download, Bell, BellOff, FileText, Calendar, User, Tag, ExternalLink } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { LegislativeTimeline } from "@/components/acts/LegislativeTimeline";
import { ActComments } from "@/components/acts/ActComments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleActs, categories } from "@/data/mockData";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { API_ENDPOINTS, apiGet } from "@/config/api";

function getProgressBadge(progress: string) {
  switch (progress) {
    case "przyjety":
      return <Badge className="bg-status-accepted text-white text-sm px-3 py-1">Przyjęty</Badge>;
    case "w_toku":
      return <Badge className="bg-status-in-progress text-white text-sm px-3 py-1">W toku</Badge>;
    case "archiwalny":
      return <Badge className="bg-status-archived text-white text-sm px-3 py-1">Archiwalny</Badge>;
    default:
      return null;
  }
}

export default function ActDetailPage() {
  const { actId } = useParams<{ actId: string }>();
  const [act, setAct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  // Pobranie aktu z API
  useEffect(() => {
    console.log("=== useEffect START ===");
    console.log("actId:", actId);
    if (!actId) {
      console.log("No actId, returning");
      return;
    }
    
    console.log("Making API request to:", API_ENDPOINTS.ACTS.DETAIL_WITH_DETAILS(actId));
    
    apiGet(API_ENDPOINTS.ACTS.DETAIL_WITH_DETAILS(actId))
      .then(async (res) => {
        console.log("API Response received, status:", res.status, "ok:", res.ok);
        if (res.ok) {
          const data = await res.json();
          console.log("Data from API:", data);
          setAct(data);
        } else {
          console.log("API returned error, using mockData");
          const mockAct = sampleActs.find((a) => a.id === actId);
          setAct(mockAct || null);
        }
      })
      .catch((err) => {
        console.error("API Error caught:", err);
        const mockAct = sampleActs.find((a) => a.id === actId);
        setAct(mockAct || null);
      })
      .finally(() => setLoading(false));
  }, [actId]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Ładowanie...</p>
        </div>
      </Layout>
    );
  }

  if (!act) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Akt nie znaleziony</h1>
          <Link to="/" className="text-primary hover:underline">
            Wróć do strony głównej
          </Link>
        </div>
      </Layout>
    );
  }

  const category = categories.find((c) => c.id === act.category);

  const handleSubscribe = () => {
    setSubscribed(!subscribed);
    if (!subscribed) {
      toast.success("Zasubskrybowano akt", {
        description: "Będziesz otrzymywać powiadomienia o zmianach.",
      });
    } else {
      toast.info("Anulowano subskrypcję aktu");
    }
  };

  const handleDownload = () => {
    toast.info("Pobieranie dokumentu...", {
      description: "Funkcja dostępna po połączeniu z backendem.",
    });
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Strona główna
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link
              to={`/kategoria/${act.category}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {category?.name}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium line-clamp-1">{act.id}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="gov-card">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {getProgressBadge(act.progress)}
                {act.priority === "high" && (
                  <Badge variant="outline" className="border-accent text-accent">
                    Priorytet
                  </Badge>
                )}
                {act.hasConsultation && (
                  <Badge variant="outline" className="border-primary text-primary">
                    Konsultacje publiczne
                  </Badge>
                )}
              </div>

              <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-4">{act.title}</h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <Button onClick={handleDownload} className="bg-primary hover:bg-gov-navy-dark">
                  <Download className="h-5 w-5 mr-2" />
                  Pobierz PDF
                </Button>
                <Button
                  variant="outline"
                  className={subscribed ? "border-accent text-accent" : ""}
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
                      Subskrybuj
                    </>
                  )}
                </Button>
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Wnioskodawca</p>
                    <p className="font-medium">{act.sponsor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Data złożenia</p>
                    <p className="font-medium">{act.dateSubmitted}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Kadencja</p>
                    <p className="font-medium">{act.kadencja} kadencja Sejmu RP</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ostatnia aktualizacja</p>
                    <p className="font-medium">{act.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="summary" className="gov-card p-0">
              <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="summary"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
                >
                  Streszczenie
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
                >
                  Przebieg prac
                </TabsTrigger>
                <TabsTrigger
                  value="versions"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
                >
                  Wersje dokumentu
                </TabsTrigger>
                {act.hasConsultation && (
                  <TabsTrigger
                    value="comments"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
                  >
                    Konsultacje publiczne
                  </TabsTrigger>
                )}
              </TabsList>

              <div className="p-6">
                <TabsContent value="summary" className="mt-0">
                  <h3 className="text-lg font-semibold mb-4">Streszczenie aktu</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{act.summary}</p>

                  {act.hasConsultation && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Konsultacje publiczne</h4>
                      <p className="text-sm text-muted-foreground">
                        Okres konsultacji: {act.consultationStart} - {act.consultationEnd}
                      </p>
                    </div>
                  )}

                  {act.votes?.iReading && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Wyniki głosowań</h4>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm font-medium mb-2">I czytanie</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-green-700">Za: {act.votes.iReading.for}</span>
                          <span className="text-red-700">Przeciw: {act.votes.iReading.against}</span>
                          <span className="text-gray-600">Wstrzymało się: {act.votes.iReading.abstain}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="timeline" className="mt-0">
                  <h3 className="text-lg font-semibold mb-6">Przebieg prac legislacyjnych</h3>
                  <LegislativeTimeline stages={act.stages} />
                </TabsContent>

                <TabsContent value="versions" className="mt-0">
                  <h3 className="text-lg font-semibold mb-4">Historia wersji dokumentu</h3>
                  <div className="space-y-3">
                    {act.versions.map((version) => (
                      <div
                        key={version.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">
                            Wersja {version.version} - {version.type}
                          </p>
                          <p className="text-sm text-muted-foreground">{version.date}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-2" />
                          Pobierz
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="comments" className="mt-0">
                  <ActComments
                    actId={act.id}
                    hasConsultation={act.hasConsultation}
                    consultationEnd={act.consultationEnd}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <div className="gov-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Tagi
              </h3>
              <div className="flex flex-wrap gap-2">
                {act.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick timeline */}
            <div className="gov-card">
              <h3 className="font-semibold mb-4">Etapy procesu</h3>
              <LegislativeTimeline stages={act.stages.slice(0, 6)} compact />
              {act.stages.length > 6 && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  +{act.stages.length - 6} więcej etapów
                </p>
              )}
            </div>

            {/* Related links */}
            <div className="gov-card">
              <h3 className="font-semibold mb-4">Powiązane zasoby</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://legislacja.rcl.gov.pl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    RCL - Legislacja
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.sejm.gov.pl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    Portal Sejmu RP
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
