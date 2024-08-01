
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review");



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Fixing the typo here
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    if (res.locals.currentUser && !listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();

};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    //console.log(result);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }
    else {
      next();
    }
  };

 module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    //console.log(result);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }
    else {
      next();
    }
  };
  module.exports.isReviewauthor=async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    
    if (!review.author._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this review ");
        return res.redirect(`/listings/${id}`);
    }
    next();

};
