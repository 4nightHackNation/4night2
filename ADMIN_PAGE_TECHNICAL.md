# Techniczne Szczegóły Implementacji

## 🔑 Kluczowe Funkcje

### 1. Generowanie Bezpiecznego Hasła

```typescript
const generatePassword = (length: number = 12): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
```

**Użycie**:
- Autogenerator hasła przy tworzeniu konta
- Regeneracja za pomocą przycisku "🔄"
- Hasła zawierają: `A-Z`, `a-z`, `0-9`, `!@#$%`

---

### 2. CRUD Operacje

#### CREATE - Dodaj Nowe Konto

```typescript
const handleAddOfficer = () => {
  // Walidacja
  if (!formData.email || !formData.name || !formData.password) {
    toast.error("Uzupełnij wszystkie pola");
    return;
  }

  // Walidacja email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    toast.error("Podaj prawidłowy adres email");
    return;
  }

  // Sprawdzenie duplikatów
  const emailExists = officers.some((o) => o.email === formData.email);
  if (emailExists) {
    toast.error("Konto z tym adresem email już istnieje");
    return;
  }

  // Tworz nowe konto
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
  toast.success("Konto urzędnika zostało dodane");
  resetForm();
  setDialogOpen(false);
};
```

#### READ - Filtrowanie Kont

```typescript
const filteredOfficers = officers.filter(
  (officer) =>
    officer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.name.toLowerCase().includes(searchTerm.toLowerCase())
);
```

#### UPDATE - Edytuj Konto

```typescript
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

// W handleAddOfficer:
if (editingId) {
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
  toast.success("Konto urzędnika zostało zaktualizowane");
}
```

#### DELETE - Usuń Konto

```typescript
const handleDeleteOfficer = (id: string) => {
  setOfficers(officers.filter((officer) => officer.id !== id));
  setDeleteId(null);
  toast.success("Konto zostało usunięte");
};
```

---

### 3. Kopiowanie do Schowka

```typescript
const handleCopyCredentials = (officer: OfficerAccount) => {
  const credentials = `Email: ${officer.email}\nHasło: ${officer.password}`;
  navigator.clipboard.writeText(credentials);
  toast.success("Dane logowania skopiowane do schowka");
};
```

**Output**:
```
Email: ktos@gov.pl
Hasło: aB3!dE$fGh9K
```

---

### 4. Zarządzanie Statusem

```typescript
onClick={() => {
  const newStatus =
    officer.status === "active" ? "inactive" : "active";
  setOfficers(
    officers.map((o) =>
      o.id === officer.id
        ? { ...o, status: newStatus }
        : o
    )
  );
  toast.success(
    `Konto ${newStatus === "active" ? "aktywowane" : "deaktywowane"}`
  );
}}
```

---

## 🎨 Struktura UI

### Dialog Dodawania/Edycji

```tsx
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
      Dodaj konto urzędnika
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>
        {editingId ? "Edytuj konto urzędnika" : "Dodaj nowe konto urzędnika"}
      </DialogTitle>
    </DialogHeader>
    {/* Formularz */}
  </DialogContent>
</Dialog>
```

### Pole Hasła z Pokazywaniem

```tsx
<div className="flex gap-2">
  <div className="flex-1 relative">
    <Input
      type={showPassword.form ? "text" : "password"}
      value={formData.password}
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
      className="absolute right-3 top-1/2 -translate-y-1/2"
    >
      {showPassword.form ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </button>
  </div>
  <Button
    variant="outline"
    size="sm"
    onClick={handleGeneratePassword}
    className="gap-2"
  >
    <RefreshCw className="h-4 w-4" />
  </Button>
</div>
```

### Tabela Kont

