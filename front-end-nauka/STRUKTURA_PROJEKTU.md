# Struktura Projektu - League Manager

## 📁 Przegląd Struktury Katalogów

```
projekt/
├── public/                 # Pliki statyczne dostępne publicznie
│   ├── index.html
│   ├── manifest.json
│   ├── mapa.avif
│   └── data/
│       ├── champions.json  # Dane JSON z bohaterami (REST API)
│       └── regions.json    # Dane JSON z regionami (REST API)
│
├── src/                    # Kod źródłowy aplikacji
│   ├── App.jsx            # Główny komponent aplikacji (routy, providerzy)
│   ├── App.css            # Główne style aplikacji
│   ├── index.js           # Punkt wejścia aplikacji
│   ├── index.css          # Globalne style
│   │
│   ├── context/           # Konteksty React (globalny stan)
│   │   ├── AppContext.jsx        # Store dla danych champions i regions (CRUD)
│   │   └── LanguageContext.jsx   # Store dla języka (PL/EN)
│   │
│   ├── services/          # Serwisy do komunikacji z API
│   │   └── api.js         # Funkcje do pobierania danych z champions.json i regions.json
│   │
│   └── components/        # Komponenty React
│       ├── Layout/        # Komponenty układu
│       │   └── Header.jsx        # Nagłówek z nawigacją i zmianą języka
│       │
│       ├── Home/          # Strona główna
│       │   ├── Home.jsx
│       │   └── Home.css
│       │
│       ├── Champions/     # Komponenty związane z bohaterami (dziedzina główna)
│       │   ├── ChampionList.jsx   # Lista wszystkich bohaterów
│       │   ├── ChampionDetail.jsx # Szczegóły pojedynczego bohatera
│       │   ├── ChampionCard.jsx   # Karta bohatera na liście
│       │   ├── ChampionList.css
│       │   ├── ChampionDetail.css
│       │   └── ChampionCard.css
│       │
│       ├── Regions/       # Komponenty związane z regionami (dziedzina poboczna)
│       │   ├── RegionList.jsx     # Lista wszystkich regionów
│       │   ├── RegionDetail.jsx   # Szczegóły pojedynczego regionu
│       │   ├── RegionCard.jsx     # Karta regionu na liście
│       │   ├── RegionList.css
│       │   ├── RegionDetail.css
│       │   └── RegionCard.css
│       │
│       ├── Filters/       # Komponenty filtrów
│       │   ├── FilterPanel.jsx     # Filtry dla champions
│       │   ├── RegionFilterPanel.jsx # Filtry dla regionów
│       │   └── FilterPanel.css
│       │
│       ├── Sort/          # Komponenty sortowania
│       │   ├── SortControls.jsx # Kontrolki sortowania
│       │   └── SortControls.css
│       │
│       └── Forms/         # Formularze (Formik)
│           ├── ChampionForm.jsx  # Formularz dodawania/edycji bohatera
│           └── FormStyles.css
│
├── package.json           # Zależności projektu
├── .eslintrc.json         # Konfiguracja ESLint
├── jsconfig.json          # Konfiguracja ścieżek ES6 (jeśli istnieje)
└── README.md              # Dokumentacja projektu
```

---

## 🔍 Szczegółowy Opis Plików

### 1. **src/index.js** - Punkt wejścia

```javascript
// To jest pierwszy plik, który się ładuje
// Renderuje główny komponent App do DOM-u
```

### 2. **src/App.jsx** - Główny komponent aplikacji

```javascript
// Zawiera:
// - Providery (LanguageProvider, AppProvider) - udostępniają globalny stan
// - Router - zarządza nawigacją między stronami
// - Routes - definiuje wszystkie ścieżki URL:
//   • /                    → Home
//   • /champions           → ChampionList (dziedzina główna)
//   • /champions/:id       → ChampionDetail (szczegóły bohatera)
//   • /champions/new       → ChampionForm (dodawanie bohatera)
//   • /champions/:id/edit  → ChampionForm (edycja bohatera)
//   • /regions             → RegionList (dziedzina poboczna)
//   • /regions/:id         → RegionDetail (szczegóły regionu)
```

