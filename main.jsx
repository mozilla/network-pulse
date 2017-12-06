import React from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Helmet } from "react-helmet";
import Analytics from './js/analytics.js';
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
import PublicProfile from './pages/public-profile.jsx';
import MyProfile from './pages/my-profile.jsx';
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
          <p className="mb-4">Discover & collaborate on projects for a healthy internet. {learnMore}</p>
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
  let searchParam = { key: `help_type`, value: router.match.params.helpType };
  return <SingleFilterCriteriaPage searchParam={searchParam} headerLabel="Help" />;
};

const Tag = (router) => {
  let searchParam = { key: `tag`, value: router.match.params.tag };
  return <SingleFilterCriteriaPage searchParam={searchParam} headerLabel="Tag" />;
};

const Routes = () => (
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/featured"/>} />
      <Route path="/featured" component={Featured} />
      <Route path="/latest" component={Latest} />
      <Route path="/favs" component={Bookmarks} />
      <Route exact path="/issues" component={Issues} />
      <Route path="/issues/:issue" component={Issue} />
      <Route path="/entry/:entryId" component={Entry} />
      <Route path="/add" component={Add} />
      <Route path="/submitted" component={Submitted} />
      <Route path="/search" component={Search} />
      <Route exact path="/tags" render={() => <Redirect to="/latest"/>} />
      <Route path="/tags/:tag" component={Tag} />
      <Route exact path="/help" render={() => <Redirect to="/latest"/>} />
      <Route path="/help/:helpType" component={Help} />
      <Route path="/moderation" component={Moderation} />
      <Route path="/profile/me" component={MyProfile} />
      <Route path="/profile/:id" component={PublicProfile} />
      <Route path="/myprofile" component={ProfileEdit} />
      <Route path="*" component={NotFound}/>
    </Switch>
);

const NavbarWithRouter = withRouter(Navbar);

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.pageTitle = `Mozilla Network Pulse`;
  }

  componentDidMount() {
    Analytics.logPageView();
  }

  componentDidUpdate() {
    Analytics.logPageView();
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div>
        <Helmet titleTemplate={`%s - ${this.pageTitle}`}
                defaultTitle={this.pageTitle}>
        </Helmet>
        <NavbarWithRouter />
        <div id="main" className="container">
          <Routes />
        </div>
        <Footer/>
      </div>
    );
  }
}

export default Main;
