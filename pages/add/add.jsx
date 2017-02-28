import React from 'react';
import { browserHistory } from 'react-router';
import { Form } from 'react-formbuilder';
import HintMessage from '../../components/hint-message/hint-message.jsx';
import Service from '../../js/service.js';
import utility from '../../js/utility';
import user from '../../js/app-user';
import basicInfoFields from './form/basic-info-fields';
import detailInfoFields from './form/detail-info-fields';

export default React.createClass({
  getInitialState() {
    return {
      numCreatorFields: 1,
      user,
      formValues: {},
      authError: false,
      serverError: false
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
  handleFormUpdate(evt, name, field, value) {
    let formValues = this.state.formValues;

    if ( name === `tags` ) {
      value = value.trim().split(/,\s*/);
    }

    formValues[name] = value;
    this.setState({ formValues });
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
          return;
        }

        this.postEntry(this.state.formValues);
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

      // TODO:FIXME:
      // Temp fix, "tags", "issues", and "creators" are supposed to be optional fields
      // but currently Pulse API sees them as required fields
      // Ticket has been filed https://github.com/mozilla/network-pulse-api/issues/80
      if (!data.tags) {
        data.tags = [];
      }

      if (!data.issues) {
        data.issues = [];
      }

      if (!data.creators) {
        data.creators = [];
      }

      Service.entries
        .post(data)
        .then((response) => {
          browserHistory.push({
            pathname: `/entry/${response.id}`,
            query: {
              justPostedByUser: true
            }
          });
        })
        .catch((reason) => {
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
              <p>Do you have something to share? If it might be useful to someone in our network, share it here! Pulse includes links to products and software tools, research reports and findings, think pieces, white papers, interviews, and curricula. If it might be useful, share it … at any stage or fidelity.</p>
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
                  <button className="btn btn-info mr-3" type="submit" onClick={this.handleFormSubmit}>Submit</button>
                  { authErrorMessage }
                  { serverErrorMessage }
                </div>
              </div>
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
      <div className="add-page row justify-content-center">
        <div className="col-lg-8">
          { this.getContent() }
        </div>
      </div>
    );
  }
});
