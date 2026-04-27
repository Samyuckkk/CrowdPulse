require('dotenv').config();
const mongoose = require('mongoose');
const zoneModel = require('../models/zone.model');
const connectionModel = require('../models/connections.model');

const zonesData = [
  { code: "z1", name: "Main Entrance", type: "entry", bbox: { x: 0.05, y: 0.15, w: 0.15, h: 0.15 } },
  { code: "z2", name: "North Exit", type: "exit", bbox: { x: 0.45, y: 0.05, w: 0.1, h: 0.08 } },
  { code: "z3", name: "East Exit", type: "exit", bbox: { x: 0.9, y: 0.45, w: 0.08, h: 0.1 } },
  { code: "z4", name: "South Exit", type: "exit", bbox: { x: 0.5, y: 0.85, w: 0.1, h: 0.08 } },
  { code: "z5", name: "West Exit", type: "exit", bbox: { x: 0.1, y: 0.6, w: 0.08, h: 0.1 } },
  { code: "z6", name: "Main Stage Area", type: "stage", bbox: { x: 0.35, y: 0.2, w: 0.3, h: 0.25 } },
  { code: "z7", name: "Secondary Stage", type: "stage", bbox: { x: 0.7, y: 0.35, w: 0.2, h: 0.2 } },
  { code: "z8", name: "DJ Tent", type: "stage", bbox: { x: 0.7, y: 0.65, w: 0.2, h: 0.2 } },
  { code: "z9", name: "Food Plaza", type: "food", bbox: { x: 0.45, y: 0.5, w: 0.2, h: 0.2 } },
  { code: "z10", name: "Market", type: "market", bbox: { x: 0.25, y: 0.45, w: 0.2, h: 0.2 } },
  { code: "z11", name: "Activation Zone", type: "activity", bbox: { x: 0.4, y: 0.75, w: 0.3, h: 0.15 } },
  { code: "z12", name: "Parking", type: "parking", bbox: { x: 0.05, y: 0.35, w: 0.2, h: 0.25 } },
  { code: "z13", name: "Camping", type: "camping", bbox: { x: 0.2, y: 0.85, w: 0.3, h: 0.15 } },
  { code: "z14", name: "Service Road", type: "service", bbox: { x: 0.8, y: 0.5, w: 0.15, h: 0.3 } },
  { code: "z15", name: "Medical", type: "medical", bbox: { x: 0.6, y: 0.75, w: 0.1, h: 0.1 } },
  { code: "z16", name: "Emergency Bays", type: "emergency", bbox: { x: 0.6, y: 0.6, w: 0.15, h: 0.2 } }
];

const connectionsData = [
  { from: "z1", to: "z10", distance: 1 },
  { from: "z1", to: "z12", distance: 1 },
  { from: "z10", to: "z9", distance: 1 },
  { from: "z10", to: "z5", distance: 1 },
  { from: "z9", to: "z6", distance: 1 },
  { from: "z9", to: "z11", distance: 1 },
  { from: "z9", to: "z7", distance: 1 },
  { from: "z6", to: "z2", distance: 1 },
  { from: "z7", to: "z3", distance: 1 },
  { from: "z8", to: "z4", distance: 1 },
];

async function seed() {
  await mongoose.connect(process.env.MongoDB_URI);

  const eventId = "69ee71a975d4405078ad522d"; 

  // 1️⃣ Insert zones
  const zones = await zoneModel.insertMany(
    zonesData.map(z => ({ ...z, eventId }))
  );

  // 2️⃣ Create map: code → _id
  const zoneMap = {};
  zones.forEach(z => {
    zoneMap[z.code] = z._id;
  });

  // 3️⃣ Insert connections
  const connections = connectionsData.map(c => ({
    eventId,
    from: zoneMap[c.from],
    to: zoneMap[c.to],
    distance: c.distance
  }));

  await connectionModel.insertMany(connections);

  console.log("✅ Zones & Connections seeded!");
  process.exit();
}

seed();