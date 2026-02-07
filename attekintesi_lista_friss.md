# Nexus AI Editor - Friss Attekintesi Lista

> Keszitette: v0 | Datum: 2025-02-07
> Osszevetes az eredeti `attekintes.txt` dokumentumaval es a tenyleges forrasfajlokkal.

---

## I. MEGOLDOTT PROBLEMAK (attekintes.txt vs valosag)

Az alabbi pontokat az eredeti attekintes.txt kritikusnak jelolte, de a jelenlegi kodban mar MEGOLDOTTAK vagy TEVESEK voltak.

### 1. Vite vs Next.js architektura konfliktus - TEVES MEGALLAPITAS
- **Eredeti allitas:** "package.json Next.js scripteket tartalmaz, nincs vite.config.ts, nincs index.html"
- **Valosag:** A projekt egy **tiszta Vite + Express full-stack alkalmazas**. A `vite.config.ts` letezik es helyesen konfiguralt (React SWC plugin, Express middleware integracio, `@` es `@shared` path aliasok). Az `index.html` letezik es a `client/App.tsx`-et tolti be. A `package.json` scriptjei mind Vite-alapuak (`"dev": "vite"`, `"build": "vite build"`). **Nincs Next.js konfliktus.**

### 2. Hianyzo fuggosegek - MEGOLDVA
- **Eredeti allitas:** `framer-motion`, `jszip`, `@monaco-editor/react`, `react-router-dom`, `@tanstack/react-query` hianyzik
- **Valosag:** Mind az ot fuggoseg megtalalhato a `package.json`-ban:
  - `@monaco-editor/react: ^4.7.0` (dependencies)
  - `jszip: ^3.10.1` (dependencies)
  - `framer-motion: ^12.23.12` (devDependencies)
  - `react-router-dom: ^6.30.1` (devDependencies)
  - `@tanstack/react-query: ^5.84.2` (devDependencies)

### 3. Nem letezo shared tipusok - MEGOLDVA
- **Eredeti allitas:** `@shared/types/editor` es `@shared/api` importok nem leteznek
- **Valosag:** Mindket fajl letezik es teljesen ki van dolgozva:
  - `shared/types/editor.ts` - Teljes tipus definiciok (InspectorState, Project, ProjectFile, stb.)
  - `shared/api.ts` - AI generacios tipusok (AIGenerationRequest, AIGenerationResponse, AIDesignUpdate)
  - A `@shared` path alias konfiguralt mind a `vite.config.ts`-ben, mind a `tsconfig.json`-ban

### 4. Tailwind v3 es v4 konfliktus - TEVES MEGALLAPITAS
- **Eredeti allitas:** "tailwindcss v3 es @tailwindcss/postcss v4 egyarant szerepel"
- **Valosag:** Csak `tailwindcss: ^3.4.17` van a `package.json`-ban. Nincs `@tailwindcss/postcss` v4. A `postcss.config.js` es `tailwind.config.ts` konzisztensen v3-at hasznalja.

### 5. Backend API route-ok hianya - MEGOLDVA
- **Eredeti allitas:** "/api/projects, /api/ai-generate endpointok nem leteznek"
- **Valosag:** Teljes Express backend letezik:
  - `server/index.ts` - Express app osszes route-tal
  - `server/routes/projects.ts` - Teljes CRUD (POST/GET/PATCH/DELETE)
  - `server/routes/files.ts` - Teljes fajl CRUD
  - `server/routes/ai-generate.ts` - AI generacios endpoint OpenAI integracioval
  - `server/lib/projectStore.ts` - In-memory tarolas
  - A Vite dev szerver integralja az Express-t plugin-kent

### 6. Vite-env.d.ts problema - TEVES MEGALLAPITAS
- **Eredeti allitas:** "Vite tipusdefinicio Next.js projektben"
- **Valosag:** A projekt Vite-alapu, igy a `vite-env.d.ts` teljesen helyen van.

