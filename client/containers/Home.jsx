import React, { useState, useEffect, useRef } from 'react';
import ListContainer from './ListContainer';
import URLContainer from './URLContainer';
import '../styles/HomeStyles.css';

const Home = ({ users }) => {
  const [listId, setListId] = useState(-1);
  const [lists, setLists] = useState({});
  const [links, setLinks] = useState(['https://developer.mozilla.org/en-US/', 'https://www.codesmith.io', 'https://w3schools.com']);
  const listName = useRef('Favorite Javascript Resources');
  const urlList = useRef(['https://mdn.com', 'https://www.codesmith.io', 'https://w3schools.com']);
  const userName = useRef('Jo');

  // get lists from backend
  // returns:
  // {userLists:  [{'id':'listid', 'name':'listname'}],
  //  otherLists: [{'id':'listid', 'name':'listname'}]}
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await fetch(`/api/users/3/lists`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setLists(data);
        }
      } catch (err) {
        console.log('Network error trying to fetch lists');
      }
    };
    fetchLists();
  }, []);

  // get a link array associated with listId from backend
  // returns:
  // ['link1', 'link2', 'link3', 'link4']

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = fetch(`/api/lists/1/links`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setLinks(data);
        }
      } catch (err) {
        console.log('Network error trying to fetch links');
      }
    };
    fetchLinks();
  }, [listId]);

  // const userLists = Object.values(users).map((userName, i) => (
  //   <ListContainer key={i} userName={userName} />
  // ));
  return (
    <div className="home-display">
      <div className="list-display">
        <h3>My Lists:</h3>
        {lists.userLists ? (
          <ListContainer setListId={setListId} lists={lists.userLists} />
        ) : null}
        <h3>Other Lists:</h3>
        {lists.otherLists ? (
          <ListContainer setListId={setListId} lists={lists.otherLists} />
        ) : null}
      </div>
      <div className="url-display">
        <h3>URLs</h3>
        {listId >= 0 ? (
          <URLContainer
            className="url-container"
            links={links}
            userName={userName.current}
            listName={listName.current}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Home;
