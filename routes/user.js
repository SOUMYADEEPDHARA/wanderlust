const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsyc.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const NewUser = new User({ username, email });
        const registeredUser = await User.register(NewUser, "hello");
        console.log(registeredUser);
        req.flash("success", "Well come to wanderlust");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}));


router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate
    ('local', {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash("success", "Welcome back to wanderlust");
        res.redirect("/listings");
    });

module.exports = router;