# 🎴 QUICK REFERENCE - Karta Szybkiego Dostępu

## ⚡ Najważniejsze Informacje

### 🌐 Dostęp do Aplikacji
```
URL: http://localhost:8081/admin-zarzadzanie
lub: Menu → Zarządzanie → Zarządzanie Kontami
```

### 🔐 Login Admin
```
Email: admin@gov.pl
Hasło: admin123
```

---

## 📋 8 Funkcji - Instrukcja Mini

### 1️⃣ Dodaj Konto
```
Klik: + Dodaj konto urzędnika
     ↓
Wypełnij: Email, Nazwa
          Hasło (auto: klikni 🔄)
          Rola (Officer/Admin)
     ↓
Klik: Dodaj konto
```

### 2️⃣ Edytuj Konto
```
Klik: Ikonka ✏️ (edit)
     ↓
Zmień: Dane
     ↓
Klik: Zaktualizuj konto
```

### 3️⃣ Usuń Konto
```
Klik: Ikonka 🗑️ (delete)
     ↓
Potwierdź: W AlertDialog
     ↓
Klik: Usuń
```

### 4️⃣ Wyszukaj
```
Wpisz: Email lub nazwa
     ↓
Tablica się filtruje (real-time)
```

### 5️⃣ Kopiuj Dane
```
Klik: Ikonka 📋 (copy)
     ↓
Email+Hasło → Schowak
```

### 6️⃣ Zmień Status
```
Klik: Aktywne/Nieaktywne
     ↓
Status się zmienia natychmiast
```

### 7️⃣ Statystyka
```
Pokaż się automatycznie:
├─ Liczba kont (szary)
├─ Aktywne (zielony)
└─ Nieaktywne (czerwony)
```

### 8️⃣ Tabela
```
Wyświetla: 6 kolumn
├─ Email (niebieski)
├─ Nazwa
├─ Rola (badge)
├─ Status (przycisk)
├─ Utworzone (data)
└─ Akcje (3 przyciski)
```

---

## 🎨 Ikony w Tabeli

| Ikona | Akcja |
|-------|-------|
| 📋 | Kopiuj email+hasło |
| ✏️ | Edytuj konto |
| 🗑️ | Usuń konto |

---

## 🔑 Generowanie Hasła

```
Przycisk: 🔄
├─ Auto-generuje hasło
├─ Mix: A-Z, a-z, 0-9, !@#$%
├─ Długość: 12 znaków
└─ Przykład: aB3!dEfGh9K#
```

---

## ✅ Validacja

| Pole | Reguła |
|------|--------|
| Email | Regex pattern + duplikat check |
| Nazwa | Wymagane pole |
| Hasło | Wymagane pole (min 8) |
| Rola | Tylko officer/admin |

---

## 📞 Gdzie szukać pomocy?

| Pytanie | Plik |
|---------|------|
| Jaki jest overview? | INDEX.md |
| Jak to działa? | ADMIN_PAGE_GUIDE.md |
| Jak to kodować? | ADMIN_PAGE_TECHNICAL.md |
| Gdzie są diagramy? | ARCHITECTURE_DIAGRAM.md |
| Jaka lista features? | FEATURES.md |

---

## 🔧 Komendy Dev

```bash
# Uruchom dev server
npm run dev

# Build do produkcji
npm run build

# Linting
npm run lint
```

---

## 💾 Dane Testowe Domyślne

```javascript
{
  email: "demo@gov.pl",
  name: "Demo Officer",
  password: "Demo123!@#",
  role: "officer",
  status: "active"
}
```

---

## 🎯 Workflow Administrator

```
┌──────────────┐
│    LOGIN     │ admin@gov.pl / admin123
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────┐
│   /admin-zarzadzanie             │
│   Zarządzanie Kontami            │
└──────┬───────────────────────────┘
       │
       ├─→ Dodaj konto ➕
       │   ├─ Fill form
       │   └─ Save
       │
       ├─→ Edytuj konto ✏️
       │   ├─ Click edit
       │   ├─ Change data
       │   └─ Update
       │
       ├─→ Usuń konto 🗑️
       │   ├─ Click delete
       │   ├─ Confirm
       │   └─ Remove
       │
       ├─→ Szukaj konto 🔍
       │   ├─ Type search
       │   └─ Filter shows
       │
       ├─→ Kopiuj dane 📋
       │   ├─ Click copy
       │   └─ Data copied
       │
       └─→ Zmień status 🔄
           ├─ Click status
           └─ Toggle active/inactive
```

---

## 🚨 Błędy i Rozwiązania

| Błąd | Rozwiązanie |
|------|------------|
| "Email już istnieje" | Użyj inny email |
| "Nieprawidłowy email" | Sprawdź format (a@b.c) |
| "Brakuje pól" | Wypełnij wszystkie pola |
| Port 8080 zajęty | Serwer uruchomi się na 8081 |

---

## 🎯 Checklist Testowania

- [ ] Zaloguj się jako admin
- [ ] Przejdź do admin panel
- [ ] Dodaj nowe konto
- [ ] Edytuj istniejące
- [ ] Usuń konto
- [ ] Szukaj po email
- [ ] Szukaj po nazwie
- [ ] Kopiuj dane
- [ ] Zmień status
- [ ] Regeneruj hasło
- [ ] Pokaż/ukryj hasło
- [ ] Test mobile view

---

## 📊 Statystyka Stron

| Metryka | Wartość |
|---------|---------|
| Linii kodu | ~500 |
| Funkcji | 6 |
| Komponenty UI | 10 |
| Ikony | 8 |
| Validacje | 3 |
| State vars | 8 |

---

## 🔄 Data Flow - Uproszczony

```
User Action
    ↓
Handler Function
    ↓
Validate Data
    ↓
Update State (setOfficers)
    ↓
React Re-render
    ↓
UI Updates
    ↓
Toast Notification
```

---

## 📱 Responsywność

| Device | Layout |
|--------|--------|
| Desktop | 3-col grid, full table |
| Tablet | 2-col grid, scroll table |
| Mobile | 1-col grid, h-scroll table |

---

## 🎁 Pro Tips

1. **Szybkie hasło**: Klikni 🔄 zamiast wpisywać
2. **Szybkie dane**: Klikni 📋 aby skopiować
3. **Szybka edycja**: Klikni ✏️ zamiast delete+add
4. **Szybkie szukanie**: Pisz podczas napisywania
5. **Szybka zmiana**: Klikni status aby toggle

---

## ❓ FAQ

**P: Czy hasła są bezpieczne?**  
O: Aktualnie localStorage. Backend TODO.

**P: Czy mogę dodać wiele kont naraz?**  
O: Bulk import - TODO

**P: Czy mogę edytować wiele naraz?**  
O: Bulk edit - TODO

**P: Gdzie są dane przechowywane?**  
O: Aktualnie w memory. Backend TODO.

---

## 📚 Więcej Informacji

Pełna dokumentacja w:
- `INDEX.md` - Mapa dokumentacji
- `COMPLETION_SUMMARY.md` - Podsumowanie
- `ADMIN_PAGE_GUIDE.md` - Pełny poradnik

---

**Wersja**: 1.0  
**Drukuj to**: ✅ Idealnie na A4  
**Przydatne dla**: Wszystkich użytkowników
