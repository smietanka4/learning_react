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
