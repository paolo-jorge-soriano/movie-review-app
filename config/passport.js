import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // login using email
    async (email, password, done) => {
      try {
        // Find email
        const user = await User.findByEmail(email);
        if (!user) {
          return done(null, false, { message: "No user found" });
        }

        // Compare password to hash
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Store user id session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Fetch user based on id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
