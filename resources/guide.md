0 ▸ Mission recap

“Fork ryos (Mac-desktop aesthetic) into luPS-One—a PlayStation-1–inspired personal site for Luca that feels like a 1995 CRT boot-screen yet still runs on the same React 18 + Tailwind + Framer + Next 13 stack.”

⸻

1 ▸ Repository hygiene & baseline
	1.	Rename project
	•	Package name: lups-one Title tag: “luPS-One // Luca Collins”
	2.	Purge legacy Mac-OS assets
	•	Remove dock icons, window chrome SVGs, Mac glass blur images, redundant CSS variables.
	3.	Meta
	•	Update README with new brand description (see §10).

⸻

2 ▸ Global theming spec

Trait	Value
Primary font (UI headings)	Industry Inc (Eurostile clone) – all-caps, weight 700, letter-spacing 0.04em
Body font	Inter – weight 400/500
Pixel treatment	font-smooth: never; image-rendering: pixelated on headings & icons only
Core palette	Grey plastic #c0c0c0; CRT glass #1c1c1c; PS-logo rainbow accents #e4002b (red), #ff9400 (amber), #0098de (cyan), #0cba3e (green)
Background	Solid #000 overlaid by: (a) repeating-linear-gradient scanlines (1 px dark/1 px transparent) at 50% opacity; (b) radial-gradient vignette edge darkening 20%.
CRT noise layer	Full-screen PNG noise (8% opacity, blend-mode overlay).
Shadow/Glow	Dithered outer glow on focus/hover: 4 px spread, rainbow shifts keyed to accent colors.
Motion timing	Fibonacci cadence—100 ms, 160 ms, 260 ms; ease-in-out cubic.
Sound FX	beep.ogg, confirm.ogg, cancel.ogg, boot_chime.ogg (8-bit BMW S55 exhaust).

Agent action: Replace or append to tailwind.config.js, globals.css, and /public/sfx.

⸻

3 ▸ Boot-up sequence
	1.	Component: <BootScreen> (first-visit only)
	•	Timeline:
	•	0 ms Logo text “LUCA” (Eurostile, grey) on black.
	•	800 ms Rainbow PS swoosh fades in beneath.
	•	1200 ms Boot chime plays, screen flashes white for 80 ms.
	•	2500 ms Fade to HomeScreen.
	•	Store localStorage.lupsOneBootSeen = true.
	2.	Skip on subsequent visits; users can replay via Konami Code Easter egg.

⸻

4 ▸ Layout paradigm

Old (“ryOS”)	New (“PS-Menu”)
Floating Mac windows	Centered PS1 system menu (grid of 2×4 “memory-card” slots)
Dock icons	Bottom glyph strip (▲ ▼ ◀ ▶ icons + “X / ◻️” labels)
Window move/close	Key-controlled focus only; slots pop open modally

Navigation rules
	•	Arrow keys or swipe = move focus.
	•	X / Return / tap = open.
	•	◻️ / Esc = close.
	•	SFX plays on every action.

⸻

5 ▸ Component mapping & file checklist

List shows existing ryOS path → new PS1 component.

ryOS path	Replace with	Notes
/components/Desktop.tsx	/components/HomeScreen.tsx	Remove draggable logic; use flex / grid
/components/Window/*	/components/SaveModal/*	Modal with CRT bezel; use Tailwind classes, no JSX portals needed
/components/Dock.tsx	Delete	Navigation handled by key listeners
/apps/*	/slots/*	Each slot folder exports title, date, thumbnail, modal content


⸻

6 ▸ Slot-by-slot content & copy

Use these exact labels, subtitles, and body blurbs.
Thumbnails: 128 × 128 PNG, 4-bit palette, dithered.

Slot	Title line 1	Title line 2 (small caps)	Thumbnail cue	Modal sections
1	Gran Turismo	My Garage	Low-poly F80	a) 360° car turntable; b) Spec sheet (list mods); c) Note: “I tune for grip, not grip-tape.”
2	FIFA ’98	Pitch & Play	Pixel soccer ball	a) Bio bullets: Born 1990, speaks EN/IT; b) Languages bar chart; c) Stadium-chant SFX on open.
3	G-Police	War-Zone Years	Top-down city icon	a) 3 photos over 90s news reel; b) Caption timeline 1992-2005 living near conflict zones; c) Quote: “Sirens make odd lullabies.”
4	Parappa	Cannabis ERP Rap	Mic icon	a) Comic-panel storyboard of first startup (2017-2020); b) Fun fact footnotes (first AI cannabis ERP).
5	Metal Gear	ArkiFi Ops	Radar blip	a) List of shipped features; b) GIF of Excel add-in UI; c) Codec-style textbox with “Mission status: ongoing.”
6	Driver	Zipply Alpha	Tachometer	a) Live OBD dials fed by demo JSON; b) Roadmap bullets (beta in Q3 2025).
7	Demo Disc	Prototype Gallery	CD case	a) Grid of thumbnails linking to public demos; b) Easter egg: random PS1 startup noise on each open.
8	Empty slot	“Insert Card”	Grey card	Disabled; hover wiggle; message: “More saves coming soon.”


⸻

7 ▸ Game-library view (projects)

Secondary screen reachable from Home via right arrow wrap-around.
	•	Layout: row of jewel cases scrolling horizontally (CSS perspective).
	•	On select: jewel case opens → inside leaflet lists project name, stack icons, link to repo/demo.
	•	Initial jewel cases to include:
	1.	CrewAI Prompt Tester – “Experiment with multi-agent prompts.”
	2.	NotesGPT – “Voice-powered note-taking.”
	3.	Prompt Bible – “100+ markdown prompt patterns.”

Copy can be drawn from repo READMEs; keep max 60 chars per blurb.

⸻

8 ▸ Global UI flourish
	1.	CRTOverlay component (top of _app.tsx)
	•	Adds scanlines div + vignette + noise.
	•	Accepts disable prop for reduced-motion pref.
	2.	Konami Easter egg
	•	↑↑↓↓←→←→◻️ X toggles Dreamcast skin for 15 s (invert accent colors to teal/orange).
	3.	Accessibility
	•	All interactive slots role="button" + aria-label="Open Slot 1 – Gran Turismo".
	•	Provide “Skip animation” link (visually hidden, screen-reader only).

⸻

9 ▸ Performance & SEO
	•	Target bundle under 250 kB gzip by lazy-loading 3-D models (dynamic(() => import(...), { ssr:false })).
	•	Add structured data JSON-LD: type Person, name “Luca Andrea Collins”, jobTitle “Senior Director of AI Product & Strategy”, url https://luca.ooo.
	•	Preload fonts .woff2, boot SFX .ogg.

⸻

10 ▸ README / project blurb (agent inserts as plain text)

luPS-One is a PlayStation-1–inspired web desktop that chronicles Luca Collins’ journey from war-torn childhood to AI product leader and motorsport tinkerer. Built with Next 13, Tailwind CSS, Framer-motion, and React-Three-Fiber, it boots like a 1995 console, speaks like a 2025 LLM, and ships via Vercel.

⸻

11 ▸ Delivery checklist (QA before first review)
	1.	Boot-screen plays once per fresh incognito session.
	2.	Arrow keys + X/◻️ fully navigable without mouse.
	3.	Lighthouse scores ≥ 90 / 90 / 100 / 100 (mobile).
	4.	Time to interactive ≤ 2 s on throttled 3G.
	5.	Every slot modal renders responsive down to 320 px width.
	6.	All audio has prefers-reduced-motion mute fallback.
