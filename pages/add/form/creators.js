import Service from '../../../js/service';
import AutoCompleteInput from './auto-complete-input';

const PROFILE_PREFIX = `👤 `;

export default class Creators extends AutoCompleteInput {
  /**
   * Custom toSchema function to ensure the parent
   * is presented with a list of Creator models,
   * using the following schema:
   *
   *   {
   *     creator_id: number | <id of the creator autocompleted. Will be null
   *                           if the creator was not autocompleted and was
   *                           manually typed in>,
   *     name: string | <name of the creator typed in, not autocompleted.
   *                     Will be null if the creator was autocompleted>
   *   }
   *
   */
  toSchema(field) {
    return {
      creator_id: field.id ? field.id : null,
      name: field.id ? null : field.name
    };
    // Note: we do not need to strip the profile prefix
    // from the field.name property, as a username with
    // profile prefix means the user selected it from
    // the autosuggestion list, in which case it will
    // have a field.id property and "name" will be "null".
  }

  fetchCompletions(fragment) {
    Service.creators
      .get(fragment)
      .then((data) => {
        let suggestions = data.results.map((creator) => {
          if(creator.profile_id) {
            creator.name = PROFILE_PREFIX + creator.name;
          }
          return {
            id: creator.creator_id,
            name: creator.name
          };
        });
        this.setState({ suggestions });
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  handleInputChange(input) {
    if (input.length >= 3) {
      this.fetchCompletions(input);
    }
  }

  /**
   * Add any creator that the user wrote before they
   * clicked away as a creator-by-name for this entry.
   */
  handlePendingInput(input) {
    this.save(input);
  }

  render() {
    return super.render({ placeholder: `Add new creator` });
  }
}
