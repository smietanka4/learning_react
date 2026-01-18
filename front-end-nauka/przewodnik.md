# Przewodnik do obrony projektu – League Legends Manager

Ten plik wyjaśnia wszystko, co wykracza poza zwykły React i JavaScript. Przeczytaj przed obroną.

---

## 1. STRUKTURA PROJEKTU

```
projekt/
├── public/
│   ├── data/
│   │   └── champions.json     <- DANE championów (tutaj dodajesz nowych!)
│   └── mapa.avif              <- zdjęcie mapy na stronie głównej
├── src/
│   ├── index.js               <- punkt wejścia, montuje <App /> w #root
│   ├── index.css              <- globalne style (przyciski, body)
│   ├── App.js                 <- główny komponent: Router + nawigacja
│   ├── App.css
│   ├── context/
│   │   └── AppContext.js      <- „magazyn” danych (champions, funkcje)
│   ├── services/
│   │   └── api.js             <- pobieranie danych z JSON, „udawany” backend
│   └── components/
│       ├── Layout/Header.js
│       ├── Home/Home.js       <- strona główna z mapą
│       ├── Champions/         <- lista, karta, szczegóły
│       ├── Filters/FilterPanel.js
│       ├── Sort/SortControls.js
│       └── Forms/ChampionForm.js  <- dodawanie i edycja (Formik + Yup)
├── generate-champions.js      <- skrypt Node do wygenerowania champions.json
└── package.json
```

---

## 2. BIBLIOTEKI „DODATKOWE” (nie czysty React/JS)

| Biblioteka           | Do czego służy                                                              |
| -------------------- | --------------------------------------------------------------------------- |
| **react-router-dom** | Nawigacja: adresy URL (/champions, /champions/5 itd.), przekierowania, Link |
| **formik**           | Obsługa formularzy: wartości pól, wysyłka, błędy                            |
| **yup**              | Walidacja: czy pole jest wypełnione, czy liczba w zakresie itd.             |

Reszta (react, react-dom, react-scripts) to standard Create React App.

---

## 3. REACT ROUTER (react-router-dom)

### Co robi

Ustawia, który komponent wyświetlić w zależności od adresu (ścieżki).

### Użycie w App.js

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

<Router>                    // „opakowuje” całą nawigację
  <Routes>                  // zestaw reguł: ścieżka -> komponent
    <Route path="/" element={<Home />} />
    <Route path="/champions" element={<ChampionList />} />
    <Route path="/champions/new" element={<ChampionForm />} />
    <Route path="/champions/:id" element={<ChampionDetail />} />      // :id = zmienna
    <Route path="/champions/:id/edit" element={<ChampionForm />} />
  </Routes>
</Router>
```

- **path="/"** – strona główna
- **path="/champions/:id"** – `:id` to parametr, np. /champions/7 → id=7

### Link (zamiast <a href>)

`<Link to="/champions">Champions</Link>` – zmienia adres bez przeładowania strony (SPA).

### useNavigate()

Funkcja do programowego przejścia na inną stronę:

```javascript
const navigate = useNavigate();
navigate("/champions"); // idź na /champions
navigate(-1); // cofnij (jak strzałka wstecz)
navigate(`/champions/${id}`); // idź na szczegóły championa o danym id
```

### useParams()

Czyta parametry ze ścieżki.
Dla `/champions/7/edit` w komponencie pod `path="/champions/:id/edit"`:

```javascript
const { id } = useParams(); // id === "7" (string)
```

---

## 4. CONTEXT API („magazyn” w React)

### Po co

Dane (lista championów, loading, błędy) i funkcje (dodaj, edytuj, usuń) są w jednym miejscu. Każdy komponent może z nich skorzystać bez przekazywania props w dół przez wiele poziomów.

### Mechanizm (3 elementy)

1. **createContext()** – tworzy „magazyn” (obecnie `AppContext`).
2. **Provider** – „opakowuje” drzewo komponentów i udostępnia `value` (obiekt z danymi i funkcjami).
3. **useContext(AppContext)** – w komponencie daje dostęp do tego `value`.

### Gdzie to jest

W `AppContext.js`:

- **createContext()**  
  `const AppContext = createContext();`

- **Provider w AppProvider**  
  `return <AppContext.Provider value={value}>{children}</AppContext.Provider>;`  
  `value` to obiekt:  
  `{ champions, loading, error, addChampion, updateChampion, deleteChampion, ... }`

- **useApp()**  
  Właściwie: `useContext(AppContext)`. W projekcie jest owinięte w funkcję `useApp()`, żeby:
  - mieć jeden import: `useApp` zamiast `useContext` + `AppContext`,
  - móc dodać sprawdzenie, czy komponent jest wewnątrz Providera.

### Jak używasz w komponencie

```javascript
import { useApp } from "../../context/AppContext";

