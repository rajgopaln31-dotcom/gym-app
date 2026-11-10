# IronYard Gym Manager (Next.js + MUI)

The original single-file `IronYard_Gym_Manager.html` rebuilt as a Next.js (App Router, TypeScript) project using Material UI components.
Look, data and behaviour are the same as the original.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure

```
src/
  app/
    layout.tsx          fonts, viewport, providers
    page.tsx            renders the app
    globals.css         theme variables (light/dark), base rules, dot/mark/flash keyframes
  theme.ts              MUI theme
  lib/
    data.ts             types, seed data, helpers (dates, ₹ formatting, status)
    ui.ts               shared MUI sx styles (buttons, panels, rows, tables, fields)
  components/
    Providers.tsx       Emotion cache + MUI ThemeProvider
    GymAppLoader.tsx    client-only loader (the app uses live clock / dates)
    GymApp.tsx          state, live activity simulation, handlers, layout
    Sidebar.tsx         nav + theme switch
    SearchBar.tsx       global search, results dropdown, live pill
    MemberDialog.tsx    add / edit member dialog
    Highlight.tsx       search match highlighting
    Tag.tsx             status tags
    PageHeader.tsx
    views/              Dashboard, MembersView, ClassesView, PaymentsView
```
