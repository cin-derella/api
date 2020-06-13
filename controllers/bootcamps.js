const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const ErrorReponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')

//@desc   Get all bootcamps
//@route  GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  let queryStr = JSON.stringify(req.query);

  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = Bootcamp.find(JSON.parse(queryStr));

  const bootcamps = await query;
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });

  //res.status(200).json({ success: true, msg: 'Show all bootcamps.', hello: req.hello })
  //res.status(200).json({ success: true, msg: 'Show all bootcamps.' })

});



//@desc   Get single bootcamp
//@route  GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findById(req.params.id);
  //is a formatted id but not in db
  if (!bootcamp) {
    //return res.status(400).json({ success: false })
    return next(new ErrorReponse(`Bootcamp not found with id of ${req.params.id}`, 404));

  }
  res.status(200).json({
    success: true,
    data: bootcamp
  })

  //res.status(200).json({ success: true, msg: `Show bootcamp ${req.params.id}` })

});


//@desc   Create new bootcamp
//@route  POST /api/v1/bootcamps
//@access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);  //add data to database
  res.status(201).json({
    success: true,
    data: bootcamp
  });


  // console.log(req.body)
  // res.status(200).json({ success: true, msg: 'Create new bootcamp.' })

});


//@desc   Update bootcamp
//@route  PUT /api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    return next(new ErrorReponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: bootcamp
  })

  //res.status(200).json({ success: true, msg: `Update bootcamp ${req.params.id}` })

});


//@desc   Delete  bootcamp
//@route  DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(new ErrorReponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: {}
  })

  //res.status(200).json({ success: true, msg: `Delete bootcamp  ${req.params.id}` })
})


//@desc   Get  bootcamps with a radius
//@route  GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //Calc radius using radians
  //Divide dist by radius of Earth
  //Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 6378;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })



})
