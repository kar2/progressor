'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,
  active: false,

  activate(state) {
    alert("Activating!");
    this.active = true;
    alert(this.getNumWords());
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
    return {active : this.active};
  },

  getNumWords() {
    // Word is defined here as any sequence of characters with
    // leading and trailing whitespace
    let editor = atom.workspace.getActiveTextEditor();
    return editor.getText().split(/\s+/).length;
  },

  getNumLines() {

  },

  toggle() {
    console.log('Progressor was toggled!');
    if (this.active) {
      this.active = false;
    } else {
      this.active = true;
    }
    if (this.active) {
      alert(this.getNumWords());
    }
  }

};
