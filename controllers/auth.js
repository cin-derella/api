const User = require('../models/User')
const asyncHandler = require('../middleware/async')
const ErrorReponse = require('../utils/errorResponse')


//@desc   Register user
//@route  POST /api/v1/auth/register
//@access Public
exports.register = asyncHandler(async (req, res, next) => {

  //Method 1: pull things out of req.body and create user
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  //Method 2: create user from req.body
  //const user = await User.create(req.body);

  //Create token
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token: token })
});


//@desc   Login user
//@route  POST /api/v1/auth/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {

  const { email, password } = req.body;

  //Validate email and password
  if (!email || !password) {
    return next(new ErrorReponse('Please provide an email and password', 400));
  }

  //Check for user
  const user = await User.findOne({ email: email }).select('+password');
  if (!user) {
    return next(new ErrorReponse('Invalid credentials', 401));
  }

  //Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorReponse('Invalid credentials', 401));

  }

  //Create token
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token: token })
})