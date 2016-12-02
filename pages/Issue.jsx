import React from 'react';

export default React.createClass({
  render() {
    return (
      <div>
        <h1>One Issue Page</h1>
        <h2>{this.props.params.issue}</h2>
      </div>
    );
  }
});
