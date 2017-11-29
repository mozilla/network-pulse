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
    this.currentPathname = ``;
    this.currentList = {};
    this.currentScrollPosition = 0;
    this.shouldRestore = false;
  }

  setCurrentPathname(pathname) {
    if (this.currentPathname !== pathname) {
      // we are visiting a new page, reset pageSettings and update currentPathname
      this.reset();
      this.currentPathname = pathname;
    }
  }

  setCurrentList(list = {}) {
    this.currentList = list;
  }

  setScrollPosition() {
    if (typeof window !== `undefined`) {
      // window.scrollY returns the value we want only when project cards
      // are rendered within a container that does not have its own scrollbar
      this.currentScrollPosition = window.scrollY;
    }
  }

  setRestore(value) {
    value = typeof value === `undefined` ? false : value;
    this.shouldRestore = value;
  }

  restoreScrollPosition() {
    if (typeof window !== `undefined` && this.shouldRestore) {
      window.scrollTo(0, this.currentScrollPosition);
      this.shouldRestore = false;
    }
  }
}

// An app will only ever have a single set of page settings, so we
// create a single one and use this as our export.
const pageSettings = new PageSettings();

export default pageSettings;
