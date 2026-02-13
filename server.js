// ===============================
// CORE IMPORTS
// ===============================
const express = require("express");
const session = require("express-session");
const path = require("path");
const http = require("http");

// ===============================
// APP INIT FIRST ⚠️
// ===============================
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));


// VIEW ENGINE SETUP
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===============================
// DATABASE
// ===============================
require("./db/database");

// ===============================
// MAILER
// ===============================
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "agriculturalfoundationiv@gmail.com",
    pass: "sjbp ltph bttj hplg"
  }
});

function sendEmail(to, subject, text) {
  return transporter.sendMail({ from: "agriculturalfoundationiv@gmail.com", to, subject, text });
}

// ===============================
// ROUTES IMPORT
// ===============================
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const depositRoutes = require("./routes/deposit");
const investRoute = require("./routes/invest");
const withdrawRoutes = require("./routes/withdraw");
const loanRoutes = require("./routes/loan");
const transactionRoutes = require("./routes/transaction");
const otpRoutes = require("./routes/otp");
const contactRoutes = require("./routes/contact");

// ===============================
// MIDDLEWARE
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  name: "cotton.sid",
  secret: "cotton_super_secret_key_2026",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000*60*60*24 }
}));

app.use(express.static(path.join(__dirname, "public")));

// ===============================
// ROUTES USE
// ===============================
app.use("/", contactRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/deposit", depositRoutes);
app.use("/api/invest", investRoute);
app.use("/withdraw", withdrawRoutes);
app.use("/loan", loanRoutes);
app.use("/transactions", transactionRoutes);
app.use("/otp", otpRoutes);

// ===============================
// LOGOUT
// ===============================
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send("Logout failed");
    res.clearCookie("cotton.sid");
    res.send("Logged out successfully");
  });
});

// ===============================
// EMAIL NOTIFICATIONS
// ===============================
app.post("/deposit/notify/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { amount, method, email } = req.body;

  await sendEmail("admin@gmail.com", "New Deposit Request",
    `User ${user_id} requested deposit of $${amount} via ${method}`);

  await sendEmail(email, "Deposit Received",
    `We received your deposit of $${amount}. Processing soon.`);

  res.send("Deposit emails sent");
});

app.post("/withdraw/notify/:user_id", async (req, res) => {
  const { amount, email, status } = req.body;

  await sendEmail(email, "Withdrawal Update",
    `Your withdrawal of $${amount} is ${status}`);

  res.send("Withdrawal email sent");
});

app.post("/kyc/notify/:user_id", async (req, res) => {
  const { email, status } = req.body;

  await sendEmail(email, "KYC Status",
    `Your KYC is ${status}`);

  res.send("KYC email sent");
});

// ===============================
// LIVE CHAT SOCKET
// ===============================
io.on("connection", socket => {
  console.log("User connected");

  socket.on("chat message", msg => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ===============================
// HEALTH CHECK
// ===============================
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});


// ===============================
// START SERVER
// ===============================
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
