import React from 'react';
import { browserHistory } from 'react-router';
import { Form } from 'react-formbuilder';
import HintMessage from '../../components/hint-message/hint-message.jsx';
import Service from '../../js/service.js';
import utility from '../../js/utility';
import user from '../../js/app-user';
import basicInfoFields from './form-fields/basic-info-fields';
import detailInfoFields from './form-fields/detail-info-fields';

export default React.createClass({
  getInitialState() {
    return {
      numCreatorFields: 1,
      user,
      formValues: {}
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
      value = value.split(`#`).map((tag) => {
        console.log(`tag`, tag.trim());
        return tag.trim();
      });
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

        console.log(`yay, we're good to go!`, this.state.formValues);

        this.postEntry(this.state.formValues);
      });
    });
  },
  getNonce(callback) {
    Service.nonce()
      .then((nonce) => {
        callback(nonce);
      })
      .catch((reason) => {
        console.error(reason);
        callback(false);
      });
  },
  postEntry(entryData) {
    this.getNonce((nonce) => {
      if (!nonce) { return; }

      let data = Object.assign({}, entryData);

      data.nonce = nonce.nonce;
      data.csrfmiddlewaretoken = nonce.csrf_token;

      // required fields should only be: title and content_url
      // optional fields: description, interest,get_involved, get_involved_url, thumbnail_url, internal_notes, (user???)

      // TODO:FIXME:
      // temp fix, "tags", "issues", and "creators" are supposed to be an optional fields
      // but currently Pulse API sees them as required fields
      // ticket has been filed https://github.com/mozilla/network-pulse-api/issues/80
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
          console.log(`response`, response);
          browserHistory.push({
            pathname: `/entry/${response.id}`
          });
        })
        .catch((reason) => {
          console.error(reason);
        });
    });
  },
  getContentForLoggedInUser() {
    return( <div>
              <h1>Share with the Network</h1>
              <p>Do you have something to share? If it might be useful to someone in our network, share it here! Pulse includes links to products and software tools, research reports and findings, think pieces, white papers, interviews, and curricula. If it might be useful, share it … at any stage or fidelity.</p>
              <div className="new-entry-form">
                <h2>Basic Info</h2>
                <div className="posted-by">
                  <p>Posted by: <span className="user-full-name">{user.username}</span></p>
                  <p className="log-out-prompt">Not you? <button className="btn btn-link inline-link" onClick={this.handleLogOutBtnClick}>Sign out</button>.</p>
                </div>
                <Form ref="basicForm" fields={basicInfoFields}
                                       inlineErrors={true}
                                       onUpdate={this.handleFormUpdate} />
                <h2>Optional Details</h2>
                <Form ref="detailForm" fields={detailInfoFields}
                                        inlineErrors={true}
                                        onUpdate={this.handleFormUpdate} />
                <button className="btn btn-info" type="submit" onClick={this.handleFormSubmit}>Submit</button>
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
      <div className="add-page">
        { this.getContent() }
      </div>
    );
  }
});
