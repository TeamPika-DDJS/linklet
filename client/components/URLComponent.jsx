import React from 'react';
import { Link } from 'react-router-dom';

const URLComponent = ({ url }) => {
  return (
    <div className="URL-component">
      <a href={url}>{url}</a>
    </div>
  );
};

export default URLComponent;
