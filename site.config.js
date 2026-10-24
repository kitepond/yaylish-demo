/* ==========================================================================
   Yaylish – SITE CONFIG  (the ONE file most buyers need to edit)
   --------------------------------------------------------------------------
   - Everything here is plain JavaScript: no build step needed.
   - Text that must be bilingual is written as { en: "...", vi: "..." }.
   - Leave a contact channel as "" (empty) to hide its button everywhere.
   - ALL values below are PLACEHOLDERS. Replace them before you go live.
   ========================================================================== */
window.SITE_CONFIG = {

  /* ---------- Brand ---------- */
  brand: {
    name: "Yaylish",                 // used in <title>, footer, schema.org, {brand} in copy
    logoText: "Yaylish",             // text shown next to the logo mark
    logoMark: "assets/img/logo-mark.svg", // swap for your own SVG/PNG; "" = text-only logo
    tagline: {
      en: "English for curious kids",
      vi: "Tiếng Anh cho bé tò mò"
    }
  },

  /* ---------- Site URL (used for sitemap/OG/schema; no trailing slash) ---------- */
  siteUrl: "https://www.example.com",

  /* ---------- Language ---------- */
  language: {
    default: "en",                   // "en" or "vi" – language shown on a visitor's first visit
    available: ["en", "vi"],         // add a code here + create assets/i18n/<code>.js to add a language
    labels: { en: "EN", vi: "VI" },  // text on the switch buttons
    names:  { en: "English", vi: "Tiếng Việt" },
    storageKey: "yaylish.lang"       // localStorage key that remembers the choice
  },

  /* ---------- Currency (per language) ----------
     Prices live in assets/data/tuition.js in several currencies.
     Example: show USD to English visitors and VND to Vietnamese visitors,
     or set both to "VND" for a Vietnam-only center. */
  currency: { en: "USD", vi: "VND" },

  /* ---------- Theme (rebrand here or in src/input.css :root) ----------
     Hex colors. Remove a line (or set null) to use the CSS default. */
  theme: {
    colors: {
      brand:      "#3454D1",   // main brand blue (links, headings accents, dark sections)
      brandDark:  "#243BA0",
      brandSoft:  "#E8EDFC",
      accent:     "#FFC93C",   // primary buttons / highlights (use dark text on it)
      coral:      "#FF7A59",
      mint:       "#35C2A1",
      sky:        "#56BEF0",
      violet:     "#8B6CE8",
      ink:        "#1E2A4A",   // body text / dark navy
      muted:      "#546080",   // secondary text
      cream:      "#FFF9EC"    // page background
    },
    radius: { card: "1.5rem", button: "9999px" },
    fonts: {
      display: "'Baloo 2', 'Be Vietnam Pro', system-ui, sans-serif",
      body:    "'Be Vietnam Pro', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    }
  },

  /* ---------- Contact (leave "" to hide) ---------- */
  contact: {
    hotline: "+84900000000",         // used for tel: links (international format, no spaces)
    hotlineDisplay: "0900 000 000",  // what visitors read
    zalo: "0900000000",              // → https://zalo.me/<number>
    messenger: "yourpage",           // → https://m.me/<page-username-or-id>
    email: "hello@example.com",
    address: {
      en: "123 Sample Street, District 1, Ho Chi Minh City, Vietnam",
      vi: "123 Đường Mẫu, Quận 1, TP. Hồ Chí Minh"
    },
    mapEmbedUrl: "",                 // paste the src of a Google Maps embed iframe; "" = show map placeholder
    mapLink: "https://maps.google.com/?q=Ho+Chi+Minh+City", // "Open in Maps" button
    social: { facebook: "", youtube: "", instagram: "", tiktok: "" }
  },

  /* ---------- Opening hours (24h "HH:MM"; null = closed) ---------- */
  hours: [
    { day: "mon", open: "08:00", close: "20:00" },
    { day: "tue", open: "08:00", close: "20:00" },
    { day: "wed", open: "08:00", close: "20:00" },
    { day: "thu", open: "08:00", close: "20:00" },
    { day: "fri", open: "08:00", close: "20:00" },
    { day: "sat", open: "08:00", close: "17:00" },
    { day: "sun", open: null,    close: null    }
  ],

  /* ---------- Floating click-to-chat buttons ---------- */
  chatButtons: {
    zalo: true, messenger: true, call: true,
    position: "right"                // "right" or "left"
  },

  /* ---------- Bank transfer / VietQR block on the Tuition page ---------- */
  payment: {
    show: true,
    isPlaceholder: true,             // true = shows a "placeholder" warning. Set false after you add real details.
    bankName: "Sample Bank (SMB)",
    accountName: "YAYLISH EDUCATION CO., LTD",
    accountNumber: "0000 0000 0000",
    transferNote: "YAYLISH - Child name - Level",
    qrImage: "assets/img/vietqr-placeholder.svg" // replace with your VietQR image (PNG/SVG/JPG)
  },

  /* ---------- Trial booking form ----------
     provider: "none"      → form validates but does NOT send anywhere (demo mode)
               "formspree" → set endpoint to https://formspree.io/f/xxxxxxx
               "netlify"   → deploy on Netlify (form name below); no endpoint needed
               "custom"    → POST JSON to your own endpoint (Make, Zapier, Google Apps Script, API…)
     calendlyUrl: optional link shown as "or pick a time online" (Calendly / Cal.com etc.) */
  form: {
    provider: "none",
    endpoint: "",
    netlifyFormName: "trial-booking",
    redirectAfterSuccess: "",        // optional URL to go to after a successful send
    calendlyUrl: "",
    fallbackEmail: "hello@example.com" // used by the "send by email" fallback button
  },

  /* ---------- Misc ---------- */
  showDemoNote: true                 // footer note "Template preview with sample content". Set false when live.
};
