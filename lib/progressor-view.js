'use babel';

import Chart from 'chart.js';

Chart.defaults.global.defaultFontColor = 'gray';
Chart.defaults.global.defaultFontFamily = 'sans-serif';

export default class ProgressorView {


  constructor() {
    // Creating view element that will have chart on it
    this.view = document.createElement('canvas');
  }

  createChart(timeLabels, wordData, lineData, updateInterval) {
    let chart = new Chart(this.view, {
      type: 'line',
      data: {
        labels: timeLabels,
        datasets: [{
          label: '#words',
          borderColor: 'rgb(255, 105, 115)',
          backgroundColor: 'rgba(255, 105, 115, 0.1)',
          data: wordData,
          borderWidth: 1
        }, {
          label: '#lines',
          borderColor: 'rgb(116, 132, 223)',
          backgroundColor: 'rgba(116, 132, 223, 0.1)',
          data: lineData,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    })
    chart.update();
    this.updateID = setInterval(() => {
      chart.update();
    }, updateInterval*1000);
  }

  getView() {
    return this.view;
  }
}
