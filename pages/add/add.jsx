import React from 'react';
import { browserHistory } from 'react-router';

export default React.createClass({
  quitAdd() {
    // TODO:FIXME: this should go back to previous route that user was before coming to /add
    browserHistory.push(`/`);
  },
  render() {
    return (
      <div className="page-add">
        <div className="container">
          <a className="btn-add" onClick={this.quitAdd}><img src="../assets/svg/icon-plus.svg" /></a>
        </div>
        <div id="add-project-form">
          <iframe src="https://docs.google.com/forms/d/1CiNYA3gzHPd4HYrgQuQB2KM0TDpsbn6jbMcl-0_OjM4/viewform?embedded=true" width="100%" height="100%" frameBorder="0" marginHeight="0" marginWidth="0">Loading...</iframe>
        </div>
      </div>
    );
  }
});
