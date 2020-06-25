const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const errorHandler = require('./middleware/error')
const morgan = require('morgan')
const connectDB = require('./config/db')
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser')


//Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');




const app = express();

//Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware,record logs "GET /api/v1/bootcamps 200 1232.498 ms - 916""
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//File uploading
//创建函数对象，创建后同errorHandler
app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers, connect /api/v1/bootcamps to  bootcamps.js just brought in above
//A router is valid middleware
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)

// Mount a middleware function
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server and exit process with failure code (1)
  server.close(() => process.exit(1));
})

