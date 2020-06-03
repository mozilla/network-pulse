import React from "react";
import { Link } from "react-router-dom";

export default (props) => {
  let renderThumbnail = (thumbnail = ``) => {
    let style = {};

    if (thumbnail) {
      style = {
        backgroundImage: `url(${thumbnail})`,
      };
    }

    return (
      <Link to={`/profile/${props.id}`}>
        <div className="thumbnail mx-auto" style={style} />
      </Link>
    );
  };

  let renderProfileBlurb = (bio) => {
    if (!bio) return null;

    let paragraphs = bio.split(`\n`).map((paragraph) => {
      if (!paragraph) return null;

      return <p key={paragraph}>{paragraph}</p>;
    });

    return <div className="blurb">{paragraphs}</div>;
  };

  return (
    <div className="profile-card bio col-md-8 my-5 my-sm-3">
      <div className="row">
        <div className="col-6 offset-3 col-sm-3 offset-sm-0 mb-2 mb-sm-0">
          {renderThumbnail(props.thumbnail)}
        </div>
        <div className="col-sm-9">
          <h2 className="name text-center text-sm-left">
            <Link to={`/profile/${props.id}`}>{props.name}</Link>
          </h2>
          {renderProfileBlurb(props.user_bio)}
        </div>
      </div>
    </div>
  );
};
