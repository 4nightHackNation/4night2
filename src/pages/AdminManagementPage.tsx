import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface OfficerAccount {
  id: string;
  email: string;
  name: string;
  password: string;
  role: "officer" | "admin";
  status: "active" | "inactive";
  createdAt: string;
  createdBy: string;
}

// Utility function to generate random password
const generatePassword = (length: number = 12): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export default function AdminManagementPage() {
  const { user, isAuthenticated } = useAuth();
  const [officers, setOfficers] = useState<OfficerAccount[]>([
    {
      id: "1",
      email: "demo@gov.pl",
      name: "Demo Officer",
      password: "Demo123!@#",
      role: "officer",
      status: "active",
      createdAt: "2025-01-15",
      createdBy: "System",
    },
  ]);

  const statusKey =
    status === "active" ? "status.activated" : "status.deactivated";

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: generatePassword(),
    role: "officer" as "officer" | "admin",
  });

  const resetForm = () => {
    setFormData({
      email: "",
      name: "",
      password: generatePassword(),
      role: "officer",
    });
    setEditingId(null);
  };

  const { t } = useTranslation("common"); // lub inny namespace, którego używasz

  const handleGeneratePassword = () => {
    setFormData({ ...formData, password: generatePassword() });
  };

  const handleCopyCredentials = (officer: OfficerAccount) => {
    const credentials = `Email: ${officer.email}\nHasło: ${officer.password}`;
    navigator.clipboard.writeText(credentials);
    toast.success(t("admin.copy_credentials_success"));
  };

  const handleAddOfficer = () => {
    if (!formData.email || !formData.name || !formData.password) {
      toast.error(t("errors.fill_all_fields"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(t("errors.invalid_email"));
      return;
    }

    if (editingId) {
      // Update existing officer
      setOfficers(
        officers.map((officer) =>
          officer.id === editingId
            ? {
                ...officer,
                email: formData.email,
                name: formData.name,
                password: formData.password,
                role: formData.role,
              }
            : officer
        )
      );
      toast.success(t("admin.update_success"));
    } else {
      // Add new officer
      const emailExists = officers.some((o) => o.email === formData.email);
      if (emailExists) {
        toast.error(t("admin.email_exists"));
        return;
      }

      const newOfficer: OfficerAccount = {
        id: Math.random().toString(36).substr(2, 9),
        email: formData.email,
        name: formData.name,
        password: formData.password,
        role: formData.role,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        createdBy: user?.email || "System",
      };

      setOfficers([...officers, newOfficer]);
      toast.success(t("admin.add_success"));
    }

    resetForm();
    setDialogOpen(false);
  };

  const handleDeleteOfficer = (id: string) => {
    setOfficers(officers.filter((officer) => officer.id !== id));
    setDeleteId(null);
    toast.success(t("admin.delete_success"));
  };

  const handleEditOfficer = (officer: OfficerAccount) => {
    setFormData({
      email: officer.email,
      name: officer.name,
      password: officer.password,
      role: officer.role,
    });
    setEditingId(officer.id);
    setDialogOpen(true);
  };

  const filteredOfficers = officers.filter(
    (officer) =>
      officer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t("admin.manage_accounts")}
            </h1>
            <p className="text-muted-foreground">
              {t("admin.manage_accounts_description")}
            </p>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t("admin.add_officer")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId
                    ? t("admin.edit_officer_account")
                    : t("admin.add_new_officer_account")}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("header.login_email")}
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    {t("admin.new_officer_name")}
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    {t("header.login_password")}
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type={showPassword.form ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="Hasło"
                        className="h-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            form: !showPassword.form,
                          })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword.form ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGeneratePassword}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("admin.new_officer_role_translation")}
                  </label>
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
                      <SelectItem value="officer">
                        {t("admin.new_role_officer")}
                      </SelectItem>
                      <SelectItem value="admin">
                        {t("admin.new_role_admin")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddOfficer} className="w-full">
                  {editingId
                    ? t("admin.update_account")
                    : t("admin.add_account")}
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
                <p className="text-sm text-muted-foreground mt-2">Nieaktywne</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Szukaj po email lub nazwie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10"
          />
        </div>

        {/* Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Konta urzędników ({filteredOfficers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {filteredOfficers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm
                    ? "Brak kont spełniających kryteria wyszukiwania"
                    : "Brak kont do wyświetlenia"}
                </div>
              ) : (
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
                    {filteredOfficers.map((officer) => (
                      <tr
                        key={officer.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm font-mono text-primary">
                          {officer.email}
                        </td>
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
                            onClick={() => {
                              const newStatus =
                                officer.status === "active"
                                  ? "inactive"
                                  : "active";
                              setOfficers(
                                officers.map((o) =>
                                  o.id === officer.id
                                    ? { ...o, status: newStatus }
                                    : o
                                )
                              );
                              toast.success(
                                t("admin.account_status_changed", {
                                  status: t(statusKey),
                                })
                              );
                            }}
                            className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
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
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleCopyCredentials(officer)}
                              className="text-blue-600 hover:text-blue-700 transition-colors p-1 hover:bg-blue-50 rounded"
                              title="Kopiuj dane logowania"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditOfficer(officer)}
                              className="text-amber-600 hover:text-amber-700 transition-colors p-1 hover:bg-amber-50 rounded"
                              title="Edytuj konto"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteId(officer.id)}
                              className="text-red-600 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                              title="Usuń konto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Usunąć konto?</AlertDialogTitle>
              <AlertDialogDescription>
                Czy jesteś pewny? Ta akcja nie może być cofnięta. Konto
                urzędnika zostanie trwale usunięte.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-4">
              <AlertDialogCancel>Anuluj</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDeleteOfficer(deleteId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Usuń
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
