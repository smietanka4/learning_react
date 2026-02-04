# Dokumentacja Prezentacyjna Projektu

## 1. Opis Projektu

Aplikacja to **Wieloosobowa Gra Bitewna Pokemon** realizowana w czasie rzeczywistym.

System łączy w sobie kilka wzorców komunikacji:

- **REST API** do zarządzania kontem użytkownika, historią gier i strategiami (notatkami).
- **WebSockets (Socket.io)** do obsługi dynamicznej rozgrywki (wybór, tury, ataki) bez opóźnień.
- **MQTT** do przesyłania ogłoszeń systemowych i logów walki bezpośrednio do klientów.
- **Zewnętrzne API** (PokeAPI) do dynamicznego pobierania danych o Pokemonach przy starcie serwera.

Całość oparta jest na architekturze klient-serwer z wykorzystaniem bazy danych PostgreSQL.

---

## 2. Lokalizacja Funkcjonalności (Wg Kryteriów)

Poniżej znajduje się ściąga pokazująca, w którym pliku i w jakiej funkcji szukać poszczególnych elementów oceniania.

### I. HTTP (REST API)

| Funkcjonalność            | Metoda   | Endpoint                | Lokalizacja w kodzie                                            |
| ------------------------- | -------- | ----------------------- | --------------------------------------------------------------- |
| **Logowanie (JWT)**       | `POST`   | `/api/login`            | `server.js` (linie ~88-103)                                     |
| **Rejestracja**           | `POST`   | `/api/register`         | `server.js` (linie ~74-86)                                      |
| **Odczyt Profilu**        | `GET`    | `/api/profile`          | `server.js` (linie ~105-111)                                    |
| **Edycja Profilu (Bio)**  | `PUT`    | `/api/profile`          | `server.js` (linie ~113-119)                                    |
| **Dodawanie Strategii**   | `POST`   | `/api/strategies`       | `server.js` (linie ~122-134)                                    |
| **Pobieranie Strategii**  | `GET`    | `/api/strategies`       | `server.js` (linie ~136-143)                                    |
| **Wyszukiwanie (Search)** | `GET`    | `/api/strategies?q=...` | `server.js` (linia ~137 - filtracja SQL `ILIKE`)                |
| **Usuwanie Strategii**    | `DELETE` | `/api/strategies/:id`   | `server.js` (linie ~145-148)                                    |
| **Historia Gier**         | `GET`    | `/api/history`          | `server.js` (linie ~151-157)                                    |
| **Klient HTTP**           | -        | -                       | `public/app.js` (funkcje `login`, `register`, `loadStrat` itd.) |

### II. Protokoły Real-Time (MQTT, WebSocket)

| Protokół                  | Zastosowanie                                  | Lokalizacja Backend                                     | Lokalizacja Frontend                                  |
| ------------------------- | --------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| **WebSocket (Socket.io)** | Główna logika gry (dołączanie, walka)         | `server.js` (`io.on('connection')`, ~linia 202)         | `public/app.js` (cała sekcja `// --- GAME LOGIC ---`) |
| **MQTT (Backend)**        | Publikacja zdarzeń systemowych                | `server.js` (`mqttClient`, funkcja `sendSystemMessage`) | -                                                     |
| **MQTT (Frontend)**       | Odbiór wiadomości systemowych przez WebSocket | -                                                       | `public/app.js` (funkcja `setupMqtt`, używa `wss://`) |

### III. Inne Funkcjonalności

| Funkcjonalność     | Opis                                                 | Lokalizacja                                            |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------ |
| **Baza Danych**    | PostgreSQL (tabela users, match_history, strategies) | `database.js` (inicjalizacja), `server.js` (zapytania) |
| **Zewnętrzne API** | Pobieranie danych z PokeAPI (fetch)                  | `server.js` (funkcja `initPokemonData`)                |
| **Bezpieczeństwo** | Hashowanie haseł (bcryptjs)                          | `server.js` (przy rejestracji i logowaniu)             |
| **Autoryzacja**    | Weryfikacja tokenu JWT (middleware)                  | `server.js` (funkcja `authenticateToken`)              |
| **Logika Gry**     | Obliczanie obrażeń, celności, krytyków               | `server.js` (event `socket.on('attack')`)              |

### IV. Klient (Aplikacja)

- **Struktura**: SPA (Single Page Application) bez przeładowań.
- **Pliki**:
  - `public/index.html` (widoki przełączane klasą `.hidden`)
  - `public/app.js` (logika klienta)
  - `public/style.css` (wygląd)

# Jak działa hashowanie w tym projekcie?

W projekcie wykorzystywana jest biblioteka **`bcryptjs`**. Służy ona do bezpiecznego przechowywania haseł, aby nigdy nie były zapisywane w bazie jawnym tekstem.

## 1. Rejestracja (Tworzenie Hasha)

**Gdzie:** `server.js` (endpoint `/api/register`)

```javascript
const hash = bcrypt.hashSync(password, 8);
```

### Co się dzieje?

1.  **Solenie (Salting):** Algorytm generuje losowy ciąg znaków zwany "solą" (tutaj wykonuje 8 rund generowania/mieszania).
2.  **Hashowanie:** Sól jest łączona z hasłem użytkownika, a następnie całość jest wielokrotnie przetwarzana matematycznie.
3.  **Wynik:** Powstaje jeden długi ciąg znaków (np. `$2a$08$KluczSoli...Hash`), który zawiera w sobie informację o algorytmie, użytą sól oraz właściwy hash. To ten ciąg trafia do bazy danych.

## 2. Logowanie (Porównanie Haseł)

**Gdzie:** `server.js` (endpoint `/api/login`)

```javascript
bcrypt.compareSync(password, user.password);
```

### Jak to działa, skoro hasła nie da się "odhashować"?

System **NIE odszyfrowuje** hasła z bazy, ponieważ funkcje skrótu (hash) są jednokierunkowe. Porównanie działa następująco:

1.  System pobiera **hash** zapisany w bazie danych dla danego użytkownika.
2.  Wyciąga z niego użytą przy rejestracji **sól** (jest zakodowana w początkowych znakach hasha).
3.  Bierze hasło, które użytkownik wpisał **teraz** w formularzu logowania.
4.  Hashuje to wpisane hasło **tą samą solą** i tym samym algorytmem.
5.  Porównuje **nowo wygenerowany hash** z tym **z bazy**.

**Wniosek:** Jeśli wyniki są identyczne, oznacza to, że użytkownik wpisał to samo hasło co przy rejestracji, mimo że serwer nigdy nie poznaje jego jawnej formy.
