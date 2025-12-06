import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Edit2, CheckCircle, XCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface OfficerAccount {
  id: string;
  email: string;
  name: string;
  role: "officer" | "admin";
  status: "active" | "inactive";
  createdAt: string;
  createdBy: string;
}

export default function AdminManagementPage() {
  const { user, isAuthenticated } = useAuth();
  const [officers, setOfficers] = useState<OfficerAccount[]>([
    {
      id: "1",
      email: "demo@gov.pl",
      name: "Demo Officer",
      role: "officer",
      status: "active",
      createdAt: "2025-01-15",
      createdBy: "System",
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "officer" as "officer" | "admin",
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Brak dostępu</h1>
          <p className="text-muted-foreground mb-6">
            Ta strona jest dostępna tylko dla administratorów.
          </p>
          <Link to="/" className="text-primary hover:underline">
            Wróć do strony głównej
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddOfficer = () => {
    if (!formData.email || !formData.name) {
      toast.error("Uzupełnij wszystkie pola");
      return;
    }

    const newOfficer: OfficerAccount = {
      id: Math.random().toString(36).substr(2, 9),
      email: formData.email,
      name: formData.name,
      role: formData.role,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: user?.email || "System",
    };

    setOfficers([...officers, newOfficer]);
    setFormData({ email: "", name: "", role: "officer" });
    setDialogOpen(false);
    toast.success("Konto urzędnika zostało dodane");
  };

  const handleDeleteOfficer = (id: string) => {
    setOfficers(officers.filter((officer) => officer.id !== id));
    toast.success("Konto zostało usunięte");
  };

  const handleToggleStatus = (id: string) => {
    setOfficers(
      officers.map((officer) =>
        officer.id === id
          ? { ...officer, status: officer.status === "active" ? "inactive" : "active" }
          : officer
      )
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Zarządzanie kontami</h1>
            <p className="text-muted-foreground">
              Administracja kontami urzędników i administratorów
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Dodaj konto urzędnika
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Dodaj nowe konto urzędnika</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="urzednik@gov.pl"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nazwa</label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Jan Kowalski"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rola</label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        role: value as "officer" | "admin",
                      })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="officer">Urzędnik</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddOfficer} className="w-full">
                  Dodaj konto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {officers.length}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Całkowicie kont
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {officers.filter((o) => o.status === "active").length}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Aktywne</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {officers.filter((o) => o.status === "inactive").length}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Nieaktywne
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Konta urzędników</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Nazwa
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Rola
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Utworzone
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {officers.map((officer) => (
                    <tr key={officer.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm">{officer.email}</td>
                      <td className="py-3 px-4 text-sm">{officer.name}</td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            officer.role === "admin"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {officer.role === "admin"
                            ? "Administrator"
                            : "Urzędnik"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <button
                          onClick={() => handleToggleStatus(officer.id)}
                          className="flex items-center gap-2 text-sm hover:opacity-70"
                        >
                          {officer.status === "active" ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Aktywne</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-red-600">Nieaktywne</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {officer.createdAt}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <button
                          onClick={() => handleDeleteOfficer(officer.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Usuń konto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
