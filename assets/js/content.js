/* ============================================================
   N.S. CORPORATION — SITE CONTENT
   ------------------------------------------------------------
   Single source of truth for ALL editable static content.
   Vehicle stock lives in the database (managed from /admin)
   and is loaded live from /api/vehicles.
   ============================================================ */

const SITE = {

  /* ---------- Brand & logo ---------- */
  brand: {
    short: "N.S.",
    full: "Corporation",
    noun: "N.S. Corporation",
    legalName: "N.S. CORPORATION CO., LTD.",
    motto: "Japan Quality. Global Trust."
  },

  /* ---------- Contact channels (used site-wide) ---------- */
  contactInfo: {
    phone: "+81 90-8410-5655",
    phoneHref: "+819084105655",
    whatsapp: "+81 90-8410-5655",
    whatsappHref: "819084105655",
    email: "nscorporation.jp@gmail.com",
    emailHref: "nscorporation.jp@gmail.com",
    address: "Chiba, Japan",
    hours: "Mon – Sat : 9:00 – 18:00 (JST)",
    socials: [
      { icon: "facebook", label: "Facebook", href: "#" },
      { icon: "instagram", label: "Instagram", href: "#" },
      { icon: "whatsapp", label: "WhatsApp", href: "https://wa.me/819084105655" }
    ]
  },

  /* ---------- Top bar ---------- */
  topbar: {
    left: "Japan — Japanese Vehicle Sourcing & Export",
    hours: "Mon – Sat : 9:00 – 18:00 (JST)"
  },

  /* ---------- Navigation ---------- */
  nav: {
    links: [
      { label: "Home", href: "#home" },
      { label: "About Us", href: "#about" },
      { label: "Ready Stock", href: "#vehicles" },
      { label: "How It Works", href: "#process" },
      { label: "Services", href: "#services" },
      { label: "Contact", href: "#contact" }
    ],
    cta: { label: "Get a Quote", href: "#contact" }
  },

  /* ---------- Hero ---------- */
  hero: {
    overline: "Japan-Based Vehicle Exporter — Since 2007",
    title: "Japanese Vehicles.",
    titleGold: "Sourced & Shipped Worldwide.",
    sub: "Quality Japanese vehicles sourced directly from Japan for customers around the world. From vehicle selection to international shipping, N.S. CORPORATION handles the process from purchase to delivery.",
    primaryCta: { label: "Contact Us", href: "#contact" },
    secondaryCta: { label: "WhatsApp Us", href: "https://wa.me/819084105655", whatsapp: true },
    slides: [
      { src: "assets/img/hero-1.jpg", alt: "Premium black coupe" },
      { src: "assets/img/hero-2.jpg", alt: "Black sports car in the dark" },
      { src: "assets/img/hero-3.jpg", alt: "Supercar front in low light" }
    ],
    stats: [
      { num: 19, suffix: "+", label: "Years of Experience" },
      { num: 25, suffix: "+", label: "Countries Served" },
      { num: 5000, suffix: "+", label: "Vehicles Exported" },
      { num: 100, suffix: "%", label: "Transparent Deals" }
    ]
  },

  /* ---------- About ---------- */
  about: {
    eyebrow: "About Us",
    title: "About N.S.",
    titleGold: "Corporation",
    paragraphs: [
      '<b>N.S. CORPORATION CO., LTD.</b> is a Japan-based automotive company specializing in Japanese vehicle sourcing, domestic sales and international vehicle exports.',
      'With experience in the automotive industry since <b>2007</b>, we provide customers with access to quality Japanese vehicles through our network of auctions and suppliers throughout Japan.',
      'From sourcing and purchasing to export documentation and international shipping, our goal is to provide a <b>transparent and reliable</b> vehicle buying experience for customers worldwide.'
    ],
    signature: "— N.S. CORPORATION CO., LTD., Japan",
    panel: {
      emblem: "Established",
      years: 2007,
      yearsSuffix: "",
      note: "Serving Customers Worldwide",
      values: [
        { title: "Integrity First", text: "Honest deals & clear communication, always." },
        { title: "Precision", text: "Every vehicle verified against its auction sheet & grade." },
        { title: "Care Without Borders", text: "Full support from purchase to delivery." }
      ]
    }
  },

  /* ---------- Vehicle stock ---------- */
  vehicles: {
    eyebrow: "Ready Stock & Recently Sold",
    heading: "Find Your",
    headingGold: "Vehicle.",
    sub: "Search our stock by make, model and year — every vehicle listed with full details and a clear status.",
    filters: ["ALL", "AVAILABLE", "RESERVED", "SOLD"],
    bodyTypes: ["All", "Sedan", "Hatchback", "SUV", "Crossover", "Coupe", "Minivan / Van", "Pickup", "Wagon", "K.Car", "Truck", "Other"],
    currency: { options: ["JPY", "USD"], jpyPerUsd: 150 },
    priceLabel: "FOB Price",
    priceHidden: "Contact for Price",
    viewLabel: "View Details",
    emptyMsg: "New vehicles are being prepared for listing — please contact us for the latest available stock.",
    noMatchMsg: "No vehicles match your search — try different filters, or contact us and we will source one for you.",
    search: {
      make: "Make",
      model: "Model",
      year: "Registration Year",
      allMakes: "All Makes",
      allModels: "All Models",
      from: "From",
      to: "To",
      go: "Search",
      reset: "Reset"
    },
    waMessage: "Hello N.S. CORPORATION, I am interested in {stock} / {vehicle}. Please send me more information."
  },

  /* ---------- Process ---------- */
  process: {
    eyebrow: "How It Works",
    heading: "From Purchase",
    headingGold: "to Delivery.",
    sub: "Six clear steps — one trusted partner from Japan to your country.",
    steps: [
      { num: "01", icon: "search", title: "Vehicle Selection / Purchase", text: "Customer selects a vehicle from our ready stock or provides their requirements for us to source a vehicle." },
      { num: "02", icon: "verify", title: "Vehicle Confirmation", text: "We confirm the vehicle information, condition, specifications and final price with the customer." },
      { num: "03", icon: "pay", title: "Payment", text: "Customer completes the agreed payment and we begin the export/shipping process." },
      { num: "04", icon: "docs", title: "Export Documentation", text: "We arrange the necessary export documentation and prepare the vehicle for shipment." },
      { num: "05", icon: "ship", title: "Shipping", text: "The vehicle is transported to the port and shipped to the customer's destination country." },
      { num: "06", icon: "pin", title: "Delivery", text: "The customer receives the shipping documents and the vehicle arrives at the destination port." }
    ]
  },

  /* ---------- Services ---------- */
  services: {
    eyebrow: "Our Services",
    heading: "One Partner for the",
    headingGold: "Entire Journey.",
    sub: "From auction halls in Japan to your destination port — we handle every step.",
    items: [
      { icon: "auction", title: "Japanese Auction Sourcing", text: "We source vehicles from major Japanese automobile auctions according to customer requirements." },
      { icon: "vehicle", title: "Ready Stock Vehicles", text: "Customers can purchase vehicles that are already available in our inventory." },
      { icon: "globe", title: "International Vehicle Export", text: "We arrange export procedures, documentation and international vehicle shipping." },
      { icon: "support", title: "Domestic Vehicle Sales", text: "Vehicle sales and sourcing services are also available for customers within Japan." },
      { icon: "ship", title: "Shipping & Export Support", text: "Support from vehicle purchase through port delivery and international shipment." }
    ],
    strip: ["Sedans", "SUVs", "Hybrids", "Electric", "Kei Cars", "Trucks & Vans", "Luxury & JDM Classics"]
  },

  /* ---------- Global Reach ---------- */
  global: {
    eyebrow: "Global Reach",
    heading: "From Japan",
    headingGold: "to Your Country.",
    paragraph: "We source quality vehicles from across Japan and arrange export and shipping to customers worldwide. From vehicle purchase and documentation to port delivery and shipping, N.S. CORPORATION supports the entire process.",
    chips: ["Canada", "UAE", "Bangladesh", "Africa", "New Zealand", "+ Your Destination"],
    map: {
      originLabel: "JAPAN",
      routes: {
        nodes: [
          { x: 150, y: 110, label: "CANADA", labelY: 92 },
          { x: 405, y: 250, label: "UAE", labelY: 230 },
          { x: 495, y: 270, label: "BANGLADESH", labelY: 298 },
          { x: 355, y: 345, label: "AFRICA", labelY: 374 },
          { x: 660, y: 440, label: "NEW ZEALAND", labelY: 470 }
        ],
        origin: { x: 600, y: 170 }
      }
    }
  },

  /* ---------- Contact / Inquiry ---------- */
  contact: {
    eyebrow: "Contact",
    heading: "Let's Find Your",
    headingGold: "Next Vehicle.",
    sub: "Tell us what you are looking for — we reply promptly with honest, clear guidance.",
    cards: [
      { label: "Phone", value: "+81 90-8410-5655", href: "tel:+819084105655", icon: "phone" },
      { label: "WhatsApp", value: "+81 90-8410-5655", href: "https://wa.me/819084105655", icon: "whatsapp" },
      { label: "Email", value: "nscorporation.jp@gmail.com", href: "mailto:nscorporation.jp@gmail.com", icon: "mail" },
      { label: "Location", value: "Japan", href: null, icon: "pin" }
    ],
    form: {
      submitLabel: "Send Inquiry",
      waFallbackNote: "Prefer WhatsApp? Message us directly and we will reply quickly."
    }
  },

  /* ---------- Bank / Payment information ---------- */
  bank: {
    eyebrow: "Payment Information",
    heading: "Bank / Payment",
    headingGold: "Information.",
    sub: "Use only the account details below for payments to N.S. CORPORATION CO., LTD.",
    fields: [
      { label: "Account Name", value: "N.S.CORPORATION CO.,LTD" },
      { label: "Bank Name", value: "THE CHIBA KOGYO BANK, LTD." },
      { label: "Branch Name", value: "HEAD BRANCH" },
      { label: "Branch Code", value: "110" },
      { label: "SWIFT Code", value: "CHIKJPJT" },
      { label: "Account Type", value: "JPY Account" },
      { label: "Account Number", value: "1122400" },
      { label: "Branch Address", value: "Chiba-Shi, Mihamaku, Saiwaicho 2-1-2, Japan" }
    ],
    pendingLabel: "To be provided — please contact us directly",
    notice: "Please confirm our banking information directly with N.S. CORPORATION before making any payment. We will never notify customers of a change of bank account through an unofficial email address or third party."
  },

  /* ---------- Footer ---------- */
  footer: {
    tagline: "Japan-based automotive company specializing in Japanese vehicle sourcing, domestic sales and international vehicle exports. Serving customers worldwide since 2007.",
    motto: "Japan Quality. Global Trust.",
    quickLinks: [
      { label: "Home", href: "#home" },
      { label: "About Us", href: "#about" },
      { label: "Ready Stock", href: "#vehicles" },
      { label: "Recently Sold", href: "#vehicles?status=SOLD" },
      { label: "Services", href: "#services" },
      { label: "Contact", href: "#contact" }
    ]
  }
};
