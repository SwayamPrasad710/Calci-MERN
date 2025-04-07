const mongoose = require("mongoose");

const calculationSchema = new mongoose.Schema(
  {
    expression: String,
    result: String,
  },
  { timestamps: true } // ➕ This adds createdAt and updatedAt
);

module.exports = mongoose.model("Calculation", calculationSchema);
