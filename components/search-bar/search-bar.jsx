import React from 'react';

export default React.createClass({
  render() {
    return (
     <div id="search">
        <div className="container">
          <input id="search-box" name="search-box" placeholder="Search keywords, people, tags..." />
          <button className="dismiss">
            <div>&times;</div>
          </button>
        </div>
      </div>
    );
  }
});
