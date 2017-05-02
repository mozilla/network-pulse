import React from 'react';
import { browserHistory, Link } from 'react-router';
import { Helmet } from "react-helmet";
import HintMessage from '../../components/hint-message/hint-message.jsx';

const headerText = `Thanks for the submission!`;

export default React.createClass({
  getInitialState() {
    return {
      entryId: false
    };
  },

  componentDidMount() {
    let location = this.props.router.location;
    let query = location.query;

    if (query && query.entryId) {
      let entryId = parseInt(query.entryId, 10);

      // Make sure this is an entry id, and not some arbitrary data.
      // This would be easier with != instead of !== but... linting
      if (`${entryId}` !== query.entryId) {
        return;
      }

      // remove 'entryId' query from URL
      delete query.entryId;
      browserHistory.replace({
        pathname: location.pathname,
        query: query
      });

      this.setState({
        entryId: entryId
      });
    }
  },

  render() {
    var linkText = false;

    if (this.state.entryId) {
      linkText = `You will be able to see to your entry via this link once approved.`;
    }

    const thankYou = (
      <HintMessage iconComponent={<img src="/assets/svg/icon-bookmark-selected.svg" />}
                    header={headerText}
                    linkComponent={linkText ? <Link to={`/entry/${this.state.entryId}`}>{linkText}</Link> : false}>
        <p>We'll be reviewing your submission, and it'll show up in the main feed after approval.</p>
      </HintMessage>
    );

    return (
      <div>
        <Helmet><title>Thank you!</title></Helmet>
        { thankYou }
      </div>
    );
  }
});
