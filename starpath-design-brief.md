# STARPATH — Website Design Brief
*Showcase site for the novel. Not a reader. A world.*

---

## Concept Direction: "DEEP SIGNAL"

The guiding metaphor for this entire site is **a transmission received from deep space** — fragmented, beautiful, just slightly beyond full comprehension. The visitor doesn't browse a website. They intercept something.

This justifies every design choice: why things fade in slowly, why text feels like it's being decoded, why the magic system glows like bioluminescence in an abyss. It's not decoration — it's the story's logic made visual.

---

## Core Aesthetic Pillars

### 1. Void-First Design
The background is never just black. It's **layered darkness** — deep navy at 0,0,0 is too flat. The base is `#03020a`, with subtle radial gradients of `#080618` creating depth. Stars are rendered as noise, not clipart. Space feels *volumetric*.

### 2. Bioluminescent Magic Language
Magic in Starpath is energy made visible — it lives in the body, flows through emotion. Translate this to UI: glows are **organic, not geometric**. They pulse softly like something breathing. They don't have hard edges. They bleed.

Primary magic glow: `#4effd6` (cold teal — this is the "output" channel, magic leaving the body)  
Secondary magic glow: `#a78bfa` (violet — this is the "input" channel, magic being absorbed)  
These two colors never appear at full opacity except in key hero moments. They exist as atmosphere.

### 3. Apple-Level Precision on a Cosmic Canvas
Clean type. Generous whitespace. No clutter. But set against something immense. The contrast between extreme minimalism in UI elements and the vast, textured backgrounds IS the aesthetic. Think: one perfectly kerned title floating in an infinite deep.

### 4. Cold Beauty
This is not warm fantasy. B3 is frozen, dark, perpetually night. The color temperature of everything is **cold** — no amber, no gold, no warm whites. Even skin tones in character cards lean cool. The warmth, when it appears (a magic glow, a single accent line), hits harder because everything else is ice.

---

## Color System

```
--void:          #03020a   /* True background */
--deep:          #080618   /* Secondary background, cards */
--surface:       #0d0d1f   /* UI surfaces */
--border:        #ffffff0f /* Hairline borders */
--border-glow:   #4effd615 /* Glowing border variant */

--text-primary:  #e8eaf6   /* Main text — cool white, slight blue */
--text-secondary:#8892b0   /* Secondary — muted blue-grey */
--text-dim:      #4a5278   /* Tertiary, labels */

--teal:          #4effd6   /* Magic output / primary accent */
--teal-dim:      #1a6b5a   /* Teal in shadow */
--violet:        #a78bfa   /* Magic input / secondary accent */
--violet-dim:    #3d2d6b   /* Violet in shadow */
--ice:           #c8d8ff   /* Cold highlight, near-white */

--glow-teal:     0 0 40px #4effd630, 0 0 80px #4effd615
--glow-violet:   0 0 40px #a78bfa30, 0 0 80px #a78bfa15
```

**Rule:** Teal and violet never appear together at high opacity in the same element. They coexist only as distant atmospheric glows — like two moons on opposite horizons.

---

## Typography

### Display / Hero
**Font:** `Syncopate` (Google Fonts) — geometric, spaced, almost brutalist. For the title STARPATH and major section headers.  
- Tracking: `0.25em` to `0.4em`  
- Weight: 700  
- Always uppercase  
- Color: `#e8eaf6` or with a subtle teal text-shadow glow on hero usage

### Body / Narrative
**Font:** `Crimson Pro` (Google Fonts) — editorial serif, humanist. Used for all body text, chapter excerpts, character descriptions.  
- Size: 17px base, 1.8 line-height  
- This creates deliberate tension: cold geometric titles vs. warm literary body. The contrast is intentional — science and soul.

### UI / Labels
**Font:** `DM Mono` (Google Fonts) — for tags, coordinates, technical labels, nav items.  
- Size: 11-12px, 0.15em tracking  
- Used sparingly. Creates the "terminal" / "coordinates" feel for lore elements.

