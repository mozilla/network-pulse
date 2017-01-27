import React from 'react';
import { Link } from 'react-router';

const HintMessage = (props) => {
  return (
    <div>
      <div className="hint-message text-center">
        <h2><img src={props.imgSrc} /></h2>
        <h2>{props.header}</h2>
        {props.children}
        { props.internalLink && props.linkText ? <Link to={props.internalLink} className="btn" onClick={props.onClick}>{props.linkText}</Link> : null }
        { props.externalLink && props.linkText ? <a href={props.externalLink} className="btn" onClick={props.onClick}>{props.linkText}</a> : null }
      </div>
    </div>
  );
};

export { HintMessage as default };
