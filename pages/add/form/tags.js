import Service from '../../../js/service';
import AutoCompleteInput from './auto-complete-input';

export default class Tags extends AutoCompleteInput {
  componentDidMount() {
    // We start tags at id=1, so that a tag id is
    // always truthy, rather than id=0 being "false".
    let idOffset = 1;

    // Prefill tags if specified via URL query
    let map = new URLSearchParams(window.location.search);
    let tags = (map.get(`tags`) || ``)
      .replace(/\s+/g,``)
      .split(`,`)
      .map((name,id) => name.trim() ? { id: id + idOffset, name } : false)
      .filter(v => v);

    // Update the idOffset so that we don't have conflicting
    // tag ids when we process the suggestions from the server:
    idOffset += tags.length;

    // Load known tags from the server for tag suggestion filtering
    Service.tags
      .get()
      .then((data) => {
        let suggestions = data.map((name,id) => ({ id: id + idOffset, name }));
        this.setState({
          data: tags,
          suggestions
        });
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  /*
   * Add any tag that the user wrote before
   * they clicked away as a tag to this entry.
   */
  handlePendingInput(input) {
    this.save(input);
  }

  render() {
    return super.render({ placeholder: `Add new tag` });
  }
}
