# Sprawozdanie z Laboratorium nr 1

**Przedmiot:** Integracja Systemów Informatycznych  
**Temat:** Git, GitHub i przygotowanie środowiska Node.js  
**Data:** 17.03.2026
**Student:** Oliwia Spaleniak

-----

## 1\. Cel laboratorium

Celem zajęć było opanowanie systemu kontroli wersji Git, platformy GitHub oraz przygotowanie lokalnego środowiska programistycznego (w tym przypadku Node.js). Głównym zadaniem była konfiguracja bezpiecznego dostępu przez SSH, zarządzanie gałęziami (branches), rozwiązywanie konfliktów oraz automatyzacja testów za pomocą GitHub Actions.

## 2\. Realizacja zadań

### Zadanie 1: Konfiguracja środowiska i SSH

  - **Opis działań:** Skonfigurowano tożsamość użytkownika Git oraz wygenerowano parę kluczy SSH (ed25519), aby umożliwić bezpieczne przesyłanie kodu do zdalnego repozytorium bez każdorazowego podawania hasła. Klucz publiczny został dodany do profilu na GitHubie.
  - **Zastosowane komendy Git:**
    ```bash
    git config --global user.name "Oliwia"
    git config --global user.email "oliwia_spa2005@interia.pl"
    ssh-keygen -t ed25519 -C "oliwia_spa2005@interia.pl"
    ```
    

### Zadanie 2: Inicjalizacja projektu i pierwsza gałąź

  - **Opis działań:** Zainicjowano projekt Node.js (`npm init`), stworzono lokalne repozytorium Git i połączono je ze zdalnym na GitHubie. Następnie utworzono gałąź `feature/initial-setup`, na której zaimplementowano podstawowy serwer Express.
  - **Zastosowane komendy Git:**
    ```bash
    git init
    git remote add origin git@github.com:oliq11/isi-lab1.git
    git checkout -b feature/initial-setup
    git add .
    git commit -m "Initial Node.js setup with Express"
    git push origin feature/initial-setup
    ```

### Zadanie 3: Praca na wielu gałęziach i dokumentacja

  - **Opis działań:** Stworzono drugą gałąź pomocniczą `feature/second-branch` w celu edycji pliku README. Przećwiczono przełączanie się między gałęziami oraz scalanie zmian do głównej gałęzi `main`.
  - **Zastosowane komendy Git:**
    ```bash
    git checkout -b feature/second-branch
    git commit -m "Edited README"
    git checkout main
    git merge feature/second-branch
    git push origin feature/second-branch
    ```

### Zadanie 4: Symulacja i rozwiązanie konfliktu

  - **Opis działań:** Wywołano celowy konflikt poprzez edycję tej samej linii pliku README.md w przeglądarce (na GitHubie) oraz lokalnie. Po próbie wypchnięcia zmian Git zgłosił błąd. Konflikt rozwiązano ręcznie poprzez edycję znaczników w pliku.
  - **Zastosowane komendy Git:**
    ```bash
    git pull origin main
    # Ręczna edycja pliku README.md (usunięcie <<<< HEAD i ====)
    git add README.md
    git commit -m "Fix merge conflict in README"
    git push origin main
    ```

### Zadanie 5: Automatyzacja GitHub Actions

  - **Opis działań:** Skonfigurowano plik workflow `.github/workflows/node.js.yml`, który automatycznie uruchamia proces budowania i testowania aplikacji przy każdym pushu. Napotkano trudność z brakiem pliku `package-lock.json`, co powodowało błąd `npm ci`. Problem rozwiązano generując plik lokalnie i wysyłając go do repozytorium.
  - **Fragment kodu workflow:**
    ```yaml
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
    ```

## 3\. Dokumentacja pracy z Gitem

  - **Link do repozytorium:** [https://github.com/oliq11/isi-lab1](https://www.google.com/search?q=https://github.com/oliq11/isi-lab1)
  - **Historia commitów:**
      - `Fix merge conflict in README`
      - `Local change to README`
      - `Edited README`
      - `Initial Node.js setup with Express`

## 4\. Wnioski

Podczas laboratorium nauczyłam się pełnego cyklu pracy z Gitem – od konfiguracji SSH po rozwiązywanie konfliktów. Największym wyzwaniem okazała się konfiguracja GitHub Actions, gdzie proces `npm ci` wymagał obecności pliku `package-lock.json`, którego początkowo nie było w repozytorium. Zrozumienie, jak Git izoluje zmiany na różnych gałęziach, znacząco ułatwia pracę w zespole.