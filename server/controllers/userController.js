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
    const query = `INSERT INTO users (email, username, password) VALUES ($1, $2, $3)`;
    values.push(username, encryptedPassword);
    await db.query(query, values);
    return next();
  } catch (e) {
    return next(err);
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

module.exports = userController;
