---
name: Momo's Barbershop
description: The shop's counter poster. Black and white logo, barber brass, barber-pole red and navy, double rules and rubber stamps.
colors:
  ink: "#0f0f11"
  ink-2: "#19191c"
  brass: "#d8b67e"
  brass-hi: "#e7cc9c"
  cape: "#f2efe9"
  red: "#b3262c"
  red-deep: "#8c1c21"
  red-hi: "#e5565b"
  navy: "#172243"
  navy-2: "#22305a"
  skin: "#c39170"
  hair: "#1c1917"
typography:
  display:
    fontFamily: "Ultra, Rockwell Extra Bold, Rockwell, Georgia, serif"
    fontSize: "clamp(2.6rem, 5.8vw, 5.4rem)"
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: "0.004em"
  panel-title:
    fontFamily: "Ultra, Georgia, serif"
    fontSize: "clamp(2rem, 2.7vw, 2.7rem)"
    fontWeight: 400
    lineHeight: 1
  logotype:
    fontFamily: "Rye, Ultra, Georgia, serif"
    fontSize: "1.4rem"
    fontWeight: 400
    lineHeight: 1
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.12em"
  number:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.3rem, 3.3vw, 3.3rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.02em"
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  none: "0px"
  xs: "2px"
  full: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "18px"
  lg: "28px"
  xl: "56px"
  section: "clamp(76px, 10vw, 140px)"
  gutter: "clamp(16px, 4vw, 48px)"
components:
  button-primary:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "0 1.3em"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.brass-hi}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.brass}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    height: "50px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.cape}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    height: "50px"
  panel:
    backgroundColor: "rgba(13, 13, 15, 0.86)"
    textColor: "{colors.cape}"
    padding: "clamp(22px, 2.3vw, 36px)"
  menu-card:
    backgroundColor: "{colors.cape}"
    textColor: "{colors.ink}"
    padding: "clamp(24px, 4vw, 56px)"
  stamp:
    textColor: "{colors.red}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
---

# Design System: Momo's Barbershop

## Overview

The page is the shop's own counter poster, pinned by the owner's reference (the Nonna Lucia bill from the Impeccable gallery) and translated into Momo's material: their round black and white logo (the bearded man in sunglasses, Cuts & Shaves) with brass as the barber-shop accent, the red, white and navy of the barber pole at the door, the white of the striped capes, the black marble floor. Every section is a printed field of one colour, framed by double rules, labelled in condensed capitals and marked with rubber stamps. The first viewport is a working bill: hours with a live open or closed status, the real round logo over a looping clipper video, and a booking column with the phone number and WhatsApp.

It is loud on purpose, but it stays a local shop's notice, not a startup landing: no gradients on type, no glass, no glow, no rounded pills. Photography of the real shop and real cuts carries the middle of the page.

## Colors

Full palette, one field per section: ink for the hero and gallery, brass for the ticket strip and the brothers' section, navy for services, cape white for reviews and the menu card, red for the closing bill.

### Primary
- **Barber Brass** `brass` #d8b67e: the accent, like brass chair fittings. Primary buttons, double rules, panel titles, numbers on dark, the live-status dot. Hover lifts to `brass-hi`.
- **Marble Black** `ink` #0f0f11: page ground, hero panels, gallery, footer, and the text colour on brass and cape.

### Secondary
- **Pole Red** `red` #b3262c: closing field, menu category heads, stamps and quote rules on cape. `red-deep` for text on brass, `red-hi` for stamps on black.
- **Pole Navy** `navy` #172243: services field, menu item names, the fade guide's controls.

### Neutral
- **Cape White** `cape` #f2efe9: text on dark fields and the paper of the menu card and review field. A cool grey-white, never warm cream.

### Named Rules
- **One field per section.** A section owns a single ground colour; accents come from the other four, never from a sixth colour.
- **Gold is never text on white.** Brass on cape fails contrast; on light grounds use red or navy.

## Typography

Ultra (slab) for every heading, as painted sign lettering. Rye appears only in the logotype lockups (nav word, seal centre) to echo the western letters of the logo. Barlow Condensed in capitals is the voice of labels, hours, numbers and buttons; Barlow carries reading text. All four are self-hosted woff2 in `assets/fonts/`.

