// Categories
export const categories = [
  { id: "finanse", name: "Finanse i podatki", icon: "Banknote", count: 24 },
  { id: "sprawiedliwosc", name: "Sprawiedliwość i prawo karne", icon: "Scale", count: 18 },
  { id: "bezpieczenstwo", name: "Bezpieczeństwo i cyberbezpieczeństwo", icon: "Shield", count: 12 },
  { id: "edukacja", name: "Edukacja i nauka", icon: "GraduationCap", count: 15 },
  { id: "zdrowie", name: "Zdrowie i polityka społeczna", icon: "Heart", count: 21 },
  { id: "energetyka", name: "Energetyka i środowisko", icon: "Leaf", count: 19 },
  { id: "transport", name: "Transport i infrastruktura", icon: "Train", count: 11 },
  { id: "gospodarka", name: "Gospodarka i przedsiębiorczość", icon: "Building2", count: 16 },
  { id: "rolnictwo", name: "Rolnictwo i rozwój wsi", icon: "Wheat", count: 9 },
  { id: "administracja", name: "Administracja publiczna i cyfryzacja", icon: "Monitor", count: 14 },
  { id: "kultura", name: "Kultura i media", icon: "Palette", count: 7 },
  { id: "samorzady", name: "Samorządy i sprawy wewnętrzne", icon: "Landmark", count: 13 },
];

