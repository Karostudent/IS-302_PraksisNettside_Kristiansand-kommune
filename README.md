# IS-302 – Praksisnettside for Kristiansand kommune

En enkel, stilig nettside for studentgruppen i IS-302 ved Universitetet i Agder.

## Sider

| Side | Fil | Beskrivelse |
|------|-----|-------------|
| Hjem | `index.html` | Gruppepresentasjon og prosjektsammendrag |
| Prosjektet | `prosjekt.html` | Detaljert prosjektbeskrivelse og tidslinje |
| Statusrapporter | `statusrapporter.html` | Løpende fremdriftsoppdateringer |
| Dagbok | `dagbok.html` | Passord-beskyttet intern dagbok |

## Struktur

```
/
├── index.html
├── prosjekt.html
├── statusrapporter.html
├── dagbok.html
├── css/
│   └── style.css
└── js/
    └── main.js
```

## Dagbok-passord

Standard passord: **`gruppe2024`** (eller `dagbok`)

Passordet kan endres i `js/main.js` – finn `ACCEPTED`-arrayen og oppdater verdiene.

## Slik legger du til innhold

### Ny statusrapport
Åpne `statusrapporter.html` og legg til et nytt `<div class="card report-card">` øverst i containeren.
Bruk kommentaren i filen som mal.

### Nytt dagbokinnlegg
Åpne `dagbok.html` og legg til et nytt `<div class="diary-entry">` øverst i dagbok-seksjonen.
Bruk kommentaren i filen som mal.

## Lokal kjøring

Åpne `index.html` direkte i nettleseren, eller bruk en enkel HTTP-server:

```bash
python3 -m http.server 8080
```

Gå deretter til `http://localhost:8080`.

## Teknologier

- HTML5 / CSS3 (med CSS-variabler)
- Vanilla JavaScript (ingen rammeverk)
- Ingen eksterne avhengigheter
Nettside for presentasjon og statusoppdateringer under praksis i Kristiansand kommune
