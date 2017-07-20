import React from 'react';
import { browserHistory, Link } from 'react-router';
import { Helmet } from "react-helmet";
import { Form } from 'react-formbuilder';
import HintMessage from '../../components/hint-message/hint-message.jsx';
import Service from '../../js/service.js';
import utility from '../../js/utility';
import user from '../../js/app-user';
import basicInfoFields from './form/basic-info-fields';
import detailInfoFields from './form/detail-info-fields';

const PRE_SUBMIT_LABEL = `Submit`;
const SUBMITTING_LABEL = `Submitting...`;

export default React.createClass({
  getInitialState() {
    return {
      numCreatorFields: 1,
      user,
      formValues: {},
      authError: false,
      serverError: false,
      submitting: false,
      showFormInvalidNotice: false
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

    user.logout();
    browserHistory.push({
      pathname: `/featured`
    });
  },
  handleCreatorClick(event) {
    event.preventDefault();
    this.setState({numCreatorFields: this.state.numCreatorFields+1});
  },
  handleFormUpdate(evt, name, field, value) {
    let formValues = this.state.formValues;

    formValues[name] = value;
    this.setState({
      formValues,
      // hide notice once user starts typing again
      // this is a quick fix. for context see https://github.com/mozilla/network-pulse/pull/560
      showFormInvalidNotice: false
    });
  },
  handleFormSubmit(event) {
    event.preventDefault();
    this.refs.basicForm.validates(basicFormIsValid => {
      this.refs.detailForm.validates(detailFormIsValid => {
        if (!basicFormIsValid) {
          console.error(`basic form does not pass validation!`);
        }

        if (!detailFormIsValid) {
          console.error(`detail form does not pass validation!`);
        }

        if (!basicFormIsValid || !detailFormIsValid) {
          this.setState({showFormInvalidNotice: true});
          return;
        }

        this.setState({
          showFormInvalidNotice: false,
          submitting: true
        }, () => this.postEntry(this.state.formValues));
      });
    });
  },
  getNonce(callback) {
    Service.nonce()
      .then((nonce) => {
        callback(false, nonce);
      })
      .catch((reason) => {
        this.setState({
          authError: true
        });
        callback(new Error(`Could not retrieve data from /nonce. Reason: ${reason}`));
      });
  },
  postEntry(entryData) {
    this.getNonce((error, nonce) => {
      if (error) {
        console.error(error);
        return;
      }

      let data = Object.assign({}, entryData);

      data.nonce = nonce.nonce;
      data.csrfmiddlewaretoken = nonce.csrf_token;

      Service.entries
        .post(data)
        .then(response => {
          const entryId = response.id;

          // will the API show this user the new entry?
          Service.entry
          .get(entryId)
          .then(result => {
            if(result) {
              browserHistory.push({
                pathname: `/entry/${response.id}`,
                query: {
                  justPostedByUser: true
                }
              });
            } else {
              browserHistory.push({
                pathname: `/submitted`,
                query: { entryId }
              });
            }
          })
          .catch(reason => {
            // a 404 is yielded as an error by Service.entry
            console.error(reason);
            browserHistory.push({
              pathname: `/submitted`,
              query: { entryId }
            });
          });

        })
        .catch(reason => {
          this.setState({
            serverError: true
          });
          console.error(reason);
        });
    });
  },
  getContentForLoggedInUser() {
    let authErrorMessage = this.state.authError ? <span className="error">You seem to be logged out at this moment. Try <a href={user.getLoginURL(utility.getCurrentURL())}>logging in</a> again?</span> : null;
    let serverErrorMessage = this.state.serverError ? <span className="error">Sorry! We're unable to submit entry to server at this time.</span> : null;

    return( <div>
              <h1>Share with the Network</h1>
              <p>Do you have something to share? If it might be useful to someone in our network, share it here! Pulse includes links to products and software tools, research reports and findings, think pieces, white papers, interviews, and curricula. If it might be useful, share it… at any stage or fidelity.</p>
              <p>Please keep your language simple and useful for a broad audience. No jargon. Submissions may be lightly edited by our curators for spelling, grammar and style consistency.</p>
              <div className="mb-6">
                <h2>Basic Info</h2>
                <div className="posted-by">
                  <p className="d-inline-block mr-3 mb-3">Posted by: <span className="text-muted">{user.username}</span></p>
                  <p className="d-inline-block text-muted">Not you? <button className="btn btn-link inline-link" onClick={this.handleLogOutBtnClick}>Sign out</button>.</p>
                </div>
                <Form ref="basicForm" fields={basicInfoFields}
                                       inlineErrors={true}
                                       onUpdate={this.handleFormUpdate} />
                <h2>Optional Details</h2>
                <Form ref="detailForm" fields={detailInfoFields}
                                        inlineErrors={true}
                                        onUpdate={this.handleFormUpdate} />
                <div className="submit-section">
                  <p>By submitting your entry, you agree to be bound by the <a href="https://www.mozilla.org/about/legal/terms/mozilla/" target="_blank">Mozilla Terms of Service</a>, and you agree that your entry may be edited lightly for clarity and style.</p>
                  <button
                    className="btn btn-info mr-3"
                    type="submit"
                    onClick={this.handleFormSubmit}
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
    let header = `Please sign in to add a post`;
    let linkComponent = <a href={user.getLoginURL(utility.getCurrentURL())}
                           onClick={this.handleSignInBtnClick}>
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
      <div className="add-page row justify-content-center">
        <Helmet><title>Post an entry</title></Helmet>
        <div className="col-lg-8">
          { this.getContent() }
        </div>
      </div>
    );
  }
});
