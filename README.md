# IS-302 – Praksisnettside for Kristiansand kommune

En enkel, stilig nettside for studentgruppen i IS-302 ved Universitetet i Agder.

## Sider

| Side | Rute | Fil | Beskrivelse |
|------|------|-----|-------------|
| Hjem | `/` | `Pages/Index.cshtml` | Gruppepresentasjon og prosjektsammendrag |
| Prosjektet | `/prosjekt` | `Pages/Prosjekt.cshtml` | Detaljert prosjektbeskrivelse og tidslinje |
| Statusrapporter | `/statusrapporter` | `Pages/Statusrapporter.cshtml` | Løpende fremdriftsoppdateringer |
| Dagbok | `/dagbok` | `Pages/Dagbok.cshtml` | Praksisdagbok med refleksjoner og notater |

## Struktur

```
/
├── Pages/
│   ├── Dagbok.cshtml
│   ├── Error.cshtml
│   ├── Index.cshtml
│   ├── Prosjekt.cshtml
│   └── Statusrapporter.cshtml
├── wwwroot/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   └── L_KRS_Forenklet_byvaapen.png
│   └── js/
│       ├── main.js
│       └── supabase-config.js
├── Program.cs
├── PraksisNettside.csproj
└── README.md
```

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

Gå deretter til URL-en som vises i terminalen (f.eks. `http://localhost:5000` eller `https://localhost:7000`).

## Teknologier

- ASP.NET Core Razor Pages (.NET 10)
- HTML5 / CSS3 (med CSS-variabler)
- Vanilla JavaScript
- Supabase JavaScript-klient via CDN
