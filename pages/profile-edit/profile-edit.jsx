import React from 'react';
import { browserHistory } from 'react-router';
import { Helmet } from "react-helmet";
import { Form } from 'react-formbuilder';
import HintMessage from '../../components/hint-message/hint-message.jsx';
import utility from '../../js/utility';
import user from '../../js/app-user';
import fields from './form/fields';

const PRE_SUBMIT_LABEL = `Submit`;
const SUBMITTING_LABEL = `Submitting...`;

export default React.createClass({
  getInitialState() {
    return {
      user
    };
  },
  componentDidMount() {
    user.addListener(this);
    user.verify(this.props.router.location);
  },
  componentWillUnmount() {
    user.removeListener(this);
  },
  updateUser(event) {
    // this updateUser method is called by "user" after changes in the user state happened
    if (event === `verified` ) {
      this.setState({ user });
    }
  },
  handleSignInBtnClick(event) {
    event.preventDefault();

    user.login(utility.getCurrentURL());
  },
  handleLogOutBtnClick(event) {
    event.preventDefault();
    // TODO:FIXME
    // placeholder event handler
    user.logout();
    browserHistory.push({
      pathname: `/featured`
    });
  },
  handleFormUpdate() {
    // TODO:FIXME
    // placeholder event handler
  },
  handleFormSubmit(event) {
    event.preventDefault();
    // TODO:FIXME
    // placeholder event handler
  },
  getContentForLoggedInUser() {
    return( <div className="row">
              <div className="col-12">
                <h1>Your profile</h1>
                <p>[FIXME] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere a magna a vulputate. Morbi vel odio tincidunt sem pulvinar dapibus ut at odio <span style={{color: `red`}}>link to legal</span>.</p>
                <p>All fields are optional.</p>
                <div className="mb-4">
                  <div className="mb-3">
                    <span>Email <em>(email won't be displayed or shared)</em></span>
                    <div className="text-muted">
                      <span>{user.email}</span>
                      <span className="d-block d-sm-inline-block ml-0 ml-sm-4"><button className="btn btn-link inline-link" onClick={(event) => this.handleLogOutBtnClick(event)}>Sign out</button></span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <span>User name</span>
                    <div className="text-muted">
                      <span>{user.username}</span>
                    </div>
                  </div>
                </div>
                <Form ref="form" fields={fields}
                                   inlineErrors={true}
                                   onUpdate={(event) => this.handleFormUpdate(event)}
                                   className="row" />
                <div className="submit-section">
                  <button
                    className="btn btn-info mr-3"
                    type="submit"
                    onClick={this.handleFormSubmit}
                    disabled={this.state.submitting ? `disabled` : null}
                  >{ this.state.submitting ? SUBMITTING_LABEL : PRE_SUBMIT_LABEL }</button>
                </div>
              </div>
            </div>);
  },
  getAnonymousContent() {
    let header = `Please sign in to edit your profile.`;
    let linkComponent = <a href={user.getLoginURL(utility.getCurrentURL())}
                           onClick={(event) => this.handleSignInBtnClick(event)}>
                           Sign in with Google
                        </a>;
    let additionalMessage;

    if (user.failedLogin) {
      header = `Sign in failed`;
      linkComponent = <Link to={`/featured`}>Explore featured</Link>;
      additionalMessage = <p>Sorry, login failed! Please try again or <a href="mailto:https://mzl.la/pulse-contact">contact us</a>.</p>;
    }

    return <HintMessage iconComponent={<span className={`fa fa-user`}></span>}
                         header={header}
                         linkComponent={linkComponent}>
              {additionalMessage}
            </HintMessage>;
  },
  getContent() {
    if (user.loggedin === undefined) return null;

    if (user.loggedin) return this.getContentForLoggedInUser();

    return this.getAnonymousContent();
  },
  render() {
    return (
      <div className="profile-edit-page row justify-content-center">
        <Helmet><title>Update profile</title></Helmet>
        <div className="col-lg-8">
          { this.getContent() }
        </div>
      </div>
    );
  }
});
