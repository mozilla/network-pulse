import React from 'react';
import { browserHistory } from 'react-router';
import { Helmet } from "react-helmet";
import { Form } from 'react-formbuilder';
import HintMessage from '../../components/hint-message/hint-message.jsx';
import utility from '../../js/utility';
import user from '../../js/app-user';
import Service from '../../js/service';
import formFields from './form/fields';

const PRE_SUBMIT_LABEL = `Submit`;
const SUBMITTING_LABEL = `Submitting...`;

export default React.createClass({
  getInitialState() {
    return {
      user,
      currentProfileLoaded: false,
      fields: {},
      formValues: {},
      serverError: false,
      submitting: false,
      showFormInvalidNotice: false
    };
  },
  componentDidMount() {
    user.addListener(this);
    user.verify(this.props.router.location);

    this.loadCurrentProfile();
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
  loadCurrentProfile() {
    // get current profile data and load it into form
    Service.myProfile.get().then(profile => {
      let fields = formFields;

      Object.keys(fields).forEach(name => {
        // load current profile to form fields
        fields[name].defaultValue = profile[name];
      });

      this.setState({
        fields,
        currentProfileLoaded: true
      });
    });
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
  handleFormUpdate(event, name, field, value) {
    let formValues = this.state.formValues;

    // if value of an image field is a link, we don't wanna include it in the formValues state
    // as the link is just for previewing user's current profile and not the image object we are
    // sending to backend
    if (field.type !== `image` || (field.type === `image` && typeof value !== `string`)) {
      formValues[name] = value;
      this.setState({
        formValues,
        // hide notice once user starts typing again
        // this is a quick fix. for context see https://github.com/mozilla/network-pulse/pull/560
        showFormInvalidNotice: false
      });
    }
  },
  handleFormSubmit(event) {
    event.preventDefault();

    this.refs.form.validates(formIsValid => {
      if (!formIsValid) {
        this.setState({ showFormInvalidNotice: true });
        return;
      }

      this.setState({
        showFormInvalidNotice: false,
        submitting: true
      }, () => this.updateProfile(this.state.formValues));
    });
  },
  updateProfile(profile) {
    Service.myProfile
      .put(profile)
      .then(() => {
        browserHistory.push({
          pathname: `/profile/me`,
        });
      })
      .catch(reason => {
        this.setState({
          serverError: true
        });
        console.error(reason);
      });
  },
  renderForm() {
    if (!this.state.currentProfileLoaded) return null;

    return <Form ref="form" fields={this.state.fields}
      inlineErrors={true}
      onUpdate={(event, name, field, value) => this.handleFormUpdate(event, name, field, value)}
      className="row" />;
  },
  getContentForLoggedInUser() {
    let authErrorMessage = this.state.authError ? <span className="error">You seem to be logged out at this moment. Try <a href={user.getLoginURL(utility.getCurrentURL())}>logging in</a> again?</span> : null;
    let serverErrorMessage = this.state.serverError ? <span className="error">Sorry! We're unable to submit entry to server at this time.</span> : null;

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
                { this.renderForm() }
                <div className="submit-section">
                  <button
                    className="btn btn-info mr-3"
                    type="submit"
                    onClick={(event) => this.handleFormSubmit(event)}
                    disabled={this.state.submitting ? `disabled` : null}
                  >{ this.state.submitting ? SUBMITTING_LABEL : PRE_SUBMIT_LABEL }</button>
                  { authErrorMessage }
                  { serverErrorMessage }
                  { this.state.showFormInvalidNotice && <span>Something isn't right. Check your info above.</span> }
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
