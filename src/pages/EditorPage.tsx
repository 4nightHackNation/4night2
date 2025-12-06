import { useState } from "react";
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

export default function EditorPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    id: `PL_2025_${String(Math.floor(Math.random() * 900) + 100)}`,
    title: "",
    summary: "",
    status: "planowany",
    category: "",
    tags: [] as string[],
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

  const handleChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addStage = () => {
    const newId = `s${stages.length + 1}`;
    setStages([
      ...stages,
      { id: newId, name: "", date: "", status: "pending" },
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

    // In real app, this would send data to backend
    toast.success("Akt został zapisany", {
      description: `ID: ${formData.id}`,
    });

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
                  <Label htmlFor="summary" className="text-base">
                    Streszczenie
                  </Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => handleChange("summary", e.target.value)}
                    placeholder="Krótki opis celu i zakresu aktu..."
                    className="mt-2 min-h-[120px]"
                  />
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
                    onValueChange={(v) => handleChange("status", v)}
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
                    onValueChange={(v) => handleChange("priority", v)}
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
                  onCheckedChange={(v) => handleChange("hasConsultation", v)}
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
