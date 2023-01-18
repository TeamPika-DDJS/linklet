const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

const MODE = process.env.NODE_ENV || 'production';
const PORT = process.env.port || 3000;

const userController = require('./controllers/userController');
const linkController = require('./controllers/linkController');

app.use(express.json());

if (MODE === 'production') {
  // statically serve everything in the build folder on the route '/dist'
  app.use('/', express.static(path.resolve(__dirname, '../dist')));
}

/*********************
    User Routes
*********************/

// route to create user - sign up
app.post('/api/users', userController.createUser, () => {});

// route to log user in
app.post('api/users/login', () => {});

// route to log user out
app.post('api/users/logout', () => {});

/*********************
    List Routes
*********************/

// route to create new list
app.post(
  '/api/users/:id/lists',
  userController.createList,
  (req, res, next) => {
    res.status(200);
  }
);

// route to read all lists
app.get('/api/users/:id/lists', userController.readLists, (req, res) => {
  return res.status(200).json(res.locals.lists);
});

// route to update list
app.patch('/api/users/:id/lists', () => {});

// route to delete list
app.delete('/api/users/:id/lists', () => {});

/*********************
    Link Routes
*********************/

// get all links for the particular list
app.get(
  '/api/lists/:list_id/links',
  linkController.readLinks,
  (req, res, next) => {
    res.status(200).json(res.locals.links);
  }
);

// add link to the list
app.post(
  'api/lists/:list_id/links',
  linkController.addLinkToList,
  (req, res, next) => {
    res.status(200);
  }
);

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}...`);
  console.log(`Currently in ${MODE.toLowerCase()} mode`);
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
