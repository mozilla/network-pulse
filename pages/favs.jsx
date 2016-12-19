import React from 'react';
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
                              : <div>
                                  <h2>Save your Favs</h2>
                                  <p>Tap the heart on any project to save it here.</p>
                                </div>
          }
        </div>
      </div>
    );
  }
});
