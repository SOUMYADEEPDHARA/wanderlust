const express = require("express");
const app = express();
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsyc.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { route } = require("./listing.js");
const {validateReview, isLoggedIn,isReviewauthor}= require("../middleware.js");
const reviewController = require("../controllers/review.js");





//review post rout
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
  
  
  //delete review rout
  router.delete('/:reviewId', isLoggedIn,isReviewauthor,wrapAsync(reviewController.destroyReview));

  module.exports=router;