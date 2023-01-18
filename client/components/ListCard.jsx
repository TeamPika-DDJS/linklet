import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';

const ListCard = ({ listId, listName, setListId }) => {
  const navigate = useNavigate();
  return (
    <Card>
      <div
        className="list-card"
        onClick={() => {
          setListId(listId);
        }}
      >
        <h3>List ID: {listId} </h3>
        <h3>List Name: {listName} </h3>
      </div>
    </Card>
  );
};

export default ListCard;
