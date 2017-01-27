import React from 'react';
import { browserHistory } from 'react-router';
import HintMessage from '../../components/hint-message/hint-message.jsx';
import UserData from '../../js/user-data.js';
import Login from '../../js/login.js';
import env from "../../config/env.generated.json";

const CreatorInputField = () => {
  return (
    <input name="creators" type="text" placeholder="Name" width="150" className="form-control" />
  );
};

export default React.createClass({
  getInitialState() {
    return {
      numCreatorFields: 1
    };
  },
  componentDidMount() {
    let currentLocation = this.props.router.location;

    Login.verifyLoggedInStatus(currentLocation, error => {
      if (!error) {
        this.forceUpdate();
      }
    });
  },
  handleLogOutBtnClick(event) {
    event.preventDefault();

    Login.logoutUser(error => {
      if (!error) {
        browserHistory.push({
          pathname: `/featured`
        });
      }
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

    let redirectUrl = `${env.ORIGIN}${this.props.router.getCurrentLocation().pathname}`;
    let promptToLogIn = (<HintMessage imgSrc={`/assets/svg/icon-user.svg`}
                                       header={`Please sign in to add a post`}
                                       link={{href: UserData.logInUrl.get(redirectUrl), text: `Sign in`}}>
                            <p>Please note, only Mozilla staff can login now as we test this new platform.</p>
                          </HintMessage>);


    let contentForNonStaff= ( <HintMessage imgSrc={`/assets/svg/icon-user.svg`}
                                               header={`Sign in failed`}
                                               btn={{to: `/featured`, text: `Explore featured`}}>
                                    <p>Only Mozilla staff can login now as we test this new platform. Check back soon!</p>
                                  </HintMessage>);

    let contentForStaff = (
      <div>
        <h1>Share with the Network</h1>
        <p>Do you have something to share? If it might be useful to someone in our network, share it here! Pulse includes links to products and software tools, research reports and findings, think pieces, white papers, interviews, and curricula. If it might be useful, share it … at any stage or fidelity.</p>
        <form action="" method="post">
          <h2>Basic Info</h2>
          <div className="posted-by">
            <p>Posted by:&nbsp;<span className="user-full-name">{UserData.username.get()}</span></p>
            <p className="log-out-prompt">Not you? <button className="btn btn-link" onClick={this.handleLogOutBtnClick}>Sign out</button>.</p>
          </div>
          <fieldset hidden>
            <label className="form-control-label">
              Posted by:&nbsp;
              <input name="" type="text" className="form-control" value="" readOnly />
            </label>
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
            <button onClick={this.handleCreatorClick} className="btn btn-link">&#43; Add another creator</button>
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


    let Content;
    let userType = UserData.type.get();

    if (userType === `staff`) {
      content = contentForStaff;
    } else if (userType === `nonstaff`) {
      content = contentForNonStaff;
    } else {
      content = promptToLogIn;
    }

    return (
      <div className="add-page">
        { content }
      </div>
    );
  }
});