### 7. global.css Google Fonts import - RESZBEN MEGOLDVA
- **Eredeti allitas:** "next/font/google hasznalata kellene"
- **Valosag:** Vite projektben az `@import url(...)` elfogadhato megoldas. Ez nem hiba, hanem architekturalis dontes kerdese.

---

## II. FENNMARADO PROBLEMAK (attekintes.txt-bol meg ervenyes)

### P1 - FONTOS

#### 2.1 Toaster duplikacio (`App.tsx`)
- **Fajl:** `client/App.tsx`
- **Problema:** Ket kulonbozo toast rendszer fut egyidejuleg: `<Toaster />` (Radix UI toast) es `<Sonner />` (sonner). Ez felesleges bundelmerethez es osszezavarodott UX-hez vezet.
- **Javaslat:** Valasztani egyet (sonner ajanlott modernebb API-ja miatt), a masikat torolni.

#### 2.2 History rendszer duplikacio
- **Fajlok:** `client/lib/history.ts` + `client/hooks/useInspectorHistory.ts`
- **Problema:** Ket kulon history implementacio letezik. A `lib/history.ts` egy generikus `createHistoryManager`-t ad (nem React hook), mig a `useInspectorHistory.ts` valodi React state-alapu undo/redo-t biztosit. A fo `use-inspector.tsx` sajat egyszerubb history-t hasznal (csak undo, nincs redo).
- **Javaslat:** `useInspectorHistory.ts`-t integralni a `use-inspector.tsx`-be (redo tamogatasssal), `lib/history.ts`-t torolni.

#### 2.3 Billentyuzet gyorsitok triplikacio
- **Fajlok:** `client/hooks/use-keyboard-shortcuts.ts`, `client/hooks/useEnhancedKeyboardShortcuts.ts`, `client/lib/keyboardShortcuts.ts`
- **Problema:** Harom kulon billentyuzet kezelesi rendszer. Az `Index.tsx` a legegyszerubbet (`use-keyboard-shortcuts.ts`) hasznalja. A masik ketto nem hivatkozott.
- **Javaslat:** Egyetlen rendszert tartani, a masik kettot torolni.

#### 2.4 Notification rendszer duplikacio
- **Fajlok:** `client/lib/notifications.ts` (sonner API) + `client/hooks/use-toast.ts` (Radix toast)
- **Problema:** A `notifications.ts` soha nincs importalva a fo alkalmazasban. Csak a `useEnhancedKeyboardShortcuts.ts` hivatkozik ra, ami szinten nem hasznalt.
- **Javaslat:** A Toaster dontessel egyutt konszolidalni. Ha sonner marad, `notifications.ts` hasznalata; ha Radix, torlese.

#### 2.5 useFiles.ts hook szabaly sertes
- **Fajl:** `client/hooks/useFiles.ts` (111. sor)
- **Problema:** `useFileOperations` hookban: `const updateFile = (fileId: string) => useUpdateFile(projectId, fileId)` - ez hookot hiv egy callback belsejeben, ami sertes a React Rules of Hooks szabaly ellen.
- **Javaslat:** Refaktoralni ugy, hogy a `useUpdateFile` a hook legfelso szintjen legyen meghivva.

#### 2.6 use-keyboard-shortcuts.ts instabil dependency
- **Fajl:** `client/hooks/use-keyboard-shortcuts.ts`
- **Problema:** A `shortcuts` objektum a `useEffect` dependency listajaban van, de minden rendernel uj referenciat kap -> felesleges event listener ujraregisztracio.
- **Javaslat:** `useMemo`-val vagy `useRef`-fel stabilizalni a shortcuts objektumot a hivo oldalon (Index.tsx).

### P2 - KOZEP

#### 2.7 StatusBar hardcoded ertekek
- **Fajl:** `client/components/editor/StatusBar.tsx`
- **Problema:** "Ln 508, Col 8", "HTML", "Spaces: 4" mind statikus string. Nem tukrozi az aktiv fajl allapotat.
- **Javaslat:** Props-kent atvenni az aktiv fajl informaciot (nyelv, kurzor pozicio).

