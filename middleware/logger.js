//@desc Logs request to console
//any request  made, this function will run.
const logger = (req, res, next) => {
  //req.hello = 'Hello World';
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  next();
}

module.exports = logger;