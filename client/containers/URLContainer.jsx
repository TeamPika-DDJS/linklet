import React, { useState, useEffect } from 'react';
import URLComponent from '../components/URLComponent';
import { Card } from '@mui/material';

// username comes from App
const URLContainer = ({ userName, listName, list }) => {

  // dynamically rendered state from backend using userName
  // const [links, setLinks] = useState({
  //   1: 'https://www.google.com',
  //   2: 'http://www.yahoo.com',
  //   3: 'http://www.msn.com'
  // });

  // useEffect(() => {
  //   console.log(`fetching listId ${listId}`);
  //   // fetch from backend to get all the links that belong to the list
  //   // fetch(`/${listId}`)
  //   //   .then(res => res.json())
  //   //   .then(data => setLinks(data))
  // })
  console.log('list is', list)
  const URLs = list.map((url, i) => (
    <URLComponent key={i} url={url} />
  ));

  return (
    <Card>
      <h3>This {userName}'s list: {listName}</h3>
      {URLs}
    </Card>
  );
};

export default URLContainer;
