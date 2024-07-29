
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/wrapAsyc.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");



const validateListing = (req, res, next) => {
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
  


//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
  );
  
  
  //New Route
  router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  //Show Route
  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
  );
  
//Create Route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {

    const newListing = new Listing(req.body.listing);
  
    await newListing.save();
    res.redirect("/listings");
  
  
  })
  );
  
  //Edit Route
  router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
  );
  
  //Update Route
 /* router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listings");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
  );*/
  router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listings");
    }
    let { id } = req.params;
    //console.log(`Updating listing with id: ${id}`);
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, { new: true, runValidators: true });
    await listing.save();
    res.redirect(`/listings/${id}`);
}));

  
  //Delete Route
  router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
  })
  );
  
  module.exports=router;