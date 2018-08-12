'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,
  active: false,
  interval: null,
  wordIntervalID: null,
  lineIntervalID: null,
  wordMap: null,
  lineMap: null,

  activate(state) {
    alert("Activating!");
    this.setTrackingInterval(5); // Will be changed later to have user input tracking interval

    this.wordMap = [];
    this.lineMap = [];
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'progressor:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    alert("Deactivating!");
    this.active = false;
    this.subscriptions.dispose();
  },

  serialize() {
    return {
      active : this.active,
    };
  },

  pushNumWords() {
    // Word is defined here as any sequence of characters with
    // leading and trailing whitespace
    alert("Pushing words")
    let editor = atom.workspace.getActiveTextEditor();
    this.wordMap.push(editor.getText().split(/\s+/).length);
    alert(this.wordMap.toString());
    return editor.getText().split(/\s+/).length;
  },

  pushNumLines() {
    // Returns number of lines in current text editor
    alert("Pushing lines")
    let editor = atom.workspace.getActiveTextEditor();
    this.lineMap.push(editor.getLineCount());
    alert(this.lineMap.toString());
    return editor.getLineCount();
  },

  setTrackingInterval(interval) {
    this.interval = interval;
  },

  trackProgress(interval) {
    // Interval is inputted in seconds
    alert("Tracking");
    this.pushNumWords();
    this.pushNumLines();
    this.wordIntervalID = setInterval(this.pushNumWords(), interval*1000);
    this.lineIntervalID = setInterval(this.pushNumLines(), interval*1000);
  },

  stopTrackingProgress() {
    alert("Not Tracking");
    clearInterval(this.wordIntervalID);
    clearInterval(this.lineIntervalID);
  },

  toggle() {
    // Switches state to and from active
    // Starts tracking progress if toggled to active
    // Stops tracking progress if toggled from active
    alert("Toggling!");
    this.active = !this.active
    alert(this.active);
    if (this.active) {
      this.trackProgress(this.interval);
    } else {
      this.stopTrackingProgress();
    }
  }

};
