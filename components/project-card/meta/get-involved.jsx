import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const DEFAULT_TEXT = `Help with this, or find other projects that have similar ways to get involved.`;

class GetInvolved extends React.Component {
  constructor(props) {
    super(props);
  }

  handleGetInvolvedLinkClick() {
    this.props.sendGaEvent({
      action: `Get involved link tap`,
      transport: `beacon`
    });
  }

  renderGetInvolvedText() {
    let props = this.props;
    let getInvolvedText = props.getInvolved ? props.getInvolved : null;
    let getInvolvedLink = props.getInvolvedUrl ? (
      <a
        href={props.getInvolvedUrl}
        target="_blank"
        onClick={() => this.handleGetInvolvedLinkClick()}
      >
        {props.getInvolvedUrl}
      </a>
    ) : null;
    if (!getInvolvedText && !getInvolvedLink) return <p>{DEFAULT_TEXT}</p>;

    return (
      <div>
        <p>{getInvolvedText}</p>
        <p className="mt-2">{getInvolvedLink}</p> 
      </div>
    );
  }

  renderHelpLabels() {
    if (!this.props.helpTypes) return null;

    return this.props.helpTypes.map(helpType => {
      return (
        <Link
          to={`/projects?helpType=${encodeURIComponent(helpType)}`}
          className={`btn btn-tag ${this.props.helpTypesOnModeration}`}
          key={helpType}
        >
          {helpType}
        </Link>
      );
    });
  }

  render() {
    if (
      !this.props.getInvolved &&
      !this.props.getInvolvedUrl &&
      !this.props.helpTypes.length > 0
    )
      return null;

    return (
      <section className="get-involved w-100 mb-5">
        <div className="container">
          <div className="offset-lg-2 py-5">
            <div className="help-needed">
              <h2>Help needed</h2>
              {this.renderGetInvolvedText()}
              <div className="mt-4">
                {this.renderHelpLabels()}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

GetInvolved.propTypes = {
  getInvolved: PropTypes.string.isRequired,
  getInvolvedUrl: PropTypes.string.isRequired,
  helpTypes: PropTypes.array.isRequired,
  sendGaEvent: PropTypes.func.isRequired
};

GetInvolved.defaultProps = {
  getInvolved: ``,
  getInvolvedUrl: ``,
  helpTypes: [],
  sendGaEvent: function() {}
};

export default GetInvolved;
