const User = require("../models/user.js");


module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password); // Use the actual password here

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
};



module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");

    const redirectUrl = res.locals.redirectUrl || '/listings'; // Fallback to a default page if redirectUrl is not set
    delete req.session.redirectUrl; // Clear the redirectUrl from session after redirect

    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            next();
        }
        req.flash("success", "Thank you visit again, you are loggedout now");
        res.redirect("/listings");
    });

};