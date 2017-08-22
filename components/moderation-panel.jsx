import React from 'react';
import Select from 'react-select';
import Service from '../js/service.js';

class ModerationPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      moderationState: this.props.moderationState,
      featured: this.props.featured
    };
  }

  getModerationStates(input, callback) {
    Service.moderationStates
      .get()
      .then((data) => {
        let options = data.map((option) => {
          return { value: option.id, label: option.name };
        });

        callback(null, {options});
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  handleModerationStateChange(selected) {
    Service.entry
      .put.moderationState(this.props.id, selected.value)
      .then(() => {
        this.setState({ moderationState: selected });
      })
      .catch(reason => {
        console.error(reason);
      });
  }

  handleFeatureToggleClick(event) {
    let featured = event.target.checked;

    Service.entry
      .put.feature(this.props.id)
      .then(() => {
        this.setState({ featured: featured });
      })
      .catch(reason => {
        console.error(reason);
      });
  }

  render() {
    return <div className="moderation-panel row justify-content-center align-items-center p-3 mb-3">
              <Select.Async
                name="form-field-name"
                value={this.state.moderationState}
                className="col-sm-8 d-block text-left"
                searchable={false}
                loadOptions={(input, callback) => this.getModerationStates(input, callback)}
                onChange={(selected) => this.handleModerationStateChange(selected)}
                clearable={false}
              />
              <div className="col-sm-4">
                <label className="mb-0 mt-2 mt-sm-0">
                  <input type="checkbox"
                         className="d-inline-block mr-2"
                         onChange={(event) => this.handleFeatureToggleClick(event)}
                         checked={this.state.featured} />
                  Featured
                </label>
              </div>
            </div>;
  }
}

ModerationPanel.defaultProps = {
  id: ``,
  moderationState: ``
};

export default ModerationPanel;
