/* ============================================================
   N.S. CORPORATION — SERVER
   ------------------------------------------------------------
   One Node process serves:
     /               the public website (index.html, vehicle.html)
     /admin          the vehicle management panel (login required)
     /api/vehicles   public read, admin write (session cookie)
     /api/upload     admin photo uploads -> data/uploads
     /uploads        the uploaded photos
   ============================================================ */

const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const store = require("./store");

const PORT = process.env.PORT || 8084;
const ROOT = path.join(__dirname, "..");
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ns-admin-2026";
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

const db = store.load();
const UPLOAD_DIR = path.join(store.DATA_DIR, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(session({
  name: "ns.sid",
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 12 }
}));

/* ---------- helpers ---------- */
const STATUSES = ["AVAILABLE", "RESERVED", "SOLD"];
const STATUS_ORDER = { AVAILABLE: 0, RESERVED: 1, SOLD: 2 };

function safeEq(a, b) {
  const ba = Buffer.from(String(a)), bb = Buffer.from(String(b));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

function requireAuth(req, res, next) {
  if (req.session && req.session.authed) return next();
  res.status(401).json({ error: "Not signed in" });
}

function pickVehicleFields(body) {
  const str = (v) => String(v ?? "").trim();
  return {
    stockNo: str(body.stockNo),
    make: str(body.make),
    model: str(body.model),
    year: body.year ? parseInt(body.year, 10) || "" : "",
    mileage: body.mileage ? parseInt(body.mileage, 10) || "" : "",
    engine: str(body.engine),
    fuel: str(body.fuel),
    transmission: str(body.transmission),
    color: str(body.color),
    chassis: str(body.chassis),
    auctionGrade: str(body.auctionGrade),
    fobPrice: body.fobPrice ? parseInt(body.fobPrice, 10) || "" : "",
    currency: str(body.currency) || "JPY",
    hidePrice: !!body.hidePrice,
    status: STATUSES.includes(body.status) ? body.status : "AVAILABLE",
    destination: str(body.destination),
    description: str(body.description),
    photos: Array.isArray(body.photos) ? body.photos.map(String).filter(Boolean) : []
  };
}

function sortVehicles(list) {
  return list.slice().sort((a, b) =>
    (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) ||
    String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
}

function removePhotos(urls) {
  urls.forEach((u) => {
    const base = path.basename(String(u));
    const file = path.join(UPLOAD_DIR, base);
    if (path.dirname(file) === UPLOAD_DIR && fs.existsSync(file)) {
      try { fs.unlinkSync(file); } catch { /* ignore */ }
    }
  });
}

/* ---------- auth ---------- */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  if (safeEq(username || "", ADMIN_USER) && safeEq(password || "", ADMIN_PASSWORD)) {
    req.session.authed = true;
    return res.json({ ok: true });
  }
  res.status(401).json({ error: "Wrong username or password" });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/session", (req, res) => {
  res.json({ authenticated: !!(req.session && req.session.authed) });
});

/* ---------- vehicle API ---------- */
app.get("/api/vehicles", (req, res) => {
  res.json({ vehicles: sortVehicles(db.vehicles) });
});

app.get("/api/vehicles/:id", (req, res) => {
  const v = db.vehicles.find((x) => x.id === req.params.id);
  if (!v) return res.status(404).json({ error: "Vehicle not found" });
  res.json({ vehicle: v });
});

app.post("/api/vehicles", requireAuth, (req, res) => {
  const fields = pickVehicleFields(req.body);
  if (!fields.make && !fields.model) return res.status(400).json({ error: "Make or model is required" });
  const now = new Date().toISOString();
  const vehicle = {
    id: "v-" + Date.now().toString(36) + crypto.randomBytes(3).toString("hex"),
    ...fields,
    createdAt: now,
    updatedAt: now
  };
  db.vehicles.push(vehicle);
  store.save(db);
  res.status(201).json({ vehicle });
});

app.put("/api/vehicles/:id", requireAuth, (req, res) => {
  const v = db.vehicles.find((x) => x.id === req.params.id);
  if (!v) return res.status(404).json({ error: "Vehicle not found" });
  const fields = pickVehicleFields(req.body);
  // delete photo files that were removed from the listing
  removePhotos(v.photos.filter((p) => !fields.photos.includes(p)));
  Object.assign(v, fields, { id: v.id, createdAt: v.createdAt, updatedAt: new Date().toISOString() });
  store.save(db);
  res.json({ vehicle: v });
});

app.delete("/api/vehicles/:id", requireAuth, (req, res) => {
  const i = db.vehicles.findIndex((x) => x.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: "Vehicle not found" });
  removePhotos(db.vehicles[i].photos || []);
  db.vehicles.splice(i, 1);
  store.save(db);
  res.json({ ok: true });
});

/* ---------- photo upload ---------- */
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
      const ext = (path.extname(file.originalname) || ".jpg").toLowerCase().slice(0, 8);
      cb(null, Date.now().toString(36) + "-" + crypto.randomBytes(4).toString("hex") + ext);
    }
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpe?g|png|webp|gif|avif)$/i.test(file.mimetype)) return cb(null, true);
    cb(new Error("Only JPG, PNG, WEBP, GIF or AVIF images are allowed"));
  }
});

app.post("/api/upload", requireAuth, upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No photo received" });
  res.status(201).json({ url: "/uploads/" + req.file.filename });
});

/* ---------- static ---------- */
app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "30d", immutable: true }));
app.use("/admin", express.static(path.join(ROOT, "admin")));
app.use(express.static(ROOT, { extensions: ["html"] }));

// clean JSON errors for upload problems (wrong file type, too large, bad JSON)
app.use((err, req, res, next) => {
  if (err) return res.status(err.status || 400).json({ error: err.message || "Bad request" });
  next();
});

app.listen(PORT, () => {
  console.log(`N.S. Corporation running  ->  http://localhost:${PORT}`);
  console.log(`Vehicle admin panel       ->  http://localhost:${PORT}/admin  (user: ${ADMIN_USER})`);
});
