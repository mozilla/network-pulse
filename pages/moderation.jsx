import React from 'react';
import Search from './search/search.jsx';
import NotFound from './not-found.jsx';
import user from '../js/app-user';

class Moderation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user
    };
  }

  componentDidMount() {
    user.addListener(this);
    user.verify(this.props.location, this.props.history);
  }

  componentWillUnmount() {
    user.removeListener(this);
  }

  updateUser(event) {
    // this updateUser method is called by "user" after changes in the user state happened
    if (event === `verified` ) {
      this.setState({ user });
    }
  }

  render() {
    if (!user.moderator) return <NotFound />;

    return <Search moderation={true} {...this.props} />;
  }
}

export default Moderation;
