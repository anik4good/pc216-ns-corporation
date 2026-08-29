/* ============================================================
   N.S. CORPORATION — JSON DATA STORE
   ------------------------------------------------------------
   Vehicles live in data/db.json (atomic writes). The file is
   created with two example vehicles on first boot. Mount
   ./data as a volume in Docker so data survives redeploys.
   ============================================================ */

const fs = require("fs");
const path = require("path");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function seed() {
  const now = new Date().toISOString();
  const db = {
    vehicles: [
      {
        id: "v-harrier-1001",
        stockNo: "NS-1001",
        make: "Toyota",
        model: "Harrier Hybrid",
        year: 2021,
        mileage: 45000,
        engine: "2490 cc",
        fuel: "Hybrid",
        transmission: "Automatic",
        color: "Pearl White",
        chassis: "ZSU80W",
        auctionGrade: "4.5",
        fobPrice: 2450000,
        currency: "JPY",
        hidePrice: false,
        status: "AVAILABLE",
        destination: "",
        description: "Example listing created automatically on first start. Edit or delete it from the admin panel and add your real vehicles.",
        photos: [],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "v-alphard-1002",
        stockNo: "NS-1002",
        make: "Toyota",
        model: "Alphard Executive Lounge",
        year: 2020,
        mileage: 38000,
        engine: "2490 cc",
        fuel: "Petrol",
        transmission: "Automatic",
        color: "Black",
        chassis: "AGH30W",
        auctionGrade: "4.5",
        fobPrice: 4300000,
        currency: "JPY",
        hidePrice: true,
        status: "SOLD",
        destination: "New Zealand",
        description: "Example SOLD listing — the vehicle stays on the website with a SOLD badge and the price hidden.",
        photos: [],
        createdAt: now,
        updatedAt: now
      }
    ]
  };
  save(db);
  return db;
}

function load() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(DB_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
      if (parsed && Array.isArray(parsed.vehicles)) return parsed;
      console.error("data/db.json has an unexpected shape — reseeding.");
    } catch (e) {
      console.error("Could not parse data/db.json — reseeding:", e.message);
    }
  }
  return seed();
}

function save(data) {
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

module.exports = { load, save, DATA_DIR };
