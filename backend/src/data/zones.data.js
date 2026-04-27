const zones = [
  { "id": "z1", "name": "Main Entrance", "type": "entry", "bbox": { "x": 0.05, "y": 0.15, "w": 0.15, "h": 0.15 } },

  { "id": "z2", "name": "North Exit", "type": "exit", "bbox": { "x": 0.45, "y": 0.05, "w": 0.1, "h": 0.08 } },
  { "id": "z3", "name": "East Exit", "type": "exit", "bbox": { "x": 0.9, "y": 0.45, "w": 0.08, "h": 0.1 } },
  { "id": "z4", "name": "South Exit", "type": "exit", "bbox": { "x": 0.5, "y": 0.85, "w": 0.1, "h": 0.08 } },
  { "id": "z5", "name": "West Exit", "type": "exit", "bbox": { "x": 0.1, "y": 0.6, "w": 0.08, "h": 0.1 } },

  { "id": "z6", "name": "Main Stage Area", "type": "stage", "bbox": { "x": 0.35, "y": 0.2, "w": 0.3, "h": 0.25 } },
  { "id": "z7", "name": "Secondary Stage", "type": "stage", "bbox": { "x": 0.7, "y": 0.35, "w": 0.2, "h": 0.2 } },
  { "id": "z8", "name": "DJ Tent", "type": "stage", "bbox": { "x": 0.7, "y": 0.65, "w": 0.2, "h": 0.2 } },

  { "id": "z9", "name": "Food & Beverage Plaza", "type": "food", "bbox": { "x": 0.45, "y": 0.5, "w": 0.2, "h": 0.2 } },
  { "id": "z10", "name": "Market & Merch", "type": "market", "bbox": { "x": 0.25, "y": 0.45, "w": 0.2, "h": 0.2 } },
  { "id": "z11", "name": "Activation Zone", "type": "activity", "bbox": { "x": 0.4, "y": 0.75, "w": 0.3, "h": 0.15 } },

  { "id": "z12", "name": "General Parking", "type": "parking", "bbox": { "x": 0.05, "y": 0.35, "w": 0.2, "h": 0.25 } },
  { "id": "z13", "name": "Camping Area", "type": "camping", "bbox": { "x": 0.2, "y": 0.85, "w": 0.3, "h": 0.15 } },

  { "id": "z14", "name": "Service Road", "type": "service", "bbox": { "x": 0.8, "y": 0.5, "w": 0.15, "h": 0.3 } },

  { "id": "z15", "name": "Medical Tent", "type": "medical", "bbox": { "x": 0.6, "y": 0.75, "w": 0.1, "h": 0.1 } },
  { "id": "z16", "name": "Emergency Bays", "type": "emergency", "bbox": { "x": 0.6, "y": 0.6, "w": 0.15, "h": 0.2 } }
]

const connections = [
  { "id": "e1", "from": "z1", "to": "z10", "distance": 1 },
  { "id": "e2", "from": "z1", "to": "z12", "distance": 1 },

  { "id": "e3", "from": "z10", "to": "z9", "distance": 1 },
  { "id": "e4", "from": "z10", "to": "z5", "distance": 1 },

  { "id": "e5", "from": "z9", "to": "z6", "distance": 1 },
  { "id": "e6", "from": "z9", "to": "z11", "distance": 1 },
  { "id": "e7", "from": "z9", "to": "z7", "distance": 1 },

  { "id": "e8", "from": "z6", "to": "z2", "distance": 1 },
  { "id": "e9", "from": "z6", "to": "z9", "distance": 1 },

  { "id": "e10", "from": "z7", "to": "z3", "distance": 1 },
  { "id": "e11", "from": "z7", "to": "z14", "distance": 1 },
  { "id": "e12", "from": "z7", "to": "z9", "distance": 1 },

  { "id": "e13", "from": "z8", "to": "z4", "distance": 1 },
  { "id": "e14", "from": "z8", "to": "z11", "distance": 1 },
  { "id": "e15", "from": "z8", "to": "z14", "distance": 1 },

  { "id": "e16", "from": "z11", "to": "z4", "distance": 1 },
  { "id": "e17", "from": "z11", "to": "z13", "distance": 1 },

  { "id": "e18", "from": "z5", "to": "z12", "distance": 1 },
  { "id": "e19", "from": "z12", "to": "z13", "distance": 2 },

  { "id": "e20", "from": "z14", "to": "z3", "distance": 1 },
  { "id": "e21", "from": "z14", "to": "z15", "distance": 1 },
  { "id": "e22", "from": "z14", "to": "z16", "distance": 1 },

  { "id": "e23", "from": "z15", "to": "z4", "distance": 1 },
  { "id": "e24", "from": "z16", "to": "z7", "distance": 1 }
]

module.exports = {
    zones,
    connections
}