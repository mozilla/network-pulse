import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

class ProfileAboutTab extends React.Component {
  constructor(props) {
    super(props);
  }

  renderLongBio() {
    if (!this.props.longBio) return null;

    return this.props.longBio.split(`\n`).map(line => {
      return (
        <ReactMarkdown
          key={line}
          source={line}
          escapeHtml={true}
          skipHtml={true}
        />
      );
    });
  }

  render() {
    return (
      <div className="profile-about-tab row justify-content-center mb-5">
        <div className="col-12 col-sm-10 col-lg-8">{this.renderLongBio()}</div>
      </div>
    );
  }
}

ProfileAboutTab.propTypes = {
  longBio: PropTypes.string.isRequired
};

export default ProfileAboutTab;
