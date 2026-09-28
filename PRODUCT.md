# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/vanilla JS, no build step, ready to upload to Hostinger or any static host. This follows the user's standing preference for their client sites (Adrian Sáenz static-site skill: IIFE scripts, `?v=` cache-busting, `.htaccess`).

## Users

Men and boys in Lloret de Mar (Costa Brava) who need a haircut, a fade or a beard done, and the parents who bring their kids. Two groups, confirmed by the Google reviews: locals and families who come back regularly, and tourists passing through on holiday who search "barbería Lloret" on their phone and decide in seconds. Reviews arrive in Spanish, English and French, so the audience is partly international.

## Product Purpose

The website of MOMO'S BARBERSHOP, a men's barbershop. It must let a visitor see quickly that the shop is good, whether it is open right now, where it is, and how to get a slot: call, WhatsApp or walk over. Success is a phone call, a WhatsApp message or a directions tap.

## Positioning

Run by two brothers, Moha and Wassim. 5.0 on Google with 120 reviews (118 five-star, 2 four-star). Reviews single out: listening before cutting, attention to detail, a very clean and newly designed shop, and unusually good treatment of children. Instagram bio: "Donde el estilo se trabaja con detalle" / "Corte, barba y experiencia". One French-speaking reviewer: "le dégradé marocain c'est ici".

## Operating Context

- Address: Carrer de Josep Anselm Clavé, 16, Local 3, 17310 Lloret de Mar, Girona. Plus code PR3X+8Q.
- Hours (Google): Monday–Friday 9:30–21:00, Saturday 9:00–21:00, Sunday closed.
- Phones: 675 23 64 96 and 872 27 08 73 (both in the Instagram bio for bookings; 872 27 08 73 is the Google listing number). WhatsApp: +34 603 97 83 74 (Instagram link).
- Instagram @momo_sbarber_shop, TikTok @momos.barbershop4.
- The shop: black marble floor with white veining, hexagonal LED ceiling lights, black leather barber chairs, black-and-white striped capes, white logo on black storefront sign, lit barber pole at the door.

## Capabilities and Constraints

Confirmed services (user answer, Sept 2026): cuts and fades, beard and shave, kids' cuts (including temporary colour spray for kids, from reviews), designs and lines shaved into the hair. The user added that they do "everything to do with hairdressing", so the site may say that anything hair-related not on the list can be asked for.

Prices: the owner has not supplied real prices yet. At the user's request the menu shows provisional, plausible prices (corte 15, máquina 10, degradado 14, lavado 5, barba 8, perfilado 6, afeitado 12, corte y barba 20, infantil 10, spray 3, rayas 2, dibujos desde 5, in euros) to be replaced when the real list arrives. No online booking system exists; booking is by phone or WhatsApp (WhatsApp +34 603 97 83 74 confirmed by the user).

- Payment: cash and card (confirmed by the user). No FAQ section and no gift cards or bundles (the user declined both).
- Languages: the site runs in Spanish, English, French and Catalan (tools/i18n-build.mjs holds the translation table and regenerates i18n.js).
- Reviews: direct Google review link uses place ID ChIJP425dPIXuxIRohm7VZdkNCA; printable QR card in imprimir-resena.html.
- Holiday notice: edit aviso.js (activo, fechas, texto por idioma).
- Domain not decided; run node tools/set-domain.mjs https://dominio when it is.
- Team: the user will say which barber is Moha and which is Wassim; until then photos carry no names.

## Brand Commitments

- Name as written on the sign: MOMO'S BARBERSHOP. The real logo (confirmed by the user) is the circular badge with a bearded man in sunglasses, two scissors and "MOMO'S BARBERSHOP · CUTS & SHAVES", white on black, as on the sign and door. No digital file exists; the site uses a rebuild from the storefront photos. A black and gold "Haircut & Shave" badge also appears in the Google photos but is not the one to use.
- The user pinned a visual reference: the Impeccable gallery piece "Trattoria da Nonna Lucia" (https://impeccable.style/gallery/view/95e472135260c675/), for how it looks and how it is structured.
- The hero must carry a looping video about the trade.

## Evidence on Hand

- Real Google reviews (quotable, with reviewer first names).
- Instagram photos of real work and of the shop (640px) and all Google Business photos of the shop, owner and customer uploads alike (the user asked for them to be used), in `assets/photos/source/`.
- Stock hero video from Pexels (free licence), downloaded with permission.
- No real prices yet (provisional ones are on the page), no founding year, no team photos with names beyond what the reviews say.

## Product Principles

1. Practical first: open/closed, phone, WhatsApp and directions reachable from the first screen on a phone.
2. Only real facts: services the user confirmed, reviews as written, no invented prices, dates or claims.
3. The shop's own look (black marble, white badge, striped capes, barber pole) is the material, not generic barber clichés.
4. Works for a tourist who does not read Spanish well: short labels, numbers and icons that read at a glance.

## Accessibility & Inclusion

Looping hero video needs a visible pause control. Text over video must stay legible (≥4.5:1). Tap targets sized for thumbs.
