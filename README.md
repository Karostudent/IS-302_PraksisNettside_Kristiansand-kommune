# IS-302 – Praksisnettside for Kristiansand kommune

En prosjektnettside for studentgruppen i IS-302 ved Universitetet i Agder (UiA). Studentene Karoline og Jabir gjennomfører praksis i Kristiansand kommune, Samfunnsmedisinsk enhet, der de jobber med effektivisering og digitalisering av saksbehandlingsprosessen for **ALIS-tilskudd (Allmennleger i spesialisering)** gjennom utvikling av en ny tilskuddsportal.

## Sider

| Side | Rute | Fil | Beskrivelse |
|------|------|-----|-------------|
| Hjem | `/` | `Pages/Index.cshtml` | Gruppepresentasjon, prosjektsammendrag og hurtigkoblinger |
| Prosjektet | `/prosjekt` | `Pages/Prosjekt.cshtml` | Detaljert prosjektbeskrivelse for ALISflyt, metode, tidslinje og relevant prosjektmateriale |
| Gruppen | `/gruppen` | `Pages/Gruppen.cshtml` | Utvidede studentprofiler for Karoline og Jabir |
| Statusrapporter | `/statusrapporter` | `Pages/Statusrapporter.cshtml` | Løpende fremdriftsoppdateringer gjennom semesteret |
| Dagbok | `/dagbok` | `Pages/Dagbok.cshtml` | Praksisdagbok med refleksjoner, notater og Supabase Auth |

## Struktur

```
/
├── Pages/
│   ├── Dagbok.cshtml
│   ├── Error.cshtml
│   ├── Gruppen.cshtml
│   ├── Index.cshtml
│   ├── Prosjekt.cshtml
│   └── Statusrapporter.cshtml
├── wwwroot/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   ├── AS-IS (1).png
│   │   ├── Jabir.jpeg
│   │   ├── Karoline.jpeg
│   │   ├── L_KRS_Forenklet_byvaapen.png
│   │   ├── Ny soknad-fail.png
│   │   ├── radhuskvartalet.jpg
│   │   ├── Soknader.png
│   │   ├── Tilskudd-excel.png
│   │   └── TO-BE forelopigpng.png
│   └── js/
│       ├── main.js
│       └── supabase-config.js
├── Program.cs
├── PraksisNettside.csproj
└── README.md
```

Prosjektsiden bruker `TO-BE forelopigpng.png` som fremhevet illustrasjon av ALISflyt. I tillegg vises fire relevante bilder i et 2x2-galleri: dagens Excel-baserte arbeid, As-Is-kartlegging, prototypen for ny søknad og oversikten over søknader. Bilder uten ferdig prosjektmateriale er ikke tatt med som placeholders.

## Slik legger du til innhold

### Ny statusrapport
Åpne `Pages/Statusrapporter.cshtml` og legg til et nytt `<div class="card report-card">` øverst i containeren.

### Nytt dagbokinnlegg
Gå til Dagbok-siden (`/dagbok`), fyll ut skjemaet og trykk **Lagre innlegg**. Innlegg kan også redigeres og slettes fra dagboken.

Dagbokinnlegg lagres i Supabase-tabellen `diary_entries` og er tilgjengelige på tvers av nettlesere og enheter. Tilkoblingen konfigureres i `wwwroot/js/supabase-config.js`.

Alle kan lese dagbokinnlegg. Oppretting, redigering og sletting krever innlogging med den delte Supabase Auth-kontoen `dagbok@praksisnettside.no`.

### Aktivere Dagbok-tilgang

1. Opprett brukeren `dagbok@praksisnettside.no` under **Authentication → Users** i Supabase, med automatisk e-postbekreftelse aktivert.
2. Kjør `supabase/diary-auth-policies.sql` i Supabase SQL Editor. Dette fjerner de midlertidige offentlige skrivepolicyene.
3. Logg inn fra Dagbok-siden med passordet du valgte da brukeren ble opprettet.

## Lokal kjøring

Kjør prosjektet med .NET CLI:

```bash
dotnet run
```

For automatisk oppdatering i nettleseren ved lagring (Hot Reload / Live Server-opplevelse):

```bash
dotnet watch
```

Gå deretter til URL-en som vises i terminalen (f.eks. `http://localhost:5000` eller `https://localhost:7000`).

## Teknologier

- ASP.NET Core Razor Pages (.NET 10)
- HTML5 / CSS3 (med sval nordisk/vinterlig Kristiansand-fargepalett)
- Vanilla JavaScript
- Supabase JavaScript-klient via CDN
