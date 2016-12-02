import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Featured from './pages/Featured.jsx';
import Latest from './pages/Latest.jsx';
import Favs from './pages/Favs.jsx';
import Issues from './pages/Issues.jsx';
import Issue from './pages/Issue.jsx';
import Entry from './pages/Entry.jsx';

import Navbar from './components/navbar/navbar.jsx';
import SearchBar from './components/search-bar/search-bar.jsx';
import Footer from './components/footer/footer.jsx';

const App = React.createClass({
  render() {
    return (
      <div>
        <SearchBar/>
        <Navbar/>
        <div className="container">
          {this.props.children}
        </div>
        <Footer/>
      </div>
    );
  }
});

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Featured} />
      <Route path="featured" component={Featured} />
      <Route path="latest" component={Latest} />
      <Route path="favs" component={Favs} />
      <Route path="issues" component={Issues} />
      <Route path="issues/:issue" component={Issue} />
      <Route path="entry/:entryId" component={Entry} />
    </Route>
  </Router>
), document.getElementById(`app`));
