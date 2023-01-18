const express = require('express');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const app = express();

const userController = require('./controllers/userController');

const MODE = process.env.NODE_ENV || 'production';
const PORT = process.env.port || 3000;

app.use(express.json());

if (MODE === 'production') {
  // statically serve everything in the build folder on the route '/dist'
  app.use('/', express.static(path.resolve(__dirname, '../dist')));
}

/*********************
    User Routes
*********************/

// route to create user - sign up
app.post('/api/users', userController.createUser, (req, res) => {
  return res.json(res.locals.user);
});

// route to log user in

app.post('/api/users/login', userController.verifyUser, (req, res) => {
  return res.json(res.locals.user);
});

// route to log user out
app.post('/api/users/logout', (req, res) => {});

/*********************
    List Routes
*********************/

// route to create new list
app.post('/api/users/:id/lists', (req, res) => {});

// route to read all lists
app.get('/api/users/:id/lists', (req, res) => {});

// route to update list
app.patch('/api/users/:id/lists', (req, res) => {});

// route to delete list
app.delete('/api/users/:id/lists', (req, res) => {});

/*********************
    Link Routes
*********************/

// route to create new link - find or create by

// catch all route
app.use('*', (req, res) => {
  res.sendStatus(404);
});

// global error
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'an error occurred' }
  };
  const errorObj = Object.assign(defaultErr, err);
  console.log('global error handler caught: ', errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}...`);
  console.log(`Currently in ${MODE.toLowerCase()} mode`);
});
