// Imports
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import flash from "connect-flash";
import passport from "./config/passport.js";
import pool from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

// Load .env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware - START
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_me",
    resave: false,
    saveUninitialized: false,
  })
);

// Flash messages
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Persist user session
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Middleware - END

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "ReelTalk", message: req.flash("info") });
});

app.use("/", authRoutes);

// Test DB connection (REMOVE LATER)
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Database time: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB connection failed.");
  }
});

// Initialize server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
