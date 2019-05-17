// Embed additional instances of the Join Us box that don't need an API exposed (eg: Homepage)
var joinUs = () => {
  if (document.querySelectorAll(`.join-us`)) {
    var elements = Array.from(document.querySelectorAll(`.join-us`));

    if (elements.length) {
      elements.forEach(element => {
        var props = element.dataset;

        props.apiUrl = `${networkSiteURL}/api/campaign/signups/${props.signupId ||
          0}/`;

        props.csrfToken = props.csrfToken || csrfToken;
        props.isHidden = false;

        apps.push(
          new Promise(resolve => {
            ReactDOM.render(
              <JoinUs {...props} whenLoaded={() => resolve()} />,
              element
            );
          })
        );
      });
    }
  }
}

module.exports = joinUs;
