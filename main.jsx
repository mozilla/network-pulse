import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';

import Featured from './pages/featured.jsx';
import Latest from './pages/latest.jsx';
import Favs from './pages/favs.jsx';
import Issues from './pages/issues.jsx';
import Issue from './pages/issue.jsx';
import Entry from './pages/entry.jsx';
import Add from './pages/add/add.jsx';
import Search from './pages/search/search.jsx';

import Navbar from './components/navbar/navbar.jsx';
import Footer from './components/footer/footer.jsx';

const App = React.createClass({
  render() {
    return (
      <div>
        <Navbar router={this.props.router}/>
        <div id="main" className="container">
          {this.props.children}
        </div>
        <Footer/>
      </div>
    );
  }
});

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/featured" />
      <Route path="featured" component={Featured} />
      <Route path="latest" component={Latest} />
      <Route path="favs" component={Favs} />
      <Route path="issues">
        <IndexRoute component={Issues} />
        <Route path=":issue" component={Issue} />
      </Route>
      <Route path="entry/:entryId" component={Entry} />
      <Route path="add" component={Add} />
      <Route path="search" component={Search} />
    </Route>
  </Router>
), document.getElementById(`app`));
