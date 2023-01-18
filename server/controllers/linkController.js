const db = require('../models/database');

linkController = {};

linkController.readLinks = async (req, res, next) => {
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

  linkController.addLinkToList = async (req, res, next) => {
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



module.exports = linkController;