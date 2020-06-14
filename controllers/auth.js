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

  sendTokenResponse(user, 200, res);

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
  sendTokenResponse(user, 200, res);
});


//Get token from model,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();
  const option = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    option.secure = true;
  }
  res
    .status(statusCode)
    .cookie('token', token, option)
    .json({
      success: true,
      token: token
    })
}