# Library: apparna som böcker på en hylla

**Datum** 2026-10-09 · **Status** utkast för granskning · **Repo** `Samuelsenhet.github.io` (gren `library`)

## Syfte

En ny sida, `/library/`, där Samuels projekt står som böcker på två hyllor: det som är live och det
som byggs. Idén kommer från Carollias virtuella bibliotek (carollia-library.lovable.app). Byggguiden
i `carollia99/virtual-library-guide` saknar licens, så ingen kod kopieras; vi bygger efter idén med
egen kod.

Resten av sajten ska inte göras om. Sidan läggs till, och den befintliga sajten rörs bara där det
krävs för att nå sidan och för att texten om antalet projekt ska stämma (se *Följder*).

**Klart när:** `/library/` visar sex böcker på två hyllor i den valda stilen, i ljust och mörkt
läge, går att använda med mus, tryck och tangentbord, och byggs och publiceras med sajtens vanliga
flöde.

## Beslut från brainstormingen

| Fråga | Svar |
|---|---|
| Vad står på hyllan | MÄÄK, Prata Öppet, Bibelrösten, Crava, Heytid, HAND |
| Var HAND och Heytid läggs in | i `content/projects.ts`, så att de också syns på `/work` |
| Layout | C, "kurerad hylla": omslag, ryggar, liggande böcker, en växt och bokstöd |
| Typografi | sajtens: Familjen Grotesk för rubriker, IBM Plex Mono för etiketter. Ingen serif |
| Bakgrund | varmt papper (Carollias ton); mörkt läge följer sajtens mörka färger |
| Klick på en bok | boken dras ut och öppnas på plats, med länk till `/work/<slug>/` |
| Ingång | ny menypunkt "Library" på `/library/` |
| Teknik | ren CSS-3D i en React-komponent, inga nya beroenden |

**Utanför:** AI-sökning (kräver server; GitHub Pages är statiskt), besökares rekommendationer
(kräver en publik skrivbar databas), oändlig rullning och böjd perspektivrad (sex böcker räcker inte
till det), animerade omslag (Higgsfield är betalt och valdes bort).

## 1. Data och innehåll

- **`content/projects.ts` är enda källan för text.** Hyllan läser namn, status, statusetikett,
  sammanfattning och markör (`1.0.7`) därifrån, precis som `/work`.
- **`content/library.ts` är ny och håller bara utseendet**, nyckat på `slug`:
  - `pose`: `'cover' | 'spine' | 'flat'`
  - `color`, `ink` (textfärg), valfri `band` (accent), `face`: `'sans' | 'mono'`
  - `width`, `height` (px), valfri `tilt` (grader) och `wear` (0-1)
  - dekoren per hylla: växt och bokstöd, i ordning med böckerna
- **Hyllan väljs av status:** `shipped` och `running` → *Live*; `building` → *In progress*. När en
  status ändras i `projects.ts` flyttar boken av sig själv. Antalet ("2 volumes") räknas fram.
- **`shelves()` i `library.ts`** är en ren funktion som bygger de två hyllorna. Den **kastar ett fel
  vid bygget** om ett projekt saknar bok i `library.ts` eller om en bok saknar projekt. Det är det
  misstag som annars sker tyst när ett sjunde projekt läggs till.
- **Färgerna är förslag**, inte apparnas varumärken:

| Bok | Läge | Färg | Text | Hylla |
|---|---|---|---|---|
| MÄÄK | omslag, −2° | `#2f4a3a` skogsgrön | `#efe6d2` | Live |
| Prata Öppet | rygg | `#6e2a26` oxblod | `#f3e7d8` | Live |
| Bibelrösten | rygg, guldband | `#22324a` marin | `#c9a75e` | In progress |
| Crava | rygg | `#b98a3a` ockra | `#2a1f14` | In progress |
| Heytid | liggande | `#8fa3b8` duvblå | `#1d2733` | In progress |
| HAND | liggande, under Heytid | `#3a3a3c` grafit | `#e8e2d6` | In progress |

