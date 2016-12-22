import React from 'react';
import { Link } from 'react-router';
import { getFavs } from '../js/favs-manager';
import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  getInitialState() {
    return {
      favs: null
    };
  },
  componentDidMount() {
    this.setState({favs: getFavs()});
  },
  render() {
    return (
      <div>
        <div className="container">
          { this.state.favs && this.state.favs.length > 0 ?
                              <ProjectList filter={{key: `favs`, value: this.state.favs}} />
                              : <div className="text-center">
                                  <h2><img src="assets/svg/icon-fav-selected.svg" /></h2>
                                  <h2>Save your Favs</h2>
                                  <p>Tap the heart on any project to save it here.</p>
                                  <Link to="/featured" className="btn">Expore featured</Link>
                                </div>
          }
        </div>
      </div>
    );
  }
});
