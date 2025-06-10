const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

//all listing (index route)
module.exports.indexRoute = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};
//new route
module.exports.newRoute = async (req, res) => {
  res.render("listings/new.ejs");
};
//show route 
module.exports.showRoute = async (req, res) => {
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
};
//create route
module.exports.createRoute = async (req, res, next) => {
  let response = await geoCodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send()

  
  let url = req.file.path;
  let filename = req.file.filename;
  const Newlisting = new Listing(req.body.listing);
  Newlisting.owner = req.user._id;
  Newlisting.image = { url, filename };
  Newlisting.geometry = response.body.features[0].geometry;


 let saveListing =  await Newlisting.save();
 console.log(saveListing)

  req.flash("success", "New list is created!");
  res.redirect("/listings");
};
//edit route
module.exports.editRoute = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", " The requested list does not exist!");
    res.redirect("/listings");
  }

  let OriginalImageUrl = listing.image.url;
  OriginalImageUrl = OriginalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, OriginalImageUrl });
};
//update
module.exports.updateRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "List is updated!");
  res.redirect(`/listings/${id}`);
};
//delete route
module.exports.destroyRoute = async (req, res) => {
  let { id } = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  console.log(deleted);
  req.flash("error", " list is deleted!");
  res.redirect("/listings");
};
