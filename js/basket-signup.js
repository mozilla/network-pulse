// Posting to Basket
// Doc: https://basket.readthedocs.io/newsletter_api.html#news-subscribe

var url = `https://www.mozilla.org/en-US/newsletter/`;

var basketSignup = function(transaction, onSuccessCallback, onFailCallback) {
  console.log(`basketSignup`, transaction);

  var payload = {
    format: `H`, // HTML emails
    newsletter: `mozilla-foundation`,
    triggerWelcome: `N`,
    email: transaction.email,
    privacy: transaction.privacy || false
  };

  var errorArray = [];
  var newsletterErrors = [];

  while (newsletterErrors.firstChild) {
    newsletterErrors.removeChild(newsletterErrors.firstChild);
  }

  var params =
    `email=` +
    encodeURIComponent(payload.email) +
    `&newsletters=` +
    payload.newsletter +
    `&privacy=` +
    payload.privacy +
    `&fmt=` +
    payload.format +
    `&source_url=` +
    // /* Strip query params in source url for newsletter signups: https://github.com/mozilla/foundation.mozilla.org/issues/2994#issuecomment-516997473 */
    encodeURIComponent(window.location.href.split(`?`)[0]);

  var xhr = new XMLHttpRequest();

  xhr.onload = function(r) {
    if (r.target.status >= 200 && r.target.status < 300) {
      var response = r.target.response;

      if (response === null) {
        onFailCallback(new Error());
        return;
      }

      if (response.success === true) {
        onSuccessCallback();
      } else {
        if (response.errors) {
          for (var i = 0; i < response.errors.length; i++) {
            errorArray.push(response.errors[i]);
          }
        }
        onFailCallback(new Error(errorArray));
      }
    } else {
      onFailCallback(new Error());
    }
  };

  xhr.onerror = function(e) {
    onFailCallback(e);
  };

  xhr.open(`POST`, url, true);
  xhr.setRequestHeader(`Content-type`, `application/x-www-form-urlencoded`);
  xhr.setRequestHeader(`X-Requested-With`, `XMLHttpRequest`);
  xhr.timeout = 5000;
  xhr.ontimeout = onFailCallback;
  xhr.responseType = `json`;
  xhr.send(params);

  return false;
};

export default basketSignup;
