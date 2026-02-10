const express = require("express");
const sendEmail = require("../utils/mailer");
const router = express.Router();

router.post("/contact", async (req, res) => {
  const { email, message } = req.body;

  try {
    // 1️⃣ Send message to your admin
    await sendEmail(
      "justusalways333@gmail.com@gmail.com",              // Replace with admin email
      "New Contact Message",
      `You received a new message from ${email}:\n\n${message}`
    );

    // 2️⃣ Auto-reply to the user
    await sendEmail(
      email,
      "We received your message",
      "Thank you for contacting Cotton Investment. Our team will review your message and reply within 24 hours."
    );

    res.send("Message sent successfully. An auto-reply has been sent to your email.");

  } catch (err) {
    console.error("Email sending failed:", err);
    res.status(500).send("Failed to send email.");
  }
});

module.exports = router;
