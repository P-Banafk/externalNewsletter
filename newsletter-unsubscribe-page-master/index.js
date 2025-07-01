const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    console.log("📦 Connected to DB:", mongoose.connection.name);
  })
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// Load Mongoose model
const Subscriber = require("./models/Subscriber");

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// Seed route (for testing)
app.get("/api/seed", async (req, res) => {
  try {
    const testUser = await Subscriber.create({ email: "test@example.com" });
    res.json({ message: "Test email inserted", data: testUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Subscribe API
app.post("/api/subscribe", async (req, res) => {
  const { email } = req.body;
  console.log("📨 Received subscribe request for:", email);

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "This email is already subscribed." });
    }

    const newSub = await Subscriber.create({ email });
    res.status(201).json({ message: "Subscribed successfully!", data: newSub });
  } catch (error) {
    console.error("❌ Subscribe error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Updated Unsubscribe API (POST)
app.post("/api/unsubscribe", async (req, res) => {
  const { email } = req.body;
  console.log("🗑️ Unsubscribe request received for:", email);

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const deleted = await Subscriber.findOneAndDelete({ email });

    if (!deleted) {
      console.log("❌ Not found in DB:", email);
      return res.status(404).json({ message: "Email not found in subscribers list." });
    }

    console.log("✅ Deleted:", deleted);
    return res.json({ message: `The email ${email} has been unsubscribed and deleted.` });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Frontend routes
app.get(["/", "/unsubscribe"], (_, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});