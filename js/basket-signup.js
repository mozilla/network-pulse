// Posting to Basket
// Doc: https://basket.readthedocs.io/newsletter_api.html#news-subscribe

var basketSignup = function (transaction, onSuccess, onFail) {
  var params = new URLSearchParams();
  params.append(`fmt`, `H`); // format
  params.append(`newsletters`, `mozilla-foundation`);
  params.append(`privacy`, transaction.privacy);
  params.append(`email`, transaction.email);
  /* Strip query params in source url for newsletter signups: https://github.com/mozilla/foundation.mozilla.org/issues/2994#issuecomment-516997473 */
  params.append(`source_url`, window.location.href.split(`?`)[0]);

  fetch(`https://www.mozilla.org/en-US/newsletter/`, {
    method: `POST`,
    headers: {
      "Content-Type": `application/x-www-form-urlencoded`,
      "X-Requested-With": `XMLHttpRequest`,
    },
    body: params.toString(),
  })
    .then((response) => response.json())
    .then((response) => {
      // throw error if Basket responded with errors
      if (!response.success) {
        throw new Error(response.errors);
      }

      if (onSuccess) {
        onSuccess();
      }
    })
    .catch((error) => {
      if (onFail) {
        onFail(error);
      }
    });
};

export default basketSignup;
