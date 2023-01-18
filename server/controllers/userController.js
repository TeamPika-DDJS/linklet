const db = require('../models/database');
const bcrypt = require('bcrypt');
const { requestToBodyStream } = require('next/dist/server/body-streams');

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
    const query = `INSERT INTO users (email, username, password) VALUES ($1, $2, $3)`;
    values.push(username, encryptedPassword);
    await db.query(query, values);
    return next();
  } catch (e) {
    return next(err);
  }
};

userController.createList = async (req, res, next) => {
  // we will get user id from the session, for now it's just hard coded id
  // name for the list will come from req.body
  // values for creating a list: user id, name of the list
  const values = [3, 'Python resources'];
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
  const { list_id, url } = req.body;

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
      db.query(query, params).then((response) => console.log('success'));
    } catch (e) {
      return next(err);
    }
  } else {
    return next(err);
  }
};

module.exports = userController;
