import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    creators: React.PropTypes.string,
    description: React.PropTypes.string.isRequired,
    featured: React.PropTypes.string,
    getInvolved: React.PropTypes.string,
    interest: React.PropTypes.string,
    issues: React.PropTypes.arrayOf(React.PropTypes.string),
    thumbnailUrl: React.PropTypes.string,
    timestamp: React.PropTypes.object,
    title: React.PropTypes.string.isRequired,
    url: React.PropTypes.string
  },
  render() {
    // TODO:FIXME: sanitize data

    return (
      <div className="project-card">
        <img src={this.props.thumbnailUrl} className="thumbnail" />
        <div className="content">
          <h2>{this.props.title}</h2>
          <h3>{this.props.creators} on {this.props.timestamp.toString()}</h3>
          <p className="description">{this.props.description}</p>
          {this.props.interest ? <p className="interest">{this.props.interest}</p> : null}
          {this.props.getInvolved ? <p className="get-involved">{this.props.getInvolved}</p> : null}
        </div>
        <div className="project-links">
          <div className="action-panel">
            <Link to={`entry/${this.props.id}`} className="read-more-link">Read more</Link>
            <div className="share">
              <a className="btn"></a>
            </div>
            <a className="star"></a>
          </div>
        </div>
      </div>
    );
  }
});
