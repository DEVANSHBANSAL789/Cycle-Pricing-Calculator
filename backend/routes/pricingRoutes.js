

const express = require("express");
const router = express.Router();
const parts = require("../data/parts");
const { calculateCyclePrice } = require("../services/pricingService");


router.get("/parts", (req, res) => {

  const grouped = {};
  for (const part of parts) {
    if (!grouped[part.component]) {
      grouped[part.component] = [];
    }
    grouped[part.component].push({ id: part.id, name: part.name, component: part.component });
  }
  res.json(grouped);
});

router.post("/calculate-price", (req, res) => {
  const { date, parts: selectedPartIds } = req.body;

  if (!date) {
    return res.status(400).json({ error: "Please provide a pricing date." });
  }
  if (!selectedPartIds || selectedPartIds.length === 0) {
    return res.status(400).json({ error: "Please select at least one part." });
  }


  try {
    const result = calculateCyclePrice(selectedPartIds, date);
    res.json(result);
  } catch (err) {

    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
