import React, { useState, useEffect } from 'react';
import URLComponent from '../components/URLComponent';
import URLContainer from '../containers/URLContainer';
import ListCard from '../components/ListCard';
import '../styles/ListContainerStyles.css';

// username comes from App
const ListContainer = ({ setListId, lists }) => {
  // dynamically rendered listIds using userName
  const listCards = lists.map((list, i) => (
    <ListCard
      className="list-card"
      key={i}
      listId={list.id}
      listName={list.name}
      setListId={setListId}
    />
  ));

  return (
    <>
    <div className="list-container">
      {listCards}
    </div>
    </>
  );
};

export default ListContainer;
