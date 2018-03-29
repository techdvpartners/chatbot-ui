import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MessageComponent } from '../message.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-graph-message',
  template: `<div [ngClass]="{
              'card bg-success text-white': message.sender === 'You',
              'card bg-light text-right': message.sender === 'ChatBot'
            }">
              <div class="card-body">
                <p class="card-title">
                  <b>{{ message.sender }}</b>
                </p>
                <div>
                  <canvas id="canvas">{{ chart }}</canvas>
                </div>
              </div>
            </div>`,
  styleUrls: ['./graph-message.component.css']
})
export class GraphMessageComponent implements MessageComponent {
  @Input() message;
  chart=[];
  constructor() { }

  ngOnInit() {
    this.createChart();
  }

  createChart(){
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.message.data.xAxis,
        datasets: [
          {
            data: this.message.data.yAxis,
            borderColor: "#3cba9f",
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }

}
