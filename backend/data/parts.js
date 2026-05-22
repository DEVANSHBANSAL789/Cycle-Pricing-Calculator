

const parts = [
  
  {
    id: "steel_frame",
    name: "Steel Frame",
    component: "Frame",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: "2016-11-30", price: 1100 },
      { validFrom: "2016-12-01", validUntil: null, price: 1200 }, // null = still current
    ],
  },
  {
    id: "aluminium_frame",
    name: "Aluminium Frame",
    component: "Frame",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: "2016-11-30", price: 1800 },
      { validFrom: "2016-12-01", validUntil: null, price: 1950 },
    ],
  },

  {
    id: "standard_handlebar",
    name: "Standard Handlebar",
    component: "Handle Bar & Brakes",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: null, price: 350 },
    ],
  },
  {
    id: "v_brakes",
    name: "V-Brakes",
    component: "Handle Bar & Brakes",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: "2016-11-30", price: 450 },
      { validFrom: "2016-12-01", validUntil: null, price: 500 },
    ],
  },
  {
    id: "disc_brakes",
    name: "Disc Brakes",
    component: "Handle Bar & Brakes",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: "2016-11-30", price: 750 },
      { validFrom: "2016-12-01", validUntil: null, price: 850 },
    ],
  },


  {
    id: "basic_saddle",
    name: "Basic Saddle",
    component: "Seating",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: null, price: 400 },
    ],
  },
  {
    id: "ergonomic_saddle",
    name: "Ergonomic Saddle",
    component: "Seating",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: "2016-11-30", price: 700 },
      { validFrom: "2016-12-01", validUntil: null, price: 780 },
    ],
  },


  {
    id: "standard_rim",
    name: "Standard Rim",
    component: "Wheels",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: null, price: 380 },
    ],
  },
  {
    id: "tube",
    name: "Tube",
    component: "Wheels",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: "2016-11-30", price: 120 },
      { validFrom: "2016-12-01", validUntil: null, price: 130 },
    ],
  },
  {
    id: "standard_tyre",
    name: "Standard Tyre",
    component: "Wheels",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: "2016-11-30", price: 200 },
      { validFrom: "2016-12-01", validUntil: null, price: 230 },
    ],
  },
  {
    id: "tubeless_tyre",
    name: "Tubeless Tyre",
    component: "Wheels",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: "2016-11-30", price: 450 },
      { validFrom: "2016-12-01", validUntil: null, price: 520 },
    ],
  },
  {
    id: "spokes",
    name: "Spokes (Set)",
    component: "Wheels",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: null, price: 150 },
    ],
  },

  {
    id: "single_speed_chain",
    name: "Single Speed Chain",
    component: "Chain Assembly",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: null, price: 300 },
    ],
  },
  {
    id: "4_gear_assembly",
    name: "4-Gear Assembly",
    component: "Chain Assembly",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: "2016-11-30", price: 850 },
      { validFrom: "2016-12-01", validUntil: null, price: 950 },
    ],
  },
  {
    id: "7_gear_assembly",
    name: "7-Gear Assembly",
    component: "Chain Assembly",
    priceHistory: [
      { validFrom: "2015-01-01", validUntil: "2016-11-30", price: 1400 },
      { validFrom: "2016-12-01", validUntil: null, price: 1550 },
    ],
  },
];

module.exports = parts;
