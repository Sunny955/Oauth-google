const express = require("express");
const passport = require("passport");
const session = require("express-session");
require("./auth");

const isLoggedin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

const app = express();

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get("/protected", isLoggedin, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});

app.get("/auth/failure", (req, res) => {
  res.send("Can't authenticate!");
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.send("Goodbye!");
  });
});

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => {
  console.log("App is listening on port 3000");
});
