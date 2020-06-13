const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const errorHandler = require('./middleware/error')
const morgan = require('morgan')
// const logger = require('./middleware/logger')
const connectDB = require('./config/db')

//Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');



const app = express();

//Body parser
app.use(express.json())


// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// app.user（logger);
//Mount routers, connect /api/v1/bootcamps to  bootcamps.js just brought in above
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)


app.use(errorHandler)
// app.get('/api/v1/bootcamps', (req, res) => {
//   res.status(200).json({ success: true, msg: 'Show all bootcamps.' })
// });


// app.get('/api/v1/bootcamps/:id', (req, res) => {
//   res.status(200).json({ success: true, msg: `Show bootcamp ${req.params.id}` })
// });

// app.post('/api/v1/bootcamps', (req, res) => {
//   res.status(200).json({ success: true, msg: 'Create new bootcamp.' })
// });

// app.put('/api/v1/bootcamps/:id', (req, res) => {
//   res.status(200).json({ success: true, msg: `Update bootcamp ${req.params.id}` })
// });

// app.delete('/api/v1/bootcamps/:id', (req, res) => {
//   res.status(200).json({ success: true, msg: `Delete bootcamp  ${req.params.id}` })
// });





//CMT: handle get method to route '/'
//app.get('/', (req, res) => {
//CMT:send back html
//res.send('<h1  >Hello from express</h1>');  

// CMT:send back json res.json({}) = res.send({}
//res.json({ name: 'Shirley' })

//CMP:send back status  .send({}) = .json({})
//res.sendStatus(400);
//res.status(400).json({ success: false });
// res.status(200).json({ success: true, data: { id: 1 }, msg: 'Show all bootcamps' })

//});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server and exit process
  server.close(() => process.exit(1));
})










// *********Code without Express******//


// const http = require('http');
// const todos = [
//   { id: 1, text: 'Todo One' },
//   { id: 2, text: 'Todo Two' },
//   { id: 3, text: 'Todo Three' },

// ]


// const server = http.createServer((req, res) => {
//   const { method, url } = req;
//   let body = [];
//   req.on('data', chunk => {
//     body.push(chunk);
//   })
//     .on('end', () => {
//       body = Buffer.concat(body).toString();

//       let status = 404;

//       const response = {
//         success: false,
//         data: null
//       }

//       if (method === 'GET' && url === '/todos') {
//         status = 200;
//         response.success = true;
//         response.data = todos
//       } else if (method === 'POST' && url === '/todos') {
//         const { id, text } = JSON.parse(body);

//         if (!id || !text) {
//           status = 400;
//           response.error = "Please add id and text"
//         } else {
//           todos.push({ id, text });
//           status = 201;
//           response.success = true;
//           response.data = todos;
//         }
//       }

//       res.writeHead(status, {
//         'Content-Type': 'application/json',
//         'X-Powered-By': 'Node.js'
//       });
//       res.end(
//         JSON.stringify(response));
//     })

// });

// const PORT = 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


