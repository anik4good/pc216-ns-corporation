/* ============================================================
   N.S. CORPORATION — SITE CONTENT
   ------------------------------------------------------------
   Single source of truth for ALL editable content. Every
   section of the page is rendered from the data below, so your
   future dashboard can update values (or POST fresh JSON) and
   the site updates automatically.
   ============================================================ */

const SITE = {

  /* ---------- Brand & logo ---------- */
  brand: {
    short: "N.S.",
    full: "Corporation",
    noun: "N.S. Corporation",
    motto: "Japan Quality. Global Trust."
  },

  /* ---------- Top bar ---------- */
  topbar: {
    left: "Chiba, Japan — Premium Japanese Vehicle Exporters",
    phone: "+81 90-8410-5655",
    phoneHref: "+819084105655",
    email: "nscorporation.jp@gmail.com",
    emailHref: "nscorporation.jp@gmail.com"
  },

  /* ---------- Navigation ---------- */
  nav: {
    links: [
      { label: "Home", href: "#home" },
      { label: "Who We Are", href: "#who-we-are" },
      { label: "What We Do", href: "#what-we-do" },
      { label: "Process", href: "#process" },
      { label: "Global Reach", href: "#global" },
      { label: "Contact", href: "#contact" }
    ],
    cta: { label: "Get a Quote", href: "#contact" }
  },

  /* ---------- Hero ---------- */
  hero: {
    overline: "We Are Here Since 2007",
    title: "Premium Japanese Vehicles.",
    titleGold: "Trusted Worldwide.",
    sub: "From the heart of Japan to your driveway — N.S. Corporation sources, inspects and exports premium Japanese vehicles with uncompromising transparency and care.",
    primaryCta: { label: "Explore What We Do", href: "#what-we-do" },
    secondaryCta: { label: "Who We Are", href: "#who-we-are" },
    stats: [
      { num: 19, suffix: "+", label: "Years of Excellence" },
      { num: 25, suffix: "+", label: "Countries Served" },
      { num: 5000, suffix: "+", label: "Vehicles Exported" },
      { num: 100, suffix: "%", label: "Transparent Deals" }
    ]
  },

  /* ---------- Trust pillars ---------- */
  pillars: [
    { icon: "vehicle", title: "Quality Japanese Vehicles", text: "Carefully selected for performance, safety and reliability." },
    { icon: "auction", title: "Direct Access to Japan's Major Auto Auctions", text: "We source from Japan's leading auctions with transparency and competitive prices." },
    { icon: "globe", title: "Worldwide Export", text: "Exporting quality vehicles to customers around the globe with care." },
    { icon: "shield", title: "Reliable & Transparent Service", text: "Honest deals, clear communication and full support from purchase to delivery." }
  ],

  /* ---------- Who We Are ---------- */
  who: {
    eyebrow: "Who We Are",
    title: "Japan Quality.",
    titleGold: "Global Trust.",
    paragraphs: [
      'Established in <b>2007</b> and headquartered in <b>Chiba, Japan</b>, N.S. Corporation is a trusted exporter of premium Japanese vehicles. For nearly two decades we have connected buyers across continents with Japan\'s finest automobiles.',
      'We hold direct access to Japan\'s major auto auctions, allowing us to hand-pick every vehicle against its auction sheet and grade.',
      'Our promise is simple — <b>honest deals, clear communication and full support</b>, from inquiry to arrival at your port.'
    ],
    signature: "— N.S. Corporation, Chiba, Japan",
    panel: {
      emblem: "Since 2007",
      years: 19,
      yearsSuffix: "+",
      note: "Years of Excellence",
      values: [
        { title: "Integrity First", text: "Honest deals & clear communication, always." },
        { title: "Precision", text: "Every vehicle auction-sheet verified & inspected." },
        { title: "Care Without Borders", text: "Full support from purchase to delivery." }
      ]
    }
  },

  /* ---------- What We Do ---------- */
  services: {
    eyebrow: "What We Do",
    heading: "Every Step of the Journey,",
    headingGold: "Handled.",
    sub: "From the auction floor in Japan to your port — one trusted partner.",
    items: [
      { icon: "auction", title: "Auction Sourcing", text: "Direct access to Japan's major auto auctions. We bid on your behalf with transparent grading and competitive prices." },
      { icon: "search", title: "Vehicle Search on Request", text: "Tell us your budget and specification — we find the perfect match from thousands of auction listings." },
      { icon: "verify", title: "Inspection & Verification", text: "Every vehicle is checked against its auction sheet and carefully inspected before purchase." },
      { icon: "ship", title: "Export & Shipping", text: "RoRo or container shipping from Japan's major ports, with careful handling at every step." },
      { icon: "docs", title: "Documentation & Compliance", text: "Complete export paperwork and destination-compliance guidance for smooth customs clearance." },
      { icon: "support", title: "After-Sales Support", text: "Clear communication and full support from purchase to delivery — and beyond." }
    ],
    strip: ["Sedans", "SUVs", "Hybrids", "Electric", "Kei Cars", "Trucks & Vans", "Luxury & JDM Classics"]
  },

  /* ---------- Process ---------- */
  process: {
    eyebrow: "How It Works",
    heading: "From Inquiry to",
    headingGold: "Delivery.",
    steps: [
      { num: "01", title: "Inquiry", text: "Share your requirements, budget and destination." },
      { num: "02", title: "Bid & Win", text: "We select and bid at Japan's major auto auctions." },
      { num: "03", title: "Inspect & Pay", text: "Vehicle verified against its grade; transparent invoicing." },
      { num: "04", title: "Ship", text: "Export, port handling and ocean freight arranged." },
      { num: "05", title: "Deliver", text: "Your vehicle arrives safely at your port." }
    ]
  },

  /* ---------- Global Reach ---------- */
  global: {
    eyebrow: "Global Reach",
    heading: "From Chiba",
    headingGold: "to the World.",
    paragraph: "Our vehicles reach driveways and ports across continents — shipped with care, delivered with pride. Wherever you are, Japan's finest is within reach.",
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

  /* ---------- Testimonials ---------- */
  testimonials: {
    eyebrow: "Client Words",
    heading: "Trusted",
    headingGold: "Worldwide.",
    items: [
      { quote: "The auction sheet matched the car perfectly. Honest people and a smooth process from start to finish.", name: "David M.", loc: "Canada" },
      { quote: "From bidding to delivery in Dubai, everything was transparent. I always knew exactly where my car was.", name: "Ahmed R.", loc: "UAE" },
      { quote: "My third vehicle through N.S. — always on time, always exactly as graded. True professionals.", name: "Sarah W.", loc: "New Zealand" }
    ]
  },

  /* ---------- Contact ---------- */
  contact: {
    eyebrow: "Contact",
    heading: "Let's Find Your",
    headingGold: "Next Vehicle.",
    sub: "Reach out — we reply promptly with honest, clear guidance.",
    cards: [
      { label: "Phone", value: "+81 90-8410-5655", href: "tel:+819084105655", icon: "phone" },
      { label: "Email", value: "nscorporation.jp@gmail.com", href: "mailto:nscorporation.jp@gmail.com", icon: "mail" },
      { label: "Location", value: "Chiba, Japan", href: null, icon: "pin" }
    ],
    form: {
      interestOptions: ["Sedan", "SUV", "Hybrid", "Electric", "Truck / Van", "Kei Car", "Other"],
      submitLabel: "Send Inquiry"
    }
  },

  /* ---------- Footer ---------- */
  footer: {
    tagline: "Premium Japanese vehicles, trusted worldwide since 2007. Direct auction access, transparent service and careful worldwide export from Chiba, Japan.",
    motto: "Japan Quality. Global Trust.",
    cols: [
      { heading: "Explore", links: [
        { label: "Home", href: "#home" }, { label: "Who We Are", href: "#who-we-are" },
        { label: "What We Do", href: "#what-we-do" }, { label: "Process", href: "#process" },
        { label: "Global Reach", href: "#global" }, { label: "Contact", href: "#contact" }
      ] },
      { heading: "What We Do", links: [
        { label: "Auction Sourcing", href: "#what-we-do" }, { label: "Vehicle Search", href: "#what-we-do" },
        { label: "Inspection", href: "#what-we-do" }, { label: "Export & Shipping", href: "#what-we-do" },
        { label: "Documentation", href: "#what-we-do" }
      ] },
      { heading: "Contact", links: [
        { label: "+81 90-8410-5655", href: "tel:+819084105655" },
        { label: "nscorporation.jp@gmail.com", href: "mailto:nscorporation.jp@gmail.com" },
        { label: "Chiba, Japan", href: null }
      ] }
    ]
  }
};