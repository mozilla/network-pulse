/**
 * A page settings class for our application - an app running in the browser or in a webview
 * only ever has one user, never multiple concurrent users, so we can defined its
 * class here, and then export a singleton pageSettings for shared use in all pages.
 *
 * PageSettings is used to preserve state so when users go back to a project list view from
 * a detail project card view they can be sent to where they were before
 * (same loaded projects, same scroll position).
 */
class PageSettings {
  constructor() {
    this.reset();
  }

  reset() {
    this.currentList = {};
    this.currentScrollPosition = 0;
    this.restore = false;
  }

  setCurrentList(list = {}) {
    this.currentList = list;
  }

  setScrollPosition() {
    if (typeof window !== `undefined`) {
      this.currentScrollPosition = window.pageYOffset;
    }
  }

  setRestore() {
    this.restore = true;
  }

  restoreScrollPosition() {
    if (typeof window !== `undefined` && this.restore) {
      window.scrollTo(0, this.currentScrollPosition);
      this.reset();
    }
  }
}

// An app will only ever have a single set of page settings, so we
// create a single one and use this as our export.
const pageSettings = new PageSettings();

export default pageSettings;