**Struktura Providerów:**

```
LanguageProvider (zewnętrzny)
  └── AppProvider (środkowy)
      └── Router (wewnętrzny)
          └── Komponenty stron
```

**Dlaczego taka kolejność?**

- `LanguageProvider` musi być na zewnątrz, żeby wszystkie komponenty miały dostęp do tłumaczeń
- `AppProvider` udostępnia dane champions i regions
- `Router` zarządza tym, która strona jest wyświetlana

---

### 3. **src/context/** - Globalny stan aplikacji

#### **AppContext.jsx** - Store dla danych champions i regions

```javascript
// Co robi:
// 1. Ładuje dane champions z API (champions.json)
// 2. Ładuje dane regions z API (regions.json)
// 3. Przechowuje je w stanie React (useState)
// 4. Udostępnia funkcje CRUD dla champions:
//    - addChampion()      - dodawanie
//    - updateChampion()   - edycja
//    - deleteChampion()   - usuwanie
//    - loadChampions()    - pobieranie z API
// 5. Udostępnia funkcje dla regions:
//    - loadRegions()      - pobieranie listy regionów z API
// 6. Obsługuje loading i error states
```

**Stan aplikacji:**

```javascript
{
  champions: [],           // Lista bohaterów
  regions: [],             // Lista regionów
  loading: false,          // Stan ładowania
  error: null,             // Błąd pobierania
  championsLoaded: false,  // Czy champions już zostali załadowani
  regionsLoaded: false,    // Czy regiony już zostały załadowane
}
```

**Jak działa:**

- Przy starcie: `useEffect` ładuje dane z `championsAPI.getAll()`
- Dane są zapisywane w `champions` i `regions` state
- Komponenty używają hooka `useApp()` aby dostać dostęp do danych
- Strategie pobierania: dane są najpierw pobierane ze store'a, dopiero potem z API (jeśli nie ma w cache)

#### **LanguageContext.jsx** - Store dla języka

```javascript
// Co robi:
// 1. Przechowuje aktualny język ('pl' lub 'en')
// 2. Zawiera słownik wszystkich tłumaczeń (includzący nowe tłumaczenia dla regionów)
// 3. Udostępnia funkcję t(key) do tłumaczenia tekstów
// 4. Udostępnia toggleLanguage() do zmiany języka
```

**Jak działa:**

- Słownik `translations` zawiera wszystkie teksty w PL i EN
- Funkcja `t('key')` zwraca odpowiedni tekst dla aktualnego języka
- Przycisk w Headerze wywołuje `toggleLanguage()` aby zmienić język
- Zmiana języka powoduje re-render wszystkich komponentów z nowymi tłumaczeniami

**Dostępne tłumaczenia obejmują:**

- Nawigacja, przyciski, komunikaty
- Etykiety formularz (champions i regions)
- Etykiety filtrów i sortowania
- Wiadomości błędów i informacyjne

---

### 4. **src/services/api.js** - Komunikacja z API

```javascript
// Champion API
// Funkcje:
// - getAll()   - pobiera wszystkie champions z /data/champions.json
// - getById(id) - pobiera jednego championa
// - create()   - tworzy nowego (symulacja)
// - update()   - aktualizuje (symulacja)
// - delete()   - usuwa (symulacja)

// Region API
// Funkcje:
// - getAll()   - pobiera wszystkie regiony z /data/regions.json
// - getById(id) - pobiera jeden region
```

**REST API:**

- Dane champions są w pliku JSON w `public/data/champions.json`
- Dane regions są w pliku JSON w `public/data/regions.json`
- Fetch pobiera dane z `/data/champions.json` i `/data/regions.json` (publiczne URL-e)

---

### 5. **src/components/** - Komponenty React

#### **Layout/Header.jsx** - Nagłówek strony

```javascript
// Zawiera:
// - Logo aplikacji
// - Linki nawigacyjne (Home, Champions, Regions) ✨ NOWE
// - Przycisk zmiany języka (PL/EN)
// - Aktywne linki oznaczane klasą 'active'
```

#### **Home/Home.jsx** - Strona główna

