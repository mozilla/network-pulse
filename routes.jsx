import React from 'react';
import ReactGA from 'react-ga';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import { Helmet } from "react-helmet";
import pageSettings from './js/app-page-settings';
import Service from './js/service.js';
import env from "./config/env.generated.json";

import ProjectLoader from './components/project-loader/project-loader.jsx';
import Bookmarks from './pages/bookmarks.jsx';
import Issues from './pages/issues/issues.jsx';
import Issue from './pages/issue.jsx';
import Entry from './pages/entry.jsx';
import SingleFilterCriteriaPage from './pages/single-filter-criteria-page.jsx';
import Add from './pages/add/add.jsx';
import Submitted from './pages/add/submitted.jsx';
import Search from './pages/search/search.jsx';
import Moderation from './pages/moderation.jsx';
import Profile from './pages/profile.jsx';
import ProfileEdit from './pages/profile-edit/profile-edit.jsx';
import NotFound from './pages/not-found.jsx';

import Navbar from './components/navbar/navbar.jsx';
import Footer from './components/footer/footer.jsx';

const Featured = () => {
  let handleOnClick = function() {
    ReactGA.event({
      category: `Browse`,
      action: `About learn more tap`,
      label: `Tagline learn more link`
    });
  };

  let learnMore = env.LEARN_MORE_LINK ? <span><a href={env.LEARN_MORE_LINK} onClick={() => handleOnClick()}>Learn more</a>.</span> : null;

  return <div>
          <Helmet><title>Featured</title></Helmet>
          <p>Discover & collaborate on projects for a healthy internet. {learnMore}</p>
          <ProjectLoader featured={`True`} />
        </div>;
};

const Latest = () => {
  return <div>
          <Helmet><title>Latest</title></Helmet>
          <ProjectLoader />
        </div>;
};

const Help = (router) => {
  let searchParam = { key: `help_type`, value: router.params.helpType };
  return <SingleFilterCriteriaPage searchParam={searchParam} headerLabel="Help" />;
};

const Tag = (router) => {
  let searchParam = { key: `tag`, value: router.params.tag };
  return <SingleFilterCriteriaPage searchParam={searchParam} headerLabel="Tag" />;
};

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: null
    };
  }

  componentDidMount() {
    Service.profileMe()
      .then(userProfile => {
        this.setState({ userProfile });
      })
      .catch(reason => {
        console.error(reason);
      });
  }

  render() {
    return <Profile profile={this.state.userProfile} />;
  }
}

class PublicProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: null
    };
  }

  componentDidMount() {
    Service.profile(this.props.params.id)
      .then(userProfile => {
        this.setState({ userProfile });
      })
      .catch(reason => {
        console.error(reason);
      });
  }

  render() {
    return <Profile profile={this.state.userProfile} />;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.pageTitle = `Mozilla Network Pulse`;
  }

  render() {
    return (
      <div>
        <Helmet titleTemplate={`%s - ${this.pageTitle}`}
                defaultTitle={this.pageTitle}>
        </Helmet>
        <Navbar router={this.props.router}/>
        <div id="main" className="container">
          {this.props.children}
        </div>
        <Footer/>
      </div>
    );
  }
}

// We have renamed all non user facing "favorites" related variables and text (e.g., favs, faved, etc) to "bookmarks".
// This is because we want client side code to match what Pulse API uses (i.e., bookmarks)
// For user facing bits like UI labels and URL path we want them to stay as "favorites".
// That's why a route like <Route path="favs" component={Bookmarks} /> is seen here.
// For more info see: https://github.com/mozilla/network-pulse/issues/326

// PageSettings is used to preserve a project list view state.
// Attach route enter hook pageSettings.setCurrentPathname(evt.location.pathname)
// *only* to routes that render a list of projects.
module.exports = (
  <Route path="/" component={App}>
    <IndexRedirect to="/featured" />
    <Route path="featured" component={Featured} onEnter={evt => pageSettings.setCurrentPathname(evt.location.pathname)} />
    <Route path="latest" component={Latest} onEnter={evt => pageSettings.setCurrentPathname(evt.location.pathname)} />
    <Route path="favs" component={Bookmarks} onEnter={evt => pageSettings.setCurrentPathname(evt.location.pathname)} />
    <Route path="issues">
      <IndexRoute component={Issues} />
      <Route path=":issue" component={Issue} onEnter={evt => pageSettings.setCurrentPathname(evt.location.pathname)} />
    </Route>
    <Route path="entry/:entryId" component={Entry} onEnter={() => pageSettings.setScrollPosition()} onLeave={() => pageSettings.setRestore(true)} />
    <Route path="add" component={Add} />
    <Route path="submitted" component={Submitted} />
    <Route path="search" component={Search} onEnter={evt => pageSettings.setCurrentPathname(evt.location.pathname)} />
    <Route path="tags">
      <IndexRedirect to="/latest" />
      <Route path=":tag" component={Tag} onEnter={evt => pageSettings.setCurrentPathname(evt.location.pathname)} />
    </Route>
    <Route path="help">
      <IndexRedirect to="/latest" />
      <Route path=":helpType" component={Help} onEnter={evt => pageSettings.setCurrentPathname(evt.location.pathname)} />
    </Route>
    <Route path="moderation" component={Moderation} onEnter={evt => pageSettings.setCurrentPathname(evt.location.pathname)} />
    <Route path="profile">
      <Route path="me" component={MyProfile} onEnter={evt => pageSettings.setCurrentPathname(evt.location.pathname)} />
      <Route path=":id" component={PublicProfile} onEnter={evt => pageSettings.setCurrentPathname(evt.location.pathname)} />
    </Route>
    <Route path="myprofile" component={ProfileEdit} onEnter={evt => pageSettings.setCurrentPathname(evt.location.pathname)} />
    <Route path="*" component={NotFound}/>
  </Route>
);