Omslagets layout (MÄÄK): "Samuel Pierre" i mono överst, en tunn linje, namnet i Familjen Grotesk,
statusraden i mono längst ned (`● Live · 1.0.7`).

### Nya poster i `projects.ts` (UTKAST, Samuel godkänner texten innan publicering)

Skrivna i samma ton som de befintliga posterna: rakt, utan säljspråk, bara det som går att belägga.
Källor: `laget/projects/hand.md`, `laget/projects/social-booking.md`, och besluten i respektive
repos `docs/DECISIONS.md`. Varje fakta kontrolleras mot repot innan publicering.

**Heytid** (`slug: 'heytid'`, `status: 'building'`, `marker: ''`, `repo: null`, `link: null`)
- `summary`: "A booking app: you publish times in an iOS app, and the people you invite book them on
  the web."
- `statusLabel`: "In development"
- `stack`: TypeScript, Expo, React, Supabase, PostgreSQL
- `body` (förslag):
  1. "Heytid is for people who meet others, one to one or in a group, and want them to book a time.
     You set up your times in the app on your phone, and you send people a personal link."
  2. "The people you invite never need an account or an app. They open the link, confirm with a
     code sent to their phone, and book. You see who is coming."
  3. "One active meetup at a time is free. More than that is a subscription, bought in the app
     through the App Store. It is Swedish, and it is sold in Sweden only."
- `facts` (förslag): What it is: Booking with a personal link · Platform: iOS for the host, the web
  for guests · Guests sign in with: Phone number, SMS one-time code · Backend: Supabase in Ireland ·
  Language: Swedish · Status: In development

**HAND** (`slug: 'hand'`, `status: 'building'`, `marker: ''`, `repo: null`, `link: null`)
- `summary`: "A personal agent for real paperwork: hand it a letter, an invoice or a contract and
  say 'take care of this'."
- `statusLabel`: "In development"
- `stack`: TypeScript, Expo, React, Supabase, PostgreSQL
- `body` (förslag):
  1. "HAND is for the administration that piles up: the letter you have not opened, the invoice you
     need to question, the contract you are not sure about. You give it the document and say: take
     care of this."
  2. "It reads the document, works out what needs to happen, and prepares it. Nothing leaves the
     app without your approval: you see exactly what it will send, and it acts only on what you
     approved."
  3. "Insurance is the first area it handles. It is an iPhone app, written in Swedish."
- `facts` (förslag): What it is: An agent for paperwork, with your approval at every step ·
  Platform: iOS, built with Expo · Backend: Supabase: Postgres, Edge Functions · First area:
  Insurance · Language: Swedish · Status: In development

## 2. Sidan och komponenterna

| Fil | Ny/ändrad | Gör |
|---|---|---|
| `content/library.ts` | ny | utseende per bok, dekor, `shelves()` |
| `app/library/page.tsx` | ny | serverkomponent: `metadata` (title "Library", description), hämtar hyllorna, renderar `<Library>`. Kanonisk adress ärvs (`'./'`) |
| `components/library/Library.tsx` | ny | klientkomponent, sidans enda tillstånd: vilken bok som är öppen. Rubrik, två hyllor, detaljvyn, `#slug` i adressen |
| `components/library/Book.tsx` | ny | en bok i tre lägen. En stillastående `<button>` tar emot pekare och fokus; bara ett inre element rör sig |
| `components/library/BookDetail.tsx` | ny | modal `<dialog>`: omslaget i stort, sammanfattning, status, fakta, föregående/nästa, "More about X" → `/work/<slug>/` |
| `components/library/Decor.tsx` | ny | växt och bokstöd i ren CSS, `aria-hidden` |
| `app/globals.css` | ändrad | ett avgränsat `.library`-block: varmt papper, `.dark .library`, kornighet, bokstrukturer, keyframes |
| `components/Nav.tsx` | ändrad | `{ href: '/library/', label: 'Library' }` efter Work |
| `app/page.tsx` | ändrad | "My library" i startsidans länklista (startsidan har ingen meny) |
| `app/sitemap.ts` | ändrad | `'/library'` |
| `content/projects.ts` | ändrad | posterna för Heytid och HAND |
| `app/work/page.tsx` | ändrad | rätta "Four things…" och beskrivningen "Three products…" till sex projekt |