```javascript
// Wyświetla:
// - Powitanie
// - Mapę Runeterra
// - Opis funkcji aplikacji
```

---

### 6. **src/components/Champions/** - Componenty dla Dziedziny Głównej

#### **ChampionList.jsx** - Lista wszystkich bohaterów

```javascript
// Funkcjonalność:
// 1. Wyświetla listę wszystkich champions w grid layout
// 2. Używa FilterPanel do filtrowania:
//    - Text input: wyszukiwanie po imieniu/tytule
//    - Dropdown: filtrowanie po roli
//    - Checkbox: filtrowanie po regionie
// 3. Używa SortControls do sortowania:
//    - Alfabetycznie (name)
//    - Według daty (releaseDate)
//    - Według danych liczbowych (difficulty, baseHealth, baseAttackDamage)
// 4. Pokazuje statystyki wyników (liczba wyświetlonych vs całkowita)
// 5. Ma przycisk "Dodaj nowego bohatera" (link do /champions/new)
// 6. Renderuje ChampionCard dla każdego bohatera
```

#### **ChampionDetail.jsx** - Szczegóły pojedynczego bohatera

```javascript
// Funkcjonalność:
// 1. Wyświetla pełne informacje o championie
// 2. Wyświetla wszystkie statystyki (health, mana, attack, armor, itp.)
// 3. Wyświetla region (dziedzina poboczna) jako klikalny link do /regions/:id
// 4. Ma przycisk "Wstecz" (master-detail pattern)
// 5. Ma przyciski "Edytuj" (link do /champions/:id/edit) i "Usuń"
// 6. Wyświetla ilustracyjne zdjęcie bohatera
// 7. Wyświetla opis (lore) bohatera
```

#### **ChampionCard.jsx** - Karta pojedynczego bohatera

```javascript
// Wyświetla:
// - Ilustracja/zdjęcie bohatera
// - Imię
// - Tytuł
// - Rola
// - Region (link do szczegółów regionu)
// Po kliknięciu przekierowuje do ChampionDetail (/champions/:id)
```

---

### 7. **src/components/Regions/** - Componenty dla Dziedziny Pobocznej ✨ NOWE

#### **RegionList.jsx** - Lista wszystkich regionów

```javascript
// Funkcjonalność:
// 1. Wyświetla listę wszystkich regionów w grid layout
// 2. Używa RegionFilterPanel do filtrowania:
//    - Text input: wyszukiwanie po nazwie, kapitale, opisie
//    - Dropdown: filtrowanie po typu terytoriów (Kingdom, Empire, itp.)
//    - Dropdown: filtrowanie po klimacie (Temperate, Variable, itp.)
// 3. Używa SortControls do sortowania:
//    - Alfabetycznie (name, capital)
//    - Według daty (foundedDate)
//    - Według danych liczbowych (population)
// 4. Pokazuje statystyki wyników
// 5. Renderuje RegionCard dla każdego regionu
```

#### **RegionDetail.jsx** - Szczegóły pojedynczego regionu

```javascript
// Funkcjonalność:
// 1. Wyświetla pełne informacje o regionie
// 2. Wyświetla:
//    - Nazwa i kapitał
//    - Typ terytoriów
//    - Klimat
//    - Populacja
//    - Data założenia (formatted date)
//    - Opis regionu
// 3. Wyświetla ilustracyjne zdjęcie regionu
// 4. Ma przycisk "Wstecz" do /regions
// ⚠️ UWAGA: Brakuje wyświetlania powiązanych champions z tego regionu
```

#### **RegionCard.jsx** - Karta pojedynczego regionu

```javascript
// Wyświetla:
// - Ilustracja/zdjęcie regionu
// - Nazwa
// - Kapitał
// - Typ terytoriów
// - Populacja
// Po kliknięciu przekierowuje do RegionDetail (/regions/:id)
```

---

### 8. **src/components/Filters/** - Panel Filtrów

#### **FilterPanel.jsx** - Filtry dla champions

