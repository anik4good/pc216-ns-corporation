/* ============================================================
   N.S. CORPORATION — APP / RENDERER
   ------------------------------------------------------------
   Renders SITE (content.js) into the DOM. To wire a dashboard
   later, refresh the SITE data and call render() again.
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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
    ship: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 42h52l-6 10H12z"/><path d="M16 42v-8h12v8"/><path d="M28 42v-8h12v8"/><path d="M40 42v-8h12v8"/><path d="M4 58q4 3 8 0t8 0 8 0 8 0 8 0 8 0 8 0"/></svg>',
    docs: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6h20l10 10v42H18z"/><path d="M38 6v10h10"/><path d="M26 30h20M26 38h20M26 46h12"/></svg>',
    support: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12h44v30H28l-14 10V42H10z"/><path d="M22 27h1M32 27h1M42 27h1"/></svg>',
    phone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.4 19.4 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    mail: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    pin: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="12" r="3"/></svg>'
  };

  /* ---------- Renderers ---------- */
  function renderTopbar() {
    const t = SITE.topbar;
    $("#topbar").innerHTML = `<div class="container topbar-inner">
      <span>&#9670; &nbsp;<b>${esc(t.left)}</b></span>
      <span><b>${esc(t.phone)}</b><span class="dot">&#9670;</span><b>${esc(t.email)}</b></span>
    </div>`;
  }

  function renderNav() {
    const links = SITE.nav.links.map((n) => `<a href="${n.href}" data-link>${esc(n.label)}</a>`).join("");
    const brand = `${mono()}<span class="brand-text">${esc(SITE.brand.noun)}</span>`;
    $("#brand").innerHTML = brand;
    $("#brandMobile") && ($("#brandMobile").innerHTML = brand);
    $("#links").innerHTML = links;
    $("#navCta").innerHTML = `<a href="${SITE.nav.cta.href}" class="btn btn-gold nav-cta">${esc(SITE.nav.cta.label)}</a>`;
  }

  function renderHero() {
    const h = SITE.hero;
    const stats = h.stats.map((s) =>
      `<div class="stat"><strong data-count="${s.num}">0</strong><sup>${esc(s.suffix)}</sup><span>${esc(s.label)}</span></div>`
    ).join("");
    $("#hero").innerHTML = `
      <div class="hero-bg"></div>
      <div class="hero-watermark">NS</div>
      <div class="container hero-inner">
        <p class="eyebrow reveal"><span class="line"></span>${esc(h.overline)}<span class="line"></span></p>
        <h1 class="reveal">${esc(h.title)}<br><span class="gold-text">${esc(h.titleGold)}</span></h1>
        <p class="lead reveal">${esc(h.sub)}</p>
        <div class="hero-cta reveal">
          <a href="${h.primaryCta.href}" class="btn btn-gold">${esc(h.primaryCta.label)}</a>
          <a href="${h.secondaryCta.href}" class="btn btn-ghost">${esc(h.secondaryCta.label)}</a>
        </div>
        <div class="stats reveal">${stats}</div>
      </div>
      <div class="scroll-hint"></div>`;
  }

  function renderPillars() {
    $("#pillars").innerHTML = `<div class="container grid-4 reveal">
      ${SITE.pillars.map((p) => `
        <div class="pillar">${icons[p.icon] || ""}<h3>${esc(p.title)}</h3><div class="rule"></div><p>${esc(p.text)}</p></div>`).join("")}
    </div>`;
  }

  function renderWho() {
    const w = SITE.who, p = w.panel;
    $("#who-we-are").innerHTML = `
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

  function renderServices() {
    const s = SITE.services;
    $("#what-we-do").innerHTML = `
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

  function renderProcess() {
    const pr = SITE.process;
    $("#process").innerHTML = `
      <div class="container">
        <div class="sec-head reveal">
          <p class="eyebrow"><span class="line"></span>${esc(pr.eyebrow)}<span class="line"></span></p>
          <h2>${esc(pr.heading)} <span class="gold-text">${esc(pr.headingGold)}</span></h2>
        </div>
        <div class="steps reveal">${pr.steps.map((s) => `
          <div class="step"><span class="num">${esc(s.num)}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></div>`).join("")}
        </div>
      </div>`;
  }

  function renderGlobal() {
    const g = SITE.global, m = g.map;
    const routes = m.routes.nodes.map((n, i) =>
      `<path class="arc" d="M${m.routes.origin.x} ${m.routes.origin.y} Q ${(n.x + m.routes.origin.x) / 2 + (i % 2 ? -70 : 70)} ${(n.y + m.routes.origin.y) / 2 - 40} ${n.x} ${n.y}"/>`
    ).join("");
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

  function renderTestimonials() {
    const t = SITE.testimonials;
    $("#testimonials").innerHTML = `
      <div class="container">
        <div class="sec-head reveal">
          <p class="eyebrow"><span class="line"></span>${esc(t.eyebrow)}<span class="line"></span></p>
          <h2>${esc(t.heading)} <span class="gold-text">${esc(t.headingGold)}</span></h2>
        </div>
        <div class="grid-3 reveal">
          ${t.items.map((i) => `
            <div class="t-card"><div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <blockquote>&ldquo;${esc(i.quote)}&rdquo;</blockquote>
              <p class="who-name">${esc(i.name)}</p><p class="who-loc">${esc(i.loc)}</p></div>`).join("")}
        </div>
      </div>`;
  }

  function renderContact() {
    const c = SITE.contact, f = c.form;
    const interestOps = f.interestOptions.map((o) => `<option>${esc(o)}</option>`).join("");
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
                <h4>${esc(card.label)}</h4>${card.href ? `<a href="${card.href}">${esc(card.value)}</a>` : `<p>${esc(card.value)}</p>`}
              </div></div>`).join("")}
          </div>
          <form id="inquiryForm" class="reveal" novalidate>
            <div class="form-row">
              <div class="field"><label for="in-name">Full Name</label><input id="in-name" name="name" type="text" required placeholder="Your name"></div>
              <div class="field"><label for="in-email">Email</label><input id="in-email" name="email" type="email" required placeholder="you@example.com"></div>
            </div>
            <div class="form-row">
              <div class="field"><label for="in-country">Country</label><input id="in-country" name="country" type="text" placeholder="e.g. Canada"></div>
              <div class="field"><label for="in-interest">Interested In</label><select id="in-interest" name="interest">${interestOps}</select></div>
            </div>
            <div class="field"><label for="in-message">Message</label><textarea id="in-message" name="message" placeholder="Tell us your budget and the vehicle you're looking for..."></textarea></div>
            <button type="submit" class="btn btn-gold">${esc(f.submitLabel)}</button>
          </form>
        </div>
      </div>`;
  }

  function renderFooter() {
    const f = SITE.footer;
    const year = f._year || new Date().getFullYear();
    $("#footer").innerHTML = `
      <div class="container foot-grid">
        <div>
          <div class="foot-brand">${mono()}<span class="brand-text">${esc(SITE.brand.noun)}</span></div>
          <p>${esc(f.tagline)}</p>
          <p class="foot-tag">${esc(f.motto)}</p>
        </div>
        ${f.cols.map((col) => `
          <div><h4>${esc(col.heading)}</h4>
            ${col.links.map((l) => l.href ? `<a href="${l.href}">${esc(l.label)}</a>` : `<p>${esc(l.label)}</p>`).join("")}
          </div>`).join("")}
      </div>
      <div class="foot-bottom"><div class="container" style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem">
        <span>&copy; <span id="year">${year}</span> <b>${esc(SITE.brand.noun)}</b>. All rights reserved.</span>
        <span><b>Japan Quality.</b> Global Trust.</span>
      </div></div>`;
  }

  /* ---------- Render all ---------- */
  function render() {
    renderTopbar();
    renderNav();
    renderHero();
    renderPillars();
    renderWho();
    renderServices();
    renderProcess();
    renderGlobal();
    renderTestimonials();
    renderContact();
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

    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }), { threshold: .15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    function runCount(el) {
      const t = +el.dataset.count, d = 1600, t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / d, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(t * e).toLocaleString("en-US");
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }
    const cio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); } }), { threshold: .6 });
    document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

    const form = $("#inquiryForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const subject = encodeURIComponent("Vehicle Inquiry — " + (fd.get("name") || ""));
      const body = encodeURIComponent("Name: " + fd.get("name") + "\nEmail: " + fd.get("email") + "\nCountry: " + fd.get("country") + "\nInterested In: " + fd.get("interest") + "\n\nMessage:\n" + fd.get("message"));
      window.location.href = "mailto:" + SITE.topbar.emailHref + "?subject=" + subject + "&body=" + body;
    });
  }

  const year = new Date().getFullYear();
  if (typeof SITE !== "undefined") render();
})();