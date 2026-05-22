const parts = require("../data/parts");

function getPriceForDate(part, date) {
  const requestedDate = new Date(date);

  for (const entry of part.priceHistory) {
    const from = new Date(entry.validFrom);
    const until = entry.validUntil ? new Date(entry.validUntil) : new Date("9999-12-31");

    if (requestedDate >= from && requestedDate <= until) {
      return entry.price;
    }
  }

  throw new Error(
    `No price found for part "${part.id}" on date "${date}". ` +
    `Check that the date is within a valid price range.`
  );
}

function calculateCyclePrice(selectedPartIds, date) {
  const partMap = {};
  for (const part of parts) {
    partMap[part.id] = part;
  }

  const breakdown = {};

  for (const id of selectedPartIds) {
    const part = partMap[id];
    if (!part) {
      throw new Error(`Unknown part ID: "${id}". Please check the part list.`);
    }

    const price = getPriceForDate(part, date);

    if (breakdown[part.component] === undefined) {
      breakdown[part.component] = 0;
    }
    breakdown[part.component] += price;
  }

  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return { breakdown, total };
}

module.exports = { getPriceForDate, calculateCyclePrice };