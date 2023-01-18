const { Pool } = require('pg');

const PG_URI = require('../credentials.js'); //'postgres://otvasbbc:MnavVzPUlbWi45_tv-7eYi0Yu-X9qDfX@peanut.db.elephantsql.com/otvasbbc'; //

const pool = new Pool({
  connectionString: PG_URI
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
};
