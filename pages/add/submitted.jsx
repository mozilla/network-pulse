import React from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { Helmet } from "react-helmet";
import HintMessage from '../../components/hint-message/hint-message.jsx';

const HEADER_TEXT = `Thanks!`;

export default class Submitted extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entryId: false
    };
  }

  componentDidMount() {
    let location = this.props.location;
    let query = qs.parse(this.props.location.search.substring(1));

    if (query && query.entryId) {
      let entryId = parseInt(query.entryId, 10);

      // Make sure this is an entry id, and not some arbitrary data.
      // This would be easier with != instead of !== but... linting
      if (`${entryId}` !== query.entryId) {
        return;
      }

      // remove 'entryId' query from URL
      delete query.entryId;
      this.props.history.replace({
        pathname: location.pathname,
        query: query
      });

      this.setState({
        entryId: entryId
      });
    }
  }

  render() {
    var linkText = false;

    if (this.state.entryId) {
      linkText = `Edit your profile`;
    }

    const thankYou = (
      <HintMessage iconComponent={<img src="/assets/svg/icon-bookmark-selected.svg" />}
                    header={HEADER_TEXT}
                    linkComponent={linkText ? <Link to={`/myprofile`}>{linkText}</Link> : false}>
        <p>After moderation, you can find your entry on your profile.</p>
      </HintMessage>
    );

    return (
      <div>
        <Helmet><title>Thank you!</title></Helmet>
        { thankYou }
      </div>
    );
  }
}
