const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const calculatorRoutes = require("./routes/calculatorRoutes.js");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", calculatorRoutes);
app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const MONGO_URI = process.env.MONGO_URI;

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