```javascript
// Zawiera 3 typy filtrów:
// 1. Text input - wyszukiwanie po imieniu/tytule
// 2. Dropdown (select) - wybór roli (role)
// 3. Checkbox group - wybór regionu (region)
//
// Funkcjonalność:
// - Dynamiczne generowanie opcji z dostępnych danych
// - Callbacks: onFilterChange(), onClearFilters()
```

#### **RegionFilterPanel.jsx** - Filtry dla regionów ✨ NOWE

```javascript
// Zawiera filtry dla regionów:
// 1. Text input - wyszukiwanie po nazwie/kapitale/opisie
// 2. Dropdown (select) - wybór typu terytoriów
// 3. Dropdown (select) - wybór klimatu
//
// Funkcjonalność:
// - Dynamiczne generowanie opcji z dostępnych regionów
// - Callbacks: onFilterChange(), onClearFilters()
```

---

### 9. **src/components/Sort/** - Kontrolki Sortowania

#### **SortControls.jsx** - Kontrolki sortowania

```javascript
// Funkcjonalność:
// - Przyciski do wyboru pola sortowania
// - Przycisk zmiany kierunku (rosnąco/malejąco)
// - Wizualne oznaczenie aktywnego sortowania (klasa 'active')
//
// Props:
// - sortBy: { field, order }
// - onSortChange: callback
// - sortOptions: array of { value, label }
```

---

### 10. **src/components/Forms/** - Formularze

#### **ChampionForm.jsx** - Formularz dodawania/edycji bohatera

```javascript
// Używa Formik do zarządzania formularzem
// Walidacja danych poprzez funkcję validateForm()
//
// Wspólny formularz dla dodawania i edycji:
// - Jeśli route: /champions/new → dodawanie
// - Jeśli route: /champions/:id/edit → edycja (pre-populate z danymi)
//
// Pola formularza:
// - name (text)           - nazwa bohatera
// - title (text)          - tytuł bohatera
// - role (select)         - rola w grze
// - region (select)       - region pochodzenia
// - difficulty (number)   - poziom trudności
// - baseHealth (number)   - zdraví
// - baseMana (number)     - mana
// - baseAttackDamage (number)  - zadawane obrażenia
// - baseArmor (number)    - pancerz
// - baseSpellBlock (number) - opór magii
// - releaseDate (date)    - data wydania
// - lore (textarea)       - historia postaci
//
// Walidacja:
// - Pola wymagane
// - Liczby muszą być w odpowiednim zakresie
// - Daty muszą być poprawne
//
// Przycisk "Anuluj" przekierowuje z powrotem
```

---

## 🔄 Przepływ Danych

### 1. **Pobieranie danych:**

```
AppContext (start)
  ↓
useEffect wywołuje loadChampions() i loadRegions()
  ↓
championsAPI.getAll() i regionsAPI.getAll()
  ↓
Fetch z /data/champions.json i /data/regions.json
  ↓
Dane zapisywane w champions i regions state
  ↓
Komponenty używają useApp() aby dostać dane
```

### 2. **Przepływ danych w komponencie (ChampionList):**

```
ChampionList
  ↓
useApp() → pobiera champions z Context
  ↓
useState → lokalny stan filtrów i sortowania
  ↓
Filtrowanie i sortowanie → filteredAndSortedChampions
  ↓
Renderuje ChampionCard dla każdego championa
  ↓
ChampionCard → link do /champions/:id
```

### 3. **Master-Detail (Champions):**

```
ChampionList (master)
  ↓
Kliknięcie na ChampionCard
  ↓
Router przekierowuje do /champions/:id
  ↓
ChampionDetail (detail) wyświetla szczegóły
  ↓
Wyświetla region (link do /regions/:id)
```

### 4. **Master-Detail (Regions):** ✨ NOWE

```
RegionList (master)
  ↓
Kliknięcie na RegionCard
  ↓
Router przekierowuje do /regions/:id
  ↓
RegionDetail (detail) wyświetla szczegóły
```

### 5. **Dwukierunkowa nawigacja:**

```
ChampionDetail
  ↓
Kliknięcie na region (link)
  ↓
/regions/:id → RegionDetail
  ↓
"Wstecz" → /regions
```

---