function ChampionList() {
  const { champions, loading, error } = useApp();
  // dalej: champions.map(...), if (loading) return ..., itd.
}
```

### Zasada z wymagań

Dane najpierw ze store’a (Context), a jeśli ich nie ma – z API. U nas: `loadChampions()` wywołuje `championsAPI.getAll()`, a wynik trafia do `setChampions`, więc do Context. Później komponenty biorą `champions` z `useApp()` – czyli ze store’a.

---

## 5. FORMIK – CO TO I JAK UŻYWAMY

### Co to jest Formik

Biblioteka do formularzy w React. Zajmuje się:

- trzymaniem wartości pól (np. name, title, region),
- wysyłką formularza (onSubmit),
- wyświetlaniem błędów przy polach.

Bez Formika musiałbyś sam: useState na każde pole, onChange wszędzie, ręcznie zbierać dane i walidować.

### Główne części w ChampionForm

#### 1) Import

```javascript
import { Formik, Form, Field, ErrorMessage } from "formik";
```

- **Formik** – komponent „opakowujący” cały formularz.
- **Form** – zastępuje `<form>`, współpracuje z Formikiem.
- **Field** – pole formularza (input/select/textarea) powiązane z nazwą (name).
- **ErrorMessage** – pokazuje błąd walidacji dla danego `name`.

#### 2) Formik – najważniejsze props

```javascript
<Formik
  initialValues={initialValues} // początkowe wartości pól
  validationSchema={championSchema} // schemat Yup (reguły walidacji)
  onSubmit={handleSubmit} // funkcja po zatwierdzeniu (np. add/update)
  enableReinitialize // przy edycji: gdy zmieni się champion, Formik zaktualizuje initialValues
>
  {({ isSubmitting, setFieldValue, values }) => <Form>...</Form>}
</Formik>
```

- **initialValues** – obiekt, np. `{ name: '', title: '', region: '', ... }`. Przy edycji wstawiasz `champion` (dane z Context).
- **validationSchema** – obiekt Yup, który mówi, co jest wymagane i w jakim zakresie.
- **onSubmit** – Twoja funkcja. Dostaje `(values, { setSubmitting })`.  
  `values` = obiekt ze wszystkimi polami po wypełnieniu.  
  `setSubmitting(false)` – po zakończeniu (sukces lub błąd) odblokowujesz przycisk.
- **enableReinitialize** – przy edycji `initialValues` zmienia się na nowego `champion`; Formik „przeładowuje” wartości w formularzu.
- Funkcja w `children` `(props) =>` – Formik przekazuje m.in.:
  - **isSubmitting** – true w trakcie submit, używasz do `disabled={isSubmitting}` na przycisku.
  - **setFieldValue('imageUrl', wynik)** – ustawiasz pole `imageUrl` ręcznie (np. po wczytaniu pliku).
  - **values** – aktualne wartości pól; np. `values.imageUrl` do podglądu zdjęcia.

#### 3) Form

Zastępuje `<form>`. W `onSubmit` Formika – nie musisz pisać `e.preventDefault()`; Formik to robi.

#### 4) Field

```javascript
<Field type="text" id="name" name="name" className="form-input" />
<Field as="select" name="region" className="form-input">
  <option value="">Select Region</option>
  {availableRegions.map(region => (
    <option key={region} value={region}>{region}</option>
  ))}
</Field>
<Field as="textarea" name="lore" rows="5" />
```

- **name** – klucz w `values` i w `initialValues`. Po submit w `values` będzie np. `values.name`, `values.region`.
- **type** – jak w zwykłym input (text, number, date itd.).
- **as="select"** / **as="textarea"** – zamiast input Renderuje `<select>` / `<textarea>`.

#### 5) ErrorMessage

```javascript
<ErrorMessage name="name" component="div" className="error-message" />
```

Gdy Yup zgłosi błąd dla pola `name`, ErrorMessage wyświetli komunikat. `component="div"` – błąd w <div>.

#### 6) Ręczne ustawienie pola – setFieldValue

Dla zdjęcia nie używamy `Field`, tylko `<input type="file">`. Po wyborze pliku:

```javascript
const reader = new FileReader();
reader.onload = () => setFieldValue("imageUrl", reader.result);
reader.readAsDataURL(file);
```

`reader.result` to np. `data:image/png;base64,...`. Zapisujesz to w `imageUrl`; Formik traktuje to jak każde inne pole i w `onSubmit` masz `values.imageUrl`.

---

## 6. YUP – WALIDACJA

### Co to jest

Biblioteka do opisywania reguł walidacji. Formik wywołuje Yup przed `onSubmit`; jeśli Yup zwróci błędy, `onSubmit` się nie wykona, a ErrorMessage je pokaże.

### Użycie w ChampionForm

```javascript
import * as Yup from "yup";

const championSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
  title: Yup.string().min(3, "...").max(100, "...").required("..."),
  region: Yup.string().required("Region is required"),
  releaseDate: Yup.date().required("Release date is required"),
  role: Yup.string().required("Role is required"),
  difficulty: Yup.number().min(1, "...").max(10, "...").required("..."),
  baseHealth: Yup.number().min(100, "...").max(1000, "...").required("..."),
  baseMana: Yup.number().min(0, "...").max(1000, "...").required("..."),
  baseArmor: Yup.number().min(0, "...").max(100, "...").required("..."),
  baseMagicResist: Yup.number().min(0, "...").max(100, "...").required("..."),
  baseAttackDamage: Yup.number().min(30, "...").max(150, "...").required("..."),
  imageUrl: Yup.string().required(
    "Zdjęcie jest wymagane – wybierz plik z dysku",
  ),
  lore: Yup.string().min(20, "...").max(1000, "...").required("..."),
});
```

- **Yup.object().shape({...})** – obiekt z wieloma polami.
- **Yup.string()** / **Yup.number()** / **Yup.date()** – typ.
- **.required('komunikat')** – pole obowiązkowe.
- **.min(n, 'komunikat')** / **.max(n, 'komunikat')** – zakres dla liczby lub długości tekstu.

Nazwy pól (name, title, region, imageUrl, lore, …) muszą się zgadzać z `name` w `Field` i z `initialValues`.

---

## 7. API I DANE (services/api.js)

### Co tu jest

- Pobieranie listy championów z pliku JSON (`/data/champions.json`).
- Funkcje create/update/delete **nie** wysyłają requestów na serwer – zwracają `Promise.resolve(...)`. Dane są tak naprawdę zmieniane w Context przez `addChampion` / `updateChampion` / `deleteChampion`.

### fetch

```javascript
fetch(API_BASE + "/champions.json").then((res) => {
  if (!res.ok) throw new Error("Failed to fetch champions");
  return res.json();
});
```

- `fetch(url)` – wysyła request GET.
- `res.ok` – false przy statusie 4xx, 5xx.
- `res.json()` – parsuje odpowiedź jako JSON (zwraca Promise z tablicą/obiektem).

### Gdzie leży plik

`public/data/champions.json`. W Create React App to, co jest w `public/`, jest serwowane z „root” (/), więc ścieżka to `/data/champions.json`.  
`API_BASE` to `process.env.REACT_APP_API_URL || '/data'`, czyli domyślnie `/data`.

### Promise

`.then(data => ...)` i `.catch(err => ...)` to standardowe Promisy. `championsAPI.getAll()` zwraca Promise, więc w Context robisz:

```javascript
championsAPI.getAll()
  .then((data) => { setChampions(data); ... })
  .catch((err) => { setError(err.message); })
  .finally(() => { setLoading(false); });
