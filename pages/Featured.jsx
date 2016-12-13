import React from 'react';

import InactiveSearchBar from '../components/inactive-search-bar.jsx';
import Navbar from '../components/navbar/navbar.jsx';
import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  render() {
    console.log(`this.props.router`,this.props.router);
    return (
      <div>
        <InactiveSearchBar/>
        <Navbar/>
        <div className="container">
          <ProjectList filter={{key: `featured`}} />
        </div>
      </div>
    );
  }
});
