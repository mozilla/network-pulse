import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    creators: React.PropTypes.string,
    description: React.PropTypes.string.isRequired,
    featured: React.PropTypes.string,
    getInvolved: React.PropTypes.string,
    getInvolvedUrl: React.PropTypes.string,
    interest: React.PropTypes.string,
    issues: React.PropTypes.arrayOf(React.PropTypes.string),
    thumbnailUrl: React.PropTypes.string,
    timestamp: React.PropTypes.object,
    title: React.PropTypes.string.isRequired,
    url: React.PropTypes.string,
    showDetail: React.PropTypes.bool
  },
  render() {
    // TODO:FIXME: sanitize data

    let detail = this.props.showDetail ?
                  (<div>
                    {this.props.interest ? <p className="interest">{this.props.interest}</p> : null}
                    {this.props.getInvolved ? <p className="get-involved">{this.props.getInvolved} <a href={this.props.getInvolvedUrl} target="_blank">Get Involved</a></p> : null}
                    {this.props.url ? <a href={this.props.url} target="_blank" className="btn visit-btn">Visit</a> : null}
                  </div>) : null;

    return (
      <div className="project-card">
        <img src={this.props.thumbnailUrl} className="thumbnail" />
        <div className="content">
          <h2>{this.props.title}</h2>
          <h3>{this.props.creators} on {this.props.timestamp.toString()}</h3>
          <p className="description">{this.props.description}</p>
          {detail}
        </div>
        <div className="project-links">
          <div className="action-panel">
            <Link to={`/entry/${this.props.id}`} className="read-more-link">Read more</Link>
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
