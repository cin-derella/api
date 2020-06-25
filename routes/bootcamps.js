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
const reviewRouter = require('./reviews')

//router代表一个由express.Router()创建的对象，Router是一个类的extend类
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);


router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps) // implement middleware for getBootcamps
  .post(protect, authorize('publisher', 'admin'), createBootcamp);


router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);



router
  .route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);


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