// Legislative stages
export const legislativeStages = [
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

// Sponsors/Wnioskodawcy
export const sponsors = [
  "Minister Finansów",
  "Minister Sprawiedliwości",
  "Minister Cyfryzacji",
  "Minister Zdrowia",
  "Minister Edukacji",
  "Minister Klimatu i Środowiska",
  "Minister Infrastruktury",
  "Minister Spraw Wewnętrznych i Administracji",
  "Minister Obrony Narodowej",
  "Minister Kultury i Dziedzictwa Narodowego",
  "Minister Rolnictwa i Rozwoju Wsi",
  "Minister Rodziny, Pracy i Polityki Społecznej",
  "Prezes Rady Ministrów",
  "Szef Kancelarii Prezesa Rady Ministrów",
];

// Filter options
export const filterOptions = {
  typAktu: [
    { value: "projekt_ustawy", label: "Projekt ustawy" },
    { value: "projekt_ustawy_zmieniajacej", label: "Projekt ustawy zmieniającej" },
    { value: "ustawa_kodeksowa", label: "Ustawa kodeksowa" },
    { value: "ustawa_budzetowa", label: "Ustawa budżetowa" },
    { value: "przepisy_wprowadzajace", label: "Przepisy wprowadzające" },
  ],
  inicjator: [
    { value: "rzadowy", label: "Rządowy" },
    { value: "poselski", label: "Poselski" },
    { value: "prezydencki", label: "Prezydencki" },
    { value: "senacki", label: "Senacki" },
    { value: "obywatelski", label: "Obywatelski" },
  ],
  status: [
    { value: "planowany", label: "Planowany" },
    { value: "procedowany", label: "Procedowany" },
    { value: "uchwalony", label: "Uchwalony" },
    { value: "odrzucony", label: "Odrzucony" },
    { value: "wycofany", label: "Wycofany" },
  ],
  postep: [
    { value: "przyjety", label: "Przyjęty" },
    { value: "w_toku", label: "W toku" },
    { value: "archiwalny", label: "Archiwalny" },
  ],
};

// Sample legislative acts
export interface LegislativeAct {
  id: string;
  title: string;
  summary: string;
  fullText?: string;
  status: "planowany" | "procedowany" | "uchwalony" | "odrzucony" | "wycofany";
  progress: "przyjety" | "w_toku" | "archiwalny";
  category: string;
  tags: string[];
  priority: "low" | "normal" | "high";
  sponsor: string;
  dateSubmitted: string;
  lastUpdated: string;
  kadencja: string;
  currentStage: number;
  stages: {
    id: string;
    name: string;
    date: string | null;
    status: "done" | "in_progress" | "pending";
  }[];
  hasConsultation: boolean;
  consultationStart?: string;
  consultationEnd?: string;
  versions: {
    id: string;
    version: number;
    date: string;
    type: string;
    url: string;
  }[];
  votes?: {
    iReading?: { for: number; against: number; abstain: number };
    iiReading?: { for: number; against: number; abstain: number };
    iiiReading?: { for: number; against: number; abstain: number };
  };
}

export const sampleActs: LegislativeAct[] = [
  {
    id: "PL_2025_001",
    title: "Projekt ustawy o zmianie ustawy o podatku dochodowym od osób fizycznych",
    summary: "Ustawa wprowadza zmiany w progach podatkowych oraz nowe ulgi dla rodzin wielodzietnych. Projekt ma na celu zmniejszenie obciążeń podatkowych dla klasy średniej.",
    status: "procedowany",
    progress: "w_toku",
    category: "finanse",
    tags: ["podatkowe", "obywatele", "budżet_panstwa"],
    priority: "high",
    sponsor: "Minister Finansów",
    dateSubmitted: "2025-01-15",
    lastUpdated: "2025-06-01",
    kadencja: "X",
    currentStage: 16,
    hasConsultation: true,
    consultationStart: "2025-02-01",
    consultationEnd: "2025-02-28",
    stages: [
      { id: "s1", name: "Projekt został przyjęty do prac rady ministrów", date: "2025-01-15", status: "done" },
      { id: "s2", name: "Zgłoszenia lobbingowe", date: "2025-01-20", status: "done" },
      { id: "s3", name: "Uzgodnienia", date: "2025-01-25", status: "done" },
      { id: "s4", name: "Konsultacje publiczne", date: "2025-02-01", status: "done" },
      { id: "s5", name: "Opiniowanie", date: "2025-02-15", status: "done" },
      { id: "s6", name: "Stały Komitet Rady Ministrów", date: "2025-03-01", status: "done" },
      { id: "s7", name: "Komisja Prawnicza", date: "2025-03-10", status: "done" },
      { id: "s8", name: "Rada Ministrów", date: "2025-03-20", status: "done" },
      { id: "s9", name: "Skierowanie projektu ustawy do Sejmu", date: "2025-04-01", status: "done" },
      { id: "s10", name: "I czytanie na posiedzeniu Sejmu", date: "2025-04-15", status: "done" },
      { id: "s11", name: "Praca w komisjach po I czytaniu", date: "2025-05-01", status: "in_progress" },
      { id: "s12", name: "II czytanie na posiedzeniu Sejmu", date: null, status: "pending" },
      { id: "s13", name: "III czytanie na posiedzeniu Sejmu", date: null, status: "pending" },
      { id: "s14", name: "Głosowanie w Sejmie", date: null, status: "pending" },
    ],
    versions: [
      { id: "v1", version: 1, date: "2025-01-15", type: "projekt", url: "/docs/PL_2025_001_v1.pdf" },
      { id: "v2", version: 2, date: "2025-03-20", type: "po_komisji", url: "/docs/PL_2025_001_v2.pdf" },
    ],
    votes: {
      iReading: { for: 245, against: 180, abstain: 15 },
    },
  },
  {
    id: "PL_2025_002",
    title: "Projekt ustawy o cyberbezpieczeństwie systemów informatycznych",
    summary: "Ustawa określa wymogi bezpieczeństwa dla systemów informatycznych podmiotów publicznych oraz operatorów usług kluczowych.",
    status: "procedowany",
    progress: "w_toku",
    category: "bezpieczenstwo",
    tags: ["cyfryzacja", "administracja_publiczna", "przedsiębiorcy"],
    priority: "high",
    sponsor: "Minister Cyfryzacji",
    dateSubmitted: "2025-02-01",
    lastUpdated: "2025-05-15",
    kadencja: "X",
    currentStage: 8,
    hasConsultation: true,
    consultationStart: "2025-02-15",
    consultationEnd: "2025-03-15",
    stages: [
      { id: "s1", name: "Projekt został przyjęty do prac rady ministrów", date: "2025-02-01", status: "done" },
      { id: "s2", name: "Konsultacje publiczne", date: "2025-02-15", status: "done" },
      { id: "s3", name: "Opiniowanie", date: "2025-03-20", status: "done" },
      { id: "s4", name: "Komitet Rady Ministrów do Spraw Cyfryzacji", date: "2025-04-01", status: "done" },
      { id: "s5", name: "Stały Komitet Rady Ministrów", date: "2025-04-15", status: "in_progress" },
      { id: "s6", name: "Rada Ministrów", date: null, status: "pending" },
    ],
    versions: [
      { id: "v1", version: 1, date: "2025-02-01", type: "projekt", url: "/docs/PL_2025_002_v1.pdf" },
    ],
  },
  {
    id: "PL_2025_003",
    title: "Ustawa o wsparciu dla rolników w okresie suszy",
    summary: "Ustawa wprowadza mechanizmy wsparcia finansowego dla gospodarstw rolnych dotkniętych skutkami suszy.",
    status: "uchwalony",
    progress: "przyjety",
    category: "rolnictwo",
    tags: ["rolnictwo", "budżet_panstwa", "obywatele"],
    priority: "high",
    sponsor: "Minister Rolnictwa i Rozwoju Wsi",
    dateSubmitted: "2024-11-01",
    lastUpdated: "2025-03-01",
    kadencja: "X",
    currentStage: 38,
    hasConsultation: true,
    consultationStart: "2024-11-15",
    consultationEnd: "2024-12-15",
    stages: [
      { id: "s1", name: "Projekt został przyjęty do prac rady ministrów", date: "2024-11-01", status: "done" },
      { id: "s2", name: "Konsultacje publiczne", date: "2024-11-15", status: "done" },
      { id: "s3", name: "Rada Ministrów", date: "2025-01-10", status: "done" },
      { id: "s4", name: "I czytanie na posiedzeniu Sejmu", date: "2025-01-25", status: "done" },
      { id: "s5", name: "II czytanie na posiedzeniu Sejmu", date: "2025-02-10", status: "done" },
      { id: "s6", name: "III czytanie na posiedzeniu Sejmu", date: "2025-02-15", status: "done" },
      { id: "s7", name: "Głosowanie w Sejmie", date: "2025-02-15", status: "done" },
      { id: "s8", name: "Rozpatrzenie ustawy przez Senat", date: "2025-02-25", status: "done" },
      { id: "s9", name: "Podpisanie przez Prezydenta Ustawy", date: "2025-03-01", status: "done" },
    ],
    versions: [
      { id: "v1", version: 1, date: "2024-11-01", type: "projekt", url: "/docs/PL_2025_003_v1.pdf" },
      { id: "v2", version: 2, date: "2025-02-15", type: "uchwalona", url: "/docs/PL_2025_003_v2.pdf" },
    ],
    votes: {
      iReading: { for: 280, against: 120, abstain: 40 },
      iiiReading: { for: 310, against: 100, abstain: 30 },
    },
  },
  {
    id: "PL_2025_004",
    title: "Projekt ustawy o reformie systemu oświaty",
    summary: "Kompleksowa reforma programów nauczania oraz systemu egzaminacyjnego w szkołach podstawowych i ponadpodstawowych.",
    status: "procedowany",
    progress: "w_toku",
    category: "edukacja",
    tags: ["edukacyjne", "obywatele", "samorząd"],
    priority: "high",
    sponsor: "Minister Edukacji",
    dateSubmitted: "2025-03-01",
    lastUpdated: "2025-05-20",
    kadencja: "X",
    currentStage: 4,
    hasConsultation: true,
    consultationStart: "2025-03-15",
    consultationEnd: "2025-04-30",
    stages: [
      { id: "s1", name: "Projekt został przyjęty do prac rady ministrów", date: "2025-03-01", status: "done" },
      { id: "s2", name: "Konsultacje publiczne", date: "2025-03-15", status: "in_progress" },
      { id: "s3", name: "Opiniowanie", date: null, status: "pending" },
      { id: "s4", name: "Rada Ministrów", date: null, status: "pending" },
    ],
    versions: [
      { id: "v1", version: 1, date: "2025-03-01", type: "projekt", url: "/docs/PL_2025_004_v1.pdf" },
    ],
  },
  {
    id: "PL_2025_005",
    title: "Projekt ustawy o ochronie danych medycznych",
    summary: "Ustawa reguluje zasady przetwarzania i ochrony danych medycznych pacjentów w systemach informatycznych.",
    status: "planowany",
    progress: "w_toku",
    category: "zdrowie",
    tags: ["zdrowotne", "cyfryzacja", "obywatele"],
    priority: "normal",
    sponsor: "Minister Zdrowia",
    dateSubmitted: "2025-04-01",
    lastUpdated: "2025-04-15",
    kadencja: "X",
    currentStage: 2,
    hasConsultation: false,
    stages: [
      { id: "s1", name: "Projekt został przyjęty do prac rady ministrów", date: "2025-04-01", status: "done" },
      { id: "s2", name: "Uzgodnienia", date: "2025-04-10", status: "in_progress" },
      { id: "s3", name: "Konsultacje publiczne", date: null, status: "pending" },
    ],
    versions: [
      { id: "v1", version: 1, date: "2025-04-01", type: "projekt", url: "/docs/PL_2025_005_v1.pdf" },
    ],
  },
  {
    id: "PL_2025_006",
    title: "Projekt ustawy o odnawialnych źródłach energii",
    summary: "Nowelizacja ustawy wprowadzająca ułatwienia dla prosumentów oraz nowe mechanizmy wsparcia farm fotowoltaicznych.",
    status: "procedowany",
    progress: "w_toku",
    category: "energetyka",
    tags: ["energetyczne", "ochrona_środowiska", "przedsiębiorcy"],
    priority: "high",
    sponsor: "Minister Klimatu i Środowiska",
    dateSubmitted: "2025-01-20",
    lastUpdated: "2025-05-25",
    kadencja: "X",
    currentStage: 20,
    hasConsultation: true,
    consultationStart: "2025-02-01",
    consultationEnd: "2025-03-01",
    stages: [
      { id: "s1", name: "Projekt został przyjęty do prac rady ministrów", date: "2025-01-20", status: "done" },
      { id: "s2", name: "Konsultacje publiczne", date: "2025-02-01", status: "done" },
      { id: "s3", name: "Rada Ministrów", date: "2025-03-15", status: "done" },
      { id: "s4", name: "I czytanie na posiedzeniu Sejmu", date: "2025-04-01", status: "done" },
      { id: "s5", name: "II czytanie na posiedzeniu Sejmu", date: "2025-05-01", status: "done" },
      { id: "s6", name: "III czytanie na posiedzeniu Sejmu", date: "2025-05-20", status: "in_progress" },
    ],
    versions: [
      { id: "v1", version: 1, date: "2025-01-20", type: "projekt", url: "/docs/PL_2025_006_v1.pdf" },
      { id: "v2", version: 2, date: "2025-05-01", type: "po_komisji", url: "/docs/PL_2025_006_v2.pdf" },
    ],
    votes: {
      iReading: { for: 260, against: 150, abstain: 30 },
      iiReading: { for: 275, against: 140, abstain: 25 },
    },
  },
  {
    id: "PL_2025_007",
    title: "Projekt ustawy o wspieraniu mobilności osób niepełnosprawnych",
    summary: "Ustawa wprowadza nowe ulgi i dofinansowania dla osób niepełnosprawnych korzystających z transportu publicznego oraz indywidualnego. Projekt zakłada również modernizację infrastruktury dostępności w miastach.",
    status: "procedowany",
    progress: "w_toku",
    category: "transport",
    tags: ["społeczne", "transport", "osoby niepełnosprawne"],
    priority: "high",
    sponsor: "Minister Infrastruktury",
    dateSubmitted: "2025-05-01",
    lastUpdated: "2025-11-30",
    kadencja: "X",
    currentStage: 5,
    hasConsultation: true,
    consultationStart: "2025-11-15",
    consultationEnd: "2025-12-20",
    stages: [
      { id: "s1", name: "Projekt został przyjęty do prac rady ministrów", date: "2025-05-01", status: "done" },
      { id: "s2", name: "Zgłoszenia lobbingowe", date: "2025-05-10", status: "done" },
      { id: "s3", name: "Konsultacje publiczne", date: "2025-11-15", status: "in_progress" },
      { id: "s4", name: "Opiniowanie", date: null, status: "pending" },
      { id: "s5", name: "Rada Ministrów", date: null, status: "pending" },
    ],
    versions: [
      { id: "v1", version: 1, date: "2025-05-01", type: "projekt", url: "/docs/PL_2025_007_v1.pdf" },
    ],
  },
];

// Featured acts for homepage
export const featuredActs = sampleActs.filter(act => act.priority === "high").slice(0, 4);

// Languages for footer
export const languages = [
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];
