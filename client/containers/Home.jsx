import React, { useState, useEffect, useRef } from 'react';
import ListContainer from './ListContainer';
import URLContainer from './URLContainer';
import '../styles/HomeStyles.css';

const Home = ({ users }) => {
  const [listId, setListId] = useState(-1);
  const listName = useRef('default');
  const list = useRef(['http://google.com', 'http://www.yahoo.com']);
  const userName = useRef('Jo');
  // query backend for listName and list based on listId
  useEffect(() => {
    console.log('list change')
    // fetch backend
    // listName.current = '';
    // list.current = [];
    // userName.current = '';
  }, [listId]);

  // const userLists = Object.values(users).map((userName, i) => (
  //   <ListContainer key={i} userName={userName} />
  // ));

  return (
    <div className="home-display">
      <div className="list-display">
        <h3>My lists</h3>
        <ListContainer setListId={setListId} />
        <h3>All other lists</h3>
        <ListContainer setListId={setListId} />
      </div>
      <div className="url-display">
        <h3>URLs</h3>
        {listId >= 0 ? (
          <URLContainer
            className="url-container"
            userName={userName.current}
            listName={listName.current}
            list={list.current}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Home;
