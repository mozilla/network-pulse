import React from 'react';
// import { Link } from 'react-router';

export default React.createClass({
  render() {
    return (
      <footer>
        <div className="container">
          <p>Get new projects by email. <a id="sign-up-btn" href="https://groups.google.com/a/mozillafoundation.org/d/forum/pulse-notifications/join">Sign up</a>.</p>
          <p><a href="https://github.com/mozilla/network-pulse">Contribute</a> to this prototype.</p>
          <p>Submit an <a href="https://docs.google.com/a/mozillafoundation.org/forms/d/e/1FAIpQLScsZ6NLDIo87YH8Z3guR-9slPampPTavcKgbqOJvLsrnqIVMQ/viewform">Impact Story tip</a>.</p>
        </div>
      </footer>
    );
  }
});
