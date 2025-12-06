import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight, Save, Plus, Trash2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import {
  categories,
  sponsors,
  filterOptions,
  legislativeStages,
} from "@/data/mockData";
import { toast } from "sonner";

type StatusType =
  | "planowany"
  | "procedowany"
  | "uchwalony"
  | "odrzucony"
  | "wycofany";
type PriorityType = "low" | "normal" | "high";

interface FormState {
  id: string;
  title: string;
  summary: string;
  pdfFile: File | null;
  status: StatusType;
  category: string;
  tags: string[];
  priority: PriorityType;
  sponsor: string;
  hasConsultation: boolean;
  consultationStart: string;
  consultationEnd: string;
  urgency: string;
}

export default function EditorPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<FormState>({
    id: `PL_2025_${String(Math.floor(Math.random() * 900) + 100)}`,
    title: "",
    summary: "",
    pdfFile: null,
    status: "planowany",
    category: "",
    tags: [],
    priority: "normal",
    sponsor: "",
    hasConsultation: false,
    consultationStart: "",
    consultationEnd: "",
    urgency: "normal",
  });

  const [stages, setStages] = useState([
    {
      id: "s1",
      name: "Projekt został przyjęty do prac rady ministrów",
      date: "",
      status: "pending" as const,
    },
  ]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // helper: update form
  const handleChange = (
    field: keyof FormState,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // validate file: MIME + extension
  const isPdfFile = (file: File | null) => {
    if (!file) return false;
    const okMime = file.type === "application/pdf";
    const okExt = file.name.toLowerCase().endsWith(".pdf");
    return okMime || okExt;
  };

  // on file change with validation + size limit (10MB)
  const onPdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      handleChange("pdfFile", null);
      return;
    }

    const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_BYTES) {
      toast.error("Plik jest za duży. Maksymalnie 10 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      handleChange("pdfFile", null);
      return;
    }

    if (!isPdfFile(file)) {
      toast.error("Nieprawidłowy typ pliku — załaduj plik PDF (.pdf).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      handleChange("pdfFile", null);
      return;
    }

    handleChange("pdfFile", file);
  };

  // manage preview URL lifecycle
  useEffect(() => {
    if (!formData.pdfFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(formData.pdfFile);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
    };
  }, [formData.pdfFile]);

  const addStage = () => {
    const newId = `s${stages.length + 1}`;
    setStages([
      ...stages,
      { id: newId, name: "", date: "", status: "pending" as const },
    ]);
  };

  const removeStage = (id: string) => {
    if (stages.length > 1) {
      setStages(stages.filter((s) => s.id !== id));
    }
  };

  const updateStage = (id: string, field: string, value: string) => {
    setStages(stages.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.sponsor) {
      toast.error("Uzupełnij wymagane pola", {
        description: "Tytuł, kategoria i wnioskodawca są wymagane.",
      });
      return;
    }

    if (!formData.pdfFile) {
      toast.error("Dodaj PDF z treścią aktu");
      return;
    }

    // przygotowanie wysyłki
    const payload = new FormData();
    payload.append("id", formData.id);
    payload.append("title", formData.title);
    payload.append("category", formData.category);
    payload.append("status", formData.status);
    payload.append("priority", formData.priority);
    payload.append("sponsor", formData.sponsor);
    payload.append("summary", formData.summary);
    payload.append("hasConsultation", String(formData.hasConsultation));
    if (formData.consultationStart)
      payload.append("consultationStart", formData.consultationStart);
    if (formData.consultationEnd)
      payload.append("consultationEnd", formData.consultationEnd);
    if (formData.pdfFile) payload.append("pdf", formData.pdfFile);

    // fetch("/api/acts", { method: "POST", body: payload }) // <-- uncomment + adjust to backend

    toast.success("Akt został zapisany", {
      description: `ID: ${formData.id}`,
    });

    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Brak dostępu</h1>
          <p className="text-muted-foreground mb-6">
            Aby tworzyć lub edytować akty prawne, musisz być zalogowany.
          </p>
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
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Strona główna
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Nowy akt</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-8">
            Tworzenie nowego aktu prawnego
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic info */}
            <div className="gov-card">
              <h2 className="text-lg font-semibold mb-6">
                Informacje podstawowe
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title" className="text-base">
                    Tytuł aktu *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Projekt ustawy o..."
                    className="mt-2 h-12"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="pdfFile" className="text-base">
                    Treść aktu (PDF)
                  </Label>

                  <div className="relative mt-2">
                    <input
                      id="pdfFile"
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={onPdfChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer peer"
                    />

                    <label
                      htmlFor="pdfFile"
                      className="
                        flex items-center justify-center h-12 px-4 rounded-md
                        border border-border
                        text-sm text-foreground
                        cursor-pointer
                        transition-colors
                        hover:border-primary
                        peer-hover:bg-primary
                        peer-hover:text-primary-foreground
                      "
                    >
                      Wybierz plik PDF
                    </label>
                  </div>

                  {formData.pdfFile ? (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        Wybrano: {formData.pdfFile.name} —{" "}
                        {Math.round(formData.pdfFile.size / 1024)} KB
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        {previewUrl && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.open(previewUrl, "_blank")}
                          >
                            Otwórz podgląd PDF
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                            handleChange("pdfFile", null);
                          }}
                        >
                          Usuń plik
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      Brak załadowanego PDF (opcjonalne)
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="summary" className="text-base">
                    Streszczenie
                  </Label>
                  <textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => handleChange("summary", e.target.value)}
                    placeholder="Krótki opis celu i zakresu aktu..."
                    className="mt-2 w-full rounded-md border p-2 min-h-[120px]"
                  />

                  <div className="mt-3">
                    <Button type="button" variant="outline" size="sm">
                      ogup tekst
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="category" className="text-base">
                    Kategoria *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => handleChange("category", v)}
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
                  <Label htmlFor="sponsor" className="text-base">
                    Wnioskodawca *
                  </Label>
                  <Select
                    value={formData.sponsor}
                    onValueChange={(v) => handleChange("sponsor", v)}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Wybierz wnioskodawcę" />
                    </SelectTrigger>
                    <SelectContent>
                      {sponsors.map((sponsor) => (
                        <SelectItem key={sponsor} value={sponsor}>
                          {sponsor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status" className="text-base">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) =>
                      handleChange("status", v as StatusType)
                    }
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.status.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
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
                      handleChange("priority", v as PriorityType)
                    }
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Niski</SelectItem>
                      <SelectItem value="normal">Normalny</SelectItem>
                      <SelectItem value="high">Wysoki</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Consultations */}
            <div className="gov-card">
              <h2 className="text-lg font-semibold mb-6">
                Konsultacje publiczne
              </h2>

              <div className="flex items-center gap-4 mb-6">
                <Switch
                  id="hasConsultation"
                  checked={formData.hasConsultation}
                  onCheckedChange={(v) =>
                    handleChange("hasConsultation", v as boolean)
                  }
                />
                <Label
                  htmlFor="hasConsultation"
                  className="text-base cursor-pointer"
                >
                  Akt przewiduje konsultacje publiczne
                </Label>
              </div>

              {formData.hasConsultation && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="consultationStart">Data rozpoczęcia</Label>
                    <Input
                      id="consultationStart"
                      type="date"
                      value={formData.consultationStart}
                      onChange={(e) =>
                        handleChange("consultationStart", e.target.value)
                      }
                      className="mt-2 h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="consultationEnd">Data zakończenia</Label>
                    <Input
                      id="consultationEnd"
                      type="date"
                      value={formData.consultationEnd}
                      onChange={(e) =>
                        handleChange("consultationEnd", e.target.value)
                      }
                      className="mt-2 h-12"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Stages */}
            <div className="gov-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  Etapy procesu legislacyjnego
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStage}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj etap
                </Button>
              </div>

              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className="flex items-start gap-4 p-4 border border-border rounded-lg"
                  >
                    <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0 text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        value={stage.name}
                        onValueChange={(v) => updateStage(stage.id, "name", v)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Wybierz etap" />
                        </SelectTrigger>
                        <SelectContent>
                          {legislativeStages.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={stage.date}
                          onChange={(e) =>
                            updateStage(stage.id, "date", e.target.value)
                          }
                          className="h-11"
                        />
                        {stages.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 shrink-0 text-destructive hover:text-destructive"
                            onClick={() => removeStage(stage.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-gov-navy-dark"
              >
                <Save className="h-5 w-5 mr-2" />
                Zapisz akt
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
