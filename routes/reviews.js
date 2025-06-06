const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { validateReview, isloggedIn, isReviewAuthor } = require("../middleware.js");

//review route

router.post("/", isloggedIn, validateReview, async (req, res) => {
  console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "Revie w is added!");
  res.redirect(`/listings/${listing._id}`);
});

//delete review route

router.delete("/:reviewId",isloggedIn, isReviewAuthor, async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review is deleted!");

  res.redirect(`/listings/${id}`);
});

module.exports = router;