#### 2.8 PreviewFrame srcDoc nem memorizalt
- **Fajl:** `client/components/editor/PreviewFrame.tsx`
- **Problema:** `generateSrcDoc()` minden rendernel lefut (string konkatenacio, fajl keresese). Nincs `useMemo`.
- **Javaslat:** `useMemo`-val memorizalni a `files` es `isInspectorActive` fuggvenyeben.

#### 2.9 PropertiesPanel debug log
- **Fajl:** `client/components/editor/PropertiesPanel.tsx` (43. sor)
- **Problema:** `console.log("Active tab:", tab)` maradek debug kod.
- **Javaslat:** Torolni.

#### 2.10 TopNav CSS hiba - duplikalt height class
- **Fajl:** `client/components/editor/TopNav.tsx`
- **Problema:** Tobb helyen `h-3.5 h-3.5` (duplikalt height, hianyzik w-3.5):
  - Monitor ikon (76. sor): `className="h-3.5 h-3.5"` -> `className="h-3.5 w-3.5"`
  - Tablet ikon (84. sor): `className="h-3.5 h-3.5"` -> `className="h-3.5 w-3.5"`
  - Smartphone ikon (92. sor): `className="h-3.5 h-3.5"` -> `className="h-3.5 w-3.5"`
  - MousePointer2 ikon (104. sor): `className="h-4 h-4"` -> `className="h-4 w-4"`
  - RotateCcw ikon (111. sor): `className="h-4 h-4"` -> `className="h-4 w-4"`
  - Download ikon (118. sor): `className="h-4 h-4"` -> `className="h-4 w-4"`
- **Javaslat:** Minden elofordulasbab w-* hozzaadasa.

#### 2.11 NotFound.tsx direkt szinek
- **Fajl:** `client/pages/NotFound.tsx`
- **Problema:** `bg-gray-100`, `text-gray-600`, `text-blue-500`, `text-blue-700` - design tokenek helyett kozvetlen Tailwind szinek.
- **Javaslat:** `bg-background`, `text-muted-foreground`, `text-primary` stb. hasznalata.