**Layout:** menyn och sidfoten som på resten av sajten; mellan dem fyller det varma papperet hela
bredden. Sidhuvud: mono-etikett "A personal archive", rubrik "Things I've made" (Familjen Grotesk,
`--text-display`), mono "6 volumes". Varje hylla: mono-etikett ("On the shelf" / "On the workbench"),
rubrik ("Live" / "In progress"), statusprick (jade / mässing) och antal.

**Varmt papper (ljust):** bakgrund som radiell övergång `#f3efe8 → #ece7df → #e3ddd3`, text `#2b2622`,
dämpad text mäts mot 4,5:1 (se *Verifiering*), hyllkant `#f4f0e9 → #ddd6ca → #cfc7b9`, kornighet
som SVG-brus med `opacity .35`, `mix-blend-mode: multiply`.

## 3. Interaktion och rörelse

Sajtens princip är ett enda koreograferat ögonblick. Här är det när boken dras ut.

| Händelse | Rörelse | Tid / kurva |
|---|---|---|
| Laddning | böckerna sätter sig en gång: 6 px uppåt + fade, förskjutet | sajtens `settle` |
| Hovring (fin pekare) / fokus | rygg: ut mot besökaren och 12 px upp; omslag: rätar upp sig; liggande: 10 px åt sidan | 350 ms, `cubic-bezier(.16,1,.3,1)` |
| Hovra kvar | kort med namn, status, en rad sammanfattning | efter 150 ms; 90 ms grace när pekaren lämnar |
| Tryck (mobil) | öppnar direkt, inget dubbeltryck | - |
| Öppna | mät bokens rektangel; boken glider till mitten, ryggen vrids så omslaget vänds fram (liggande reser sig, omslag förstoras) | 650 ms, `cubic-bezier(.16,1,.3,1)` |
| | papperet tonas och suddas | 400 ms |
| | texten tonas in efter landning | fördröjning 200 ms |
| Stänga | boken tillbaka till sin plats | 400 ms |
| ← / → i boken | byt bok med övertoning, ingen ny flygtur | 200 ms |
| Esc | stäng; fokus tillbaka till boken på hyllan | - |

Öppen bok speglas i adressen (`/library/#maak`); en sådan länk öppnar boken vid laddning.

**Reducerad rörelse:** ingen flygtur och ingen animation. Hovring lyfter boken som vanligt, men
omedelbart (se ändringen nedan); öppna/stänga = omedelbart byte; laddningsanimationen av.

## 4. Mobil, tillgänglighet, mörkt läge

- **Mobil:** båda hyllorna ryms på 390 px utan sidledsskroll; böckerna skalas till ca 85 % under
  420 px. Detaljvyn: omslaget överst (ca 40 % av höjden), texten under med egen skroll. Knappar
  minst 44 × 44 px. De liggande böckernas klickyta förstoras osynligt till minst 44 px höjd.
- **Tillgänglighet:** varje hylla är en `<section>` med rubrik och en lista. Varje bok är en knapp
  med riktigt namn, t.ex. "MÄÄK, live on the App Store"; ryggtexten är `aria-hidden`. Detaljvyn är
  `<dialog>` med rubrik, fokusfälla och Esc. Ingen information finns bara vid hovring. Sajtens
  fokusram (`:focus-visible`) gäller.
- **Mörkt läge:** följer sajtens växling (systeminställningen eller besökarens val). Papperet blir
  sajtens mörka bakgrund (`#152030 → #0f1620 → #0b1119`), hyllkanten mörknar, kornigheten tonas ned
  (`opacity .18`, `screen`). Böckerna behåller sina färger.

## Följder i den befintliga sajten

