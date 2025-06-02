const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema  } = require('../schema');
const Listing = require('../models/listing');

//joi

const validateListing = (req,res,next) =>{
   let {error} =  listingSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(400, errMsg)
   }else{
    next();
   }
}

//all listing (index route)
router.get("/", async (req, res)=>{
  const allListings =  await Listing.find({});
  console.log(allListings)
        res.render('listings/index.ejs', {allListings})
    });

//new route
router.get('/new', (req,res)=>{
    res.render('listings/new.ejs')
})

//show route
router.get('/:id', async ( req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
    req.flash('error', ' The requested list does not exist!'); 
    res.redirect('/listings')
    }
    res.render('listings/show.ejs', {listing})
})

//create route
router.post('/', validateListing, wrapAsync( async (req, res,next) => {
 
    const Newlisting = new Listing(req.body.listing); 
    await Newlisting.save();
    req.flash('success', 'New list is created!'); 
    res.redirect('/listings');

  }));
//edit route
router.get('/:id/edit', async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
      if(!listing){
    req.flash('error', ' The requested list does not exist!'); 
    res.redirect('/listings')
    }
    res.render('listings/edit.ejs', {listing})
})

//update
router.put('/:id',validateListing,wrapAsync( async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing})
   req.flash('success', 'List is updated!'); 

    res.redirect(`/listings/${id}`);
}))

//delete route
router.delete('/:id', async(req, res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted)
    req.flash('error', ' list is deleted!'); 
    res.redirect('/listings')
})

module.exports = router;