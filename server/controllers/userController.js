const db = require('../models/database');
const bcrypt = require('bcrypt');

const userController = {};

userController.createUser = async (req, res, next) => {
  //   const { username, password, email } = req.body;

  const username = 'Dasha';
  const email = 'admin@gmail.com';
  const password = '1234';

  const salt_work_factor = 10;
  const encryptedPassword = await bcrypt.hash(password, salt_work_factor);

  // check if this email is taken
  // try to query db
  try {
    const query = `SELECT * FROM users WHERE email = $1`;
    const values = [email];
    const response = await db.query(query, values);
    const rows = response.rows;
    if (rows.length > 0) { 
        next()
    }
};
  }
  const query = `SELECT * FROM users WHERE email = $1`;
  const values = [email];
  const response = await db.query(query, values);
  const rows = response.rows;
  if (rows.length > 0) console.log('user cannot be created');
};

userController.createUser();
