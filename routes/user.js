const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsyc.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password); // Use the actual password here
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);

            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));



router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});


router.post("/login", saveRedirectUrl, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
}), wrapAsync(async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    
    const redirectUrl = res.locals.redirectUrl || '/listings'; // Fallback to a default page if redirectUrl is not set
    delete req.session.redirectUrl; // Clear the redirectUrl from session after redirect
    
    res.redirect(redirectUrl);
}));

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            next();
        }
        req.flash("success", "Thank you visit again, you are loggedout now");
        res.redirect("/listings");
    });

});

module.exports = router;