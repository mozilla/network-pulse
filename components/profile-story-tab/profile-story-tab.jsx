import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

class ProfileStoryTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="profile-story-tab row justify-content-center mb-5">
      <div className="col-sm-10">
        { this.props.longBio &&
        <div className="quote my-5">
          <ReactMarkdown
            source={this.props.longBio.replace(/\\n/g, `\n`)}
            escapeHtml={true}
            skipHtml={true}
          />
        </div>
        }
      </div>
    </div>;
  }
}

ProfileStoryTab.propTypes = {
  longBio: PropTypes.string.isRequired
};

export default ProfileStoryTab;
