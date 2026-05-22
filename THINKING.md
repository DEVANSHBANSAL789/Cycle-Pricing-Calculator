# THINKING.md — Cycle Pricing Engine

## 1. Who is using this tool?

The user is a **salesperson at a Hero Cycles showroom** — not a developer. She might be handling 20+ customer enquiries on a busy day, switching between different cycle configurations rapidly. She knows cycle parts by name, not by part IDs or JSON keys.

**What she actually needs from this tool:**
- A fast, visual way to pick parts (checkboxes, not text input)
- A clear, instant total price — one big number she can tell the customer
- A per-component breakdown so she can justify the price ("Wheels alone are ₹1,180")
- Prices that reflect the actual date of the sale (since costs change quarterly)

**What would frustrate her:**
- Having to type part names manually — she will misspell them
- Seeing "undefined" or raw JSON errors on screen
- Waiting more than a second for a price to appear
- Having to scroll past confusing technical labels
- The tool not telling her *why* a combination might be a problem (e.g. tubeless tyre without a rim)

---

## 2. What makes this problem tricky — Edge Cases

Time-sensitive pricing sounds simple ("look up the price for this date") but creates real complications:

**Edge Case 1 — Date before any price exists**
If a salesperson enters a date like `2010-01-01` and the earliest price data starts in `2015-01-01`, the engine must fail clearly. Silently returning `0` or `undefined` would produce a wrong total with no warning.

**Edge Case 2 — validUntil is null (open-ended current price)**
The most recent price for most parts has `validUntil: null`, meaning "this price is active until further notice." The engine must interpret `null` as "far future" — not as "no price." A naive date comparison would treat `null` as invalid.

**Edge Case 3 — Overlapping ranges (data quality)**
If bad data has two price entries whose date ranges overlap (e.g. one ends Jan 31 and another starts Jan 15), the engine might pick the wrong one, or pick both. The current design returns the *first* matching entry, so range ordering in the data file matters. A production system would validate that ranges don't overlap on insert.

**Edge Case 4 — Same configuration, different totals on different dates**
A salesperson configuring `steel_frame + tubeless_tyre + 4_gear_assembly` on Nov 15, 2016 gets a different total than on Dec 15, 2016. The UI should make the date selection prominent so the salesperson doesn't assume prices are fixed.

**Edge Case 5 — Part selected, no matching date range**
If a part's price history ends at `2020-12-31` and someone queries `2025-01-01`, there's no valid price. This must throw a clear error, not silently return `0` and produce a wrong total.

---

## 3. Data Model

### Component
A high-level grouping of parts (e.g. Frame, Wheels). Not stored as a separate entity — it's just a string field on each Part.

```
Component (string label)
  "Frame" | "Handle Bar & Brakes" | "Seating" | "Wheels" | "Chain Assembly"
```

### Part
```
Part
  ├── id           : string   — unique slug, e.g. "tubeless_tyre"
  ├── name         : string   — human-readable, e.g. "Tubeless Tyre"
  ├── component    : string   — which high-level group it belongs to
  └── priceHistory : PriceEntry[]
```

### PriceEntry
```
PriceEntry
  ├── validFrom  : string (ISO date) — "2015-01-01"
  ├── validUntil : string | null     — null = still active
  └── price      : number            — in Indian Rupees (₹)
```

### CycleConfiguration (request payload)
```
CycleConfiguration
  ├── date  : string (ISO date)  — the pricing date
  └── parts : string[]           — list of part IDs selected
```

### Entity relationships:
```
Component (1) ──── has many ──── Parts (many)
Part      (1) ──── has many ──── PriceEntries (many)
```

---

## 4. Design Decision — Why priceHistory as date ranges?

**Alternative considered:** Store only the current price on each part and update it whenever it changes.

**Problem with that approach:** We lose history entirely. A salesperson quoting a price from last month's date would get today's price — which is wrong. For audit purposes, pricing disputes, and retrospective calculations, you need to know what a part cost on *any* given date, not just today.

**Chosen approach:** Store an array of `{ validFrom, validUntil, price }` entries per part.

- Simple to implement: just loop and find the matching range.
- Easy to extend: adding a new price only means appending one object.
- No data is ever deleted — history is always preserved.
- The open-ended current price uses `validUntil: null` — a common pattern that avoids having to update all records when a new price starts.

---

## 5. Plan — How the pricing engine works (plain English)

1. **Load parts** from a static JS file (or database in production). Each part knows its name, which component it belongs to, and its price history.

2. **Salesperson opens the UI**, selects a pricing date, and ticks the parts she wants.

3. **Frontend sends a POST request** to `/api/calculate-price` with the date and array of part IDs.

4. **Backend receives the request** and calls `calculateCyclePrice(partIds, date)` in the pricing service.

5. **For each part ID:**
   - Find the part object by ID. If not found, throw a clear error.
   - Loop through that part's `priceHistory`.
   - Pick the entry where `validFrom <= date <= validUntil` (treating `null` as far-future).
   - If no entry matches, throw a clear error.
   - Add the price to the component subtotal.

6. **After all parts are processed**, sum all component subtotals to get the grand total.

7. **Return `{ breakdown, total }`** to the frontend.

8. **Frontend renders** the breakdown table and highlights the grand total.