```tsx
<table className="w-full">
  <thead>
    <tr className="border-b border-border">
      <th>Email</th>
      <th>Nazwa</th>
      <th>Rola</th>
      <th>Status</th>
      <th>Utworzone</th>
      <th>Akcje</th>
    </tr>
  </thead>
  <tbody>
    {filteredOfficers.map((officer) => (
      <tr key={officer.id} className="border-b border-border hover:bg-muted/50">
        {/* Cells */}
        <td className="py-3 px-4 text-right">
          <div className="flex gap-2 justify-end">
            <button onClick={() => handleCopyCredentials(officer)}>
              <Copy className="h-4 w-4" />
            </button>
            <button onClick={() => handleEditOfficer(officer)}>
              <Edit2 className="h-4 w-4" />
            </button>
            <button onClick={() => setDeleteId(officer.id)}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## 📊 Statystyka Kont

```tsx
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
```

---

## 🔐 Walidacja Email

```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(formData.email)) {
  toast.error("Podaj prawidłowy adres email");
  return;
}
```

Sprawdza:
- ✅ Co najmniej jeden znak przed @
- ✅ Dokładnie jeden @
- ✅ Co najmniej jeden znak po @
- ✅ Kropka i domena
- ✅ Brak spacji

---

## 🎯 Stan Komponentu

```typescript
// Dane kont
const [officers, setOfficers] = useState<OfficerAccount[]>([...]);

// UI State
const [searchTerm, setSearchTerm] = useState("");
const [dialogOpen, setDialogOpen] = useState(false);
const [editingId, setEditingId] = useState<string | null>(null);
const [deleteId, setDeleteId] = useState<string | null>(null);

// Form State
const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
const [formData, setFormData] = useState({
  email: "",
  name: "",
  password: generatePassword(),
  role: "officer" as "officer" | "admin",
});
```

---

## 🔄 Lifecycle Funkcji

```
1. resetForm()
   - Resetuje formData
   - Generuje nowe hasło
   - Zeruje editingId

2. handleGeneratePassword()
   - Generuje nowe hasło
   - Aktualizuje formData

3. handleAddOfficer()
   - Waliduje dane
   - Sprawdza duplikaty
   - Tworzy/edytuje konto
   - Resetuje formularz
   - Zamyka dialog

4. handleEditOfficer()
   - Wczytuje dane konta
   - Ustawia editingId
   - Otwiera dialog

5. handleDeleteOfficer()
   - Filtruje tablicę
   - Zeruje deleteId
   - Pokazuje toast
```

---

## 💾 localStorage Integration (TODO)

```typescript
// Persist officers
useEffect(() => {
  localStorage.setItem("officers", JSON.stringify(officers));
}, [officers]);

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem("officers");
  if (saved) {
    setOfficers(JSON.parse(saved));
  }
}, []);
```

---

## 🚀 API Integration Przykład

```typescript
// Zamiast local state
const handleAddOfficer = async () => {
  // ... walidacja ...

  const response = await fetch("/api/users/officers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    const newOfficer = await response.json();
    setOfficers([...officers, newOfficer]);
    toast.success("Konto dodane");
  } else {
    toast.error("Błąd podczas dodawania konta");
  }
};
```

---

## 📦 Dependencje

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "lucide-react": "^0.462.0",
  "sonner": "^1.x",
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-alert-dialog": "^1.1.14",
  "@radix-ui/react-select": "^2.2.5"
}
```

---

## ✅ Checklist Testowania

- [ ] Dodaj nowe konto
- [ ] Edytuj istniejące konto
- [ ] Usuń konto (z potwierdzeniem)
- [ ] Wyszukaj po email
- [ ] Wyszukaj po nazwie
- [ ] Skopiuj dane logowania
- [ ] Zmień status (active/inactive)
- [ ] Regeneruj hasło
- [ ] Pokaż/ukryj hasło w formularzu
- [ ] Test na mobilnym
- [ ] Test walidacji email
- [ ] Test duplikatów email

---

**Wersja**: 1.0.0  
**Ostatnia aktualizacja**: 6 grudnia 2025
