/* ============================================================
   N.S. CORPORATION — APP / RENDERER
   ------------------------------------------------------------
   Renders SITE (content.js) into the DOM. Vehicle stock is
   loaded live from /api/vehicles (managed via /admin).
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const PAGE = document.body.dataset.page || "home";
  const prefix = PAGE === "vehicle" ? "index.html" : "";

  /* ---------- Helpers ---------- */
  function waLink(text) {
    const base = "https://wa.me/" + SITE.contactInfo.whatsappHref;
    return text ? base + "?text=" + encodeURIComponent(text) : base;
  }

  function vehicleName(v) {
    return [v.make, v.model].filter(Boolean).join(" ").trim() || "Vehicle";
  }

  function vehicleFullName(v) {
    return [vehicleName(v), v.year].filter(Boolean).join(" ");
  }

  function priceLabel(v) {
    if (v.hidePrice || !v.fobPrice) return SITE.vehicles.priceHidden;
    const cur = v.currency === "USD" ? "$" : "¥";
    return SITE.vehicles.priceLabel + ": " + cur + Number(v.fobPrice).toLocaleString("en-US");
  }

  function mileageLabel(v) {
    return v.mileage ? Number(v.mileage).toLocaleString("en-US") + " km" : "";
  }

  function metaLine(v) {
    return [v.year, mileageLabel(v), v.fuel, v.transmission].filter(Boolean).join("  |  ");
  }

  function waVehicleMessage(v) {
    return SITE.vehicles.waMessage
      .replace("{stock}", "Stock No. " + (v.stockNo || "—"))
      .replace("{vehicle}", vehicleFullName(v));
  }

  /* ---------- Logo monogram (silver N / gold S) ---------- */
  function mono() {
    return '<svg class="mono" viewBox="0 0 90 100" aria-hidden="true">' +
      '<defs><linearGradient id="gSilver" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#f2f6fa"/><stop offset=".5" stop-color="#aeb9c2"/><stop offset="1" stop-color="#7d8891"/>' +
      '</linearGradient><linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#f6e3a4"/><stop offset=".5" stop-color="#d4af37"/><stop offset="1" stop-color="#8f6b1f"/>' +
      '</linearGradient></defs>' +
      '<text x="6" y="70" font-family="Cinzel, serif" font-size="66" font-weight="700" fill="url(#gSilver)">N</text>' +
      '<text x="28" y="94" font-family="Cinzel, serif" font-size="66" font-weight="700" fill="url(#gGold)">S</text></svg>';
  }

  const icons = {
    vehicle: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 40l3.5-11c.8-2.4 3-4 5.5-4h22c2.5 0 4.7 1.6 5.5 4L52 40"/><rect x="8" y="38" width="48" height="10" rx="3"/><circle cx="20" cy="50" r="4.5"/><circle cx="44" cy="50" r="4.5"/><path d="M25 48h14"/></svg>',
    auction: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6l18 18-8 8-18-18z"/><path d="M32 30l22 22"/><path d="M8 56h26"/></svg>',
    globe: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><path d="M10 32h44"/><path d="M32 10c8 6 12 13 12 22s-4 16-12 22c-8-6-12-13-12-22s4-16 12-22z"/></svg>',
    shield: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M32 6l20 8v14c0 14-8 24-20 30C20 52 12 42 12 28V14z"/><path d="M23 31l7 7 12-14"/></svg>',
    search: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="28" cy="28" r="16"/><path d="M40 40l14 14"/></svg>',
    verify: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6h20l10 10v42H18z"/><path d="M38 6v10h10"/><path d="M25 34l5 5 10-11"/><path d="M26 46h18"/></svg>',
    pay: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="14" width="52" height="36" rx="4"/><path d="M6 26h52"/><path d="M14 40h12"/></svg>',
    ship: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 42h52l-6 10H12z"/><path d="M16 42v-8h12v8"/><path d="M28 42v-8h12v8"/><path d="M40 42v-8h12v8"/><path d="M4 58q4 3 8 0t8 0 8 0 8 0 8 0 8 0 8 0"/></svg>',
    docs: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6h20l10 10v42H18z"/><path d="M38 6v10h10"/><path d="M26 30h20M26 38h20M26 46h12"/></svg>',
    support: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12h44v30H28l-14 10V42H10z"/><path d="M22 27h1M32 27h1M42 27h1"/></svg>',
    phone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.4 19.4 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    mail: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    pin: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="12" r="3"/></svg>',
    whatsapp: '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>',
    facebook: '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    instagram: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    clock: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    bank: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 10v11M9.5 10v11M14.5 10v11M19 10v11"/><path d="M12 3l9 5H3z"/><path d="M5 15h3M16 15h3"/></svg>',
    alert: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l10 18H2z"/><path d="M12 10v4"/><path d="M12 17.5h.01"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>'
  };

  /* ---------- Top bar ---------- */
  function renderTopbar() {
    const t = SITE.topbar, c = SITE.contactInfo;
    $("#topbar").innerHTML = `<div class="container topbar-inner">
      <span>&#9670; &nbsp;<b>${esc(t.left)}</b></span>
      <span>
        <a href="tel:${esc(c.phoneHref)}"><b>${esc(c.phone)}</b></a>
        <span class="dot">&#9670;</span>
        <a href="mailto:${esc(c.emailHref)}"><b>${esc(c.email)}</b></a>
        <span class="dot">&#9670;</span>
        <span class="tb-hours"><b>${esc(t.hours)}</b></span>
      </span>
    </div>`;
  }

  /* ---------- Nav ---------- */
  function renderNav() {
    const links = SITE.nav.links.map((n) =>
      `<a href="${prefix}${n.href}" data-link>${esc(n.label)}</a>`).join("");
    const brand = `${mono()}<span class="brand-text">${esc(SITE.brand.noun)}</span>`;
    $("#brand").innerHTML = brand;
    $("#links").innerHTML = links;
    $("#navCta").innerHTML = `<a href="${prefix}${SITE.nav.cta.href}" class="btn btn-gold nav-cta">${esc(SITE.nav.cta.label)}</a>`;
  }

  /* ---------- Hero ---------- */
  function renderHero() {
    const h = SITE.hero;
    const stats = h.stats.map((s) =>
      `<div class="stat"><strong data-count="${s.num}">0</strong><sup>${esc(s.suffix)}</sup><span>${esc(s.label)}</span></div>`).join("");
    const sec = h.secondaryCta;
    const slides = (h.slides || []).map((s, i) =>
      `<div class="hero-slide${i === 0 ? " active" : ""}" style="background-image:url('${esc(s.src)}')" role="img" aria-label="${esc(s.alt || "")}"></div>`).join("");
    const dots = (h.slides || []).map((s, i) =>
      `<button class="hero-dot${i === 0 ? " active" : ""}" data-i="${i}" type="button" aria-label="Show slide ${i + 1}"></button>`).join("");
    $("#home").innerHTML = `
      <div class="hero-bg">
        <div class="hero-slides">${slides}</div>
        <div class="hero-shade"></div>
      </div>
      <div class="container hero-inner">
        <p class="eyebrow reveal"><span class="line"></span>${esc(h.overline)}<span class="line"></span></p>
        <h1 class="reveal">${esc(h.title)}<br><span class="gold-text">${esc(h.titleGold)}</span></h1>
        <p class="lead reveal">${esc(h.sub)}</p>
        <div class="hero-cta reveal">
          <a href="${esc(h.primaryCta.href)}" class="btn btn-gold">${esc(h.primaryCta.label)}</a>
          <a href="${esc(sec.href)}" target="_blank" rel="noopener" class="btn btn-wa">${icons.whatsapp}<span>${esc(sec.label)}</span></a>
        </div>
        <div class="stats reveal">${stats}</div>
      </div>
      ${h.slides && h.slides.length > 1 ? `<div class="hero-dots">${dots}</div>` : ""}
      <div class="scroll-hint"></div>`;
    initHeroSlider();
  }

  function initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide");
    if (slides.length < 2) return;
    let idx = 0, timer = null;
    const dots = document.querySelectorAll(".hero-dot");
    const show = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((el, i) => el.classList.toggle("active", i === idx));
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
    };
    const play = () => { clearInterval(timer); timer = setInterval(() => show(idx + 1), 6000); };
    dots.forEach((d) => d.addEventListener("click", () => { show(+d.dataset.i); play(); }));
    play();
  }

  /* ---------- About ---------- */
  function renderAbout() {
    const w = SITE.about, p = w.panel;
    $("#about").innerHTML = `
      <div class="container who-grid">
        <div class="who-copy reveal">
          <p class="eyebrow"><span class="line"></span>${esc(w.eyebrow)}</p>
          <h2>${esc(w.title)} <span class="gold-text">${esc(w.titleGold)}</span></h2>
          ${w.paragraphs.map((para) => `<p>${para}</p>`).join("")}
          <p class="signature">${esc(w.signature)}</p>
        </div>
        <aside class="who-panel reveal">
          <div class="emblem"><span class="e-line"></span><span>${esc(p.emblem)}</span><span class="e-line"></span></div>
          <div class="big-years"><span class="gold-text" data-count="${p.years}">0</span><sup>${esc(p.yearsSuffix)}</sup></div>
          <p class="panel-note">${esc(p.note)}</p>
          <ul class="values">${p.values.map((v) => `<li><strong>${esc(v.title)}</strong><span>${esc(v.text)}</span></li>`).join("")}</ul>
        </aside>
      </div>`;
  }

  /* ---------- Vehicle stock (home section) ---------- */
  const stockState = {
    items: [],
    filter: "ALL",
    body: "All",
    make: "",
    model: "",
    yearFrom: "",
    yearTo: "",
    currency: SITE.vehicles.currency.options[0],
    loaded: false
  };

  function statusBadge(status) {
    return `<span class="v-badge st-${esc(status)}">${esc(status)}</span>`;
  }

  function priceLabel(v, inUsd) {
    if (v.hidePrice || !v.fobPrice) return SITE.vehicles.priceHidden;
    const amount = Number(v.fobPrice);
    if (inUsd && v.currency !== "USD") {
      return "FOB Price: $" + Math.round(amount / SITE.vehicles.currency.jpyPerUsd).toLocaleString("en-US");
    }
    return SITE.vehicles.priceLabel + ": " + (v.currency === "USD" ? "$" : "¥") + amount.toLocaleString("en-US");
  }

  function vehicleCard(v) {
    const img = (v.photos && v.photos[0]) || "assets/img/stock-placeholder.svg";
    const chips = [v.bodyType, v.transmission, v.fuel].filter(Boolean);
    const strip = [v.engine, mileageLabel(v)].filter(Boolean);
    return `
      <a class="v-card st-card-${esc(v.status)}" href="vehicle.html?id=${encodeURIComponent(v.id)}">
        <div class="v-media">
          <img src="${esc(img)}" alt="${esc(vehicleFullName(v))}" loading="lazy">
          ${statusBadge(v.status)}
        </div>
        <div class="v-body">
          <h3>${esc(vehicleName(v))}${v.year ? ` <span class="v-year">${esc(v.year)}</span>` : ""}</h3>
          <div class="v-price-row"><span class="v-price">${esc(priceLabel(v, stockState.currency === "USD"))}</span></div>
          ${strip.length ? `<div class="v-strip">${esc(strip.join("   |   "))}</div>` : ""}
          ${chips.length ? `<div class="v-chips">${chips.map((c) => `<span>${esc(c)}</span>`).join("")}</div>` : ""}
          <div class="v-foot">
            <span class="v-stock">Stock No. ${esc(v.stockNo || "—")}</span>
            <span class="v-more">${esc(SITE.vehicles.viewLabel)} ${icons.arrow}</span>
          </div>
        </div>
      </a>`;
  }

  function renderStockSectionShell() {
    const s = SITE.vehicles, se = s.search;
    $("#vehicles").innerHTML = `
      <div class="container">
        <div class="sec-head reveal">
          <p class="eyebrow"><span class="line"></span>${esc(s.eyebrow)}<span class="line"></span></p>
          <h2>${esc(s.heading)} <span class="gold-text">${esc(s.headingGold)}</span></h2>
          <p class="sub">${esc(s.sub)}</p>
        </div>
        <div class="v-search reveal" id="vSearch">
          <div class="vs-field"><label for="vsMake">${esc(se.make)}</label><select id="vsMake"><option value="">${esc(se.allMakes)}</option></select></div>
          <div class="vs-field"><label for="vsModel">${esc(se.model)}</label><select id="vsModel"><option value="">${esc(se.allModels)}</option></select></div>
          <div class="vs-field vs-years"><label for="vsYearFrom">${esc(se.year)}</label>
            <span class="yr"><input id="vsYearFrom" type="number" min="1950" max="2100" placeholder="${esc(se.from)}"><em>~</em><input id="vsYearTo" type="number" min="1950" max="2100" placeholder="${esc(se.to)}"></span>
          </div>
          <button class="btn btn-gold vs-btn" id="vsGo" type="button">${esc(se.go)}</button>
          <button class="btn btn-ghost vs-btn" id="vsReset" type="button">${esc(se.reset)}</button>
        </div>
        <div class="v-cur reveal" id="vCurrency">
          <span class="v-cur-label">Price in</span>
          ${s.currency.options.map((c) => `<button class="v-cur-btn${c === stockState.currency ? " active" : ""}" data-cur="${c}" type="button">${c === "JPY" ? "&#165; JPY" : "&#36; USD"}</button>`).join("")}
        </div>
        <div class="v-tabs reveal" id="vStatusTabs">
          ${s.filters.map((f) => `<button class="v-tab${f === stockState.filter ? " active" : ""}" data-filter="${f}" type="button">${f}</button>`).join("")}
        </div>
        <div class="v-tabs v-tabs-body reveal" id="vBodyTabs">
          ${s.bodyTypes.map((b) => `<button class="v-tab${b === stockState.body ? " active" : ""}" data-body="${b}" type="button">${esc(b)}</button>`).join("")}
        </div>
        <div class="v-grid reveal" id="vGrid"><p class="v-loading">Loading vehicles&hellip;</p></div>
      </div>`;
  }

  function stockMatches(v) {
    if (stockState.filter !== "ALL" && v.status !== stockState.filter) return false;
    if (stockState.body !== "All" && v.bodyType !== stockState.body) return false;
    if (stockState.make && v.make !== stockState.make) return false;
    if (stockState.model && v.model !== stockState.model) return false;
    if (stockState.yearFrom && !(v.year && Number(v.year) >= Number(stockState.yearFrom))) return false;
    if (stockState.yearTo && !(v.year && Number(v.year) <= Number(stockState.yearTo))) return false;
    return true;
  }

  function applyStockFilter() {
    const grid = $("#vGrid");
    if (!grid) return;
    const list = stockState.items.filter(stockMatches);
    grid.innerHTML = list.length
      ? list.map(vehicleCard).join("")
      : `<p class="v-empty">${esc(stockState.loaded && stockState.items.length ? SITE.vehicles.noMatchMsg : SITE.vehicles.emptyMsg)}</p>`;
  }

  function populateSearch() {
    const makeSel = $("#vsMake"), modelSel = $("#vsModel");
    if (!makeSel || !modelSel) return;
    const esc2 = esc;
    [...new Set(stockState.items.map((v) => v.make).filter(Boolean))].sort()
      .forEach((m) => makeSel.insertAdjacentHTML("beforeend", `<option value="${esc2(m)}">${esc2(m)}</option>`));
    const fillModels = () => {
      modelSel.innerHTML = `<option value="">${esc2(SITE.vehicles.search.allModels)}</option>`;
      [...new Set(stockState.items
        .filter((v) => !makeSel.value || v.make === makeSel.value)
        .map((v) => v.model).filter(Boolean))].sort()
        .forEach((m) => modelSel.insertAdjacentHTML("beforeend", `<option value="${esc2(m)}">${esc2(m)}</option>`));
    };
    fillModels();
    makeSel.addEventListener("change", fillModels);
  }

  function initStockControls() {
    const statusTabs = $("#vStatusTabs");
    statusTabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".v-tab");
      if (!btn) return;
      stockState.filter = btn.dataset.filter;
      statusTabs.querySelectorAll(".v-tab").forEach((b) => b.classList.toggle("active", b === btn));
      applyStockFilter();
      if (history.replaceState) {
        const q = stockState.filter === "ALL" ? "" : "?status=" + stockState.filter;
        history.replaceState(null, "", "#vehicles" + q);
      }
    });

    const bodyTabs = $("#vBodyTabs");
    bodyTabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".v-tab");
      if (!btn) return;
      stockState.body = btn.dataset.body;
      bodyTabs.querySelectorAll(".v-tab").forEach((b) => b.classList.toggle("active", b === btn));
      applyStockFilter();
    });

    $("#vCurrency").addEventListener("click", (e) => {
      const btn = e.target.closest(".v-cur-btn");
      if (!btn) return;
      stockState.currency = btn.dataset.cur;
      document.querySelectorAll("#vCurrency .v-cur-btn").forEach((b) => b.classList.toggle("active", b === btn));
      applyStockFilter();
    });

    $("#vsGo").addEventListener("click", () => {
      stockState.make = $("#vsMake").value;
      stockState.model = $("#vsModel").value;
      stockState.yearFrom = $("#vsYearFrom").value;
      stockState.yearTo = $("#vsYearTo").value;
      applyStockFilter();
    });

    $("#vsReset").addEventListener("click", () => {
      stockState.make = stockState.model = stockState.yearFrom = stockState.yearTo = "";
      stockState.body = "All";
      $("#vsMake").value = "";
      $("#vsModel").value = "";
      $("#vsYearFrom").value = "";
      $("#vsYearTo").value = "";
      document.querySelectorAll("#vBodyTabs .v-tab").forEach((b) => b.classList.toggle("active", b.dataset.body === "All"));
      applyStockFilter();
    });

    // Deep link: #vehicles?status=SOLD
    const m = (location.hash || "").match(/^#vehicles\?status=([A-Z]+)$/);
    if (m && SITE.vehicles.filters.includes(m[1])) {
      stockState.filter = m[1];
      document.querySelectorAll("#vStatusTabs .v-tab").forEach((b) => b.classList.toggle("active", b.dataset.filter === m[1]));
    }
  }

  async function loadVehicles() {
    try {
      const res = await fetch("api/vehicles", { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      stockState.items = Array.isArray(data.vehicles) ? data.vehicles : [];
    } catch {
      stockState.items = [];
    }
    stockState.loaded = true;
    populateSearch();
    applyStockFilter();
  }

  function renderVehicles() {
    renderStockSectionShell();
    initStockControls();
    loadVehicles();
  }

  /* ---------- Process ---------- */
  function renderProcess() {
    const pr = SITE.process;
    $("#process").innerHTML = `
      <div class="container">
        <div class="sec-head reveal">
          <p class="eyebrow"><span class="line"></span>${esc(pr.eyebrow)}<span class="line"></span></p>
          <h2>${esc(pr.heading)} <span class="gold-text">${esc(pr.headingGold)}</span></h2>
          <p class="sub">${esc(pr.sub)}</p>
        </div>
        <div class="flow reveal">
          ${pr.steps.map((s, i) => `
            <div class="flow-step">
              <div class="flow-icon">${icons[s.icon] || ""}<span class="num">${esc(s.num)}</span></div>
              <h3>${esc(s.title)}</h3>
              <p>${esc(s.text)}</p>
              ${i < pr.steps.length - 1 ? `<span class="flow-arrow">${icons.arrow}</span>` : ""}
            </div>`).join("")}
        </div>
      </div>`;
  }

  /* ---------- Services ---------- */
  function renderServices() {
    const s = SITE.services;
    $("#services").innerHTML = `
      <div class="container">
        <div class="sec-head reveal">
          <p class="eyebrow"><span class="line"></span>${esc(s.eyebrow)}<span class="line"></span></p>
          <h2>${esc(s.heading)} <span class="gold-text">${esc(s.headingGold)}</span></h2>
          <p class="sub">${esc(s.sub)}</p>
        </div>
        <div class="grid-3 reveal">
          ${s.items.map((it) => `
            <div class="service">${icons[it.icon] || ""}<h3>${esc(it.title)}</h3><p>${esc(it.text)}</p></div>`).join("")}
        </div>
        <div class="strip reveal">${s.strip.map((x) => `<span>${esc(x)}</span>`).join("")}</div>
      </div>`;
  }

  /* ---------- Global reach ---------- */
  function renderGlobal() {
    const g = SITE.global, m = g.map;
    const routes = m.routes.nodes.map((n, i) =>
      `<path class="arc" d="M${m.routes.origin.x} ${m.routes.origin.y} Q ${(n.x + m.routes.origin.x) / 2 + (i % 2 ? -70 : 70)} ${(n.y + m.routes.origin.y) / 2 - 40} ${n.x} ${n.y}"/>`).join("");
    const dots = m.routes.nodes.map((n) => `<circle cx="${n.x}" cy="${n.y}" r="4"/>`).join("");
    const labels = m.routes.nodes.map((n) => `<text x="${n.x}" y="${n.labelY}" text-anchor="middle">${esc(n.label)}</text>`).join("");

    $("#global").innerHTML = `
      <div class="container global-grid">
        <div class="global-copy reveal">
          <p class="eyebrow"><span class="line"></span>${esc(g.eyebrow)}</p>
          <h2>${esc(g.heading)} <span class="gold-text">${esc(g.headingGold)}</span></h2>
          <p>${esc(g.paragraph)}</p>
          <div class="chips">${g.chips.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>
        </div>
        <div class="map-wrap reveal">
          <svg viewBox="0 0 760 520" class="map" role="img" aria-label="Export routes from Japan">
            <defs><radialGradient id="jpGlow"><stop offset="0" stop-color="rgba(246,227,164,.85)"/><stop offset="1" stop-color="rgba(212,175,55,0)"/></radialGradient></defs>
            <g fill="none" stroke="#d4af37" stroke-width="1.4" opacity=".85">${routes}</g>
            <g fill="#f1d789">${dots}</g>
            <circle cx="${m.routes.origin.x}" cy="${m.routes.origin.y}" r="30" fill="url(#jpGlow)"/>
            <circle cx="${m.routes.origin.x}" cy="${m.routes.origin.y}" r="6" fill="#f6e3a4"/>
            <g fill="#e8e2d2" font-family="Jost, sans-serif" font-size="15" letter-spacing="2.5">${labels}
              <text x="${m.routes.origin.x + 20}" y="${m.routes.origin.y - 22}" fill="#d4af37" font-family="Cinzel, serif" font-size="17" letter-spacing="3">${esc(m.originLabel)}</text>
            </g>
          </svg>
        </div>
      </div>`;
  }

  /* ---------- Contact / inquiry ---------- */
  function renderContact() {
    const c = SITE.contact;
    $("#contact").innerHTML = `
      <div class="container">
        <div class="sec-head reveal">
          <p class="eyebrow"><span class="line"></span>${esc(c.eyebrow)}<span class="line"></span></p>
          <h2>${esc(c.heading)} <span class="gold-text">${esc(c.headingGold)}</span></h2>
          <p class="sub">${esc(c.sub)}</p>
        </div>
        <div class="contact-grid">
          <div class="reveal">
            ${c.cards.map((card) => `
              <div class="c-card"><div class="ring">${icons[card.icon] || ""}</div><div>
                <h4>${esc(card.label)}</h4>${card.href ? `<a href="${esc(card.href)}" ${String(card.href).startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${esc(card.value)}</a>` : `<p>${esc(card.value)}</p>`}
              </div></div>`).join("")}
            <p class="wa-note">${icons.whatsapp} ${esc(c.form.waFallbackNote)} <a href="${esc(waLink())}" target="_blank" rel="noopener">Open WhatsApp</a></p>
          </div>
          <form id="inquiryForm" class="reveal" novalidate>
            <div class="form-row">
              <div class="field"><label for="in-name">Full Name *</label><input id="in-name" name="name" type="text" required placeholder="Your full name"></div>
              <div class="field"><label for="in-company">Company Name (optional)</label><input id="in-company" name="company" type="text" placeholder="Your company"></div>
            </div>
            <div class="form-row">
              <div class="field"><label for="in-country">Country *</label><input id="in-country" name="country" type="text" required placeholder="e.g. Canada"></div>
              <div class="field"><label for="in-email">Email *</label><input id="in-email" name="email" type="email" required placeholder="you@example.com"></div>
            </div>
            <div class="form-row">
              <div class="field"><label for="in-phone">WhatsApp / Phone Number *</label><input id="in-phone" name="phone" type="tel" required placeholder="+1 234 567 890"></div>
              <div class="field"><label for="in-vehicle">Vehicle Interested In</label><input id="in-vehicle" name="vehicle" type="text" placeholder="e.g. Toyota Harrier Hybrid 2021"></div>
            </div>
            <div class="form-row">
              <div class="field"><label for="in-stock">Stock Number</label><input id="in-stock" name="stock" type="text" placeholder="e.g. NS-1001"></div>
              <div class="field"><label for="in-port">Destination Port</label><input id="in-port" name="port" type="text" placeholder="e.g. Montreal, Canada"></div>
            </div>
            <div class="field"><label for="in-message">Message</label><textarea id="in-message" name="message" placeholder="Tell us your budget, requirements and any questions..."></textarea></div>
            <button type="submit" class="btn btn-gold btn-wide">${esc(c.form.submitLabel)}</button>
          </form>
        </div>
      </div>`;
  }

  function initContactForm() {
    const form = $("#inquiryForm");
    if (!form) return;

    // Prefill from query params (vehicle detail page "Inquire Now")
    const qp = new URLSearchParams(location.search);
    if (qp.get("stock")) form.querySelector('[name="stock"]').value = qp.get("stock");
    if (qp.get("vehicle")) form.querySelector('[name="vehicle"]').value = qp.get("vehicle");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const g = (k) => String(fd.get(k) || "").trim();
      const subject = encodeURIComponent("Vehicle Inquiry — " + (g("name") || "Website"));
      const body = encodeURIComponent(
        "Name: " + g("name") +
        "\nCompany: " + g("company") +
        "\nCountry: " + g("country") +
        "\nEmail: " + g("email") +
        "\nWhatsApp / Phone: " + g("phone") +
        "\nVehicle Interested In: " + g("vehicle") +
        "\nStock Number: " + g("stock") +
        "\nDestination Port: " + g("port") +
        "\n\nMessage:\n" + g("message")
      );
      window.location.href = "mailto:" + SITE.contactInfo.emailHref + "?subject=" + subject + "&body=" + body;
    });
  }

  /* ---------- Bank / payment information ---------- */
  function renderBank() {
    const b = SITE.bank;
    $("#bank").innerHTML = `
      <div class="container">
        <div class="sec-head reveal">
          <p class="eyebrow"><span class="line"></span>${esc(b.eyebrow)}<span class="line"></span></p>
          <h2>${esc(b.heading)} <span class="gold-text">${esc(b.headingGold)}</span></h2>
          <p class="sub">${esc(b.sub)}</p>
        </div>
        <div class="bank-panel reveal">
          <div class="bank-head">${icons.bank}<h3>${esc(SITE.brand.legalName)}</h3></div>
          <dl class="bank-grid">
            ${b.fields.map((f) => `
              <div class="bank-field">
                <dt>${esc(f.label)}</dt>
                <dd class="${f.value ? "" : "is-pending"}">${esc(f.value || b.pendingLabel)}</dd>
              </div>`).join("")}
          </dl>
          <div class="bank-notice">${icons.alert}<p>${esc(b.notice)}</p></div>
        </div>
      </div>`;
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const f = SITE.footer, c = SITE.contactInfo;
    const year = new Date().getFullYear();
    $("#footer").innerHTML = `
      <div class="container foot-grid">
        <div>
          <div class="foot-brand">${mono()}<span class="brand-text">${esc(SITE.brand.noun)}</span></div>
          <p>${esc(f.tagline)}</p>
          <div class="foot-social">
            ${c.socials.map((s) => `<a href="${esc(s.href)}" aria-label="${esc(s.label)}" ${String(s.href).startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${icons[s.icon] || ""}</a>`).join("")}
          </div>
          <p class="foot-tag">${esc(f.motto)}</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          ${f.quickLinks.map((l) => `<a href="${prefix}${esc(l.href)}">${esc(l.label)}</a>`).join("")}
        </div>
        <div>
          <h4>Contact</h4>
          <p class="foot-co"><b>${esc(SITE.brand.legalName)}</b></p>
          <p>${esc(c.address)}</p>
          <a href="tel:${esc(c.phoneHref)}">${esc(c.phone)}</a>
          <a href="mailto:${esc(c.emailHref)}">${esc(c.email)}</a>
          <a href="${esc(waLink())}" target="_blank" rel="noopener">WhatsApp: ${esc(c.whatsapp)}</a>
          <p class="foot-hours">${esc(c.hours)}</p>
        </div>
      </div>
      <div class="foot-bottom"><div class="container" style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem">
        <span>&copy; <span id="year">${year}</span> <b>${esc(SITE.brand.legalName)}</b>. All rights reserved.</span>
        <span><b>Japan Quality.</b> Global Trust.</span>
      </div></div>`;
  }

  /* ---------- Floating WhatsApp ---------- */
  function renderWaFloat() {
    const el = $("#waFloat");
    if (!el) return;
    el.innerHTML = `<a class="wa-float" href="${esc(waLink())}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${icons.whatsapp}</a>`;
  }

  /* ---------- Vehicle detail page ---------- */
  const SPEC_ROWS = [
    ["Stock Number", (v) => v.stockNo],
    ["Make", (v) => v.make],
    ["Model", (v) => v.model],
    ["Year", (v) => v.year],
    ["Mileage", (v) => v.mileage ? Number(v.mileage).toLocaleString("en-US") + " km" : ""],
    ["Engine Size", (v) => v.engine],
    ["Fuel Type", (v) => v.fuel],
    ["Transmission", (v) => v.transmission],
    ["Body Type", (v) => v.bodyType],
    ["Color", (v) => v.color],
    ["Chassis / Model Code", (v) => v.chassis],
    ["Auction Grade", (v) => v.auctionGrade],
    ["Destination Country", (v) => v.status === "SOLD" ? v.destination : ""],
    ["Status", (v) => v.status]
  ];

  async function renderVehicleDetail() {
    const wrap = $("#vehicle-detail");
    const id = new URLSearchParams(location.search).get("id");
    if (!id) { wrap.innerHTML = '<div class="container"><p class="v-empty">Vehicle not found.</p></div>'; return; }

    let v = null;
    try {
      const res = await fetch("api/vehicles/" + encodeURIComponent(id), { headers: { Accept: "application/json" } });
      if (res.ok) v = (await res.json()).vehicle;
    } catch { /* handled below */ }

    if (!v) {
      wrap.innerHTML = `<div class="container"><div class="sec-head"><h2>Vehicle Not Found</h2>
        <p class="sub">This vehicle may have been removed from our stock list.</p>
        <a class="btn btn-gold" href="index.html#vehicles">Browse All Vehicles</a></div></div>`;
      return;
    }

    document.title = vehicleFullName(v) + " — " + (v.stockNo || "") + " | N.S. Corporation";

    const photos = (v.photos && v.photos.length ? v.photos : ["assets/img/stock-placeholder.svg"]);
    const isSold = v.status === "SOLD";

    const specRows = SPEC_ROWS
      .map(([label, get]) => [label, get(v)])
      .filter(([, val]) => val !== "" && val != null)
      .map(([label, val]) => `<div class="spec-row"><span>${esc(label)}</span><b>${esc(val)}</b></div>`).join("");

    const ctas = isSold ? `
        <div class="vd-ctas">
          <p class="vd-sold-cta">Looking for a similar vehicle? Contact us.</p>
          <div class="vd-cta-row">
            <a class="btn btn-wa" target="_blank" rel="noopener" href="${esc(waLink("Hello N.S. CORPORATION, I saw Stock No. " + (v.stockNo || "") + " (" + vehicleFullName(v) + ") which is sold. Please find me a similar vehicle."))}">${icons.whatsapp}<span>WhatsApp Us</span></a>
            <a class="btn btn-gold" href="index.html?stock=${encodeURIComponent(v.stockNo || "")}&vehicle=${encodeURIComponent(vehicleFullName(v))}#contact">Contact Us</a>
          </div>
        </div>` : `
        <div class="vd-ctas">
          <div class="vd-cta-row">
            <a class="btn btn-gold" href="index.html?stock=${encodeURIComponent(v.stockNo || "")}&vehicle=${encodeURIComponent(vehicleFullName(v))}#contact">Inquire Now</a>
            <a class="btn btn-wa" target="_blank" rel="noopener" href="${esc(waLink(waVehicleMessage(v)))}">${icons.whatsapp}<span>WhatsApp Us</span></a>
          </div>
        </div>`;

    const approxUsd = (!v.hidePrice && v.fobPrice && v.currency !== "USD")
      ? `<small class="vd-approx">&asymp; $${Math.round(Number(v.fobPrice) / SITE.vehicles.currency.jpyPerUsd).toLocaleString("en-US")} USD (rate: ${SITE.vehicles.currency.jpyPerUsd} JPY/USD)</small>`
      : "";

    wrap.innerHTML = `
      <div class="container">
        <a class="vd-back" href="index.html#vehicles">&larr; Back to All Vehicles</a>
        <div class="vd-grid">
          <div class="vd-gallery reveal">
            <div class="vd-main"><img id="vdMainImg" src="${esc(photos[0])}" alt="${esc(vehicleFullName(v))}"></div>
            ${photos.length > 1 ? `<div class="vd-thumbs">${photos.map((p, i) =>
              `<button class="vd-thumb${i === 0 ? " active" : ""}" data-src="${esc(p)}"><img src="${esc(p)}" alt="Photo ${i + 1}" loading="lazy"></button>`).join("")}</div>` : ""}
          </div>
          <div class="vd-info reveal">
            <div class="vd-topline">${statusBadge(v.status)}<span class="vd-stockno">Stock No. ${esc(v.stockNo || "—")}</span></div>
            <h1>${esc(vehicleName(v))}</h1>
            <p class="v-meta">${esc(metaLine(v))}</p>
            <div class="vd-price"><span>${esc(priceLabel(v))}</span>${approxUsd}</div>
            <div class="spec-table">${specRows}</div>
            ${ctas}
          </div>
        </div>
        ${v.description ? `
        <div class="vd-desc reveal">
          <h2>Vehicle Description</h2>
          <p>${esc(v.description)}</p>
        </div>` : ""}
      </div>`;

    // this content is rendered after the scroll observer has run — show it directly
    requestAnimationFrame(() => wrap.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible")));

    // On vehicle pages the floating WhatsApp button pre-fills this vehicle's stock message
    const float = document.querySelector(".wa-float");
    if (float) float.href = waLink(waVehicleMessage(v));

    const mainImg = $("#vdMainImg");
    wrap.querySelectorAll(".vd-thumb").forEach((t) => t.addEventListener("click", () => {
      mainImg.src = t.dataset.src;
      wrap.querySelectorAll(".vd-thumb").forEach((x) => x.classList.toggle("active", x === t));
    }));
  }

  /* ---------- Render all ---------- */
  function render() {
    renderTopbar();
    renderNav();
    renderWaFloat();
    if (PAGE === "vehicle") {
      renderVehicleDetail();
    } else {
      renderHero();
      renderAbout();
      renderVehicles();
      renderProcess();
      renderServices();
      renderGlobal();
      renderContact();
      renderBank();
      initContactForm();
    }
    renderFooter();
    initInteractions();
  }

  /* ---------- Interactions ---------- */
  function initInteractions() {
    const nav = $("#nav");
    window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 30));

    const burger = $("#burger"), links = $("#links");
    burger.addEventListener("click", () => { links.classList.toggle("open"); burger.classList.toggle("active"); });
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { links.classList.remove("open"); burger.classList.remove("active"); }));

    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }), { threshold: .12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    function runCount(el) {
      const t = +el.dataset.count, d = 1600, t0 = performance.now();
      const plain = t > 1900; // years count up plainly, large numbers use locale format
      (function tick(now) {
        const p = Math.min((now - t0) / d, 1), e = 1 - Math.pow(1 - p, 3);
        const val = Math.round(t * e);
        el.textContent = plain ? String(val) : val.toLocaleString("en-US");
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }
    const cio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); } }), { threshold: .6 });
    document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));
  }

  if (typeof SITE !== "undefined") render();
})();
