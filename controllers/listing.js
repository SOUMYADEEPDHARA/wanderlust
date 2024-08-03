const Listing = require("../models/listing.js");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

module.exports.renderNewForm= (req, res) => {
    res.render("listings/new.ejs");
  };

  module.exports.showListing=async (req, res) => {
    let { id } = req.params;
   
   const listing = await Listing.findById(id).populate({path: "reviews", populate:{path:"author",},}).populate("owner");
   if (!listing) {
    req.flash("error","Listing does not exist!");
    return res.redirect("/listings");
   }
    res.render("listings/show.ejs", { listing });

  };

  module.exports.createListing = async (req, res, next) => {
   
    const { path: url, filename } = req.file;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};



  module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error","Listing does not exist!");
      return res.redirect("/listings");
     }
    res.render("listings/edit.ejs", { listing });
  };


  module.exports.updateListing=async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listings");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });
    req.flash("success", "Listing Edited!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
  };