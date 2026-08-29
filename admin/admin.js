/* ============================================================
   N.S. CORPORATION — VEHICLE MANAGER (admin logic)
   Talks to /api/* with session-cookie auth.
   ============================================================ */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const STATUSES = ["AVAILABLE", "RESERVED", "SOLD"];
  let vehicles = [];
  let editingId = null;   // null = creating
  let photos = [];        // urls in the open modal

  /* ---------- api helper ---------- */
  async function api(path, opts = {}) {
    const res = await fetch(path, {
      headers: opts.body instanceof FormData ? {} : { "Content-Type": "application/json" },
      ...opts,
      body: opts.body instanceof FormData ? opts.body : opts.body ? JSON.stringify(opts.body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Request failed (" + res.status + ")");
    return data;
  }

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(t._h);
    t._h = setTimeout(() => { t.hidden = true; }, 2600);
  }

  /* ---------- views ---------- */
  function showLogin() {
    $("appView").hidden = true;
    $("loginView").style.display = "grid";
  }

  function showApp() {
    $("loginView").style.display = "none";
    $("appView").hidden = false;
    loadVehicles();
  }

  /* ---------- list ---------- */
  async function loadVehicles() {
    try {
      const data = await api("/api/vehicles");
      vehicles = data.vehicles || [];
    } catch (e) {
      if (e.message.startsWith("Request failed (401)")) return showLogin();
      toast(e.message);
      vehicles = [];
    }
    renderStats();
    renderList();
  }

  function renderStats() {
    const count = (s) => vehicles.filter((v) => v.status === s).length;
    $("stats").innerHTML = `
      <span class="stat-chip">Total <b>${vehicles.length}</b></span>
      <span class="stat-chip st-AVAILABLE">Available <b>${count("AVAILABLE")}</b></span>
      <span class="stat-chip st-RESERVED">Reserved <b>${count("RESERVED")}</b></span>
      <span class="stat-chip st-SOLD">Sold <b>${count("SOLD")}</b></span>`;
  }

  function priceText(v) {
    if (v.hidePrice || !v.fobPrice) return "Price hidden";
    return (v.currency === "USD" ? "$" : "¥") + Number(v.fobPrice).toLocaleString("en-US") + " FOB";
  }

  function renderList() {
    const list = $("list");
    if (!vehicles.length) {
      list.innerHTML = '<div class="empty">No vehicles yet — click “+ Add Vehicle” to create your first listing.</div>';
      return;
    }
    list.innerHTML = vehicles.map((v) => `
      <div class="row" data-id="${esc(v.id)}">
        <img class="row-thumb" src="${esc(v.photos[0] || "/assets/img/stock-placeholder.svg")}" alt="">
        <div class="row-info">
          <div class="row-name">${esc(v.make)} ${esc(v.model)}${v.year ? " " + esc(v.year) : ""}</div>
          <div class="row-sub">Stock ${esc(v.stockNo || "—")}${v.destination && v.status === "SOLD" ? " → " + esc(v.destination) : ""}</div>
        </div>
        <span class="row-price">${esc(priceText(v))}</span>
        <span class="row-status">
          <select class="${esc(v.status)}" data-act="status" aria-label="Change status">
            ${STATUSES.map((s) => `<option ${s === v.status ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </span>
        <span class="row-actions">
          <button class="btn-line" data-act="edit" type="button">Edit</button>
          <button class="btn-line btn-danger" data-act="delete" type="button">Delete</button>
        </span>
      </div>`).join("");
  }

  $("list").addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn || btn.tagName !== "BUTTON") return;
    const id = btn.closest(".row").dataset.id;
    const v = vehicles.find((x) => x.id === id);
    if (!v) return;
    if (btn.dataset.act === "edit") return openModal(v);
    if (btn.dataset.act === "delete") {
      if (!confirm("Delete " + v.make + " " + v.model + " (" + (v.stockNo || "no stock no.") + ")? This also deletes its photos.")) return;
      try { await api("/api/vehicles/" + id, { method: "DELETE" }); toast("Vehicle deleted"); loadVehicles(); }
      catch (err) { toast(err.message); }
    }
  });

  $("list").addEventListener("change", async (e) => {
    const sel = e.target.closest('select[data-act="status"]');
    if (!sel) return;
    const id = sel.closest(".row").dataset.id;
    const v = vehicles.find((x) => x.id === id);
    if (!v || sel.value === v.status) return;
    try {
      await api("/api/vehicles/" + id, { method: "PUT", body: { ...v, status: sel.value } });
      toast("Status changed to " + sel.value);
      loadVehicles();
    } catch (err) {
      toast(err.message);
      sel.value = v.status;
    }
  });

  /* ---------- modal ---------- */
  function openModal(v) {
    editingId = v ? v.id : null;
    photos = v ? (v.photos || []).slice() : [];
    $("modalTitle").textContent = v ? "Edit Vehicle — " + (v.stockNo || v.make + " " + v.model) : "Add Vehicle";
    $("formError").textContent = "";
    $("f-photos").value = "";
    const set = (id, val) => { $(id).value = val ?? ""; };
    set("f-make", v?.make); set("f-model", v?.model); set("f-year", v?.year);
    set("f-mileage", v?.mileage); set("f-engine", v?.engine); set("f-fuel", v?.fuel);
    set("f-transmission", v?.transmission); set("f-color", v?.color); set("f-chassis", v?.chassis);
    set("f-grade", v?.auctionGrade); set("f-stock", v?.stockNo); set("f-dest", v?.destination);
    set("f-price", v?.fobPrice); set("f-currency", v?.currency || "JPY");
    set("f-status", v?.status || "AVAILABLE"); set("f-desc", v?.description);
    $("f-hidePrice").checked = !!(v && v.hidePrice);
    renderThumbs();
    $("modal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    $("modal").hidden = true;
    document.body.style.overflow = "";
    editingId = null;
  }

  $("addBtn").addEventListener("click", () => openModal(null));
  $("closeModal").addEventListener("click", closeModal);
  $("cancelModal").addEventListener("click", closeModal);

  // sold vehicles default to a hidden price (can be unchecked)
  $("f-status").addEventListener("change", () => {
    if ($("f-status").value === "SOLD") $("f-hidePrice").checked = true;
  });

  /* ---------- photos ---------- */
  function renderThumbs() {
    $("photoThumbs").innerHTML = photos.map((p, i) => `
      <div class="thumb"><img src="${esc(p)}" alt="Photo ${i + 1}">
        <button type="button" data-url="${esc(p)}" title="Remove photo">&times;</button>
      </div>`).join("");
  }

  $("photoThumbs").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-url]");
    if (!btn) return;
    photos = photos.filter((u) => u !== btn.dataset.url);
    renderThumbs();
  });

  $("f-photos").addEventListener("change", async (e) => {
    const files = [...e.target.files];
    e.target.value = "";
    for (const file of files) {
      const fd = new FormData();
      fd.append("photo", file);
      try {
        const data = await api("/api/upload", { method: "POST", body: fd });
        photos.push(data.url);
        renderThumbs();
      } catch (err) {
        toast("Upload failed: " + err.message);
      }
    }
  });

  /* ---------- save ---------- */
  $("vehForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const num = (id) => $(id).value.trim() === "" ? "" : $(id).value.trim();
    const body = {
      make: $("f-make").value.trim(),
      model: $("f-model").value.trim(),
      year: num("f-year"),
      mileage: num("f-mileage"),
      engine: $("f-engine").value.trim(),
      fuel: $("f-fuel").value,
      transmission: $("f-transmission").value,
      color: $("f-color").value.trim(),
      chassis: $("f-chassis").value.trim(),
      auctionGrade: $("f-grade").value.trim(),
      stockNo: $("f-stock").value.trim(),
      destination: $("f-dest").value.trim(),
      fobPrice: num("f-price"),
      currency: $("f-currency").value,
      status: $("f-status").value,
      hidePrice: $("f-hidePrice").checked,
      description: $("f-desc").value.trim(),
      photos
    };
    if (!body.make || !body.model) { $("formError").textContent = "Make and model are required."; return; }

    const btn = $("saveBtn");
    btn.disabled = true;
    try {
      if (editingId) {
        await api("/api/vehicles/" + editingId, { method: "PUT", body });
        toast("Vehicle updated");
      } else {
        await api("/api/vehicles", { method: "POST", body });
        toast("Vehicle added");
      }
      closeModal();
      loadVehicles();
    } catch (err) {
      $("formError").textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });

  /* ---------- auth ---------- */
  $("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("loginError").textContent = "";
    try {
      await api("/api/login", { method: "POST", body: { username: $("lg-user").value, password: $("lg-pass").value } });
      showApp();
    } catch (err) {
      $("loginError").textContent = err.message;
    }
  });

  $("logoutBtn").addEventListener("click", async () => {
    try { await api("/api/logout", { method: "POST" }); } catch { /* ignore */ }
    showLogin();
  });

  /* ---------- init ---------- */
  api("/api/session").then((d) => (d.authenticated ? showApp() : showLogin())).catch(showLogin);
})();