## 🌍 Internacjonalizacja

**Jak działa:**

1. `LanguageContext` przechowuje `language` state ('pl' lub 'en')
2. Każdy komponent używa `useLanguage()` hook
3. Komponenty wywołują `t('key')` aby pobrać przetłumaczony tekst
4. Przycisk w Headerze (EN/PL) wywołuje `toggleLanguage()` aby zmienić język
5. Zmiana języka powoduje re-render wszystkich komponentów z nowymi tłumaczeniami

**Obsługiwane tłumaczenia:**

- ✅ Komponenty Champions
- ✅ Komponenty Regions (NOWE)
- ✅ Filtry, Sortowanie
- ✅ Formularze
- ✅ Komunikaty błędów
- ✅ Nawigacja

**Przykład:**

```javascript
// W komponencie:
const { t } = useLanguage();
<h2>{t('championList')}</h2>  // "Bohaterowie" (PL) lub "Champions" (EN)
<h2>{t('regionList')}</h2>    // "Regiony" (PL) lub "Regions" (EN)
```

---

## 📋 Wymagania [DST] - Status

### ✅ **Warunki konieczne:**

- React (komponenty funkcyjne) ✓
- ESLint bez błędów ✓
- Formik w formularzach ✓
- Responsywność (CSS media queries) ✓
- Unikalny temat (League of Legends) ✓

### ✅ **Funkcjonalność [DST]:**

- REST API z JSON (`/data/champions.json`, `/data/regions.json`) ✓
- Komponenty funkcyjne ✓
- Podział na komponenty ✓
- Store (Context API) ✓

### ✅ **Interfejs [DST]:**

- Jasna komunikacja akcji użytkownika ✓
- Aktualne standardy stylowania ✓

### ✅ **Dziedzina główna - Champions [DST]:**

- Wyświetlanie wszystkich na liście ✓
- Podstawowe dane na liście ✓
- Filtrowanie: text, dropdown, checkbox ✓
- Sortowanie: alfabetycznie, daty, liczbowo ✓
- Graficzne przedstawienie ze zdjęciem ✓

### ✅ **Dziedzina poboczna - Regions [DST]:** ✨ NOWE

- Wyświetlanie wszystkich na liście ✓
- Podstawowe dane na liście (razem z obrazkiem) ✓
- Filtrowanie: text, dropdown, dropdown ✓
- Sortowanie: alfabetycznie, daty, liczbowo ✓

### ✅ **Poruszanie się [DST]:**

- Master-detail (Champions: lista → szczegóły) ✓
- Master-detail (Regions: lista → szczegóły) ✓
- Dane dziedziny pobocznej (region) w szczegółach championa ✓
- Edycja i usunięcie w widoku szczegółowym (Champions) ✓
- Przycisk dodania na liście (Champions) ✓

### ✅ **Formularze [DST]:**

- Osobne route'y (`/champions/new`, `/:id/edit`) ✓
- Wspólny formularz dla dodawania i edycji ✓
- Walidacja danych (wbudowana w Formik) ✓
- Odpowiednie typy danych ✓

### ✅ **Internacjonalizacja [BDB]:**

- Dwie wersje językowe (PL/EN) ✓
- Przycisk przełączania ✓

### ⚠️ **Brakuje (opcjonalne [BDB]):**

- ❌ Paginacja dla list champions i regionów
- ❌ Statystyki powiązań w RegionDetail (champions z danego regionu)
- ❌ Statystyki globalne z wykresami
- ❌ Formularze do edycji/dodawania regionów
- ❌ CRUD operacje na regionach

---

## 💡 Jak dodać nową funkcjonalność?

### **Przykład: Dodanie paginacji**

1. Utwórz komponent `Pagination.jsx` w `components/Pagination/`
2. Dodaj stan `currentPage` w `ChampionList.jsx` i `RegionList.jsx`
3. Przekaż tylko `currentPage * itemsPerPage` elementów do renderowania
4. Dodaj `<Pagination />` na końcu listy

### **Przykład: Wyświetlenie powiązanych championów w RegionDetail**

