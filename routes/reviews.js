const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const Review = require("../models/review");
const {
  validateReview,
  isloggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//review route

router.post("/", isloggedIn, validateReview, reviewController.createReview);

//delete review route

router.delete(
  "/:reviewId",
  isloggedIn,
  isReviewAuthor,
  reviewController.destroyReview
);

module.exports = router;
