import React from 'react';

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
  handleCreatorClick(event) {
    event.preventDefault();
    this.setState({numCreatorFields: this.state.numCreatorFields+1});
  },
  render() {
    let creatorFields = [];

    for (var i=0; i<this.state.numCreatorFields; i++) {
      creatorFields.push( <CreatorInputField />);
    }

    return (
      <div className="add-page">
        <h1>Share with the Network</h1>
        <p>Do you have something to share? If it might be useful to someone in our network, share it here! Pulse includes links to products and software tools, research reports and findings, think pieces, white papers, interviews, and curricula. If it might be useful, share it … at any stage or fidelity.</p>
        <form action="" method="post">
          <h2>Basic Info</h2>
          <div className="posted-by">
            <p>Posted by:&nbsp;<span className="user-full-name">[name of user]</span></p>
            <p className="log-out-prompt">Not you? <a href="">Sign out.</a></p>
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
  }
});
