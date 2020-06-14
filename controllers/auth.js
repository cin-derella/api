const User = require('../models/User')
const asyncHandler = require('../middleware/async')
const ErrorReponse = require('../utils/errorResponse')


//@desc   Register user
//@route  GET /api/v1/auth/register
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
})