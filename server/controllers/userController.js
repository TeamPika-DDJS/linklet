const db = require('../models/database');
const bcrypt = require('bcrypt');

const userController = {};

userController.createUser = async (req, res, next) => {
  // deconstructing values on req body
  const { username, password, email } = req.body;

  // values array to send with query
  const values = [email];

  // hashing the password
  const salt_work_factor = 10;
  const encryptedPassword = await bcrypt.hash(password, salt_work_factor);

  // error message
  const err = {
    log: 'Express error handler caught error in userController.createUser middleware',
    status: 400,
    message: { err: 'User cannot be created' }
  };

  // check if this email is taken
  // try to query db
  try {
    const query = `SELECT * FROM users WHERE email = $1`;
    const response = await db.query(query, values);
    const rows = response.rows;
    // if rows have length, that means there is already this email stored in the database
    if (rows.length > 0) {
      return next(err);
    }
  } catch (e) {
    return next(err);
  }

  // if email is free, we can try to create a user now
  try {
    const query = `INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, username`;
    values.push(username, encryptedPassword);
    const response = await db.query(query, values);
    res.locals.user = response.rows[0];
    req.session.user = res.locals.user;
    return next();
  } catch (e) {
    return next(err);
  }
};

userController.verifyUser = async (req, res, next) => {
  const { username, password } = req.body;

  const err = {
    log: 'Express error handler caught error in userController.verifyUser middleware',
    status: 400,
    message: { err: 'User cannot be created' }
  };

  try {
    const query = `SELECT * FROM users WHERE username='${username}'`;
    const response = await db.query(query);
    const user = response.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.locals.user = { id: user.id, username: user.username };
      req.session.user = res.locals.user;
    }
    return next();
  } catch (error) {
    next(err);
  }
};

userController.createList = async (req, res, next) => {
  // name for the list will come from req.body
  // user id is in the params
  const { name } = req.body;
  const user_id = req.params['id'];

  const values = [user_id, name];

  // error object
  const err = {
    log: 'Express error handler caught error in userController.createList middleware',
    status: 400,
    message: { err: 'User already has this list' }
  };

  // first check if user already has this list
  try {
    const query = `SELECT * FROM lists WHERE user_id = $1 AND name = $2`;
    const response = await db.query(query, values);
    const rows = response.rows;
    // if rows have length, that means there is already this user already has this list
    if (rows.length > 0) {
      return next(err);
    }
  } catch (e) {
    return next(err);
  }

  // now we can add new list
  try {
    const query = `INSERT INTO lists (user_id, name) VALUES ($1, $2)`;
    await db.query(query, values);
    return next();
  } catch (e) {
    return next(err);
  }
};

// helper function for retreiving id for the link
const getLinkId = async (url) => {
  const params = [url];

  // look for link in the table - if it exists, return id
  try {
    const query = `SELECT * FROM links WHERE url = $1`;
    const response = await db.query(query, params);
    if (response.rows.length > 0) {
      return response.rows[0].id;
    }
  } catch (e) {
    return -1;
  }

  // if link does not exist, we need to insert it first and then return id
  try {
    const query = `INSERT INTO links (url) VALUES ($1) RETURNING id`;
    const response = await db.query(query, params);
    return response.rows[0].id;
  } catch (e) {
    return -1;
  }
};

userController.addLinkToList = async (req, res, next) => {
  // id of the list to add link to and link's url are going to be stored on req.body
  const { url } = req.body;
  const list_id = req.params['list_id'];

  // error object
  const err = {
    log: 'Express error handler caught error in userController.addLink middleware',
    status: 400,
    message: { err: 'Link cannot be added to the list' }
  };

  // use helper function to get link's id
  const link_id = await getLinkId(url);

  // if we got link_id
  if (link_id > -1) {
    try {
      const query = `INSERT INTO links_per_lists (link_id, list_id) VALUES ($1, $2)`;
      const params = [link_id, list_id];
      await db.query(query, params);
      return next();
    } catch (e) {
      return next(err);
    }
  } else {
    return next(err);
  }
};

userController.readLists = async (req, res, next) => {
  const user_id = req.params['id'];
  const params = [user_id];

  try {
    // get lists for this user
    const query = `SELECT id, name FROM lists WHERE user_id = $1`;
    const response = await db.query(query, params);
    const userLists = response.rows;

    // get lists for other users
    const otherQuery = `SELECT TOP 5 FROM lists WHERE user_id != $1`;
    const otherResponse = await db.query(otherQuery, params);
    const otherLists = otherResponse.rows;

    // save it on locals
    res.locals.lists = { userLists, otherLists };
    return next();
  } catch (e) {
    return next(err);
  }
};

userController.readLinks = async (req, res, next) => {
  const list_id = req.params['list_id'];

  // error object
  const err = {
    log: 'Express error handler caught error in userController.addLink middleware',
    status: 400,
    message: { err: 'Could not find links for this list' }
  };

  // we will get all links for this particular list
  // we will return an array of objects with 2 keys: id, url
  const params = [list_id];
  const query = `SELECT * FROM links WHERE id IN (SELECT link_id FROM links_per_lists WHERE list_id = $1)`;
  try {
    const response = await db.query(query, params);
    res.locals.links = response.rows;
    return next();
  } catch (er) {
    return next(err);
  }
};

module.exports = userController;
