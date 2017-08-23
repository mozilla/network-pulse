import React from 'react';

// real schema
/*
{
    "user_bio": "",
    "custom_name": "",
    "is_group": false,
    "thumbnail": null,
    "issues": [],
    "twitter": "",
    "linkedin": "",
    "github": "",
    "website": ""
}
*/


class Bio extends React.Component {
  constructor(props) {
    super(props);
  }

  renderThumbnail() {
    let style = {
      backgroundImage: `url(${this.props.thumbnail})`,
    };

    return <div className="thumbnail mx-auto" style={style}></div>;
  }

  renderName() {
    return <div className="name d-inline-block mb-2 mr-4">{this.props.firstname} {this.props.lastname}</div>;
  }

  renderSocialMedia() {
    let list = [ `twitter`, `linkedin`, `github` ].map(type => this.renderSocialMediaLink(type, this.props[type]) );

    return <div className="d-inline-block">{list}</div>;
  }

  renderSocialMediaLink(type, link) {
    if (!link) return null;

    return <a href={link} target="_blank" className="d-inline-block mr-3 social-media default-text-color-link" key={type}><span className={`fa fa-${type}`}></span></a>;
  }

  renderMeta(type, text, link) {
    let meta = text;

    if (link) {
      meta = <a href={link} className="default-text-color-link">{text}</a>;
    }

    return <div className={`meta-with-icon ${type} d-inline-block mr-4`}>{meta}</div>;
  }

  renderOtherMeta() {
    let org = this.props.org ? this.renderMeta(`org`, this.props.org) : null;
    let location = this.props.location ? this.renderMeta(`location`, this.props.location) : null;
    let language = this.props.language ? this.renderMeta(`language`, this.props.language.join(` ,`)) : null;
    let story = this.props.storyLink ? this.renderMeta(`story`, `Read Story`, this.props.storyLink) : null;
    let website = this.props.website ? this.renderMeta(`website`, this.props.website, this.props.website) : null;

    return <div className="other-meta open-sans mb-2">{org}{location}{language}{story}{website}</div>;
  }

  renderBlurb() {
    let paragraphs = this.props.user_bio.split(`\n`).map((paragraph) => {
      if (!paragraph) return null;

      return <p key={paragraph}>{paragraph}</p>;
    });

    if (paragraphs.length < 1) return null;

    return <div className="blurb">{paragraphs}</div>;
  }

  renderTags(type = ``, tags = []) {
    if (!type || tags.length < 1) { return null; }

    return <div className="tags mb-1">
              <span className="open-sans text-uppercase">{type}: </span>{tags.join(`, `)}
            </div>;
  }

  renderInterest() {
    if (!this.props.interest) { return null; }

    return this.renderTags(`interests`, this.props.interest);
  }

  renderHelpWith() {
    if (!this.props.help_with) { return null; }

    return this.renderTags(`can help with`, this.props.help_with);
  }

  render() {
    console.log(this.props);
    return (
      <div className="bio pb-5 mb-5">
        <div className="row">
          <div className="col-sm-4 col-md-2">
            { this.renderThumbnail() }
          </div>
          <div className="col-sm-8 col-md-10">
            { this.renderName() }
            { this.renderSocialMedia() }
            { this.renderOtherMeta() }
            { this.renderBlurb() }
            { this.renderInterest() }
            { this.renderHelpWith() }
          </div>
        </div>
      </div>
    );
  }
}
export default Bio;
