import React from "react";
import PropTypes from "prop-types";

class Step extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    if (!this.props.show) return null;

    return (
      <div>
        <h2 className="h3-heading mb-2 text-center">{this.props.heading}</h2>
        {this.props.subhead && (
          <p className="body-large mb-2 text-center">{this.props.subhead}</p>
        )}
        {this.props.hint && (
          <p className="h6-heading text-center">{this.props.hint}</p>
        )}
        <div className="mt-4">{this.props.children}</div>
      </div>
    );
  }
}

Step.propTypes = {
  heading: PropTypes.string.isRequired,
  subhead: PropTypes.string,
  hint: PropTypes.string
};

export default Step;
