import React from 'react';

import InactiveSearchBar from '../components/inactive-search-bar.jsx';
import Navbar from '../components/navbar/navbar.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        <InactiveSearchBar/>
        <Navbar/>
        <div className="container">
          <h2>Save your Favs</h2>
          <p>Tap the heart on any project to save it here.</p>
        </div>
      </div>
    );
  }
});
