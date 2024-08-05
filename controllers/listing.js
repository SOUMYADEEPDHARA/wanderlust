const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const Map_Token=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: Map_Token });

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
    let response= await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
    .send();
   
    const { path: url, filename } = req.file;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry=response.body.features[0].geometry
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
     let originalImageUrl=listing.image.url;
     originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");

    res.render("listings/edit.ejs", { listing , originalImageUrl});
  };


  module.exports.updateListing=async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listings");
    }
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });
    if(typeof req.file !=="undefined"){
    const { path: url, filename } = req.file;
    listing.image = { url, filename };
    await listing.save();
    }
    
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