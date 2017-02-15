import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

const HintMessage = (props) => {
  let classnames = classNames(`btn`, `btn-outline-info`);

  return (
    <div>
      <div className="hint-message text-center">
        <h2><img src={props.imgSrc} /></h2>
        <h2>{props.header}</h2>
        {props.children}
        { props.internalLink && props.linkText ? <Link to={props.internalLink} className={classnames} onClick={props.onClick}>{props.linkText}</Link> : null }
        { props.externalLink && props.linkText ? <a href={props.externalLink} className={classnames} onClick={props.onClick}>{props.linkText}</a> : null }
      </div>
    </div>
  );
};

export { HintMessage as default };
