import express from "express";
import passport from "../config/passport.js";
import User from "../models/User.js";

const router = express.Router();

// Register form
router.get("/register", (req, res) => {
  res.render("register", { title: "Register", message: req.flash("error") });
});

// Register user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const match = await User.findByEmail(email);
    if (!match) {
      req.flash("error", "Email already taken");
      return res.redirect("/register");
    }

    await User.create({ username, email, password });
    req.flash("info", "Registration successful! You may now login.");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong.");
    res.redirect("/register");
  }
});

// Login form
router.get("/login", (req, res) => {
  res.render("login", { title: "Login", message: req.flash("error") });
});

// Login user
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Logout user
router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    } else {
      req.flash("info", "Logout successful.");
      res.redirect("/");
    }
  });
});

export default router;
