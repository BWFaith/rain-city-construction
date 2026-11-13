# Rain City Design & Build, LLC — Website

A 9-page, fully responsive static website (HTML, CSS, JavaScript — no build step).

## Pages
index.html (Home) · about.html · services.html · gallery.html (before/after + single photos) · process.html · reviews.html · faq.html · contact.html · booking.html (quote calculator + booking)

## Folder structure
- `css/style.css` — all styling. Brand colours are variables at the top (`--orange`, `--slate`…).
- `js/config.js` — **the file you edit most**: phone, owner email, EmailJS keys, service prices, finish levels, time slots.
- `js/main.js` — behaviour (hero slideshow + rain animation, sliders, gallery, lightbox, quote wizard, email sending).
- `assets/images/` — all photos. `before-1..6.jpg` and `after-1..6.jpg` are **placeholders**.

## Quick start
Open `index.html` in a browser, or upload the whole folder to any host (Netlify, Vercel, cPanel, GitHub Pages).

## 1. Email setup (quote to client + copy to owner)
The site is static, so it uses the free EmailJS service. Until you configure it, the booking form works in **demo mode** (shows success, sends nothing).

1. Create a free account at https://www.emailjs.com and add an **Email Service** (Gmail/Outlook). Copy the **Service ID**.
2. Create an **Email Template** with:
   - **To Email:** `{{to_email}}`
   - **Subject:** `{{subject}}`
   - **Reply-To:** `{{reply_to}}`
   - **From name:** `{{from_name}}`
   - **Content (HTML):** `{{{message_html}}}`  (three braces so the HTML renders)
   Copy the **Template ID**.
3. In Account > General copy your **Public Key**.
4. Open `js/config.js` and fill in `publicKey`, `serviceId`, `templateId`, and `business.ownerEmail`.

On every booking the site sends two emails with the same itemized quote: one to the client, one to `ownerEmail`. The contact form works the same way.

## 2. Pricing
Rates in `js/config.js` (`services`, `tiers`, `rushMultiplier`, `rangeLow/High`) are **placeholders**. Replace them with your real prices. Formula: quantity x rate x finish multiplier, with a minimum charge per service; the client sees a range (92%–115% by default).

## 3. Replace placeholders before launch
- **Before/after photos:** overwrite `assets/images/before-N.jpg` and `after-N.jpg` (same file names, about 1600x1000). Titles are in `gallery.html`.
- **Single photos:** edit the `<figure>` blocks in `gallery.html` / `index.html`.
- **Logo:** a vector recreation is in `assets/images/logo-mark.svg`. Replace with your official logo file if you have one.
- **Reviews:** `reviews.html` and the home page show **SAMPLE reviews**. Replace with real, verified client reviews (using invented testimonials on a live site can break advertising rules).
- **Company details:** license number, service area, hours, public email, warranty terms, company story (marked with "add" text on About, Contact, Process).
- **Stats on the home page:** `data-count` values in `index.html`.
- **Map:** paste a Google Maps embed in `contact.html` where it says "Map placeholder".
- **Owner photo:** `assets/images/owner.jpg`.

## 4. Fonts and libraries
Google Fonts (Barlow Condensed, Figtree) and EmailJS are loaded from CDNs, so the site needs internet access. Everything else is local.

## Accessibility and performance
Keyboard-friendly navigation and sliders, visible focus states, reduced-motion support, lazy-loaded images, responsive from 320px up.
