
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsyc.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js");
const { reviewSchema } = require("./schema.js");



app.use(methodOverride('_method'));
const bodyParser = require('body-parser');
const { render } = require("ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
main().then(() => {
  console.log('Connected to MongoDB');
})
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/", (req, res) => {
  res.send("hi i am rout");
});

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

const validateReview = (req, res, next) => {
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


//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
})
);


//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { listing });
})
);

//Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {

  const newListing = new Listing(req.body.listing);

  await newListing.save();
  res.redirect("/listings");


})
);

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
})
);

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listings");
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
})
);

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  res.redirect("/listings");
})
);

//review post rout
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);

//delete review rout
app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  
  // Find the listing and remove the reference to the review
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  
  // Delete the actual review
  await Review.findByIdAndDelete(reviewId);
  
  // Redirect back to the listing page
  res.redirect(`/listings/${id}`);
}));


}));
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});
//error handeling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  //res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
})