const express = require("express");
const router = express.Router({mergeParams : true });
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema } = require('../schema');
const Review  = require('../models/review');
const Listing = require('../models/listing');

//review validation

const validateReview = (req,res,next) =>{
   let {error} =  reviewSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(400, errMsg)
   }else{
    next();
   }
}
//review route

router.post('/', validateReview,  async(req, res)=>{
    console.log(req.params.id)
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review (req.body.review);
 
   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
   req.flash('success', 'Review is added!'); 
  res.redirect(`/listings/${listing._id}`);
});

//delete review route

router.delete('/:reviewId', async(req,res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
   req.flash('success', 'Review is deleted!'); 

    res.redirect(`/listings/${id}`);
})

module.exports = router
