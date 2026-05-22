// pricingService.test.js
// Jest unit tests for the core pricing logic.
// Run with: npm test (inside /backend)

const { getPriceForDate, calculateCyclePrice } = require("../services/pricingService");
const parts = require("../data/parts");

// Helper: get a part object by ID (same way the service does it)
function getPartById(id) {
  return parts.find((p) => p.id === id);
}

// ── Test 1 ────────────────────────────────────────────────────────────────────
// tubeless_tyre should return the OLD price (450) before 2016-12-01
test("tubeless_tyre returns old price (450) before 2016-12-01", () => {
  const tubelessTyre = getPartById("tubeless_tyre");
  const price = getPriceForDate(tubelessTyre, "2016-11-15"); // November — old range
  expect(price).toBe(450);
});

// ── Test 2 ────────────────────────────────────────────────────────────────────
// tubeless_tyre should return the NEW price (520) on or after 2016-12-01
test("tubeless_tyre returns new price (520) on or after 2016-12-01", () => {
  const tubelessTyre = getPartById("tubeless_tyre");
  const price = getPriceForDate(tubelessTyre, "2016-12-15"); // December — new range
  expect(price).toBe(520);
});

// ── Test 3 ────────────────────────────────────────────────────────────────────
// calculateCyclePrice should return correct totals and component breakdown
// Using the exact example from the assignment spec (date: 2016-12-15)
test("calculateCyclePrice returns correct total and component breakdown", () => {
  const selectedParts = [
    "steel_frame",         // Frame: 1200
    "standard_handlebar",  // Handle Bar & Brakes: 350
    "v_brakes",            // Handle Bar & Brakes: 500  → subtotal 850
    "basic_saddle",        // Seating: 400
    "tubeless_tyre",       // Wheels: 520
    "standard_rim",        // Wheels: 380
    "tube",                // Wheels: 130
    "spokes",              // Wheels: 150  → subtotal 1180 ... wait, let me recalculate
    "4_gear_assembly",     // Chain Assembly: 950
  ];

  const { breakdown, total } = calculateCyclePrice(selectedParts, "2016-12-15");

  // Verify each component subtotal
  expect(breakdown["Frame"]).toBe(1200);
  expect(breakdown["Handle Bar & Brakes"]).toBe(850); // 350 + 500
  expect(breakdown["Seating"]).toBe(400);
  // Wheels: tubeless_tyre(520) + standard_rim(380) + tube(130) + spokes(150) = 1180
  expect(breakdown["Wheels"]).toBe(1180);
  expect(breakdown["Chain Assembly"]).toBe(950);

  // Grand total = 1200 + 850 + 400 + 1180 + 950 = 4580
  expect(total).toBe(4580);
});

// ── Test 4 (Bonus) ────────────────────────────────────────────────────────────
// An invalid part ID should throw a clear, descriptive error
test("calculateCyclePrice throws an error for an unknown part ID", () => {
  expect(() => {
    calculateCyclePrice(["nonexistent_part"], "2016-12-15");
  }).toThrow('Unknown part ID: "nonexistent_part"');
});

// ── Test 5 (Bonus) ────────────────────────────────────────────────────────────
// A date before any price range exists should throw a clear error
test("getPriceForDate throws an error when no price range covers the date", () => {
  const steelFrame = getPartById("steel_frame");
  // steel_frame prices start from 2015-01-01, so 2010 has no range
  expect(() => {
    getPriceForDate(steelFrame, "2010-01-01");
  }).toThrow('No price found for part "steel_frame" on date "2010-01-01"');
});