---

## Motion Language

### The Prime Principle
**Everything reveals itself. Nothing pops in.**

Animations should feel like something becoming visible, not something appearing. Think: a star becoming resolvable as your eyes adjust to darkness.

### Entrance Animations
```css
/* Standard reveal — used on all content sections */
@keyframes emerge {
  from { opacity: 0; transform: translateY(16px) scale(0.99); filter: blur(4px); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    filter: blur(0); }
}
/* Duration: 0.8s, ease-out, staggered by 120ms per element */
```

### Hero Title
The title `STARPATH` assembles **letter by letter** — not a typewriter effect (too cliché), but a staggered opacity+blur reveal per character, each 60ms apart. The effect reads as: the signal resolving.

### Magic Glows — Breathing
All glow elements pulse on a slow cycle:
```css
@keyframes breathe {
  0%, 100% { opacity: 0.4; filter: blur(60px); }
  50%       { opacity: 0.7; filter: blur(40px); }
}
/* Duration: 4-6s, ease-in-out, infinite — different durations per element */
```

### Scroll Behavior
- Sections use `IntersectionObserver` to trigger `emerge` on entry — no scroll-jacking
- Parallax only on the hero background layers (subtle, max 20% differential)
- Characters section: horizontal scroll on mobile, side-by-side reveal on desktop

### Hover States
- Links: teal underline draws in from left (width 0 → 100% over 0.25s)
- Cards: `border-color` transitions to `--border-glow`, box-shadow expands softly
- CTA button: background pulses one breathe cycle on hover

---

## Layout Architecture

### Section 01 — HERO

