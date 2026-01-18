# Struktura Projektu - League Manager

## 📁 Przegląd Struktury Katalogów

```
projekt/
├── public/                 # Pliki statyczne dostępne publicznie
│   └── data/
│       └── champions.json  # Dane JSON z bohaterami (REST API)
│
├── src/                    # Kod źródłowy aplikacji
│   ├── App.js             # Główny komponent aplikacji (routy, providerzy)
│   ├── App.css            # Główne style aplikacji
│   ├── index.js           # Punkt wejścia aplikacji
│   ├── index.css          # Globalne style
│   │
│   ├── context/           # Konteksty React (globalny stan)
│   │   ├── AppContext.js          # Store dla danych champions (CRUD)
│   │   └── LanguageContext.js     # Store dla języka (PL/EN)
│   │
│   ├── services/          # Serwisy do komunikacji z API
│   │   └── api.js         # Funkcje do pobierania danych z champions.json
│   │
│   └── components/        # Komponenty React
│       ├── Layout/        # Komponenty układu (Header)
│       ├── Home/          # Strona główna
│       ├── Champions/     # Komponenty związane z bohaterami
│       ├── Filters/       # Komponenty filtrów
│       ├── Sort/          # Komponenty sortowania
│       └── Forms/         # Formularze (Formik)
```

---

## 🔍 Szczegółowy Opis Plików

### 1. **src/index.js** - Punkt wejścia
```javascript
// To jest pierwszy plik, który się ładuje
// Renderuje główny komponent App do DOM-u
```

### 2. **src/App.js** - Główny komponent aplikacji
```javascript
// Zawiera:
// - Providery (LanguageProvider, AppProvider) - udostępniają globalny stan
// - Router - zarządza nawigacją między stronami
// - Routes - definiuje wszystkie ścieżki URL (/, /champions, /champions/new, itd.)
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
- `AppProvider` udostępnia dane champions
- `Router` zarządza tym, która strona jest wyświetlana

---

### 3. **src/context/** - Globalny stan aplikacji

#### **AppContext.js** - Store dla danych
```javascript
// Co robi:
// 1. Ładuje dane champions z API (champions.json)
// 2. Przechowuje je w stanie React (useState)
// 3. Udostępnia funkcje CRUD:
//    - addChampion() - dodawanie
//    - updateChampion() - edycja
//    - deleteChampion() - usuwanie
// 4. Obsługuje loading i error states
```

**Jak działa:**
- Przy starcie: `useEffect` ładuje dane z `championsAPI.getAll()`
- Dane są zapisywane w `champions` state
- Komponenty używają hooka `useApp()` aby dostać dostęp do danych

#### **LanguageContext.js** - Store dla języka
```javascript
// Co robi:
// 1. Przechowuje aktualny język ('pl' lub 'en')
// 2. Zawiera słownik wszystkich tłumaczeń
// 3. Udostępnia funkcję t(key) do tłumaczenia tekstów
// 4. Udostępnia toggleLanguage() do zmiany języka
```

**Jak działa:**
- Słownik `translations` zawiera wszystkie teksty w PL i EN
- Funkcja `t('key')` zwraca odpowiedni tekst dla aktualnego języka
- Przycisk w Headerze wywołuje `toggleLanguage()` aby zmienić język

---

### 4. **src/services/api.js** - Komunikacja z API
```javascript
// Funkcje:
// - getAll() - pobiera wszystkie champions z /data/champions.json
// - getById(id) - pobiera jednego championa
// - create() - tworzy nowego (symulacja)
// - update() - aktualizuje (symulacja)
// - delete() - usuwa (symulacja)
```

**REST API:**
- Dane są w pliku JSON w `public/data/champions.json`
- Fetch pobiera dane z `/data/champions.json` (publiczny URL)

---

### 5. **src/components/** - Komponenty React

#### **Layout/Header.js** - Nagłówek strony
```javascript
// Zawiera:
// - Logo aplikacji
// - Linki nawigacyjne (Home, Champions)
// - Przycisk zmiany języka (PL/EN)
```

#### **Home/Home.js** - Strona główna
```javascript
// Wyświetla:
// - Powitanie
// - Mapę Runeterra
// - Opis funkcji aplikacji
```

#### **Champions/** - Komponenty związane z bohaterami

**ChampionList.js** - Lista wszystkich bohaterów
```javascript
// Funkcjonalność:
// 1. Wyświetla listę wszystkich champions
// 2. Używa FilterPanel do filtrowania (text, dropdown, checkbox)
// 3. Używa SortControls do sortowania
// 4. Pokazuje statystyki wyników
// 5. Ma przycisk "Dodaj nowego bohatera"
```

**ChampionDetail.js** - Szczegóły pojedynczego bohatera
```javascript
// Funkcjonalność:
// 1. Wyświetla pełne informacje o championie
// 2. Ma przycisk "Wstecz" (master-detail)
// 3. Ma przyciski "Edytuj" i "Usuń"
// 4. Wyświetla region (dziedzina poboczna) jako klikalny link
```

**ChampionCard.js** - Karta pojedynczego bohatera na liście
```javascript
// Wyświetla podstawowe info (zdjęcie, imię, tytuł, rola, region)
// Po kliknięciu przekierowuje do ChampionDetail
```

#### **Filters/FilterPanel.js** - Panel filtrów
```javascript
// Zawiera 3 typy filtrów:
// 1. Text input - wyszukiwanie po imieniu/tytule
// 2. Dropdown - wybór roli (role)
// 3. Checkbox group - wybór regionu (region)
```

#### **Sort/SortControls.js** - Kontrolki sortowania
```javascript
// Funkcjonalność:
// - Przyciski do wyboru pola sortowania (name, date, liczby)
// - Przycisk zmiany kierunku (rosnąco/malejąco)
// - Wizualne oznaczenie aktywnego sortowania
```

#### **Forms/ChampionForm.js** - Formularz dodawania/edycji
```javascript
// Używa Formik do zarządzania formularzem
// Walidacja danych poprzez funkcję validate (wbudowana w Formik)
// Wspólny formularz dla dodawania i edycji:
// - Jeśli jest /champions/new -> dodawanie
// - Jeśli jest /champions/:id/edit -> edycja
```

---

## 🔄 Przepływ Danych

### 1. **Pobieranie danych:**
```
AppContext (start)
  └── useEffect wywołuje loadChampions()
      └── championsAPI.getAll()
          └── Fetch z /data/champions.json
              └── Dane zapisywane w champions state
                  └── Komponenty używają useApp() aby dostać dane
