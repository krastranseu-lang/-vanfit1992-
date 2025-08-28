# VanFit — minimalny szkielet UI

Prosty szkic aplikacji do planowania załadunku:
- Lewy panel: lista ładunków + szybkie dodawanie (presety, wklejka tekstowa).
- Prawa strona: obrys przestrzeni ładunkowej (2D canvas/SVG) z planem podglądu.

## Uruchomienie (UI)
- Otwórz plik  w przeglądarce (bez serwera wystarczy).
- Widzisz: panel po lewej oraz pusty obrys pojazdu po prawej.

## Kod i testy
- Logika LDM:  (funkcje , ).
- Geometria 2D:  (prostokąty, odejmowanie stref „blocked”).
- Komponenty UI (React):
  -  – panel z podsumowaniem LDM,
  -  – prosty podgląd podłogi (SVG).
- Testy: katalog  (Vitest + jsdom).

Aby uruchomić testy lokalnie:
1. Wymagany Node.js 18+.
2. 
3.  (typowanie + testy) lub  (same testy).

Uwaga: w aktualnym środowisku asystenta  nie jest dostępne, więc testów nie uruchomiłem – ale konfiguracja (, , ) jest gotowa.

## Struktura
-  – samowystarczalny prototyp UI (HTML/CSS/JS, również widok 2D/3D).
-  – moduły TS/TSX (logika i komponenty, pokryte testami).
-  – testy jednostkowe (Vitest, RTL dla komponentów).

## Proponowane następne kroki
- Integracja: spiąć lewy panel z obliczaniem LDM () i wyświetlać  nad listą.
- Rysowanie 2D: użyć  dla prostego, skalowalnego rysunku obrysu i stref „blocked”.
- Stan aplikacji: prosty store (np. w pamięci + ) dla listy ładunków, obrotów 90°, ilości i wagi.
- Interakcje: dodawanie/usuwanie/rotacja ładunków, szybkie presety, wklejka tekstowa parser → lista pozycji.
- Dev UX: opcjonalnie dodać Vite (dev serwer + bundling TS/TSX) i wyprowadzić UI do komponentów React.

## Licencja
Wewnętrzny szkic/prototyp (brak licencji publicznej, do użytku własnego).

