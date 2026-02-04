# Raport Wymagań Projektowych

Analiza projektu pod kątem spełnienia kryteriów oceniania. Próg zaliczenia: 60% (ok. 12 pkt).

## 1. HTTP (Szacowany wynik: 4.65 / 6 pkt)

### CRUD (Operacje na danych) - 1.05 pkt

- **CREATE (Dodawanie danych) - 0.3 pkt**
  - [x] Użytkownicy (`POST /api/register`) - 0.15 pkt
  - [x] Strategie (`POST /api/strategies`) - 0.15 pkt
- **READ (Odczytywanie danych) - 0.45 pkt**
  - [x] Profil użytkownika (`GET /api/profile`) - 0.15 pkt
  - [x] Strategie (`GET /api/strategies`) - 0.15 pkt
  - [x] Historia meczów (`GET /api/history`) - 0.15 pkt
- **UPDATE (Zmiana danych) - 0.15 pkt**
  - [x] Bio użytkownika (`PUT /api/profile`) - 0.15 pkt
  - [ ] Brak edycji strategii lub innych zasobów
- **DELETE (Usuwanie danych) - 0.15 pkt**
  - [x] Strategie (`DELETE /api/strategies/:id`) - 0.15 pkt
  - [ ] Brak usuwania konta lub historii

### Wyszukiwanie (0.3 pkt)

- [x] Wyszukiwanie strategii wg wzorca (`GET /api/strategies?q=...`) - 0.3 pkt
  - Zaimplementowane filtrowanie po stronie serwera (`ILIKE`).

### Logowanie i wylogowywanie (0.3 pkt)

- [x] Logowanie (`POST /api/login`) z JWT - 0.3 pkt
  - Wylogowywanie realizowane po stronie klienta (standard dla JWT).

### Klient (3.0 pkt)

- [x] Kompletny klient SPA (Single Page Application) w `public/app.js` - 3.0 pkt
  - Obsługuje wszystkie zdefiniowane punkty końcowe.
  - Posiada interfejs dla logowania, lobby, gry i zarządzania strategiami.

---

## 2. MQTT, WS, SSE (Szacowany wynik: 5.0 / 6 pkt)

- **Backend MQTT - 2.0 pkt**
  - [x] Publikowanie komunikatów systemowych i powiadomień o stanie gry na specyficzne tematy (`pokemon-game-project/room/:id`).
  - Wykorzystanie biblioteki `mqtt` w `server.js`.

- **Frontend WebSocket - 3.0 pkt (MAX)**
  - [x] Pełna logika gry w czasie rzeczywistym przy użyciu `socket.io`.
  - Zarządzanie pokojami, synchronizacja tur, obsługa ataków, aktualizacja HP w czasie rzeczywistym.
  - Złożona logika interakcji między dwoma graczami.

_(Opcjonalnie: Frontend MQTT również jest zaimplementowany w `app.js` przez WebSocket, co dodatkowo potwierdza kompetencje w tym obszarze)_

---

## 3. Inne (Szacowany wynik: 5.0 / 6 pkt)

### Funkcjonalności powiązane z protokołami (2.0 pkt)

- [x] **Frontend MQTT (WSS)** - 1.0 pkt
  - Klient przeglądarkowy łączy się bezpośrednio z brokerem HiveMQ przez WebSocket (`wss://...`) aby odbierać wiadomości systemowe. Jest to dodatkowe użycie protokołu niezależne od głównego `socket.io`.
- [x] **Zewnętrzne API (HTTP)** - 1.0 pkt
  - Pobieranie danych o Pokemonach (statystyki, grafiki) z zewnętrznego serwisu `pokeapi.co` przy starcie serwera.

### Inne funkcjonalności (maks. 3 pkt) - 3.0 pkt

- [x] **Baza danych PostgreSQL** - Wykorzystanie bazy danych do trwałego zapisu użytkowników, historii gier i strategii using `pg`.
- [x] **Szyfrowanie haseł** - Użycie `bcryptjs` do bezpiecznego przechowywania haseł.
- [x] **JSON Web Token (JWT)** - Bezpieczna autoryzacja użytkowników.
- [x] **Pliki konfiguracyjne** - Użycie zmiennych środowiskowych `.env`.
- [x] **Logika biznesowa gry** - Balansowanie statystyk, obliczanie obrażeń, walidacja ruchów.

---

## 4. Aplikacja (Szacowany wynik: 2.0 / 2 pkt)

- [x] **Jakość wykonania** - 2.0 pkt
  - Kod jest podzielony na moduły (serwer, baza danych, statycznie serwowany frontend).
  - Aplikacja wygląda na kompletną i działającą bez ewidentnych błędów logicznych w kodzie.

---

## Podsumowanie

**Szacowana liczba punktów: ~16.65 / 20 pkt**
**Wynik procentowy: ~83%**

Wymóg 60% (12 pkt) został spełniony z dużym zapasem. Projekt realizuje kluczowe wymagania dotyczące protokołów HTTP, WebSocket oraz MQTT, a także posiada solidną warstwę persistentcji i logiki biznesowej.