### Hierarchy
- Display (`h-display`): clamp(2.6rem, 5.8vw, 5.4rem), line-height .96, balanced wrap. Section heads are sized per section so they sit in two or three lines.
- Panel title: Ultra 2 to 2.7rem, brass, over a 6px double rule.
- Numbers (phones, hours): Barlow Condensed 800 with tabular figures.
- Labels: Barlow Condensed 700 to 800, uppercase, tracking .1 to .16em.
- Body: Barlow 400, 1.0625rem, line-height 1.55, measure capped near 55 to 62ch.

### Named Rules
- **No kickers.** Headings stand alone; condensed labels only name fields inside panels (Dónde, Para tu cita).

## Layout

Content max width 1280px plus a fluid gutter (16 to 48px). Section padding clamp(76px, 10vw, 140px). The hero bill is a three-column grid (1fr, 1.3fr, 1fr) above 1100px, two tiers between 760 and 1099px (emblem on top, hours and booking side by side), and a single stack on phones (emblem over video, booking, hours) with a fixed call and WhatsApp dock after the hero. The gallery is a three-column grid with the middle column dropped 80px; two columns with alternate drop on phones.

## Elevation & Depth

Flat printed fields. Depth only where a real object sits on the page: the logo and the seal carry soft drop shadows, the menu card a long soft shadow. No coloured glows, no hard offset shadows.

### Shadow Vocabulary
- Logo: `drop-shadow(0 22px 40px rgba(0,0,0,.55))`.
- Menu card: `0 34px 70px -30px rgba(0,0,0,.6)`.
- Seal: `drop-shadow(0 14px 24px rgba(15,15,17,.35))`.

## Shapes

Square corners throughout (2px on buttons at most). Circles are reserved for real round objects: the logo, the seal, the rating stamp, the live dot and the video pause control. Frames are 6px double rules; menu headings use 5px double rules; separators inside lists are 1px dashed.

## Components

### Buttons
Primary brass with ink text; ink with brass text on brass fields; outline in cape on dark and red fields. Condensed caps, 50px tall, icon leading. Press scales to .97 in 160ms.

### Cards / Containers
The only card is the menu card: cape paper inside a gold double rule on the navy field. Everything else groups with space and rules.

### Navigation
Fixed 64px ink bar with a gold hairline, logo plus Rye word mark, condensed caps links with a gold underline that draws from the left, and the brass WhatsApp button. Below 1100px: call button and a drop-down sheet.

### Signature components
- **The bill (hero).** Double-rule frame that draws open from the centre on load; ink panels either side of the video window; today's row highlighted in gold with a "Hoy" tag; Sunday stamped Cerrado.
- **Ticket strip.** Gold strip with punched edges, live status, a dashed "corta por aquí" line that scissors cut as the page scrolls.
- **Barber-pole seam.** 16px diagonal red, white and navy band that crawls slowly; used twice as a section seam.
- **Fade guide.** Bajo, medio, alto radio control moving the fade band and a red bracket up a swatch of skin and clipper-textured hair (registered custom properties animate the mask).
- **Rating stamp.** Double-ringed red rubber stamp, rotated -8deg, that lands when it enters.
- **Scissors cursor.** Mouse-only 38px brass scissors with an ink outline; the blade tips are the hotspot and track the pointer with no lag; blades open over links and buttons, snap shut on press and drop two tiny hair clippings; a spring tilt follows horizontal speed. Hidden on touch, over the map iframe and outside the window.
- **Logo.** `assets/img/logo-momos.webp` is a rebuild of the storefront logo (no digital original was available): head artwork taken from the door vinyl, ring, arc lettering and scissors redrawn. Replace with the original file if the owner has it.

## Do's and Don'ts

### Do:
- Use real photos of the shop and real cuts; keep the logo as supplied.
- Keep practical facts (open now, phone, WhatsApp, directions) reachable from the first screen on a phone.
- Write hours as "9:30 - 21:00" with a plain hyphen.

### Don't:
- Invent prices, dates, services or quotes. Prices stay out until the owner supplies them.
- Add a warm cream ground, gradient text, glass cards or pill buttons.
- Put gold text on the cape or brass grounds.
