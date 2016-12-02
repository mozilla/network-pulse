import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import request from 'superagent';

import Featured from './pages/featured.jsx';
import Latest from './pages/latest.jsx';
import Favs from './pages/favs.jsx';
import Issues from './pages/issues.jsx';
import Issue from './pages/issue.jsx';
import Entry from './pages/entry.jsx';
import AddNew from './pages/add.jsx';

import Navbar from './components/navbar/navbar.jsx';
import SearchBar from './components/search-bar/search-bar.jsx';
import Footer from './components/footer/footer.jsx';

import googleSheetParser from './js/google-sheet-parser';

const App = React.createClass({
  componentDidMount() {
    let GOOGLE_SHEET_ID = `1vmYQjQ9f6CR8Hs5JH3GGJ6F9fqWfLSW0S4dz-t2KTF4`;
    let url = `https://spreadsheets.google.com/feeds/cells/${GOOGLE_SHEET_ID}/1/public/values?alt=json`;

    request
      .get(url)
      .set(`Accept`, `application/json`)
      .end((err, res)=>{
        console.log("///////////////////////// \n\n\n");
        // console.log(googleSheetParser.parse(res.body));
        this.setState({
          loadedFromGoogle: true,
          projects: googleSheetParser.parse(res.body)
        });
        window.projects = googleSheetParser.parse(res.body);
      });
  },
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
      <Route path="/featured" component={Featured} />
      <Route path="/latest" component={Latest} />
      <Route path="/favs" component={Favs} />
      <Route path="/issues" component={Issues} />
      <Route path="/issues/:issue" component={Issue} />
      <Route path="/entry/:entryId" component={Entry} />
      <Route path="/add" component={AddNew} />
    </Route>
  </Router>
), document.getElementById(`app`));
