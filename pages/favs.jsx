import React from 'react';
import { getFavs } from '../js/favs-manager';
import ProjectList from '../components/project-list/project-list.jsx';
import HintMessage from '../components/hint-message/hint-message.jsx';

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
        { this.state.favs && this.state.favs.length > 0 ?
                            <ProjectList params={{favs: this.state.favs}} />
                            : <HintMessage imgSrc={`/assets/svg/icon-fav-selected.svg`}
                                           header={`Save your Favs`}
                                           btn={{to: `/featured`, text: `Explore featured`}}>
                                <p>Tap the heart on any project to save it here.</p>
                              </HintMessage>
        }
      </div>
    );
  }
});