Full viewport height. Three layered backgrounds:
1. **Layer 1 (deepest):** CSS radial gradient — `#03020a` to `#080618`, slight teal bloom off-center bottom-left (where B3's distant aurora would be)
2. **Layer 2:** Procedural star field via `<canvas>` — 400-600 dots, varying opacity 0.2–0.8, subtle twinkle on 15% of them
3. **Layer 3:** Large atmospheric glow orbs — two `div` elements, teal and violet, `filter: blur(120px)`, absolute positioned, breathing animation, placed asymmetrically (never centered)

**Content layout:**
```
                    [nav — minimal, right-aligned: DM Mono]

    [top-left label: DM Mono, dim]
    "SECTOR B3 — NUEVA HUMANIDAD"

    [center, shifted 15% left of true center]
    S T A R P A T H          ← Syncopate, massive, letter-reveal
    ─────────────────────    ← thin line, teal, 80px wide, draws in
    Una historia de energía, memoria y lo que
    se pierde entre las estrellas.      ← Crimson Pro, italic

    [bottom-right, small]
    ↓ SCROLL                 ← DM Mono, animated arrow
```

**What makes this memorable:** The title is NOT centered. It sits in the left-center third of the screen. The right side breathes with atmospheric glow. The asymmetry creates tension — like the universe isn't balanced.

---

### Section 02 — WORLD CONTEXT (brief, visceral)

Not a lore dump. Three columns, each a single crystallized fact about the universe — written like transmission fragments, not encyclopedia entries.

Layout: full-bleed dark section, `--surface` background, three cards side by side.

```
[ COORDENADAS: B-3 ]          [ POST-CRISIS ]           [ NUEVA HUMANIDAD ]
Oscuridad perpetua.           Las estrellas              El núcleo mágico
Un planeta que nadie          prometieron                no se eligió.
eligió y que todos            abundancia.                Se mutó hacia él.
aprendieron a llamar          La Crisis cobró           Lo que fluye por
hogar.                        todo lo demás.             sus venas también
                                                         los consume.
```

Each card has a hairline teal-left border. On hover: the border glows, the text gets marginally brighter. Clean. Minimal. Each one is a hook, not an explanation.

---

### Section 03 — CHARACTERS

The most visually elaborate section. Each character gets a "card" that feels less like a UI card and more like a **profile retrieved from a database that wasn't meant to be accessed**.

**Layout:** Horizontal scroll container on all screens. Cards are `340px wide × 520px tall`, slightly overlapping at rest, separating on scroll.

**Card anatomy:**
```
┌─────────────────────────────┐
│  [atmospheric glow bg]      │  ← Unique color per character
│                             │     Estelle: teal
│                             │     Nadia:  violet
│  [character name]           │  ← Syncopate, large
│  [role tag: DM Mono]        │  ← e.g. "γ-1 · I/55 O/34"
│  ─────────────────          │
│  [2-line description]       │  ← Crimson Pro, italic
│                             │
│  [TRAIT] ──────────── ████  │  ← visual bars, teal
│  [FLAW]  ──────────── ███░  │  ← visual bars, violet
│                             │
└─────────────────────────────┘
```

On hover: card lifts (`translateY(-8px)`), the atmospheric glow intensifies, a faint scan-line effect runs top to bottom once (CSS animation, subtle).

---

### Section 04 — CHAPTERS ACCESS

Minimal. This is not the focus — but it needs to exist and be elegant.

A vertical list of chapters. Each row:
```
[Chapter number: DM Mono, dim]  [Chapter title: Crimson Pro]  [→ teal arrow]
```
Thin hairline separators between rows. On hover: the entire row background becomes `#ffffff04`, the arrow slides 4px right. Clean, like an index.

At the top of the section: a small paragraph in Crimson Pro italic — one sentence from the novel that makes someone want to start reading. A real hook line, not a synopsis.

---

### Navigation

Sticky, top-right aligned. Extremely minimal:
```
STARPATH    ·    MUNDO    ·    PERSONAJES    ·    LEER
```
DM Mono, 11px, 0.2em tracking. On scroll past hero: nav background becomes `#03020acc` with `backdrop-filter: blur(20px)`. The title "STARPATH" left-anchored, nav items right-anchored.

No hamburger menu on mobile — nav collapses to just the title + a single "≡" that reveals a full-screen overlay.

---

## What Makes This Unforgettable

One thing someone will remember: **the breathing glows**.

Not the typography, not the layout — though those are excellent. The memory will be two soft orbs of teal and violet light, slowly pulsing in the background of the hero, like something alive in the dark. It's the magic system made ambient. It's B3's aurora rendered in UI. It's the only "warm" thing on an ice-cold site, and it pulls you in before you read a single word.

Every other design decision serves that moment.

---

## Tech Stack Recommendation for Claude Code

- **Framework:** SvelteKit (you already use it) or plain HTML/CSS/JS if speed matters
- **Fonts:** Google Fonts (Syncopate, Crimson Pro, DM Mono) — loaded via `@import`
- **Canvas:** Vanilla JS for star field — no library needed, ~60 lines
- **Animations:** CSS keyframes for everything except the character card scan-line (JS-triggered once on hover)
- **Scroll reveals:** Native `IntersectionObserver` — no GSAP needed, keep it light
- **No UI frameworks** (no Tailwind, no component libraries) — this site is too custom for utility classes to help

---

## Files to Give Claude Code as Context

From your Obsidian vault, include:
- Character entries for Estelle and Nadia (stats, descriptions)
- B3 world description
- The magic system overview (core levels, channels A/B)
- Cap 0, Sección 1 (rewritten version) — for the pull quote in chapters section

---

## What This Site Is NOT

- Not a dark fantasy grimoire aesthetic (no parchment, no candles, no serif-heavy Gothic)
- Not a generic sci-fi HUD (no fake interfaces, no scan lines everywhere, no neon green)
- Not purple-gradient-on-white (the cardinal sin of AI-generated design)
- Not content-heavy on load — the world reveals itself as you scroll

---

*Brief version: It's what the universe of Starpath looks like if you could see it from outside — vast, cold, bioluminescent, and quietly alive.*
