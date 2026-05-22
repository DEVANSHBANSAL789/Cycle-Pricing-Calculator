const express = require("express");
const cors = require("cors");
const pricingRoutes = require("./routes/pricingRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", pricingRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Cycle Pricing Engine API is running." });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});