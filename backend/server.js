const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Allow frontend to connect
app.use(cors());

// ✅ Parse JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

// 🚨 Main Alert API
app.post("/alert", (req, res) => {
    const { severity, message } = req.body;

    console.log("🚨 ALERT RECEIVED");
    console.log("Severity:", severity);
    console.log("Message:", message);

    let responseMsg = "";

    if (severity === "high") {
        console.log("⚠️ HIGH PRIORITY ALERT SENT");
        responseMsg = "🚨 High priority alert sent to authorities!";
    } else {
        console.log("ℹ️ Normal alert sent");
        responseMsg = "Alert sent successfully!";
    }

    res.json({
        status: "success",
        response: responseMsg
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});