// Imports
import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

// Load .env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
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

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes (TEMP) <- CHANGE LATER
app.get("/", (req, res) => {
  res.render("index", { title: "ReelTalk", message: req.flash("info") });
});

// Initialize server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
