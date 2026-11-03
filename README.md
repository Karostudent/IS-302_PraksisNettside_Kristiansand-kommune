# IS-302 – Praksisnettside for Kristiansand kommune

Dette prosjektet er en praksisnettside for studentgruppen i emnet IS-302 ved
Universitetet i Agder (UiA). Karoline Aas-Mehren og Jabir Gutale gjennomfører
praksis i Kristiansand kommune, Samfunnsmedisinsk enhet.

Nettsiden dokumenterer praksisperioden og prosjektarbeidet deres. Hovedtemaet
er **ALISflyt**, en prototype for å effektivisere og digitalisere behandlingen
av søknader om ALIS-tilskudd (tilskudd for allmennleger i spesialisering).

## Om prosjektet

Dagens prosess for ALIS-tilskudd er i stor grad manuell og innebærer blant
annet skjemaer, regneark, dokumenthåndtering og oppfølging på tvers av flere
roller. I praksisprosjektet kartlegger studentene dagens arbeidsprosess
(«As-Is») og utvikler en mulig fremtidig arbeidsflyt («To-Be»).

ALISflyt er avgrenset til en prototype som demonstrerer sentrale deler av
søknads- og behandlingsprosessen:

- opprette, lagre, redigere og sende inn ALIS-søknader
- vise søknadsstatus og detaljer
- beregne tilskudd basert på avklarte satser og grunnlag
- gi egne oversikter og arbeidsflater for ALIS-lege, veileder og koordinator
- gjøre det mulig å returnere søknader som mangler opplysninger
- samle relevant dokumentasjon og redusere manuelt dobbeltarbeid

Prototypen er ikke et ferdig produksjonssystem. Målet er å undersøke behov,
visualisere en forbedret arbeidsprosess og demonstrere muligheter for videre
utvikling i samarbeid med oppdragsgiver.

## Nettsidens innhold

| Side | Rute | Innhold |
| --- | --- | --- |
| Hjem | `/` | Presentasjon av studentteamet, praksisoppdraget og hurtigkoblinger |
| Prosjektet | `/prosjekt` | Bakgrunn, mål, metode, tidslinje og visuelt materiale fra ALISflyt |
| Gruppen | `/gruppen` | Profiler og arbeidsområder for Karoline og Jabir |
| Statusrapport 1 | `/statusrapporter` | Første statusrapport med tidlig prototype og prosessarbeid |
| Statusrapport 2 | `/statusrapporter2` | Videreutviklet prototype, tilskuddsberegning, rollebaserte visninger og video |
| Dagbok | `/dagbok` | Praksisdagbok med refleksjoner og innlegg fra praksisperioden |

## Teknologier

- ASP.NET Core Razor Pages på .NET 10
- HTML5 og CSS3
- Vanilla JavaScript
- Supabase JavaScript-klient via CDN
- Supabase Auth og PostgreSQL-tabellen `diary_entries` for dagboken
- GitHub for versjonskontroll og automatisk deploy
- Azure Web App for publisering via GitHub Actions

Applikasjonen består hovedsakelig av Razor Pages og statiske filer. ASP.NET
Core håndterer sidene og statiske ressurser, mens dagbokfunksjonaliteten
kommuniserer direkte med Supabase fra nettleseren.

## Prosjektstruktur

```text
/
├── Pages/
│   ├── Dagbok.cshtml
│   ├── Error.cshtml
│   ├── Gruppen.cshtml
│   ├── Index.cshtml
│   ├── Prosjekt.cshtml
│   ├── Statusrapporter.cshtml
│   └── Statusrapporter2.cshtml
├── supabase/
│   └── diary-auth-policies.sql
├── wwwroot/
│   ├── css/style.css
│   ├── images/
│   ├── js/main.js
│   ├── js/supabase-config.js
│   └── videos/statusrapport-2.mp4
├── .github/workflows/
│   └── main_praksis-i-kristiansand-kommune.yml
├── Program.cs
├── PraksisNettside.csproj
└── README.md
```

## Lokal kjøring

Forutsetter installert .NET 10 SDK.

Start applikasjonen med:

```bash
dotnet run
```

For Hot Reload under utvikling:

```bash
dotnet watch
```

Åpne deretter adressen som vises i terminalen, for eksempel
`https://localhost:7000` eller `http://localhost:5000`.

## Dagbok og Supabase

Alle besøkende kan lese dagbokinnlegg. Oppretting, redigering og sletting
krever innlogging med den delte dagbokkontoen
`dagbok@praksisnettside.no`. Den innloggede brukeren kan også endre
gruppepassordet fra Dagbok-siden.

For å sette opp dagboken:

1. Opprett Supabase-tabellen `diary_entries` med feltene som brukes av
   `wwwroot/js/main.js`: `id`, `entry_date`, `emoji`, `title`, `body`,
   `created_at` og `updated_at`.
2. Opprett brukeren `dagbok@praksisnettside.no` under **Authentication →
   Users** i Supabase.
3. Kontroller at prosjektets URL og publishable key er satt i
   `wwwroot/js/supabase-config.js`.
4. Kjør `supabase/diary-auth-policies.sql` i Supabase SQL Editor. Skriptet
   aktiverer Row Level Security, åpner for lesing og begrenser skriving til
   dagbokkontoen.
5. Test innlogging, oppretting, redigering og sletting fra `/dagbok`.

Ikke legg hemmelige servernøkler eller service role keys i
`supabase-config.js`. Nøkler som brukes i nettleseren må være publishable
eller anon-nøkler, og tilgangen skal sikres med Supabase RLS-policyene.

## Deploy

Ved push til `main` bygger GitHub Actions prosjektet med .NET 10, publiserer
appen og distribuerer den til Azure Web App-en
`Praksis-i-Kristiansand-kommune`. Workflowen ligger i
`.github/workflows/main_praksis-i-kristiansand-kommune.yml` og kan også
startes manuelt med `workflow_dispatch`.
