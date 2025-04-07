const express = require("express");
const router = express.Router();
const Calculation = require("../models/Calculation.js");
const math = require("mathjs"); // Add the math.js library

// ➕ Route: POST /api/calculate
router.post("/calculate", async (req, res) => {
  const { expression } = req.body;

  try {
    // Validate expression (you can add more strict validation if needed)
    if (!expression || typeof expression !== "string") {
      return res.status(400).json({ error: "Invalid expression format" });
    }

    // Safely evaluate the expression
    const result = math.evaluate(expression); // Using math.js to evaluate the expression

    // Create a new calculation document
    const newCalc = new Calculation({
      expression,
      result: result.toString(),
    });

    // Save to the database
    await newCalc.save();
    res.status(200).json(newCalc);
  } catch (err) {
    res.status(400).json({ error: "Invalid Expression" });
  }
});

// 📜 Route: GET /api/history
router.get("/history", async (req, res) => {
  try {
    const history = await Calculation.find().sort({ createdAt: -1 }).limit(5); // Show the last 5 calculations
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// 🧹 Route: DELETE /api/history
router.delete("/history", async (req, res) => {
  try {
    await Calculation.deleteMany(); // Delete all calculation history
    res.status(200).json({ message: "History cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear history" });
  }
});

module.exports = router;