1. W `RegionDetail.jsx` pobierz wszystkich championów z `useApp()`
2. Przefiltruj champions gdzie `champion.region === region.name`
3. Wyświetl ich listę w dedykowanej sekcji
4. Dodaj licznik "X champions from this region"

### **Przykład: Dodanie statystyk globalnych**

1. Utwórz `Statistics.jsx` w `components/Statistics/`
2. Dodaj route `/statistics` w `App.jsx`
3. Dodaj link w `Header.jsx` do statystyk
4. Użyj danych z `useApp()` aby obliczyć:
   - Średnia trudność championów
   - Rozkład championów po regionach
   - Populacja/liczba championów per region
5. Wizualizuj dane za pomocą prostych wykresów lub tabel

### **Przykład: Dodanie CRUD dla regionów**

1. Utwórz `RegionForm.jsx` w `components/Forms/`
2. Dodaj route'y w `App.jsx`:
   - `/regions/new` → RegionForm (dodawanie)
   - `/regions/:id/edit` → RegionForm (edycja)
3. Dodaj metody w `AppContext.jsx`:
   - `addRegion(region)`
   - `updateRegion(id, region)`
   - `deleteRegion(id)`
4. Dodaj przyciski edycji/usuwania w `RegionDetail.jsx`
5. Uaktualnij `regionsAPI` aby wspierać CRUD operacje

---

## 📦 Zależności Projektu

### **Główne zależności (package.json):**

- `react` - biblioteka UI
- `react-dom` - DOM rendering
- `react-router-dom` - routing
- `formik` - zarządzanie formularzami
- `yup` - walidacja schematów (jeśli używane)

### **Dev zależności:**

- `eslint` - linting kodu
- `react-scripts` - build tools dla Create React App

---

## 🎯 Kluczowe Koncepcje

### **Context API (Store)**

- `AppContext` = globalny stan danych (champions, regions)
- `LanguageContext` = globalny stan języka
- Każdy komponent może użyć hooków (`useApp()`, `useLanguage()`) aby dostać dostęp
- **Kluczowa strategia:** Dane pobierane ze store'a, jeśli nie ma → fetch z API

### **React Router**

- Definiuje ścieżki URL i które komponenty wyświetlać
- **Routes:**
  - `/` → Home
  - `/champions` → ChampionList
  - `/champions/:id` → ChampionDetail
  - `/champions/new` → ChampionForm (dodawanie)
  - `/champions/:id/edit` → ChampionForm (edycja)
  - `/regions` → RegionList
  - `/regions/:id` → RegionDetail

### **Formik**

- Formik zarządza stanem formularza
- Walidacja poprzez funkcję `validate` (sprawdza min/max długości, wymagane pola)
- Obs obsługuje zarówno dodawanie jak i edycję w tym samym komponencie

### **Hooks React**

- `useState` - lokalny stan w komponencie
- `useContext` - dostęp do Context (poprzez `useApp()`, `useLanguage()`)
- `useEffect` - efekt uboczny (np. ładowanie danych przy starcie)
- `useNavigate`, `useParams` - React Router hooks
- Custom hooks: `useApp()`, `useLanguage()`

### **Responsywność**

- CSS Media queries dla mobile first design
- Breakpoints na ~768px dla mobile devices
- Grid i Flexbox do elastycznego layoutu

---

## ✨ Ostatnie Zmiany

### V2.0 - Dodane Regiony (Dziedzina Poboczna)

- ✅ Komponenty RegionList, RegionDetail, RegionCard
- ✅ RegionFilterPanel z filtrami
- ✅ Sortowanie regionów
- ✅ API dla regionów (regionsAPI)
- ✅ State dla regionów w AppContext
- ✅ Routing dla `/regions` i `/regions/:id`
- ✅ Tłumaczenia dla regionów (PL/EN)
- ✅ Link do regionów w Header
- ✅ Dwukierunkowa nawigacja (Champions ↔ Regions)

### V1.0 - Podstawowa Funkcjonalność

- Champions system (CRUD)
- Filtrowanie i sortowanie
- Master-detail pattern
- Formularze z Formik
- Internacjonalizacja
- Responsywność
