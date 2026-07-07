// ===================================================
// 🌌💀 THE DOOMSDAY VAULT API 💀🌌
// Project 2 — Backend API Development
// ===================================================
// Features:
// 1. Time-locked "Vault" messages (message to your future self)
// 2. Anonymous confessions wall
// 3. Random apocalypse scenario generator
// ===================================================

const express = require("express");
const app = express();
app.use(express.json());

// ===================================================
// IN-MEMORY "DATABASE"
// ===================================================
let vaults = [];       // time-locked messages
let confessions = [];  // anonymous confessions
let nextVaultId = 1;
let nextConfessionId = 1;

// ===================================================
// APOCALYPSE SCENARIOS (for the random generator)
// ===================================================
const scenarios = [
  "🧟 Zombie outbreak begins in a fast-food chain. Cause: undercooked nuggets.",
  "👽 Aliens land, take one look at Earth's WiFi speed, and leave immediately.",
  "🌋 Super-volcano erupts. Silver lining: free ash exfoliation for everyone.",
  "🤖 AI becomes sentient, immediately quits to become a poet instead.",
  "🌊 Oceans rise 1 inch. Beach towels declared a national resource.",
  "🐝 Bees unionize and demand better working conditions. Honey prices soar.",
  "🌑 The sun takes a day off. Everyone discovers what stars actually look like.",
  "🦖 Dinosaurs return via time portal, immediately start a podcast."
];

// ===================================================
// ROOT — welcome message
// ===================================================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to The Doomsday Vault 🌌💀",
    endpoints: [
      "GET  /doomsday          -> random apocalypse scenario",
      "POST /vault              -> lock a message until a future date",
      "GET  /vault/:id          -> try to open a locked message",
      "POST /confessions        -> post an anonymous confession",
      "GET  /confessions        -> get a random confession"
    ]
  });
});

// ===================================================
// 1) GET /doomsday -> random apocalypse scenario
// ===================================================
app.get("/doomsday", (req, res) => {
  const random = scenarios[Math.floor(Math.random() * scenarios.length)];
  res.status(200).json({
    success: true,
    scenario: random
  });
});

// ===================================================
// 2) POST /vault -> create a time-locked message
// Body: { "message": "...", "unlockDate": "2027-01-01" }
// ===================================================
app.post("/vault", (req, res) => {
  const { message, unlockDate } = req.body;

  // ---- VALIDATION ----
  if (!message || message.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "A vault message cannot be empty"
    });
  }

  if (!unlockDate || isNaN(Date.parse(unlockDate))) {
    return res.status(400).json({
      success: false,
      message: "A valid unlockDate is required (e.g. 2027-01-01)"
    });
  }

  const newVault = {
    id: nextVaultId++,
    message: message.trim(),
    unlockDate: new Date(unlockDate).toISOString().split("T")[0],
    createdAt: new Date().toISOString().split("T")[0]
  };

  vaults.push(newVault);

  res.status(201).json({
    success: true,
    message: "Your message has been sealed in the vault 🔒",
    data: { id: newVault.id, unlockDate: newVault.unlockDate }
  });
});

// ===================================================
// 3) GET /vault/:id -> try to open a vault
// Only reveals the message if today's date >= unlockDate
// ===================================================
app.get("/vault/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const vault = vaults.find((v) => v.id === id);

  if (!vault) {
    return res.status(404).json({
      success: false,
      message: "No such vault exists"
    });
  }

  const today = new Date().toISOString().split("T")[0];

  if (today < vault.unlockDate) {
    // 403 = Forbidden (it exists, but you can't access it yet)
    return res.status(403).json({
      success: false,
      message: `🔒 This vault is still sealed. Unlocks on ${vault.unlockDate}`
    });
  }

  res.status(200).json({
    success: true,
    message: "🔓 Vault unlocked!",
    data: vault
  });
});

// ===================================================
// 4) POST /confessions -> post an anonymous confession
// ===================================================
app.post("/confessions", (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Confession text cannot be empty"
    });
  }

  if (text.length > 300) {
    return res.status(400).json({
      success: false,
      message: "Confession too long. Keep it under 300 characters."
    });
  }

  const newConfession = {
    id: nextConfessionId++,
    text: text.trim()
  };

  confessions.push(newConfession);

  res.status(201).json({
    success: true,
    message: "Your secret is safe with the void 🕳️",
    data: newConfession
  });
});

// ===================================================
// 5) GET /confessions -> get one random confession
// ===================================================
app.get("/confessions", (req, res) => {
  if (confessions.length === 0) {
    return res.status(404).json({
      success: false,
      message: "The void is empty. No confessions yet."
    });
  }

  const random = confessions[Math.floor(Math.random() * confessions.length)];
  res.status(200).json({
    success: true,
    data: random
  });
});

// ===================================================
// Catch-all for unknown routes
// ===================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "This route does not exist in this reality."
  });
});

// ===================================================
// Start server
// ===================================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🌌💀 Doomsday Vault running at http://localhost:${PORT}`);
});