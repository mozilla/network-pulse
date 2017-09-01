import React from 'react';

class Bio extends React.Component {
  constructor(props) {
    super(props);
  }

  renderPic() {
    let style = {
      backgroundImage: `url(${this.props.pic})`,
    };

    return <div className="pic mx-auto" style={style}></div>;
  }

  renderName() {
    return <div className="name d-inline-block mb-2 mr-4">{this.props.firstname} {this.props.lastname}</div>;
  }

  renderSocialMedia() {
    if (!this.props.socialMedia || this.props.socialMedia.length < 1) return null;

    let platforms = this.props.socialMedia.map(platform => {
      return <a href={platform.link} target="_blank" className="d-inline-block mr-3" key={platform.type}>{platform.type}</a>;
    });

    return <div className="d-inline-block">{platforms}</div>;
  }

  renderMeta(type, text, icon, link) {
    let meta = text;

    if (link) {
      meta = <a href={link}>{text}</a>;
    }

    return <div className={`meta-with-icon ${type} d-inline-block mr-4`}>{meta}</div>;
  }

  renderOtherMeta() {
    let org = this.props.org ? this.renderMeta(`org`, this.props.org) : null;
    let location = this.props.location ? this.renderMeta(`location`, this.props.location) : null;
    let language = this.props.language ? this.renderMeta(`language`, this.props.language.join(` ,`)) : null;
    let story = this.props.storyLink ? this.renderMeta(`story`, `Read Story`, ``, this.props.storyLink) : null;
    let link = this.props.link ? this.renderMeta(`link`, this.props.link) : null;

    return <div className="other-meta open-sans mb-2">{org}{location}{language}{story}{link}</div>;
  }

  renderBlurb() {
    let paragraphs = this.props.bio.split(`\n`).map((paragraph) => {
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
            { this.renderPic() }
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
