const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const commentRoutes = require('./routes/comments');
const repliesRoutes = require('./routes/replies');
require('dotenv').config();

const app = express();

//connect to mongodb
mongoose
  .connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true, // for connection warning
      useUnifiedTopology: true,
    },
    () => {
      console.log(
        '\n \t Database connection has been established successfully'
      );
    }
  )
  .catch((err) => {
    console.error('App starting error:', err.stack);
    process.exit(1);
  });

// setup middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

//setup app routes
app.get('/', home);
app.use('/report/comments', commentRoutes);
app.use('/reports/comments/replies', repliesRoutes);

function home(req, res) {
  res.json({
    status: 'Success',
    message: 'Welcome',
    data: 'This is the comments service api',
  });
}

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
  res.send('error');
});

module.exports = app;
