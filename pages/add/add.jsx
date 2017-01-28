import React from 'react';
import { browserHistory } from 'react-router';
import HintMessage from '../../components/hint-message/hint-message.jsx';
import utility from '../../js/utility';
import user from '../../js/app-user';

export default React.createClass({
  getInitialState() {
    return {
      numCreatorFields: 1,
      user
    };
  },
  componentDidMount() {
    user.verify(this.props.router.location, () => this.setState({ user }));
  },
  handleSignInBtnClick(event) {
    event.preventDefault();

    user.login(utility.getCurrentURL());
  },
  handleLogOutBtnClick(event) {
    event.preventDefault();

    user.logout();
    browserHistory.push({
      pathname: `/featured`
    });
  },
  handleCreatorClick(event) {
    event.preventDefault();
    this.setState({numCreatorFields: this.state.numCreatorFields+1});
  },
  getContentForLoggedInUser() {
    return( <div>
              <p>(TODO:FIXME: form for logged in user to be built)</p>
              <p>Hi<span className="user-full-name"> {user.username}</span></p>
              <p className="log-out-prompt">Not you? <button className="btn btn-link" onClick={this.handleLogOutBtnClick}>Sign out</button>.</p>
            </div>);
  },
  getFailurePrompt() {
    return ( <HintMessage imgSrc={`/assets/svg/icon-user.svg`}
                          header={`Sign in failed`}
                          internalLink={`/featured`}
                          linkText={`Explore featured`}>
              <p>Only Mozilla staff can login now as we test this new platform. Check back soon!</p>
            </HintMessage>);
  },
  getAnonymousContent() {
    return (<HintMessage imgSrc={`/assets/svg/icon-user.svg`}
                         header={`Please sign in to add a post`}
                         externalLink={user.getLoginURL(utility.getCurrentURL())}
                         linkText={`Sign in`}
                         onClick={this.handleSignInBtnClick}>
              <p>Please note, only Mozilla staff can login now as we test this new platform.</p>
            </HintMessage>);
  },
  getContent() {
    if (user.loggedin) {
      return this.getContentForLoggedInUser();
    }

    if (user.failedLogin) {
      return this.getFailurePrompt();
    }

    return this.getAnonymousContent();
  },
  render() {
    return (
      <div className="add-page">
        { this.getContent() }
      </div>
    );
  }
});
