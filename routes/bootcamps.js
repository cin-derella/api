const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const courseRouter = require('./courses')

const router = express.Router();

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius);

router
  .route('/:id/photo')
  .put(bootcampPhotoUpload);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps) // implement middleware for getBootcamps
  .post(createBootcamp);


router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);






// router.get('/', (req, res) => {
//   res.status(200).json({ success: true, msg: 'Show all bootcamps.' })
// });


// router.get('/:id', (req, res) => {
//   res.status(200).json({ success: true, msg: `Show bootcamp ${req.params.id}` })
// });

// router.post('/', (req, res) => {
//   res.status(200).json({ success: true, msg: 'Create new bootcamp.' })
// });

// router.put('/:id', (req, res) => {
//   res.status(200).json({ success: true, msg: `Update bootcamp ${req.params.id}` })
// });

// router.delete('/:id', (req, res) => {
//   res.status(200).json({ success: true, msg: `Delete bootcamp  ${req.params.id}` })
// });

module.exports = router;