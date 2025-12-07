import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight, Save, Plus, Trash2 } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import {
  categories,
  sponsors,
  filterOptions,
  legislativeStages,
} from "@/data/mockData";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

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
  const { isAuthenticated, user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { t } = useTranslation("common");

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

  // create/revoke preview URL
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

  const handleChange = (
    field: keyof FormState,
    value: string | boolean | File | null | StatusType | PriorityType | string[]
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

  // file change handler with size limit (10MB) and validation
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
      return;
    }

    if (!isPdfFile(file)) {
      toast.error("Wybrany plik nie jest plikiem PDF.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    handleChange("pdfFile", file);
  };

  const addStage = () => {
    const newId = `s${stages.length + 1}`;
    setStages([
      ...stages,
      { id: newId, name: "", date: "", status: "pending" },
    ]);
  };

  const removeStage = (id: string) => {
    if (stages.length > 1) setStages(stages.filter((s) => s.id !== id));
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

    // fetch("/api/acts", { method: "POST", body: payload }) // uncomment and adapt

    toast.success("Akt został zapisany", { description: `ID: ${formData.id}` });
    navigate("/");
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
              {t("editor.breadcrumb_new_act")}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-8">
            {t("editor.title_create_new_act")}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic info */}
            <div className="gov-card">
              <h2 className="text-lg font-semibold mb-6">
                {t("editor.basic.title")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title" className="text-base">
                    {t("editor.fields.title.label")} *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder={t("editor.fields.title.placeholder")}
                    className="mt-2 h-12"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="pdfFile" className="text-base">
                    {t("editor.fields.pdf.label")}
                  </Label>

                  {/* custom upload: label changes border on hover, cursor pointer; input invisible overlay */}
                  <div className="relative mt-2 group">
                    <label
                      htmlFor="pdfFile"
                      className="
            flex items-center justify-center h-12 px-4 rounded-md
            border border-border
            text-sm text-foreground
            cursor-pointer
            transition-colors duration-150
            hover:border-primary
            group-hover:bg-primary
            group-hover:text-primary-foreground
            group-hover:border-primary
          "
                    >
                      {t("editor.fields.pdf.choose_file")}
                    </label>

                    <input
                      id="pdfFile"
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={onPdfChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  <div className="mt-2">
                    <Button type="button" variant="outline" size="sm">
                      {t("editor.fields.pdf.ogup_ai")}
                    </Button>
                  </div>

                  {formData.pdfFile ? (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        {t("editor.fields.pdf.selected")}:{" "}
                        {formData.pdfFile.name} —{" "}
                        {Math.round(formData.pdfFile.size / 1024)} KB
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        {previewUrl && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.open(previewUrl, "_blank")}
                          >
                            {t("editor.fields.pdf.open_preview")}
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
                          {t("editor.fields.pdf.remove_file")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      {t("editor.fields.pdf.no_file")}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="summary" className="text-base">
                    {t("editor.fields.summary.label")}
                  </Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => handleChange("summary", e.target.value)}
                    placeholder={t("editor.fields.summary.placeholder")}
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-base">
                    {t("editor.fields.category.label")} *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => handleChange("category", v)}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue
                        placeholder={t("editor.select.category_placeholder")}
                      />
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
                    {t("editor.fields.sponsor.label")} *
                  </Label>
                  <Select
                    value={formData.sponsor}
                    onValueChange={(v) => handleChange("sponsor", v)}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue
                        placeholder={t("editor.select.sponsor_placeholder")}
                      />
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
                    {t("editor.fields.status.label")}
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => handleChange("status", v)}
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
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority" className="text-base">
                    {t("editor.fields.priority.label")}
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(v) => handleChange("priority", v)}
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
                  onCheckedChange={(v) => handleChange("hasConsultation", v)}
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
                        handleChange("consultationStart", e.target.value)
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
                  {t("editor.stages.title")}
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStage}
                >
                  <Plus className="h-4 w-4 mr-2" />{" "}
                  {t("editor.stages.add_stage")}
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
                          <SelectValue
                            placeholder={t("editor.stages.select_placeholder")}
                          />
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
                {t("editor.actions.cancel")}
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-gov-navy-dark"
              >
                <Save className="h-5 w-5 mr-2" /> {t("editor.actions.save_act")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
