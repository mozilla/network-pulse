import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import ProjectLoader from '../components/project-loader/project-loader.jsx';
import Utility from '../js/utility';

// For pages that display a list of entries based on single param search in the API call
// e.g., 'tag', 'help_type', ...etc
class SingleFilterCriteriaPage extends React.Component {
  constructor(props) {
    super(props);
  }

  formatSearchParam(searchParam) {
    if (searchParam.key === `help_type`) {
      searchParam.value = Utility.getHelpTagFromSlug(searchParam.value);
    }

    return searchParam;
  }

  render() {
    let searchParam = this.formatSearchParam(this.props.searchParam);
    let params = {};
    params[searchParam.key] = searchParam.value;

    return <div>
      <Helmet><title>{searchParam.value}</title></Helmet>
      <h2 className="text-capitalize">{`${this.props.headerLabel}: ${searchParam.value} `}</h2>
      <ProjectLoader {...params} showCounter={true} />
    </div>;
  }
}

SingleFilterCriteriaPage.propTypes = {
  searchParam: PropTypes.object.isRequired,
  headerLabel: PropTypes.string.isRequired,
};

SingleFilterCriteriaPage.defaultProps = {
  searchParam: { key: ``, value: ``},
  headerLabel: ``
};

export default SingleFilterCriteriaPage;
