const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isloggedIn, isOwner, validateListing } = require("../middleware");
const ListingController = require("../controllers/listings");
const { route } = require("./user");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//router route
router
  .route("/")
  .get(ListingController.indexRoute) //index route
  .post(//create route
    isloggedIn,
    upload.single("listing[image]"), 
    validateListing,
    wrapAsync(ListingController.createRoute)
  );
//new route

router.get("/new", isloggedIn, ListingController.newRoute);

router
  .route("/:id")
  .get(ListingController.showRoute) //show route
  .put(
    //update route
    isloggedIn,
    isOwner,
    upload.single("listing[image]"), 
    validateListing,
    wrapAsync(ListingController.updateRoute)
  )
  .delete(isloggedIn, isOwner, ListingController.destroyRoute); //delete route

//edit route
router.get("/:id/edit", isloggedIn, isOwner, ListingController.editRoute);

module.exports = router;