```

### 2. **Przepływ danych w komponencie:**
```
ChampionList
  └── useApp() → pobiera champions z Context
  └── useState → lokalny stan filtrów i sortowania
  └── Filtrowanie i sortowanie → filteredAndSortedChampions
  └── Renderuje ChampionCard dla każdego championa
```

### 3. **Master-Detail:**
```
ChampionList (master)
  └── Kliknięcie na ChampionCard
      └── Router przekierowuje do /champions/:id
          └── ChampionDetail (detail)
              └── Wyświetla szczegóły wybranego championa
```

---

## 🌍 Internacjonalizacja

**Jak działa:**
1. `LanguageContext` przechowuje `language` state ('pl' lub 'en')
2. Każdy komponent używa `useLanguage()` hook
3. Komponenty wywołują `t('key')` aby pobrać przetłumaczony tekst
4. Przycisk w Headerze wywołuje `toggleLanguage()` aby zmienić język
5. Zmiana języka powoduje re-render wszystkich komponentów z nowymi tłumaczeniami

**Przykład:**
```javascript
// W komponencie:
const { t } = useLanguage();
<h2>{t('championList')}</h2>  // "Champions" lub "Bohaterowie"
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
- REST API z JSON (`/data/champions.json`) ✓
- Komponenty funkcyjne ✓
- Podział na komponenty ✓
- Store (Context API) ✓

### ✅ **Dziedzina główna - Champions [DST]:**
- Wyświetlanie wszystkich na liście ✓
- Filtrowanie: text, dropdown, checkbox ✓
- Sortowanie: alfabetycznie, daty, liczbowo ✓
- Graficzne przedstawienie ze zdjęciem ✓

### ✅ **Poruszanie się [DST]:**
- Master-detail (lista → szczegóły) ✓
- Dane dziedziny pobocznej (region) w szczegółach ✓
- Edycja i usunięcie w widoku szczegółowym ✓
- Przycisk dodania na liście ✓

### ✅ **Formularze [DST]:**
- Osobne route'y (`/champions/new`, `/:id/edit`) ✓
- Wspólny formularz dla dodawania i edycji ✓
- Walidacja danych (wbudowana w Formik) ✓
- Odpowiednie typy danych ✓

### ✅ **Internacjonalizacja [BDB]:**
- Dwie wersje językowe (PL/EN) ✓
- Przycisk przełączania ✓

### ⚠️ **Brakuje (opcjonalne [BDB]):**
- Paginacja dla listy champions
- Pełna implementacja regionów jako dziedziny pobocznej
- Statystyki z wykresami (są komponenty, brak routów)

---

## 🎯 Kluczowe Koncepcje

### **Context API (Store)**
- `AppContext` = globalny stan danych
- `LanguageContext` = globalny stan języka
- Każdy komponent może użyć hooków (`useApp()`, `useLanguage()`) aby dostać dostęp

### **React Router**
- Definiuje ścieżki URL i które komponenty wyświetlać
- `/` → Home
- `/champions` → ChampionList
- `/champions/:id` → ChampionDetail
- `/champions/new` → ChampionForm (dodawanie)
- `/champions/:id/edit` → ChampionForm (edycja)

### **Formik**
- Formik zarządza stanem formularza
- Walidacja poprzez funkcję `validate` (sprawdza min/max długości, wymagane pola)

### **Hooks React**
- `useState` - lokalny stan w komponencie
- `useContext` - dostęp do Context (poprzez `useApp()`, `useLanguage()`)
- `useEffect` - efekt uboczny (np. ładowanie danych przy starcie)
- `useNavigate`, `useParams` - React Router hooks

---

## 💡 Jak dodać nową funkcjonalność?

**Przykład: Dodanie paginacji**

1. Utwórz komponent `Pagination.js` w `components/Pagination/`
2. Dodaj stan `currentPage` w `ChampionList.js`
3. Przekaż tylko `currentPage * itemsPerPage` elementów do renderowania
4. Dodaj `<Pagination />` na końcu listy

**Przykład: Dodanie statystyk**

1. Utwórz `Statistics.js` w `components/Statistics/`
2. Dodaj route `/statistics` w `App.js`
3. Dodaj link w `Header.js`
4. Użyj danych z `useApp()` aby obliczyć statystyki

