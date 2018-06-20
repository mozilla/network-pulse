import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

class ProfileAboutTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="profile-about-tab row justify-content-center mb-5">
      <div className="col">
        { this.props.longBio &&
          <ReactMarkdown
            source={this.props.longBio.replace(/\\n/g, `\n`)}
            escapeHtml={true}
            skipHtml={true}
          />
        }
      </div>
    </div>;
  }
}

ProfileAboutTab.propTypes = {
  longBio: PropTypes.string.isRequired
};

export default ProfileAboutTab;
