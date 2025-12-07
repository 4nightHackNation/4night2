import { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ChevronRight, Save, Plus, Trash2, Upload, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { filterOptions, categories } from "@/data/mockData";

const LEGISLATIVE_STAGES = [
  "Projekt został przyjęty do prac rady ministrów",
  "Zgłoszenia lobbingowe",
  "Uzgodnienia",
  "Konsultacje publiczne",
  "Opiniowanie",
  "Komitet Rady Ministrów do Spraw Cyfryzacji",
  "Komitet do Spraw Europejskich",
  "Komitet Społeczny Rady Ministrów",
  "Komitet Ekonomiczny Rady Ministrów",
  "Stały Komitet Rady Ministrów",
  "Komisja Prawnicza",
  "Potwierdzenie projektu przez Stały Komitet Rady Ministrów",
  "Rada Ministrów",
  "Notyfikacja",
  "Skierowanie projektu ustawy do Sejmu",
  "Wpłynięcie projektu do Sejmu",
  "I czytanie na posiedzeniu Sejmu",
  "Praca w komisjach po I czytaniu",
  "Sprawozdanie komisji po I czytaniu",
  "II czytanie na posiedzeniu Sejmu",
  "Praca w komisjach po II czytaniu",
  "Sprawozdanie komisji po II czytaniu",
  "III czytanie na posiedzeniu Sejmu",
  "Głosowanie w Sejmie",
  "Przekazanie ustawy Prezydentowi i Marszałkowi Senatu",
  "Wpłynięcie ustawy do Prezydenta",
  "Wpłynięcie ustawy do Marszałka Senatu",
  "Skierowanie ustawy do Komisji Senackich",
  "Rozpatrzenie ustawy przez Komisje Senackie",
  "Rozpatrzenie ustawy przez Senat",
  "Przekazanie uchwały do Sejmu",
  "Wpłynięcie do Sejmu stanowisko Senatu",
  "Praca w komisjach nad stanowiskiem Senatu",
  "Sprawozdanie komisji",
  "Rozpatrywanie na forum Sejmu stanowiska Senatu",
  "Przekazanie Ustawy Prezydentowi do podpisu",
  "Podpisanie przez Prezydenta Ustawy",
  "Przekazanie Ustawy do dziennika ustaw",
];
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  API_URL,
  API_ENDPOINTS,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiUploadFile,
} from "@/config/api";

type StatusType =
  | "planowany"
  | "procedowany"
  | "uchwalony"
  | "odrzucony"
  | "wycofany"
  | "draft";
type PriorityType = "low" | "normal" | "high";

interface Tag {
  id: number;
  name: string;
}

interface ActVersion {
  id: string;
  versionNumber: number;
  date: string;
  type: string;
  filePath: string;
}

interface ActStage {
  id: string;
  name: string;
  date: string;
  status: string;
  order: number;
}

interface ReadingVote {
  id: string;
  readingName: string;
  for: number;
  against: number;
  abstain: number;
  date: string | null;
}

interface CreateActFormState {
  title: string;
  plainLanguageSummary: string;
  status: StatusType;
  priority: PriorityType;
  sponsor: string;
  category: string;
  kadencja: string;
  currentStage: number;
  hasConsultation: boolean;
  consultationStart: string;
  consultationEnd: string;
  tagIds: number[];
}