#### 2.12 AccordionSections.tsx duplikacio
- **Fajl:** `client/components/editor/panels/AccordionSections.tsx`
- **Problema:** A teljes komponens duplikalt funkciokat tartalmaz az `EditTab.tsx` + sections/* komponensekkel. A PropertiesPanel az EditTab-ot hasznalja, nem az AccordionSections-t.
- **Javaslat:** Torolni a fajlt, ha nem hivatkozott.

#### 2.13 ResourcePanel.tsx sajat SVG Sparkles
- **Fajl:** `client/components/editor/layout/ResourcePanel.tsx`
- **Problema:** Sajat `Sparkles` SVG komponens van definalva (38-55. sor) ahelyett, hogy a mar telepitett `lucide-react` csomag `Sparkles` ikonjat hasznalna.
- **Javaslat:** `import { Sparkles } from "lucide-react"` hasznalata.

#### 2.14 handleElementSelect `any` tipusok
- **Fajl:** `client/pages/Index.tsx` (95. sor)
- **Problema:** `handleElementSelect(data: any)` - tipusbiztos interface kellene.
- **Javaslat:** Definalni egy `InspectorElementData` interface-t a `PreviewFrame` postMessage adatai alapjan.

### P3 - ALACSONY

#### 2.15 PropertiesPanel redo hianyzik UI-bol
- **Fajl:** `client/components/editor/PropertiesPanel.tsx`
- **Problema:** Csak undo gomb letezik, bar a `useInspectorHistory` tamogatja a redo-t is.
- **Javaslat:** Redo gomb hozzaadasa.

#### 2.16 use-project-files.ts localStorage
- **Fajl:** `client/hooks/use-project-files.ts`
- **Problema:** `localStorage`-t hasznal az adatok tarolasara. Ez szandekos offline mukodes, de hosszabb tavon adatbazissal erdemes lenne helyettesiteni.
- **Statusz:** Elfogadhato jelenlegi allapotban (offline szerkeszto).

---

## III. UJ PROBLEMAK (nem szerepeltek az attekintes.txt-ben)

### P0 - KRITIKUS

#### 3.1 `openai` package hianyzik
- **Fajl:** `server/routes/ai-generate.ts` (2. sor)
- **Problema:** `import { OpenAI } from "openai"` - de az `openai` csomag NINCS a `package.json`-ban. A szerver build elszall ezen az importon.
- **Javaslat:** `pnpm add openai` vagy az AI SDK hasznalata helyette.

### P1 - FONTOS

#### 3.2 Nem hasznalt fuggosegek a package.json-ban
- **Fuggosegek:** `@react-three/drei`, `@react-three/fiber`, `three`, `@types/three` - 3D konyvtarak, de sehol nincsenek hasznalva a projektben.
- **Fuggosegek:** `next-themes` - Next.js-specifikus, Vite projektben nem hasznalt.
- **Javaslat:** Torolni a felesleges fuggosegeket a bundle meret csokkentese erdekeben.

#### 3.3 shared/schemas/editor.ts soha nincs hasznalva
- **Fajl:** `shared/schemas/editor.ts`
- **Problema:** Teljes Zod schema rendszer (InspectorStateSchema, ProjectSchema, stb.) letezik, de sehol nincs importalva a projektben - sem a szerveren, sem a kliensen.
- **Javaslat:** Integralni a server route-ok input validaciojaba, vagy torolni ha felesleges.

#### 3.4 @tailwindcss/typography plugin nincs beallitva
- **Fajl:** `tailwind.config.ts`
- **Problema:** `@tailwindcss/typography: ^0.5.16` a devDependencies-ben van, de a `tailwind.config.ts` plugins tombje nem tartalmazza: `plugins: [require("tailwindcss-animate")]` - nincs `require("@tailwindcss/typography")`.
- **Javaslat:** Hozzaadni a plugint a tailwind konfighoz, vagy torolni a fuggoseget.

### P2 - KOZEP

#### 3.5 PreviewFrame biztonsagi kockazat
- **Fajl:** `client/components/editor/PreviewFrame.tsx`
- **Problema:** Az iframe `sandbox="allow-scripts allow-modals allow-same-origin"` - az `allow-same-origin` lehetove teszi, hogy az iframe JS-e hozzaferjen a szulo ablak storage-ahoz. A felhasznaloi JS kod kozvetlenul injektalodik a srcDoc-ba.
- **Javaslat:** `allow-same-origin` eltavolitasa ha lehetseges, vagy CSP meta tag hozzaadasa az iframe tartalmaba.

#### 3.6 CodeEditor onChange undefined kezeles
- **Fajl:** `client/components/editor/CodeEditor.tsx` + `client/hooks/use-project-files.ts`
- **Problema:** A Monaco Editor `onChange` `string | undefined`-t ad. A `CodeEditor` tovabbitja ezt: `onChange(file.id, value)` ahol `value` lehet `undefined`. De a `updateFileContent` tipusa `(id: string, content: string)` - nincs `undefined` kezeles.
- **Javaslat:** Null check hozzaadasa: `onChange(file.id, value ?? "")`.

#### 3.7 Netlify konfig valoszinuleg elavult
- **Fajlok:** `netlify.toml`, `netlify/functions/api.ts`
- **Problema:** Netlify deployment konfig letezik a projektben, de a fo fejlesztesi kornyezet Vite + Express. Ha a deploy cel mar nem Netlify, ezek feleslegesek.
- **Javaslat:** Tisztazni a deploy celt, felesleg eseten torolni.

#### 3.8 dotenv redundancia
- **Fajl:** `package.json` - `dotenv: ^17.2.1`
- **Problema:** A Vite automatikusan kezeli a `.env` fajlokat. A `dotenv` kulon fuggoseg csak a szerver oldalon szukseges (`server/index.ts` -> `import "dotenv/config"`), de a Vite server plugin mar betolti a kornyezeti valtozokat.
- **Javaslat:** Ellenorizni, hogy a production server build (`node dist/server/node-build.mjs`) valoban hasznalja-e; ha igen, megtartani.

---

## IV. OSSZEFOGLALO TABLA

| # | Problema | Prioritas | Statusz | Forras |
|---|---------|-----------|---------|--------|
| 1.1 | Vite/Next.js konfliktus | P0 | MEGOLDVA (teves volt) | attekintes.txt |
| 1.2 | Hianyzo fuggosegek | P0 | MEGOLDVA | attekintes.txt |
| 1.3 | Shared tipusok hianyzik | P0 | MEGOLDVA | attekintes.txt |
| 1.4 | Tailwind v3/v4 konfliktus | P0 | MEGOLDVA (teves volt) | attekintes.txt |
| 1.5 | Backend API route-ok | P1 | MEGOLDVA | attekintes.txt |
| 1.6 | vite-env.d.ts problema | P3 | MEGOLDVA (teves volt) | attekintes.txt |
| 1.7 | Google Fonts import | P3 | ELFOGADHATO (Vite) | attekintes.txt |
| 2.1 | Toaster duplikacio | P1 | FENNALL | attekintes.txt |
| 2.2 | History duplikacio | P1 | FENNALL | attekintes.txt |
| 2.3 | Keyboard shortcuts triplikacio | P1 | FENNALL | attekintes.txt |
| 2.4 | Notification duplikacio | P1 | FENNALL | attekintes.txt |
| 2.5 | useFiles hook szabaly sertes | P1 | FENNALL | attekintes.txt |
| 2.6 | Instabil useEffect dependency | P1 | FENNALL | attekintes.txt |
| 2.7 | StatusBar hardcoded | P2 | FENNALL | attekintes.txt |
| 2.8 | PreviewFrame srcDoc memo | P2 | FENNALL | attekintes.txt |
| 2.9 | Debug log maradek | P2 | FENNALL | attekintes.txt |
| 2.10 | TopNav CSS hiba | P2 | FENNALL | attekintes.txt |
| 2.11 | NotFound direkt szinek | P2 | FENNALL | attekintes.txt |
| 2.12 | AccordionSections duplikacio | P2 | FENNALL | attekintes.txt |
| 2.13 | ResourcePanel SVG duplikacio | P2 | FENNALL | attekintes.txt |
| 2.14 | any tipusok | P2 | FENNALL | attekintes.txt |
| 2.15 | Redo gomb hianyzik | P3 | FENNALL | attekintes.txt |
| 2.16 | localStorage hasznalat | P3 | ELFOGADHATO | attekintes.txt |
| 3.1 | openai package hianyzik | P0 | UJ PROBLEMA | v0 |
| 3.2 | Nem hasznalt fuggosegek | P1 | UJ PROBLEMA | v0 |
| 3.3 | Zod schemas nem hasznalt | P1 | UJ PROBLEMA | v0 |
| 3.4 | Typography plugin hianyzik | P1 | UJ PROBLEMA | v0 |
| 3.5 | PreviewFrame biztonsag | P2 | UJ PROBLEMA | v0 |
| 3.6 | onChange undefined kezeles | P2 | UJ PROBLEMA | v0 |
| 3.7 | Netlify konfig elavult | P2 | UJ PROBLEMA | v0 |
| 3.8 | dotenv redundancia | P3 | UJ PROBLEMA | v0 |

---

## V. AJANLOTT JAVITASI SORREND

1. **P0:** `openai` package hozzaadasa a package.json-hoz (3.1)
2. **P1:** Toast/Notification rendszer konszolidacio (2.1 + 2.4)
3. **P1:** Keyboard shortcuts konszolidacio (2.3)
4. **P1:** History rendszer konszolidacio (2.2)
5. **P1:** useFiles hook szabaly javitas (2.5)
6. **P1:** Felesleges fuggosegek torlese (3.2)
7. **P2:** TopNav CSS javitas (2.10) + Debug log torles (2.9)
8. **P2:** PreviewFrame optimalizacio es biztonsag (2.8 + 3.5)
9. **P2:** Tipusbiztos interface-ek (2.14 + 3.6)
10. **P2:** Holt kod torles (2.12 + 3.3 + 3.7)
