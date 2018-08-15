'use babel';

var moment = require('moment');
moment().format();

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,
  active: false,
  interval: null,
  intervalID: null,

  // Array holding time series data of number of words and number of lines
  wordMap: null,
  lineMap: null,

  activate(state) {
    alert("Activating!");

    // Initializing values
    this.wordMap = [];
    this.lineMap = [];

    // Will be changed later to have user input tracking interval
    this.setTrackingInterval(5);

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

  setTrackingInterval(interval) {
    this.interval = interval;
  },

  getTimeAsString() {
    let d = new Date();
    let formattedDate = d.getHours() + ":" +
                       (d.getMinutes() < 10 ? '0' : '') +
                        d.getMinutes() + ":" +
                       (d.getSeconds() < 10 ? '0' : '') +
                        d.getSeconds();
    alert(formattedDate);
    return formattedDate;
  },

  trackProgress() {
    let editor = atom.workspace.getActiveTextEditor();
    let initTime = moment().format("M/D/Y h:mm:ss A");
    alert(initTime);

    this.wordMap.push({
      time: initTime,
      wordCount: editor.getText().split(/\s+/).length
    });

    this.lineMap.push({
      time: initTime,
      lineCount: editor.getText().split(/\s+/).length
    });

    this.intervalID = setInterval(() => {
      // trackingTime is time after each passing of this.interval seconds
      // Pushes to wordMap and lineMap with same time
      let trackingTime = moment().format("M/D/Y h:mm:ss A");

      // Push number of words to wordMap
      this.wordMap.push({
        time: trackingTime,
        count: editor.getText().split(/\s+/).length
      });

      // Push number of lines to lineMap
      this.lineMap.push({
        time: trackingTime,
        count: editor.getLineCount()
      });

      alert(this.mapToString(this.wordMap));
      alert(this.mapToString(this.lineMap));
    }, this.interval*1000);
  },

  mapToString(arr) {
    index = arr[arr.length-1];
    return (Object.values(index));
  },

  stopTrackingProgress() {
    clearInterval(this.intervalID);
  },

  toggle() {
    // Switches state to and from active
    // Starts tracking progress if toggled to active
    // Stops tracking progress if toggled from active
    this.active = !this.active;
    if (this.active) {
      this.trackProgress();
    } else {
      this.stopTrackingProgress();
    }
  }

};
