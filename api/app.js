var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var helmet = require('helmet');

var indexRouter = require('./routes/index');
var createRouter = require('./routes/createCaseRoute');
var updateRouter = require('./routes/updateCaseRoute');
var deleteRouter = require('./routes/deleteCaseRoute');
var retrieveRouter = require('./routes/retrieveCaseRoute');

const errorHandler = require('./middleware/errorHandler');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware setup
app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.use('/', indexRouter);
app.use('/cases', retrieveRouter);
app.use('/cases', createRouter);
app.use('/cases', deleteRouter);
app.use('/cases', updateRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
