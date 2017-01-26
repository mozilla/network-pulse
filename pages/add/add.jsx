import React from 'react';
import { browserHistory } from 'react-router';
import HintMessage from '../../components/hint-message/hint-message.jsx';
import Service from '../../js/service.js';
import UserData from '../../js/user-data.js';
import env from "../../config/env.generated.json";

const CreatorInputField = () => {
  return (
    <input name="creators" type="text" placeholder="Name" width="150" className="form-control" />
  );
};

export default React.createClass({
  getInitialState() {
    return {
      numCreatorFields: 1,
      loggedInStatusChecked: false
    };
  },
  componentWillMount() {
    console.log(`UserData.userLoggedInStatus.get() = `, UserData.userLoggedInStatus.get());
  },
  componentDidMount() {
    let loggedInParam = this.props.router.location.query.loggedin;

    if ( !loggedInParam || loggedInParam.toString().toLowerCase() === `true` ) {
      // if there's no "loggedin" param presented in the URL OR if "loggedin" param is true
      // we want to verify if user is really logged in by making a /userstatus call to Pulse API
      this.verifyLoggedInStatus();
    } else if ( loggedInParam && loggedInParam.toString().toLowerCase() === `false` ) {
      // if "loggedin" param is presented in the URL and it is set to false
      // we assume that user cannot be logged in using his/her Google Account
      // (i.e., not using a Mozilla Staff account)
      this.updateLoggedInInfo(false);
    }
  },
  verifyLoggedInStatus() {
    Service.userstatus()
      .then(response => {
        if (response.loggedin) {
          // Pulse API verified that this user was already logged in
          this.updateLoggedInInfo(true,response.username);
        } else {
          // user is not logged in, redirect him/her to Pulse API's login URL
          let redirectUrl = `${env.ORIGIN}${this.props.router.getCurrentLocation().pathname}`;

          window.location.href = UserData.logInUrl.get(redirectUrl);
        }
      })
      .catch(reason => {
        this.updateLoggedInInfo(false);
        console.error(reason);
      });
  },
  updateLoggedInInfo(status, username = ``) {
    UserData.userLoggedInStatus.set(status);
    UserData.username.set(username);

    // we have verified user's logged in status with Pulse API
    this.setState({
      loggedInStatusChecked: true
    });

    // After the login process user will be redirected back to Pulse.
    // There will be a query argument "loggedin" presented in the URL
    // which is something we don't want it to stay at all times.
    this.clearLoggedinParam();
  },
  clearLoggedinParam() {
    let query = this.props.router.location.query;

    // we don't need the "loggedin" param sent back from Pulse API to be presented at all times
    delete query.loggedin;

    browserHistory.replace({
      pathname: this.props.router.location.pathname,
      query: query
    });
  },
  logOutUser(event) {
    event.preventDefault();
    Service.logout()
      .then(() => {
        // we have successfully logged user out
        this.updateLoggedInInfo(false);
        // redirect user to /featured page
        browserHistory.push({
          pathname: `/featured`
        });
      })
      .catch(reason => {
        console.error(reason);
        // TODO:FIXME: what do we do here?
      });
  },
  handleCreatorClick(event) {
    event.preventDefault();
    this.setState({numCreatorFields: this.state.numCreatorFields+1});
  },
  render() {
    let creatorFields = [];

    for (var i=0; i<this.state.numCreatorFields; i++) {
      creatorFields.push( <CreatorInputField key={i} />);
    }

    let ContentForUnauthedUser = ( <HintMessage imgSrc={`/assets/svg/icon-bookmark-selected.svg`}
                                               header={`Sign in failed`}
                                               btn={{to: `/featured`, text: `Explore featured`}}>
                                    <p>Only Mozilla staff can login now as we test this new platform. Check back soon!</p>
                                  </HintMessage>);

    let ContentForAuthedUser = (
      <div>
        <h1>Share with the Network</h1>
        <p>Do you have something to share? If it might be useful to someone in our network, share it here! Pulse includes links to products and software tools, research reports and findings, think pieces, white papers, interviews, and curricula. If it might be useful, share it … at any stage or fidelity.</p>
        <form action="" method="post">
          <h2>Basic Info</h2>
          <div className="posted-by">
            <p>Posted by:&nbsp;<span className="user-full-name">{UserData.username.get()}</span></p>
            <p className="log-out-prompt">Not you? <button className="btn btn-link" onClick={this.logOutUser}>Sign out</button>.</p>
          </div>
          <fieldset hidden>
            <label className="form-control-label">
              Posted by:&nbsp;
              <input name="" type="text" className="form-control" value="" readOnly />
            </label>
            <p>Not you? <a href="">Sign out.</a></p>
          </fieldset>
          <label className="form-control-label">
            Title of the project<em className="required">(required)</em>
            <input name="title" type="text" placeholder="Title" className="form-control" />
          </label>
          <label className="form-control-label">
            URL<em className="required">(required)</em>
            <input name="" type="url" placeholder="https://example.com" className="form-control" />
          </label>
          <label className="form-control-label">
            Describe what you are sharing. Keep it simple and use plain language.
            <textarea name="description" placeholder="Description" className="form-control" />
          </label>
          <h2>Optional Details</h2>
          <fieldset className="creators">
            <legend>Who are the creators? This could be staff, contributors, partners…</legend>
            { creatorFields }
            <button ref={(addCreatorLink) => { this.addCreatorLink = addCreatorLink; }} onClick={this.handleCreatorClick} className="btn btn-link">&#43; Add another creator</button>
          </fieldset>
          <label className="form-control-label">
            Keywords to help with search by program, event, campaign, subject …
            <input name="tags" type="text" placeholder="#mozfest  #code  #tool" className="form-control" />
          </label>
          <fieldset>
            <legend>Check any Key Internet Issues that relate to your project.</legend>
            <label className="form-control-label">
              <input name="issues" type="checkbox" className="form-control" value="Online Privacy & Security" />Online Privacy & Security
            </label>
            <label className="form-control-label">
              <input name="issues" type="checkbox" className="form-control" value="Open Innovation" />Open Innovation
            </label>
            <label className="form-control-label">
              <input name="issues" type="checkbox" className="form-control" value="Decentralization" />Decentralization
            </label>
            <label className="form-control-label">
              <input name="issues" type="checkbox" className="form-control" value="Web Literacy" />Web Literacy
            </label>
            <label className="form-control-label">
              <input name="issues" type="checkbox" className="form-control" value="Digital Inclusion" />Digital Inclusion
            </label>
          </fieldset>


          <label className="form-control-label">
            Looking for support? Describe how people can do that.
            <input name="get_involved" type="text" placeholder="Contribute to the code." className="form-control" />
          </label>
          <label className="form-control-label">
            Link for people to get involved.
            <input name="get_involved_url" type="url" placeholder="https://example.com" className="form-control" />
          </label>
          <fieldset>
            <label className="form-control-label">
              Upload a thumbnail image
              <input name="thumbnail_url" type="url" placeholder="https://example.com" className="form-control" />
            </label>
            <p className="form-text"><em>1200px by 630px recommended image dimension</em></p>
          </fieldset>
          <button type="submit" className="btn btn-filled">Submit project</button>
        </form>
      </div>
    );

    return (
      <div className="add-page">
        {
          this.state.loggedInStatusChecked ? ( UserData.userLoggedInStatus.get() ? ContentForAuthedUser : ContentForUnauthedUser )
                                           : <p className="text-center">Checking your login status now...</p>
        }
      </div>
    );
  }
});
