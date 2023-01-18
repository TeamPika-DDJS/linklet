import { stringLiteral } from '@babel/types';
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './containers/Home';
import URLComponent from './components/URLComponent';
import ListContainer from './containers/ListContainer';
import Auth from './containers/Auth';

const App = () => {
  // create array of Routes from list of users in user table
  const [users, setUsers] = useState({
    1: 'jo',
    2: 'stephen',
    3: 'daria',
    4: 'dyson'
  });

  const routes = Object.values(users).map((user, i) => (
    <Route
      key={i}
      exact
      path={user}
      element={<ListContainer userName={user} />}
    />
  ));
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home users={users} />} />
          {routes}
          <Route exact path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
