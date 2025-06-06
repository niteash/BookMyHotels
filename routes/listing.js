const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isloggedIn, isOwner, validateListing } = require("../middleware");

//all listing (index route)
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//new route
router.get("/new", isloggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", " The requested list does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
});

//create route
router.post(
  "/",
  validateListing,
  isloggedIn,
  wrapAsync(async (req, res, next) => {
    const Newlisting = new Listing(req.body.listing);
    Newlisting.owner = req.user._id;
    await Newlisting.save();
    req.flash("success", "New list is created!");
    res.redirect("/listings");
  })
);
//edit route
router.get("/:id/edit", isloggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", " The requested list does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
});

//update
router.put(
  "/:id",
  validateListing,
  isloggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "List is updated!");

    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete("/:id", isloggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  console.log(deleted);
  req.flash("error", " list is deleted!");
  res.redirect("/listings");
});

module.exports = router;