export default function EditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const { t } = useTranslation("common");
  const searchParams = new URLSearchParams(location.search);
  const actIdParam = searchParams.get("actId");

  const [createdActId, setCreatedActId] = useState<string | null>(actIdParam);
  const [isCreating, setIsCreating] = useState(!actIdParam);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingAct, setLoadingAct] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [pdfFiles, setPdfFiles] = useState<Record<string, File>>({});

  const [formData, setFormData] = useState<CreateActFormState>({
    title: "",
    plainLanguageSummary: "",
    status: "draft",
    priority: "normal",
    sponsor: "",
    category: "",
    kadencja: "",
    currentStage: 0,
    hasConsultation: false,
    consultationStart: "",
    consultationEnd: "",
    tagIds: [],
  });

  const [versions, setVersions] = useState<ActVersion[]>([]);
  const [stages, setStages] = useState<ActStage[]>([]);
  const [readingVotes, setReadingVotes] = useState<ReadingVote[]>([]);

  // Load tags
  useEffect(() => {
    setLoadingTags(true);
    apiGet(API_ENDPOINTS.TAGS.LIST)
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setTags(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        toast.error("Nie udało się załadować tagów");
      })
      .finally(() => setLoadingTags(false));
  }, []);

  // Load act data when editing
  useEffect(() => {
    if (!actIdParam) return;
    setLoadingAct(true);
    apiGet(API_ENDPOINTS.ACTS.DETAIL_WITH_DETAILS(actIdParam))
      .then(async (res) => {
        if (!res.ok) {
          toast.error("Nie udało się załadować aktu");
          return;
        }
        const data = await res.json();
        
        setFormData({
          title: data.title ?? "",
          plainLanguageSummary: data.plainLanguageSummary ?? "",
          status: (data.status as StatusType) ?? "draft",
          priority: (data.priority as PriorityType) ?? "normal",
          sponsor: data.sponsor ?? "",
          category: data.category ?? "",
          kadencja: data.kadencja ?? "",
          currentStage: data.currentStage ?? 0,
          hasConsultation: Boolean(data.hasConsultation),
          consultationStart: data.consultationStart
            ? new Date(data.consultationStart).toISOString().split("T")[0]
            : "",
          consultationEnd: data.consultationEnd
            ? new Date(data.consultationEnd).toISOString().split("T")[0]
            : "",
          tagIds: Array.isArray(data.tags)
            ? data.tags.map((tag: any) => (typeof tag === "object" ? tag.id : Number(tag)))
            : [],
        });

        // Load versions, stages, reading votes
        if (Array.isArray(data.versions)) {
          setVersions(
            data.versions.map((v: any) => ({
              id: v.id,
              versionNumber: v.versionNumber ?? 1,
              date: v.date ? new Date(v.date).toISOString().split("T")[0] : "",
              type: v.type ?? "",
              filePath: v.filePath ?? "",
            }))
          );
        }
        if (Array.isArray(data.stages)) {
          setStages(
            data.stages.map((s: any) => ({
              id: s.id,
              name: s.name ?? "",
              date: s.date ? new Date(s.date).toISOString().split("T")[0] : "",
              status: s.status ?? "planned",
              order: s.order ?? 0,
            }))
          );
        }
        if (Array.isArray(data.readingVotes)) {
          setReadingVotes(
            data.readingVotes.map((v: any) => ({
              id: v.id,
              readingName: v.readingName ?? "",
              for: v.for ?? 0,
              against: v.against ?? 0,
              abstain: v.abstain ?? 0,
              date: v.date ? new Date(v.date).toISOString().split("T")[0] : null,
            }))
          );
        }
      })
      .finally(() => setLoadingAct(false));
  }, [actIdParam]);

  if (
    !isAuthenticated ||
    (user?.role !== "officer" && user?.role !== "admin")
  ) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Brak dostępu</h1>
          <p className="text-muted-foreground mb-6">
            Aby tworzyć lub edytować akty prawne, musisz być zalogowany jako
            urzędnik.
          </p>
          <Link to="/" className="text-primary hover:underline">
            Wróć do strony głównej
          </Link>
        </div>
      </Layout>
    );
  }

  const handleFormChange = (
    field: keyof CreateActFormState,
    value: string | boolean | number | number[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateAct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.sponsor || !formData.category || !formData.kadencja) {
      toast.error("Uzupełnij wymagane pola", {
        description: "Tytuł, sponsor, kategoria i kadencja są wymagane.",
      });
      return;
    }

    try {
      // Filtruj duplikaty tagów
      const uniqueTagIds = [...new Set(formData.tagIds)];

      const payload = {
        title: formData.title,
        plainLanguageSummary: formData.plainLanguageSummary,
        status: formData.status,
        priority: formData.priority,
        sponsor: formData.sponsor,
        category: formData.category,
        kadencja: formData.kadencja,
        currentStage: formData.currentStage,
        hasConsultation: formData.hasConsultation,
        consultationStart: formData.consultationStart
          ? new Date(formData.consultationStart).toISOString()
          : null,
        consultationEnd: formData.consultationEnd
          ? new Date(formData.consultationEnd).toISOString()
          : null,
        tagIds: uniqueTagIds,
      };

      const res = await apiPost(API_ENDPOINTS.ACTS.CREATE, payload);
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Błąd serwera" }));
        toast.error("Nie udało się utworzyć aktu", {
          description: error.message || "Spróbuj ponownie",
        });
        return;
      }

      const createdAct = await res.json();
      const newActId = createdAct.id;
      setCreatedActId(newActId);
      setIsCreating(false);
      toast.success("Akt został utworzony", {
        description: `ID: ${newActId}`,
      });
      
      // Update URL without navigation
      const newUrl = `${window.location.pathname}?actId=${newActId}`;
      window.history.pushState({}, "", newUrl);
    } catch (error) {
      toast.error("Wystąpił błąd podczas tworzenia aktu");
    }
  };

  const handleUpdateAct = async () => {
    if (!createdActId) return;

    try {
      // Filtruj duplikaty tagów
      const uniqueTagIds = [...new Set(formData.tagIds)];

      const payload = {
        title: formData.title,
        plainLanguageSummary: formData.plainLanguageSummary,
        status: formData.status,
        priority: formData.priority,
        sponsor: formData.sponsor,
        category: formData.category,
        kadencja: formData.kadencja,
        currentStage: formData.currentStage,
        hasConsultation: formData.hasConsultation,
        consultationStart: formData.consultationStart
          ? new Date(formData.consultationStart).toISOString()
          : null,
        consultationEnd: formData.consultationEnd
          ? new Date(formData.consultationEnd).toISOString()
          : null,
        tagIds: uniqueTagIds,
      };

      const res = await apiPut(API_ENDPOINTS.ACTS.UPDATE(createdActId), payload);
      if (!res.ok) {
        toast.error("Nie udało się zaktualizować aktu");
        return;
      }

      toast.success("Akt został zaktualizowany");
    } catch (error) {
      toast.error("Wystąpił błąd podczas aktualizacji aktu");
    }
  };

  const handleAddVersion = async () => {
    if (!createdActId) {
      toast.error("Najpierw utwórz akt");
      return;
    }

    const newVersion: Partial<ActVersion> = {
      versionNumber: versions.length + 1,
      date: new Date().toISOString().split("T")[0],
      type: "draft",
      filePath: "",
    };

    try {
      const payload = {
        versionNumber: newVersion.versionNumber!,
        date: new Date(newVersion.date!).toISOString(),
        type: newVersion.type!,
        filePath: newVersion.filePath!,
      };

      const res = await apiPost(
        API_ENDPOINTS.VERSIONS.CREATE(createdActId),
        payload
      );
      if (!res.ok) {
        toast.error("Nie udało się dodać wersji");
        return;
      }

      const created = await res.json();
      setVersions([
        ...versions,
        {
          id: created.id,
          versionNumber: created.versionNumber,
          date: new Date(created.date).toISOString().split("T")[0],
          type: created.type,
          filePath: created.filePath,
        },
      ]);
      toast.success("Wersja została dodana");
    } catch (error) {
      toast.error("Wystąpił błąd podczas dodawania wersji");
    }
  };

  const handleAddStage = async () => {
    if (!createdActId) {
      toast.error("Najpierw utwórz akt");
      return;
    }

    const newStage: Partial<ActStage> = {
      name: "",
      date: new Date().toISOString().split("T")[0],
      status: "planned",
      order: 0,
    };

    try {
      const payload = {
        name: newStage.name!,
        date: new Date(newStage.date!).toISOString(),
        status: newStage.status!,
        order: 0,
      };

      const res = await apiPost(
        API_ENDPOINTS.STAGES.CREATE(createdActId),
        payload
      );
      if (!res.ok) {
        toast.error("Nie udało się dodać etapu");
        return;
      }

      const created = await res.json();
      setStages([
        ...stages,
        {
          id: created.id,
          name: created.name,
          date: new Date(created.date).toISOString().split("T")[0],
          status: created.status,
          order: created.order,
        },
      ]);
      toast.success("Etap został dodany");
    } catch (error) {
      toast.error("Wystąpił błąd podczas dodawania etapu");
    }
  };

  const handleAddReadingVote = async () => {
    if (!createdActId) {
      toast.error("Najpierw utwórz akt");
      return;
    }

    const newVote: Partial<ReadingVote> = {
      readingName: "",
      for: 0,
      against: 0,
      abstain: 0,
      date: null,
    };

    try {
      const payload = {
        readingName: newVote.readingName!,
        for: newVote.for!,
        against: newVote.against!,
        abstain: newVote.abstain!,
        date: newVote.date ? new Date(newVote.date).toISOString() : null,
      };

      const res = await apiPost(
        API_ENDPOINTS.READING_VOTES.CREATE(createdActId),
        payload
      );
      if (!res.ok) {
        toast.error("Nie udało się dodać głosowania");
        return;
      }

      const created = await res.json();
      setReadingVotes([
        ...readingVotes,
        {
          id: created.id,
          readingName: created.readingName,
          for: created.for,
          against: created.against,
          abstain: created.abstain,
          date: created.date
            ? new Date(created.date).toISOString().split("T")[0]
            : null,
        },
      ]);
      toast.success("Głosowanie zostało dodane");
    } catch (error) {
      toast.error("Wystąpił błąd podczas dodawania głosowania");
    }
  };

  const handleUploadPdf = async (versionId: string) => {
    const pdfFile = pdfFiles[versionId];
    if (!pdfFile || !createdActId) {
      toast.error("Wybierz plik PDF");
      return;
    }

    try {
      console.log("Uploading PDF:", {
        actId: createdActId,
        versionId,
        fileName: pdfFile.name,
        fileSize: pdfFile.size,
        endpoint: API_ENDPOINTS.VERSIONS.UPLOAD_PDF(createdActId, versionId),
      });

      const res = await apiUploadFile(
        API_ENDPOINTS.VERSIONS.UPLOAD_PDF(createdActId, versionId),
        pdfFile
      );

      console.log("Upload response:", {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "Nieznany błąd");
        toast.error("Nie udało się przesłać pliku PDF", {
          description: errorText,
        });
        return;
      }

      // Backend zwraca NoContent (204) po udanym uploadzie
      // Pobierz zaktualizowaną wersję z serwera
      try {
        // Czekaj chwilę, aby backend zdążył zapisać plik
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const versionRes = await apiGet(
          API_ENDPOINTS.VERSIONS.DETAIL(createdActId, versionId)
        );
        console.log("Version detail response:", {
          status: versionRes.status,
          ok: versionRes.ok,
        });
        
        if (versionRes.ok) {
          const updatedVersion = await versionRes.json();
          console.log("Updated version from server:", updatedVersion);
          const newFilePath = updatedVersion.filePath;
          
          if (newFilePath) {
            setVersions(
              versions.map((v) =>
                v.id === versionId
                  ? {
                      ...v,
                      filePath: newFilePath,
                    }
                  : v
              )
            );
            console.log("Set filePath to:", newFilePath);
          } else {
            // Jeśli backend nie zwrócił filePath, ustaw jako "uploaded" aby pokazać przycisk
            console.log("No filePath in response, using 'uploaded' as fallback");
            setVersions(
              versions.map((v) =>
                v.id === versionId ? { ...v, filePath: "uploaded" } : v
              )
            );
          }
        } else {
          // Fallback - ustaw jako "uploaded" jeśli nie udało się pobrać
          const errorText = await versionRes.text().catch(() => "");
          console.log("Failed to fetch updated version:", errorText);
          setVersions(
            versions.map((v) =>
              v.id === versionId ? { ...v, filePath: "uploaded" } : v
            )
          );
        }
      } catch (e) {
        console.error("Error fetching updated version:", e);
        // Fallback - ustaw jako "uploaded"
        setVersions(
          versions.map((v) =>
            v.id === versionId ? { ...v, filePath: "uploaded" } : v
          )
        );
      }

      // Usuń plik z state
      const newPdfFiles = { ...pdfFiles };
      delete newPdfFiles[versionId];
      setPdfFiles(newPdfFiles);

      // Wyczyść input
      const input = document.getElementById(`pdf-${versionId}`) as HTMLInputElement;
      if (input) input.value = "";

      toast.success("Plik PDF został przesłany");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Wystąpił błąd podczas przesyłania pliku", {
        description: error instanceof Error ? error.message : "Nieznany błąd",
      });
    }
  };

  const handleGenerateSummary = async (versionId?: string) => {
    if (!createdActId) {
      toast.error("Najpierw utwórz akt");
      return;
    }

    // Sprawdzamy czy mamy PDF dla tej wersji
    const pdfFile = versionId ? pdfFiles[versionId] : null;
    if (!pdfFile) {
      toast.error("Najpierw dodaj plik PDF");
      return;
    }

    setGeneratingSummary(true);
    try {
      // Wysyłamy PDF jako multipart/form-data
      const formData = new FormData();
      formData.append('file', pdfFile);

      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}${API_ENDPOINTS.EXPLANATIONS.FROM_PDF}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Nie udało się wygenerować streszczenia" }));
        toast.error(error.message || "Nie udało się wygenerować streszczenia");
        return;
      }

      const result = await res.json();
      const summary = result.explanation || result.plainLanguageSummary || result.text || '';
      
      if (!summary) {
        toast.error("Serwer nie zwrócił streszczenia");
        return;
      }

      handleFormChange("plainLanguageSummary", summary);
      toast.success("Streszczenie zostało wygenerowane");
    } catch (error) {
      console.error('AI Explanation error:', error);
      toast.error("Wystąpił błąd podczas generowania streszczenia");
    } finally {
      setGeneratingSummary(false);
    }
  };

  const onPdfChange = (e: React.ChangeEvent<HTMLInputElement>, versionId: string) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      const newPdfFiles = { ...pdfFiles };
      delete newPdfFiles[versionId];
      setPdfFiles(newPdfFiles);
      return;
    }

    const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_BYTES) {
      toast.error("Plik jest za duży. Maksymalnie 10 MB.");
      e.target.value = "";
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      toast.error("Wybrany plik nie jest plikiem PDF.");
      e.target.value = "";
      return;
    }

    setPdfFiles({ ...pdfFiles, [versionId]: file });
  };

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
              {t("editor.breadcrumb_home")}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">
              {isCreating ? t("editor.breadcrumb_new_act") : "Edycja aktu"}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-8">
            {isCreating
              ? t("editor.title_create_new_act")
              : "Edycja aktu prawnego"}
          </h1>

          {/* Create Act Form */}
          {isCreating ? (
            <form onSubmit={handleCreateAct} className="space-y-8">
              <div className="gov-card">
                <h2 className="text-lg font-semibold mb-6">
                  {t("editor.basic.title")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title" className="text-base">
                      Tytuł *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleFormChange("title", e.target.value)}
                      placeholder="Wprowadź tytuł aktu"
                      className="mt-2 h-12"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="plainLanguageSummary" className="text-base">
                      Streszczenie w prostym języku
                    </Label>
                    <Textarea
                      id="plainLanguageSummary"
                      value={formData.plainLanguageSummary}
                      onChange={(e) =>
                        handleFormChange("plainLanguageSummary", e.target.value)
                      }
                      placeholder="Wprowadź streszczenie"
                      className="mt-2 min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-base">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) =>
                        handleFormChange("status", v as StatusType)
                      }
                    >
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.status.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {t(`status.${opt.value}`, opt.label)}
                          </SelectItem>
                        ))}
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="text-base">
                      Priorytet
                    </Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(v) =>
                        handleFormChange("priority", v as PriorityType)
                      }
                    >
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t("priority.low")}</SelectItem>
                        <SelectItem value="normal">
                          {t("priority.normal")}
                        </SelectItem>
                        <SelectItem value="high">{t("priority.high")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sponsor" className="text-base">
                      Sponsor *
                    </Label>
                    <Input
                      id="sponsor"
                      value={formData.sponsor}
                      onChange={(e) => handleFormChange("sponsor", e.target.value)}
                      placeholder="Wprowadź sponsora"
                      className="mt-2 h-12"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-base">
                      Kategoria *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleFormChange("category", value)}
                    >
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="kadencja" className="text-base">
                      Kadencja *
                    </Label>
                    <Input
                      id="kadencja"
                      value={formData.kadencja}
                      onChange={(e) => handleFormChange("kadencja", e.target.value)}
                      placeholder="np. X"
                      className="mt-2 h-12"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentStage" className="text-base">
                      Obecny etap
                    </Label>
                    <Select
                      value={
                        formData.currentStage >= 0 &&
                        formData.currentStage < LEGISLATIVE_STAGES.length
                          ? LEGISLATIVE_STAGES[formData.currentStage]
                          : ""
                      }
                      onValueChange={(v) => {
                        const index = LEGISLATIVE_STAGES.indexOf(v);
                        handleFormChange("currentStage", index >= 0 ? index : 0);
                      }}
                    >
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue placeholder="Wybierz obecny etap" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEGISLATIVE_STAGES.map((stageName, index) => (
                          <SelectItem key={index} value={stageName}>
                            {stageName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <Label className="text-base mb-2 block">Tagi</Label>
                  {loadingTags ? (
                    <p className="text-sm text-muted-foreground">Ładowanie tagów...</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <div key={tag.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${tag.id}`}
                            checked={formData.tagIds.includes(tag.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFormChange("tagIds", [
                                  ...formData.tagIds,
                                  tag.id,
                                ]);
                              } else {
                                handleFormChange(
                                  "tagIds",
                                  formData.tagIds.filter((id) => id !== tag.id)
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`tag-${tag.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {tag.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Consultations */}
              <div className="gov-card">
                <h2 className="text-lg font-semibold mb-6">
                  {t("editor.consultations.title")}
                </h2>

                <div className="flex items-center gap-4 mb-6">
                  <Switch
                    id="hasConsultation"
                    checked={formData.hasConsultation}
                    onCheckedChange={(v) => handleFormChange("hasConsultation", v)}
                  />
                  <Label
                    htmlFor="hasConsultation"
                    className="text-base cursor-pointer"
                  >
                    {t("editor.consultations.toggle_label")}
                  </Label>
                </div>

                {formData.hasConsultation && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="consultationStart">
                        {t("editor.consultations.start")}
                      </Label>
                      <Input
                        id="consultationStart"
                        type="date"
                        value={formData.consultationStart}
                        onChange={(e) =>
                          handleFormChange("consultationStart", e.target.value)
                        }
                        className="mt-2 h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="consultationEnd">
                        {t("editor.consultations.end")}
                      </Label>
                      <Input
                        id="consultationEnd"
                        type="date"
                        value={formData.consultationEnd}
                        onChange={(e) =>
                          handleFormChange("consultationEnd", e.target.value)
                        }
                        className="mt-2 h-12"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  {t("editor.actions.cancel")}
                </Button>
                <Button type="submit" className="bg-primary hover:bg-gov-navy-dark">
                  <Save className="h-5 w-5 mr-2" /> Utwórz akt
                </Button>
              </div>
            </form>
          ) : (
            // Edit Act - After Creation
            <div className="space-y-8">
              {/* Basic Info - Editable */}
              <div className="gov-card">
                <h2 className="text-lg font-semibold mb-6">
                  {t("editor.basic.title")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title" className="text-base">
                      Tytuł *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleFormChange("title", e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="plainLanguageSummary" className="text-base">
                      Streszczenie w prostym języku
                    </Label>
                    <Textarea
                      id="plainLanguageSummary"
                      value={formData.plainLanguageSummary}
                      onChange={(e) =>
                        handleFormChange("plainLanguageSummary", e.target.value)
                      }
                      className="mt-2 min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-base">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) =>
                        handleFormChange("status", v as StatusType)
                      }
                    >
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.status.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {t(`status.${opt.value}`, opt.label)}
                          </SelectItem>
                        ))}
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="text-base">
                      Priorytet
                    </Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(v) =>
                        handleFormChange("priority", v as PriorityType)
                      }
                    >
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t("priority.low")}</SelectItem>
                        <SelectItem value="normal">
                          {t("priority.normal")}
                        </SelectItem>
                        <SelectItem value="high">{t("priority.high")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sponsor" className="text-base">
                      Sponsor *
                    </Label>
                    <Input
                      id="sponsor"
                      value={formData.sponsor}
                      onChange={(e) => handleFormChange("sponsor", e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-base">
                      Kategoria *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleFormChange("category", value)}
                    >
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="kadencja" className="text-base">
                      Kadencja *
                    </Label>
                    <Input
                      id="kadencja"
                      value={formData.kadencja}
                      onChange={(e) => handleFormChange("kadencja", e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentStage" className="text-base">
                      Obecny etap
                    </Label>
                    <Select
                      value={
                        formData.currentStage >= 0 &&
                        formData.currentStage < LEGISLATIVE_STAGES.length
                          ? LEGISLATIVE_STAGES[formData.currentStage]
                          : ""
                      }
                      onValueChange={(v) => {
                        const index = LEGISLATIVE_STAGES.indexOf(v);
                        handleFormChange("currentStage", index >= 0 ? index : 0);
                      }}
                    >
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue placeholder="Wybierz obecny etap" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEGISLATIVE_STAGES.map((stageName, index) => (
                          <SelectItem key={index} value={stageName}>
                            {stageName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <Label className="text-base mb-2 block">Tagi</Label>
                  {loadingTags ? (
                    <p className="text-sm text-muted-foreground">Ładowanie tagów...</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <div key={tag.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${tag.id}`}
                            checked={formData.tagIds.includes(tag.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFormChange("tagIds", [
                                  ...formData.tagIds,
                                  tag.id,
                                ]);
                              } else {
                                handleFormChange(
                                  "tagIds",
                                  formData.tagIds.filter((id) => id !== tag.id)
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`tag-${tag.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {tag.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Consultations */}
                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-4">
                    {t("editor.consultations.title")}
                  </h3>
                  <div className="flex items-center gap-4 mb-6">
                    <Switch
                      id="hasConsultation"
                      checked={formData.hasConsultation}
                      onCheckedChange={(v) => handleFormChange("hasConsultation", v)}
                    />
                    <Label
                      htmlFor="hasConsultation"
                      className="text-base cursor-pointer"
                    >
                      {t("editor.consultations.toggle_label")}
                    </Label>
                  </div>

                  {formData.hasConsultation && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="consultationStart">
                          {t("editor.consultations.start")}
                        </Label>
                        <Input
                          id="consultationStart"
                          type="date"
                          value={formData.consultationStart}
                          onChange={(e) =>
                            handleFormChange("consultationStart", e.target.value)
                          }
                          className="mt-2 h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="consultationEnd">
                          {t("editor.consultations.end")}
                        </Label>
                        <Input
                          id="consultationEnd"
                          type="date"
                          value={formData.consultationEnd}
                          onChange={(e) =>
                            handleFormChange("consultationEnd", e.target.value)
                          }
                          className="mt-2 h-12"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Button onClick={handleUpdateAct} variant="outline">
                    <Save className="h-4 w-4 mr-2" /> Zapisz zmiany
                  </Button>
                </div>
              </div>

              {/* Versions Section */}
              <div className="gov-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Wersje</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddVersion}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Dodaj wersję
                  </Button>
                </div>

                <div className="space-y-4">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className="p-4 border border-border rounded-lg space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Numer wersji</Label>
                          <Input
                            value={version.versionNumber}
                            onChange={(e) =>
                              setVersions(
                                versions.map((v) =>
                                  v.id === version.id
                                    ? { ...v, versionNumber: parseInt(e.target.value) || 1 }
                                    : v
                                )
                              )
                            }
                            type="number"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Data</Label>
                          <Input
                            value={version.date}
                            onChange={(e) =>
                              setVersions(
                                versions.map((v) =>
                                  v.id === version.id ? { ...v, date: e.target.value } : v
                                )
                              )
                            }
                            type="date"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Typ</Label>
                          <Input
                            value={version.type}
                            onChange={(e) =>
                              setVersions(
                                versions.map((v) =>
                                  v.id === version.id ? { ...v, type: e.target.value } : v
                                )
                              )
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>

                      {/* PDF Upload for Version */}
                      <div className="space-y-2">
                        <Label>Dodaj PDF</Label>
                        {version.filePath && version.filePath !== "" ? (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              PDF został przesłany
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateSummary(version.id)}
                              disabled={generatingSummary}
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              {generatingSummary
                                ? "Generowanie..."
                                : "Wygeneruj streszczenie AI"}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => onPdfChange(e, version.id)}
                                className="hidden"
                                id={`pdf-${version.id}`}
                              />
                              <label
                                htmlFor={`pdf-${version.id}`}
                                className="flex-1 cursor-pointer"
                              >
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full"
                                  asChild
                                >
                                  <span>
                                    <Upload className="h-4 w-4 mr-2 inline" /> Wybierz PDF
                                  </span>
                                </Button>
                              </label>
                              {pdfFiles[version.id] && (
                                <Button
                                  type="button"
                                  onClick={() => handleUploadPdf(version.id)}
                                >
                                  Prześlij
                                </Button>
                              )}
                            </div>
                            {pdfFiles[version.id] && (
                              <p className="text-sm text-muted-foreground">
                                Wybrano: {pdfFiles[version.id].name} (
                                {Math.round(pdfFiles[version.id].size / 1024)} KB)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (!createdActId) return;
                            try {
                              const payload = {
                                versionNumber: version.versionNumber,
                                date: new Date(version.date).toISOString(),
                                type: version.type,
                                filePath: version.filePath,
                              };
                              const res = await apiPut(
                                API_ENDPOINTS.VERSIONS.UPDATE(createdActId, version.id),
                                payload
                              );
                              if (res.ok) {
                                toast.success("Wersja została zaktualizowana");
                              } else {
                                toast.error("Nie udało się zaktualizować wersji");
                              }
                            } catch (error) {
                              toast.error("Wystąpił błąd");
                            }
                          }}
                        >
                          <Save className="h-4 w-4 mr-2" /> Zapisz
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            if (!createdActId) return;
                            try {
                              const res = await apiDelete(
                                API_ENDPOINTS.VERSIONS.DELETE(createdActId, version.id)
                              );
                              if (res.ok) {
                                setVersions(versions.filter((v) => v.id !== version.id));
                                toast.success("Wersja została usunięta");
                              } else {
                                toast.error("Nie udało się usunąć wersji");
                              }
                            } catch (error) {
                              toast.error("Wystąpił błąd");
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Usuń
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stages Section */}
              <div className="gov-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Etapy</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddStage}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Dodaj etap
                  </Button>
                </div>

                <div className="space-y-4">
                  {stages.map((stage) => (
                    <div
                      key={stage.id}
                      className="p-4 border border-border rounded-lg space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nazwa</Label>
                          <Select
                            value={stage.name}
                            onValueChange={(v) =>
                              setStages(
                                stages.map((s) =>
                                  s.id === stage.id ? { ...s, name: v } : s
                                )
                              )
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Wybierz etap" />
                            </SelectTrigger>
                            <SelectContent>
                              {LEGISLATIVE_STAGES.map((stageName) => (
                                <SelectItem key={stageName} value={stageName}>
                                  {stageName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Data</Label>
                          <Input
                            value={stage.date}
                            onChange={(e) =>
                              setStages(
                                stages.map((s) =>
                                  s.id === stage.id ? { ...s, date: e.target.value } : s
                                )
                              )
                            }
                            type="date"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Select
                            value={stage.status}
                            onValueChange={(v) =>
                              setStages(
                                stages.map((s) =>
                                  s.id === stage.id ? { ...s, status: v } : s
                                )
                              )
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planned">Planowany</SelectItem>
                              <SelectItem value="in_progress">W trakcie</SelectItem>
                              <SelectItem value="completed">Zakończony</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (!createdActId) return;
                            try {
                              const payload = {
                                name: stage.name,
                                date: stage.date
                                  ? new Date(stage.date).toISOString()
                                  : new Date().toISOString(),
                                status: stage.status,
                                order: 0,
                              };
                              const res = await apiPut(
                                API_ENDPOINTS.STAGES.UPDATE(createdActId, stage.id),
                                payload
                              );
                              if (res.ok) {
                                toast.success("Etap został zaktualizowany");
                              } else {
                                toast.error("Nie udało się zaktualizować etapu");
                              }
                            } catch (error) {
                              toast.error("Wystąpił błąd");
                            }
                          }}
                        >
                          <Save className="h-4 w-4 mr-2" /> Zapisz
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            if (!createdActId) return;
                            try {
                              const res = await apiDelete(
                                API_ENDPOINTS.STAGES.DELETE(createdActId, stage.id)
                              );
                              if (res.ok) {
                                setStages(stages.filter((s) => s.id !== stage.id));
                                toast.success("Etap został usunięty");
                              } else {
                                toast.error("Nie udało się usunąć etapu");
                              }
                            } catch (error) {
                              toast.error("Wystąpił błąd");
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Usuń
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reading Votes Section */}
              <div className="gov-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Głosowania</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddReadingVote}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Dodaj głosowanie
                  </Button>
                </div>

                <div className="space-y-4">
                  {readingVotes.map((vote) => (
                    <div
                      key={vote.id}
                      className="p-4 border border-border rounded-lg space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Nazwa czytania</Label>
                          <Input
                            value={vote.readingName}
                            onChange={(e) =>
                              setReadingVotes(
                                readingVotes.map((v) =>
                                  v.id === vote.id
                                    ? { ...v, readingName: e.target.value }
                                    : v
                                )
                              )
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Za</Label>
                          <Input
                            value={vote.for}
                            onChange={(e) =>
                              setReadingVotes(
                                readingVotes.map((v) =>
                                  v.id === vote.id
                                    ? { ...v, for: parseInt(e.target.value) || 0 }
                                    : v
                                )
                              )
                            }
                            type="number"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Przeciw</Label>
                          <Input
                            value={vote.against}
                            onChange={(e) =>
                              setReadingVotes(
                                readingVotes.map((v) =>
                                  v.id === vote.id
                                    ? { ...v, against: parseInt(e.target.value) || 0 }
                                    : v
                                )
                              )
                            }
                            type="number"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Wstrzymało się</Label>
                          <Input
                            value={vote.abstain}
                            onChange={(e) =>
                              setReadingVotes(
                                readingVotes.map((v) =>
                                  v.id === vote.id
                                    ? { ...v, abstain: parseInt(e.target.value) || 0 }
                                    : v
                                )
                              )
                            }
                            type="number"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Data</Label>
                          <Input
                            value={vote.date || ""}
                            onChange={(e) =>
                              setReadingVotes(
                                readingVotes.map((v) =>
                                  v.id === vote.id ? { ...v, date: e.target.value } : v
                                )
                              )
                            }
                            type="date"
                            className="mt-2"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (!createdActId) return;
                            try {
                              const payload = {
                                readingName: vote.readingName,
                                for: vote.for,
                                against: vote.against,
                                abstain: vote.abstain,
                                date: vote.date
                                  ? new Date(vote.date).toISOString()
                                  : null,
                              };
                              const res = await apiPut(
                                API_ENDPOINTS.READING_VOTES.UPDATE(
                                  createdActId,
                                  vote.id
                                ),
                                payload
                              );
                              if (res.ok) {
                                toast.success("Głosowanie zostało zaktualizowane");
                              } else {
                                toast.error("Nie udało się zaktualizować głosowania");
                              }
                            } catch (error) {
                              toast.error("Wystąpił błąd");
                            }
                          }}
                        >
                          <Save className="h-4 w-4 mr-2" /> Zapisz
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            if (!createdActId) return;
                            try {
                              const res = await apiDelete(
                                API_ENDPOINTS.READING_VOTES.DELETE(
                                  createdActId,
                                  vote.id
                                )
                              );
                              if (res.ok) {
                                setReadingVotes(
                                  readingVotes.filter((v) => v.id !== vote.id)
                                );
                                toast.success("Głosowanie zostało usunięte");
                              } else {
                                toast.error("Nie udało się usunąć głosowania");
                              }
                            } catch (error) {
                              toast.error("Wystąpił błąd");
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Usuń
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