```

---

## 8. JAK DODAĆ WIĘCEJ CHAMPIONÓW

### Sposób 1: Ręczna edycja pliku JSON

1. Otwórz `public/data/champions.json`.
2. To jest **tablica** obiektów. Jeden champion to jeden obiekt, np.:

```json
{
  "id": 101,
  "name": "NowaPostać",
  "title": "The New One",
  "region": "Demacia",
  "releaseDate": "2024-01-15",
  "role": "Fighter",
  "difficulty": 5,
  "baseHealth": 600,
  "baseMana": 300,
  "baseArmor": 30,
  "baseMagicResist": 32,
  "baseAttackDamage": 60,
  "imageUrl": "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/NowaPostac.png",
  "lore": "Opis postaci, min. 20 znaków."
}
```

3. **id** – musi być unikalne. Jeśli masz 100 elementów z id 1–100, nowy daj 101 (albo max+1).
4. **imageUrl** – albo link z CDN Riot (nazwa w URL bez spacji i znaków specjalnych, np. „Kai'Sa” → często „Kaisa”), albo zdjęcie dodane potem przez formularz (wtedy w JSON na starcie możesz dać `""` – użytkownik w aplikacji doda przez upload).
5. Wstaw nowy obiekt do tablicy (przecinek po poprzednim, prawidłowe nawiasy `[ ]`).
6. Zapisz. Po odświeżeniu strony i ponownym `loadChampions` nowy champion się pojawi.

### Sposób 2: Skrypt generate-champions.js

1. W pliku `generate-champions.js` jest tablica `champions` z nazwami (Aatrox, Ahri, …) i pętla `for (let i = 0; i < 100; i++)`.
2. Żeby wygenerować np. 120 championów:
   - w tablicy `champions` dopisz brakujące 20 nazw (muszą być na liście, inaczej będzie błąd),
   - zmień `i < 100` na `i < 120`.
3. W konsoli (w folderze `projekt`):
   - `node generate-champions.js`
4. Skrypt nadpisuje `public/data/champions.json`. Odśwież aplikację.

Uwaga: `imageUrl` w skrypcie budowane jest z `name` (usuwa się znaki inne niż a–z, 0–9). Dla postaci z CDN Riot nazwa w URL bywa inna (np. „Nunu” zamiast „Nunu & Willump”) – część zdjęć może nie działać; w takim przypadku w formularzu można dodać zdjęcie przez upload.

---

## 9. PRZEPŁYW DANYCH (krótko)

1. **Start:**  
   `index.js` ładuje `App` w `#root`.  
   `App` opakowuje wszystko w `<AppProvider>` (Context) i `<Router>`.

2. **Dane:**  
   W `AppProvider`, `useEffect` wywołuje `loadChampions()`.  
   `loadChampions` robi `championsAPI.getAll()` (fetch do `/data/champions.json`), potem `setChampions(data)`.  
   Lista jest w state Context i udostępniana przez `useApp()`.

3. **Lista:**  
   `ChampionList` bierze `champions` z `useApp()`, filtruje i sortuje lokalnie, po czym `.map()` → `ChampionCard` dla każdego.  
   Klik w kartę to `Link to={/champions/${champion.id}}` → zmiana URL na `/champions/7`.

4. **Szczegóły:**  
   `ChampionDetail` czyta `useParams().id`, w `champions` szuka `champ.id === parseInt(id, 10)` i renderuje szczegóły.  
   Przyciski Edit/Delete używają `updateChampion`/`deleteChampion` z `useApp()` oraz `navigate()`.

5. **Formularz:**  
   `ChampionForm` sprawdza `useParams().id` – brak `id` = nowy champion, jest `id` = edycja.  
   Pobiera `champions`, `addChampion`, `updateChampion` z `useApp()`.  
   Formik: `initialValues` z `champion` (edycja) lub pusty obiekt (dodawanie).  
   Po submit: `addChampion(values)` lub `updateChampion(id, values)`, potem `navigate(...)`.  
   W Context: `addChampion` dopisuje do `champions` i nadaje nowe `id`; `updateChampion` zamienia obiekt po `id`; `deleteChampion` filtruje po `id`.

---

## 10. PODSUMOWANIE: CO MÓWIĆ NA OBRONIE

- **React:** komponenty funkcyjne, `useState`, `useEffect`, `useContext`, `createContext`, `Provider`.
- **React Router:** `BrowserRouter`, `Routes`, `Route`, `Link`, `useNavigate`, `useParams` – do czego służą i gdzie są użyte.
- **Context:** jedna „skrzynka” na dane i funkcje; `AppProvider` i `useApp()`; zasada „dane ze store’a, a gdy brak – z API”.
- **Formik:** `Formik`, `Form`, `Field`, `ErrorMessage`; `initialValues`, `validationSchema`, `onSubmit`; `setFieldValue` przy uploadzie zdjęcia; `isSubmitting`, `values`.
- **Yup:** `Yup.object().shape({...})`, `required`, `min`, `max` dla string/number/date; spójność z `Field` i `initialValues`.
- **API:** `fetch` do `/data/champions.json`; `championsAPI.getAll/create/update/delete`; `Promise` + `.then`/`.catch`/`.finally`.
- **Dodawanie championów:** edycja `public/data/champions.json` (struktura obiektu) albo `generate-champions.js` (tablica nazw, pętla, `node generate-champions.js`).
- **Struktura:** `index.js` → `App` → `AppProvider` + `Router`; `Routes`/`Route`; komponenty w `components/`; dane w `context/`, wywołania API w `services/`.

Powodzenia na obronie.