- `/work` säger i dag "Four things. One is in the App Store, one has been meeting for three years,
  and two are still being built." och beskrivningen "Three products: one in the App Store, two in
  development." Med sex projekt stämmer det inte. Förslag:
  - intro: "Six things. One is in the App Store, one has been meeting for three years, and four are
    still being built. None of the code is open source yet, and none of it claims to be."
  - description: "Six things: one app in the App Store, a circle that has met for three years, and
    four apps in development."
- Startsidans lista (`Ledger`) och dess brödtext läser från `projects.ts`; HAND och Heytid syns där
  automatiskt. Brödtexten på startsidan ("Right now that means an app about knowing yourself, a voice
  that cannot misquote scripture, and a marketplace that runs backwards") nämner inte de nya och
  lämnas som den är, om Samuel inte vill annat.

## 5. Verifiering

**Automatiskt:**
1. `npm run typecheck`, `npm run lint`, `npm run build` går igenom. `shelves()` stoppar bygget om en
   bok och ett projekt inte matchar.
2. Ett litet skript mäter kontrast för etiketter och ryggtext mot varmt och mörkt papper och skriver
   ut par under 4,5:1.
3. I `out/`: `/library/index.html` finns och `sitemap.xml` innehåller `/library/`.

**Med ögon** (Samuel i Arc mot `npm start`, efter checklista): ljust och mörkt läge i 1440, 768 och
390 px; Tab, Enter, ← →, Esc och att fokus återvänder; reducerad rörelse i macOS; `/library/#maak`;
`/work` och startsidan visar sex projekt med rättad text.

**Leverans:** gren `library` → PR till `main` med beskrivning enligt T-005 (vad, varför, antaganden,
felsätt, testat och inte testat). GitHub Pages publicerar vid merge. Därefter uppdateras
`laget/projects/samuel-dev.md`.

## Risker

- **Texten om HAND och Heytid** kan säga mer än produkterna gör i dag. Varje mening kontrolleras mot
  repot innan merge, och Samuel godkänner den.
- **3D-transformer i Safari** kan flimra med `preserve-3d` och `backdrop-filter` samtidigt. Kontrolleras
  i Safari på iPhone; reserv är att skippa suddningen bakom detaljvyn.
- **Varmt papper i en sval sajt** kan se ut som ett fel vid övergången mot menyn. Mockupen visade det
  som avsiktligt; kontrolleras på riktigt i 1440 px.

## Ändring 2026-10-09: hyllan på startsidan, i sidans egen färg

Beslutat av Samuel efter att ha sett sidan och två mockups.

- **Hyllan ersätter listan på startsidan.** `/library/`, menypunkten "Library", länken "My
  library" och raden i sitemap är borttagna, så hyllan finns på ett ställe. `/work` behåller listan.
- **Samma färg som sidan.** Det varma papperet och kornigheten är borttagna. Hyllan lånar sajtens
  färger via `var()` (`--color-ground`, `--color-text`, `--color-dim`, `--color-raised`,
  `--color-line`); bara hyllkanten och skuggorna är dess egna. Ljust och mörkt följer temaväxlaren.
- **Stycket "I am a builder in Sweden…"** står nu direkt under rubriken, med oförändrad text.
- **Sidhuvudet** ("A personal archive", "Things I've made", "6 volumes") är borttaget; rubriken
  ovanför gör det jobbet. Varje hylla behåller sin etikett, rubrik och sitt antal.
- **Djuplänkar** är `/#maak` i stället för `/library/#maak`.

## Ändring 2026-10-09: lyftet vid hovring finns även med reducerad rörelse

Med Reducera rörelse påslaget stod böckerna stilla vid hovring, så hyllan såg död ut. Reducera
rörelse gäller animationer som glider, zoomar och flyger; ett omedelbart lyft är ingen sådan.
Sajtens globala regel gör redan alla övergångar omedelbara för de besökarna, så regeln som låste
bokens läge är borttagen. Flygturen när en bok öppnas är fortfarande avstängd för dem.
`npm run check` hindrar att låsningen kommer tillbaka.
