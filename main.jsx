import React from "react";
import ReactGA from "react-ga";
import { withRouter } from "react-router";
import { Switch, Route, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Analytics from "./js/analytics.js";

import ProjectLoader from "./components/project-loader/project-loader.jsx";
import Bookmarks from "./pages/bookmarks.jsx";
import Issues from "./pages/issues/issues.jsx";
import Issue from "./pages/issue.jsx";
import Entry from "./pages/entry.jsx";
import SingleFilterCriteriaPage from "./pages/single-filter-criteria-page.jsx";
import Add from "./pages/add/add.jsx";
import Submitted from "./pages/add/submitted.jsx";
import Search from "./pages/search/search.jsx";
import Moderation from "./pages/moderation.jsx";
import Profile from "./pages/profile.jsx";
import ProfileEdit from "./pages/profile-edit/profile-edit.jsx";
import NotFound from "./pages/not-found.jsx";
import JoinUsModal from "./components/join-us-modal/join-us-modal.jsx";
import Navbar from "./components/navbar/navbar.jsx";
import Footer from "./components/footer/footer.jsx";

const Latest = () => {
  return (
    <div className="container mt-5">
      <Helmet>
        <title>Latest</title>
      </Helmet>
      <ProjectLoader />
    </div>
  );
};

const Help = router => {
  let searchParam = {
    key: `help_type`,
    value: decodeURIComponent(router.match.params.helpType)
  };
  return (
    <SingleFilterCriteriaPage searchParam={searchParam} headerLabel="Help" />
  );
};

const Tag = router => {
  let searchParam = {
    key: `tag`,
    value: decodeURIComponent(router.match.params.tag)
  };
  return (
    <SingleFilterCriteriaPage searchParam={searchParam} headerLabel="Tag" />
  );
};

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Search} />
    <Route
      path="/search/:tab"
      render={props => (
        <Redirect to={`/${props.match.params.tab}${props.location.search}`} />
      )}
    />
    <Route
      exact
      path="/search"
      render={props => <Redirect to={`/projects${props.location.search}`} />}
    />
    <Route path="/:tab(people|projects)" component={Search} />
    <Redirect exact path="/featured" to="/" />
    <Route path="/latest" component={Latest} />
    <Route path="/favs" component={Bookmarks} />
    <Route exact path="/issues" component={Issues} />
    <Route path="/issues/:issue" component={Issue} />
    <Route path="/entry/:entryId" component={Entry} />
    <Route path="/add" component={Add} />
    <Route path="/submitted" component={Submitted} />
    <Route exact path="/tags" render={() => <Redirect to="/latest" />} />
    <Route path="/tags/:tag" component={Tag} />
    <Route exact path="/help" render={() => <Redirect to="/latest" />} />
    <Route path="/help/:helpType" component={Help} />
    <Route path="/moderation" component={Moderation} />
    <Route exact path="/profile/:id" component={Profile} />
    <Route path="/profile/:id/:tab" component={Profile} />
    <Route path="/myprofile" component={ProfileEdit} />
    <Route path="*" component={NotFound} />
  </Switch>
);

const JoinUsModalWithRouter = withRouter(JoinUsModal);
const NavbarWithRouter = withRouter(Navbar);

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.metaTitle = `Mozilla Pulse`;
    this.metaDescription = `Discover & collaborate on projects for a healthy internet.`;
    this.metaImage = `https://assets.mofoprod.net/network-pulse/images/mozilla-og-image-min.original.jpg`;
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
      <React.Fragment>
        <Helmet>
          <meta name="description" content={this.metaDescription} />
          <meta name="twitter:title" content={this.metaTitle} />
          <meta name="twitter:description" content={this.metaDescription} />
          <meta name="twitter:image" content={this.metaImage} />
          <meta property="og:url" content={this.props.url} />
          <meta property="og:title" content={this.metaTitle} />
          <meta property="og:description" content={this.metaDescription} />
          <meta property="og:site_name" content={this.metaTitle} />
          <meta property="og:image" content={this.metaImage} />
        </Helmet>
        <JoinUsModalWithRouter />
        <NavbarWithRouter />
        <div id="main" className="mb-5">
          <Routes />
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Main;
