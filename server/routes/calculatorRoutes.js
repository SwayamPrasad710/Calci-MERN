const express = require("express");
const router = express.Router();
const Calculation = require("../models/Calculation.js");

// ➕ Route: POST /api/calculate
router.post("/calculate", async (req, res) => {
  const { expression } = req.body;

  try {
    // Evaluate the expression safely
    const result = eval(expression); // In production, replace this with a safer evaluator

    const newCalc = new Calculation({
      expression,
      result: result.toString(),
    });

    await newCalc.save();
    res.status(200).json(newCalc);
  } catch (err) {
    res.status(400).json({ error: "Invalid Expression" });
  }
});

// 📜 Route: GET /api/history
router.get("/history", async (req, res) => {
  try {
    const history = await Calculation.find().sort({ createdAt: -1 }).limit(5); // 👈 Only show last 10
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// 🧹 Route: DELETE /api/history
router.delete("/history", async (req, res) => {
  try {
    await Calculation.deleteMany(); // Delete all documents
    res.status(200).json({ message: "History cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear history" });
  }
});

module.exports = router;
