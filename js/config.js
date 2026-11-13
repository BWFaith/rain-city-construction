/* ==========================================================
   RAIN CITY DESIGN & BUILD — SITE CONFIGURATION
   Everything the owner is likely to edit lives in this file.
   ========================================================== */
window.RC = {
  business: {
    name: "Rain City Design & Build, LLC",
    phone: "206 483 3980",
    phoneLink: "+12064833980",
    contact: "Hoa Duong",
    ownerEmail: "owner@yourdomain.com", // <-- the owner's inbox (receives a copy of every quote)
  },

  /* ---- EmailJS (free tier works) — see README.md, section "Email setup" ---- */
  emailjs: {
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
    serviceId: "YOUR_SERVICE_ID",
    templateId: "YOUR_TEMPLATE_ID",
  },

  /* ---- Quote calculator ----
     PLACEHOLDER RATES: replace with your real pricing.
     total = quantity x rate x finish multiplier (min charge applies) */
  tiers: {
    standard: {
      label: "Standard",
      note: "Quality builder-grade materials",
      mult: 1.0,
    },
    premium: {
      label: "Premium",
      note: "Upgraded fixtures & finishes",
      mult: 1.28,
    },
    luxury: {
      label: "Luxury",
      note: "Custom, high-end throughout",
      mult: 1.65,
    },
  },
  rushMultiplier: 1.1, // "Priority scheduling" surcharge
  rangeLow: 0.92, // estimate range shown to the client
  rangeHigh: 1.15,
  services: [
    {
      id: "bathroom",
      name: "Bathroom remodel",
      img: "shower.jpg",
      unit: "sq ft of bathroom",
      rate: 140,
      min: 6500,
      def: 60,
      tiers: true,
      blurb: "Tile, shower, vanity, plumbing & electrical",
    },
    {
      id: "design",
      name: "Design-build remodel",
      img: "vanity.jpg",
      unit: "sq ft of living space",
      rate: 190,
      min: 15000,
      def: 400,
      tiers: true,
      blurb:
        "Kitchens, basements, additions & full interiors",
    },
    {
      id: "plumbing",
      name: "Plumbing",
      img: "sump-pump.jpg",
      unit: "fixtures / connections",
      rate: 380,
      min: 450,
      def: 3,
      tiers: false,
      blurb: "Repairs, re-pipes, fixtures and drains",
    },
    {
      id: "heater",
      name: "Water heater & sump pump",
      img: "water-heater.jpg",
      unit: "units installed",
      rate: 1650,
      min: 1650,
      def: 1,
      tiers: false,
      blurb: "Supply, install, haul-away and permits",
    },
    {
      id: "hvac",
      name: "HVAC / mini-split install",
      img: "heat-pump.jpg",
      unit: "indoor zones",
      rate: 4200,
      min: 4200,
      def: 2,
      tiers: false,
      blurb: "Ductless heat pumps, single or multi-zone",
    },
    {
      id: "electrical",
      name: "Electrical",
      img: "electrical.jpg",
      unit: "outlets / switches / fixtures",
      rate: 185,
      min: 450,
      def: 8,
      tiers: false,
      blurb: "Upgrades, lighting, panels and new circuits",
    },
    {
      id: "flooring",
      name: "Hardwood & vinyl flooring",
      img: "flooring.jpg",
      unit: "sq ft of flooring",
      rate: 9,
      min: 1500,
      def: 500,
      tiers: true,
      blurb: "Supply and installation, all prep included",
    },
    {
      id: "painting",
      name: "Interior painting",
      img: "paint-prep.jpg",
      unit: "sq ft of floor area",
      rate: 3.5,
      min: 900,
      def: 800,
      tiers: false,
      blurb: "Full prep, protection, spray & brush finish",
    },
  ],
  timeSlots: [
    "Morning (8am – 12pm)",
    "Afternoon (12pm – 4pm)",
    "Flexible / any time",
  ],
};
