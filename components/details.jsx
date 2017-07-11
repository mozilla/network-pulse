import React from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';

class Details extends React.Component {
  handleVisitBtnClick() {
    ReactGA.event(this.props.createGaEventConfig(`Visit button`, `Clicked`, `beacon`));
  }

  handleGetInvolvedLinkClick() {
    ReactGA.event(this.props.createGaEventConfig(`Get involved`, `Clicked`, `beacon`));
  }

  render() {
    let props = this.props;
    let getInvolvedText = props.getInvolved ? props.getInvolved : null;
    let getInvolvedLink = props.getInvolvedUrl ? ( <a href={props.getInvolvedUrl} target="_blank" onClick={this.handleGetInvolvedLinkClick}>Get Involved</a>) : null;

    return props.onDetailView || props.onModerationMode ?
            (<div>
              { props.interest ? <p className="interest">{props.interest}</p> : null }
              { getInvolvedText || getInvolvedLink ? <p className="get-involved">{getInvolvedText} {getInvolvedLink}</p> : null }
              { props.contentUrl ? <a href={props.contentUrl} target="_blank" className="btn btn-block btn-outline-info mb-3" onClick={this.handleVisitBtnClick}>Visit</a> : null }
            </div>) : null;
  }
}
Details.propTypes = {
  createGaEventConfig: PropTypes.func.isRequired
};

export default Details;
