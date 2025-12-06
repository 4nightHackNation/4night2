# 📊 Diagram Systemu - Admin Panel

## 🏗️ Architektura Strony

```
┌─────────────────────────────────────────────────────────────────┐
│                   ADMIN MANAGEMENT PAGE                          │
│                  /admin-zarzadzanie                             │
└─────────────────────────────────────────────────────────────────┘
           │
           ├─ [Access Check] → Tylko dla admin
           │
           ├──────────────────────────────────────────────────────┐
           │                                                      │
           ├─ HEADER                                             │
           │  ├─ Tytuł: "Zarządzanie kontami"                    │
           │  └─ Button: "+ Dodaj konto urzędnika"              │
           │                                                      │
           ├─ STATISTICS (Grid 3 kolumny)                        │
           │  ├─ Karta 1: Całkowite konta                        │
           │  ├─ Karta 2: Aktywne konta (zielony)               │
           │  └─ Karta 3: Nieaktywne konta (czerwony)           │
           │                                                      │
           ├─ SEARCH INPUT                                       │
           │  └─ Szukaj po email lub nazwie (real-time)         │
           │                                                      │
           ├─ ACCOUNTS TABLE                                     │
           │  ├─ Email                                           │
           │  ├─ Nazwa                                           │
           │  ├─ Rola (Officer/Admin)                           │
           │  ├─ Status (Active/Inactive - klikalne)            │
           │  ├─ Utworzone (data)                                │
           │  └─ Akcje (Copy, Edit, Delete)                      │
           │                                                      │
           └─ DIALOGS & ALERTS                                   │
              ├─ Dialog: Dodaj/Edytuj Konto                      │
              └─ AlertDialog: Potwierdz Usunięcie               │
```

---

## 🔄 Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    COMPONENT STATE                             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  officers: OfficerAccount[]                                   │
│  ├─ id, email, name, password                                │
│  ├─ role (officer | admin)                                   │
│  ├─ status (active | inactive)                               │
│  ├─ createdAt, createdBy                                     │
│                                                               │
│  searchTerm: string  → Real-time filter                       │
│  dialogOpen: boolean → Toggle add/edit dialog                 │
│  editingId: string | null → Current editing account          │
│  deleteId: string | null → Account pending deletion          │
│  formData: {email, name, password, role}                     │
│                                                               │
└────────────────────────────────────────────────────────────────┘
           │
           ├─────────────┬─────────────┬─────────────┬──────────┐
           ▼             ▼             ▼             ▼          ▼
      [Search]      [Add Account] [Edit Account] [Delete]   [Toggle]
           │             │             │             │          │
           ▼             ▼             ▼             ▼          ▼
      filter()    handleAdd()    handleEdit()  handleDelete() toggleStatus()
           │             │             ▼             │          │
           ▼             ▼          Update          Filter       ▼
    filteredList    Create       Officers[]        Confirm    Update
                   New Officer      │              Alert      Status
                        │            ▼
                        ▼         setOfficers()
                    Toast OK           │
                        │              ▼
                        ▼         UI Update
                   Close Dialog   Table Re-render
```

---

## 🎬 User Interaction Flow

```
User Akcja                    Komponent Odpowiedź          Wynik
═══════════════════════════════════════════════════════════════════

[1] Klikni "Dodaj..."     → Dialog otwiera się        Form puste
                          → resetForm() wywoła        Hasło generowane

[2] Wypełni dane          → formData updates           Real-time binding
                          → Validation pokazuje       Error toast

[3] Klikni "Dodaj"        → handleAddOfficer()        Walidacja
                          → emailExists check        Nowe konto
                          → Create new officer       Toast success
                          → setOfficers([...])       Dialog zamyka
                          → resetForm()              Statystyka updates

[4] Szuka "jan"           → searchTerm updates        filteredOfficers
                          → Real-time filter         Tabela aktualizuje
                          → Licznik wyników          Zmiany liczby

[5] Klikni "Copy"         → handleCopyCredentials()   Clipboard
                          → navigator.clipboard      Toast success
                          → Email + hasło            Dane gotowe

[6] Klikni "Edit"         → handleEditOfficer()       Data wczytana
                          → setFormData()             Dialog otwiera
                          → setEditingId()            Dane do edycji

[7] Zmieni dane           → formData updates          Real-time

[8] Klikni "Update"       → handleAddOfficer()        Walidacja
                          → Map update officer       Toast success
                          → UI update                Dialog zamyka

[9] Klikni Status         → Toggle handler            Status zmienia
                          → Map updated status       Toast confirm
                          → Re-render                UI updates

[10] Klikni "Delete"      → setDeleteId()             AlertDialog
                          → Confirmation             Czeka na akcję

[11] Potwierdzi Delete    → handleDeleteOfficer()     Filter array
                          → setOfficers()             Officer removed
                          → Toast success            Statystyka updates
