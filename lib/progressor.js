'use babel';

var moment = require('moment');

import ProgressorView from './progressor-view';
import { CompositeDisposable } from 'atom';

export default {

  // Visual elements to display progress
  progressorView: null,
  modalPanel: null,

  subscriptions: null,
  active: false,
  hasBeenActivated: false,
  interval: 15,
  intervalID: null,

  // Arrays holding time, number of words, and number of lines
  timeMap: null,
  wordMap: null,
  lineMap: null,

  activate(state) {

    // Initializing
    this.timeMap = [],
    this.wordMap = [],
    this.lineMap = [],


    this.progressorView = new ProgressorView();
    this.progressorView.createChart(this.timeMap, this.wordMap, this.lineMap, this.interval);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.progressorView.getView(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'progressor:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.active = false;
    this.subscriptions.dispose();
  },

  serialize() {},

  trackProgress() {
    let initEditor = atom.workspace.getActiveTextEditor();

    this.timeMap.push(moment().format('h:mm:ss A'));
    this.wordMap.push(initEditor.getText().split(/\s+/).length);
    this.lineMap.push(initEditor.getLineCount());

    this.intervalID = setInterval(() => {
      // Pushes time, wordCount, and lineCount to respective arrays after each interval
      let currentEditor = atom.workspace.getActiveTextEditor();
      if (currentEditor !== undefined) {
        this.timeMap.push(moment().format('h:mm:ss A'));
        this.wordMap.push(currentEditor.getText().split(/\s+/).length);
        this.lineMap.push(currentEditor.getLineCount());
      }
    }, this.interval*1000);
  },

  toggle() {
    // Switches between text editor and view of progress chart
    if (!this.hasBeenActivated) {
      this.hasBeenActivated = true;
      this.trackProgress();
    }
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

};
