import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MessageComponent } from '../message.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-graph-message',
  template: `<div [ngClass]="{
              'card bg-success text-white text-right': sender === 'You',
              'card bg-light': sender === 'ChatBot'
            }">
              <div class="card-body">
                <p class="card-title">
                  <b>{{ sender }}</b>
                </p>
                <div>
                  <canvas [id]="message['title']">{{ chart }}</canvas>
                </div>
              </div>
            </div>`,
  styleUrls: ['./graph-message.component.css']
})
export class GraphMessageComponent implements MessageComponent, AfterViewInit {
  @Input() sender;
  @Input() message;
  chart=[];
  constructor() {
    
  }

  ngAfterViewInit() {
    this.createChart();
  }

  createChart(){
    this.chart = new Chart(this.message.title, {
      type: 'line',
      data: {
        labels: this.message.xAxis,
        datasets: [
          {
            data: this.message.yAxis,
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
