import React, { useState, useEffect } from 'react';
import URLComponent from '../components/URLComponent';
import { Card } from '@mui/material';

// username comes from App
const URLContainer = ({ userName, listName, links }) => {
  const URLs = links.map((url, i) => <URLComponent key={i} url={url} />);

  return (
    <Card>
      <h3>
        This {userName}'s list: {listName}
      </h3>
      {URLs}
    </Card>
  );
};

export default URLContainer;
