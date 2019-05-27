import React from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Utility from '../../js/utility.js';
import SignOutButton from '../sign-out-button.jsx';

class Bio extends React.Component {
  constructor(props) {
    super(props);

    this.profileOwnerName = this.getProfileOwnerName(props);
  }

  getProfileOwnerName(props) {
    // we prefer to show custom name if presented, otherwise fall back to name
    return props.custom_name || props.name;
  }

  componentWillReceiveProps(nextProps) {
    this.profileOwnerName = this.getProfileOwnerName(nextProps);
  }

  handleSocialMediaClick(event, type) {
    ReactGA.event({
      category: `Profile`,
      action: `Social link tap`,
      label: `${this.profileOwnerName} - ${type}`,
      transport: `beacon`
    });
  }

  renderThumbnail() {
    let style = {};

    if (this.props.thumbnail) {
      style = {
        backgroundImage: `url(${this.props.thumbnail})`
      };
    }

    return <div className="thumbnail mx-auto" style={style}></div>;
  }

  renderEditLink() {
    if (!this.props.my_profile) return null;

    return <div className="my-3 mt-sm-4 mb-md-0"><Link to="/myprofile">Edit your profile</Link></div>;
  }

  renderSocialMedia() {
    let list = [ `twitter`, `linkedin`, `github` ];
    list = list.map((type, i) => {
      let link = this.props[type];
      if (!link) { return; }

      let classname = classNames(`social-media ${type} x-small`, {
        "mr-sm-1" : i !== list.length-1
      });

      return <a href={link} target="_blank" className={classname} onClick={(event) => this.handleSocialMediaClick(event, type)} key={type}></a>;
    });

    return <div className="d-flex mb-4 mb-sm-0">{list}</div>;
  }

  renderSignOut() {
    if (!this.props.my_profile) return null;

    return <div className="ml-sm-3"><SignOutButton user={this.props.user} history={this.props.history} /></div>;
  }

  renderMeta(type, text, link) {
    let meta = text;

    if (link) {
      meta = <a href={link} onClick={(event) => this.handleSocialMediaClick(event, type)}>{text}</a>;
    }

    return <div className={`meta-with-icon d-flex align-items-center ${ type == 'website' ? 'website mt-3' : type} x-small`}>{meta}</div>;
  }

  renderOtherMeta() {
    let org = this.props.org ? this.renderMeta(`org`, this.props.org) : null;
    let location = this.props.location ? this.renderMeta(`location`, this.props.location) : null;
    let language = this.props.language ? this.renderMeta(`language`, this.props.language.join(` ,`)) : null;
    let story = this.props.storyLink ? this.renderMeta(`story`, `Read Story`, this.props.storyLink) : null;
    let website = this.props.website ? this.renderMeta(`website`, this.props.website, this.props.website) : null;

    return <div className="mb-3 d-flex flex-column">{org}{location}{language}{story}{website}</div>;
  }

  renderBlurb() {
    let paragraphs = this.props.user_bio.split(`\n`).map((paragraph) => {
      if (!paragraph) return null;

      return <p key={paragraph}>{paragraph}</p>;
    });

    if (paragraphs.length < 1) return null;

    return <div className="blurb">{paragraphs}</div>;
  }

  renderTags(label = ``, type = ``, tags = []) {
    if (!type || tags.length < 1) { return null; }
    
    tags = tags.map((tag, i) => {
      let link = `/${type}/${type === `issues` ? Utility.getUriPathFromIssueName(tag) : encodeURIComponent(tag)}`;

      return <div className="d-inline-block" key={tag}>
      <Link className="mr-1" to={link}>{tag}{i < tags.length-1 && ","}</Link>
    </div>;;
    });

    return <div className="body-small tags mb-1">
      <div className="d-inline-block mr-2">{label}:</div>
      {tags}
    </div>;
  }

  renderInterest() {
    if (!this.props.issues) { return null; }

    return this.renderTags(`Interests`, `issues`, this.props.issues);
  }

  render() {
    return (
      <div className="bio mb-5">
        <div className="row justify-content-center">
          <div className="col-6 col-sm-4 col-md-2 text-center text-sm-left">
            { this.renderThumbnail() }
            { this.renderEditLink() }
          </div>
          <div className="col-sm-8 col-md-10">
            <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-baseline align-items-md-baseline mb-4 mb-sm-3">
              <div className="d-flex flex-column flex-md-row align-items-center align-items-sm-start align-items-md-baseline">
                <h1 className="h5-heading mr-sm-4 text-truncate mw-100 mb-4 mb-sm-1 mb-md-0">{this.profileOwnerName}</h1>
                { this.renderSocialMedia() }
              </div>
              { this.renderSignOut() }
            </div>
            { this.renderOtherMeta() }
            { this.renderBlurb() }
            { this.renderInterest() }
          </div>
        </div>
      </div>
    );
  }
}

Bio.propTypes = {
  name: PropTypes.string.isRequired,
  "custom_name": PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
  issues: PropTypes.array.isRequired,
  twitter: PropTypes.string.isRequired,
  linkedin: PropTypes.string.isRequired,
  github: PropTypes.string.isRequired,
  website: PropTypes.string.isRequired,
  "my_profile": PropTypes.bool.isRequired,
  user: PropTypes.object
};

export default Bio;
