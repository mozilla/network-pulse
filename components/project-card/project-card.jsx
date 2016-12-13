import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

const Details = (props) => {
  return props.onDetailView ?
          (<div>
            {props.interest ? <p className="interest">{props.interest}</p> : null}
            {props.getInvolved ? <p className="get-involved">{props.getInvolved} <a href={props.getInvolvedUrl} target="_blank">Get Involved</a></p> : null}
            {props.url ? <a href={props.url} target="_blank" className="btn visit-btn">Visit</a> : null}
          </div>) : null;
};

export default React.createClass({
  getDefaultProps() {
    return {
      onDetailView: false
    };
  },
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
    onDetailView: React.PropTypes.bool
  },
  componentDidMount() {
    if (this.urlToShare) {
      // TODO:FIXME: not sure if this is the best way to display URL of the current page
      this.urlToShare.value = window.location.href;
    }
  },
  render() {
    let classnames = classNames({"project-card": true, "single": this.props.onDetailView});
    let actions = this.props.onDetailView ?
                  (<div className="share">
                    <a className="btn"></a>
                    <input readOnly type="text" ref={(input) => { this.urlToShare = input; }} />
                  </div>)
                  : (<div>
                      <Link to={`/entry/${this.props.id}`} className="read-more-link">Read more</Link>
                    </div>);

    return (
      <div className={classnames}>
        <img src={this.props.thumbnailUrl} className="img-fluid mx-auto d-block" />
        <div className="content">
          <h2>{this.props.title}</h2>
          <h3>{this.props.creators} on {this.props.timestamp.toString()}</h3>
          <p className="description">{this.props.description}</p>
          <Details {...this.props} />
        </div>
        <div className="project-links">
          <div className="action-panel">
            {actions}
            <a className="star"></a>
          </div>
        </div>
      </div>
    );
  }
});
