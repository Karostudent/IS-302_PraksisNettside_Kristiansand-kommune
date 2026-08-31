# IS-302 – Praksisnettside for Kristiansand kommune

En enkel, stilig nettside for studentgruppen i IS-302 ved Universitetet i Agder.

## Sider

| Side | Fil | Beskrivelse |
|------|-----|-------------|
| Hjem | `index.html` | Gruppepresentasjon og prosjektsammendrag |
| Prosjektet | `prosjekt.html` | Detaljert prosjektbeskrivelse og tidslinje |
| Statusrapporter | `statusrapporter.html` | Løpende fremdriftsoppdateringer |
| Dagbok | `dagbok.html` | Praksisdagbok med refleksjoner og notater |

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

## Slik legger du til innhold

### Ny statusrapport
Åpne `statusrapporter.html` og legg til et nytt `<div class="card report-card">` øverst i containeren.
Bruk kommentaren i filen som mal.

### Nytt dagbokinnlegg
Åpne `dagbok.html`, fyll ut skjemaet og trykk **Lagre innlegg**. Innlegg kan også redigeres og slettes fra dagboken.

Dagbokinnlegg lagres i Supabase-tabellen `diary_entries` og er tilgjengelige på tvers av nettlesere og enheter. Tilkoblingen konfigureres i `js/supabase-config.js`.

Alle kan lese dagbokinnlegg. Oppretting, redigering og sletting krever innlogging med den delte Supabase Auth-kontoen `dagbok@praksisnettside.no`. Passordet lagres bare i Supabase Auth og kan endres fra Dagbok-siden etter at det nåværende passordet er bekreftet.

### Aktivere Dagbok-tilgang

1. Opprett brukeren `dagbok@praksisnettside.no` under **Authentication → Users** i Supabase, med automatisk e-postbekreftelse aktivert.
2. Kjør `supabase/diary-auth-policies.sql` i Supabase SQL Editor. Dette fjerner de midlertidige offentlige skrivepolicyene.
3. Logg inn fra `dagbok.html` med passordet du valgte da brukeren ble opprettet.

## Lokal kjøring

Åpne `index.html` direkte i nettleseren, eller bruk en enkel HTTP-server:

```bash
python3 -m http.server 8080
```

Gå deretter til `http://localhost:8080`.

## Teknologier

- HTML5 / CSS3 (med CSS-variabler)
- Vanilla JavaScript (ingen rammeverk)
- Supabase JavaScript-klient via CDN
Nettside for presentasjon og statusoppdateringer under praksis i Kristiansand kommune
