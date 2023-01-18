import React, { useState, useEffect } from 'react';
import URLComponent from '../components/URLComponent';
import URLContainer from '../containers/URLContainer';
import ListCard from '../components/ListCard';
// username comes from App
const ListContainer = ({ userName, setListId }) => {
  // dynamically rendered listIds using userName
  const [lists, setList] = useState({
    1: 'news',
    2: 'sports'
  });
  const listCards = Object.entries(lists).map((list, i) => (
    <ListCard key={i} listId={list[0]} listName={list[1]} setListId={setListId}/>
  ));

  return (
    <div>
      <h3>These are {userName}'s lists</h3>
      {listCards}
    </div>
  );
};

export default ListContainer;