```

---

## 🎨 UI Components Hierarchy

```
AdminManagementPage
│
├─ Layout (wrapper)
│  └─ <navigation> + <footer>
│
├─ Header Section
│  ├─ <div> tytuł + opis
│  └─ Dialog
│      ├─ DialogTrigger
│      │  └─ Button: "+ Dodaj"
│      └─ DialogContent
│          ├─ Input: Email
│          ├─ Input: Nazwa
│          ├─ InputGroup: Hasło + RefreshBtn
│          ├─ Select: Rola
│          └─ Button: Dodaj/Aktualizuj
│
├─ Statistics Section
│  └─ Grid (3 columns)
│      ├─ Card (total)
│      ├─ Card (active)
│      └─ Card (inactive)
│
├─ Search Section
│  └─ Input: Search
│
├─ Table Section
│  └─ Card
│      └─ Table
│          ├─ THead
│          │  └─ TR
│          │     ├─ TH: Email
│          │     ├─ TH: Nazwa
│          │     ├─ TH: Rola
│          │     ├─ TH: Status
│          │     ├─ TH: Utworzone
│          │     └─ TH: Akcje
│          └─ TBody
│             └─ TR (dla każdego filtered officer)
│                ├─ TD: email (font-mono)
│                ├─ TD: name
│                ├─ TD: Badge (rola)
│                ├─ TD: Button (status toggle)
│                ├─ TD: createdAt
│                └─ TD: ActionButtons
│                   ├─ Button: Copy Icon
│                   ├─ Button: Edit Icon
│                   └─ Button: Delete Icon
│
└─ AlertDialog (delete confirmation)
   ├─ Title: "Usunąć konto?"
   ├─ Description: "Ta akcja..."
   └─ Buttons: Cancel | Delete
```

---

## 🔐 Validation & Security

```
┌─ User Input ─────────────────────────────────────────────┐
│                                                          │
│  Email: "user@gov.pl"                                   │
│    ├─ Check regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/        │
│    ├─ Check exists: officers.some((o) => o.email === .)│
│    └─ Trim whitespace                                   │
│                                                          │
│  Name: "Jan Kowalski"                                   │
│    ├─ Check not empty                                   │
│    └─ Max length: 100 chars                             │
│                                                          │
│  Password: "aB3!dEfGh9K#"                               │
│    ├─ Auto-generated or manual                          │
│    ├─ Min length: 8 chars                               │
│    ├─ Mix: A-Z, a-z, 0-9, !@#$%                        │
│    └─ Never sent in plain text (TODO: hash in backend)  │
│                                                          │
│  Role: "officer" | "admin"                              │
│    └─ Only allowed values                               │
│                                                          │
└──────────────────────────────────────────────────────────┘
           ▼
    ✅ If all valid → Create/Update
    ❌ If invalid   → Toast error
```

---

## 🔄 State Updates Flow

```
Action → Handler Function → Validation → setOfficers() → Re-render → UI Update

ADD:
  Button Click
    ↓
  handleAddOfficer()
    ├─ Validate data
    ├─ Check duplicates
    ├─ Create new officer
    └─ setOfficers([...officers, newOfficer])
        ↓
      React Re-renders
        ├─ Table updates
        ├─ Statistics update
        └─ Search results update

EDIT:
  Edit Icon Click
    ↓
  handleEditOfficer()
    ├─ Load officer data
    ├─ setFormData()
    └─ setEditingId()
        ↓
      Dialog opens with data
        ↓
      Form changes
        ↓
      User clicks "Update"
        ↓
      handleAddOfficer() with editingId
        ├─ Map and update officer
        └─ setOfficers([...updated])
            ↓
          React Re-renders
            └─ Table updates

DELETE:
  Delete Icon Click
    ↓
  setDeleteId()
    ↓
  AlertDialog shows
    ↓
  User clicks "Usuń"
    ↓
  handleDeleteOfficer()
    ├─ Filter out officer
    └─ setOfficers([...filtered])
        ↓
      React Re-renders
        ├─ Table updates
        └─ Statistics update

SEARCH:
  Type in Input
    ↓
  setSearchTerm()
    ↓
  filteredOfficers computed
    ├─ Filter by email
    └─ Filter by name
        ↓
      React Re-renders
        └─ Table shows filtered results

STATUS:
  Click Status Button
    ↓
  Map officers array
    ├─ Toggle status
    └─ setOfficers()
        ↓
      React Re-renders
        └─ UI shows new status
```

---

## 📱 Responsive Breakpoints

```
Desktop (≥1024px)
├─ Grid 3 columns (stats)
├─ Full table with all columns
├─ Normal button sizes
└─ Hover effects active

Tablet (768px - 1023px)
├─ Grid 2 columns (stats)
├─ Table with scroll
├─ Smaller padding
└─ Touch-friendly buttons

Mobile (<768px)
├─ Grid 1 column (stacked)
├─ Horizontal scroll table
├─ Full-width inputs
└─ Stacked buttons in dialog
```

---

## 🔌 API Integration Ready

```typescript
// Current: Local State
const [officers, setOfficers] = useState([])

// Future: Backend Integration
async function handleAddOfficer() {
  // POST /api/users/officers
  // Response: { id, email, name, password, role, status, ... }
  // Store: setOfficers([...officers, response])
}

async function handleEditOfficer() {
  // PUT /api/users/officers/:id
  // Response: { ...updated officer }
  // Store: setOfficers(officers.map(o => o.id === id ? response : o))
}

async function handleDeleteOfficer() {
  // DELETE /api/users/officers/:id
  // Response: { success: true }
  // Store: setOfficers(officers.filter(o => o.id !== id))
}
```

---

**Diagram Version**: 1.0  
**Last Updated**: 6 grudnia 2025
