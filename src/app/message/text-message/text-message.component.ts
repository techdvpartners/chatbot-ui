import { Component, Input } from '@angular/core';
import { MessageComponent } from '../message.component';

@Component({
  selector: 'app-text-message',
  template: `<div [ngClass]="{
              'card bg-success text-white': message.sender === 'You',
              'card bg-light text-right': message.sender === 'ChatBot'
            }">
              <div class="card-body">
                <p class="card-title">
                  <b>{{ message.sender }}</b>
                </p>
                <p class="card-text">{{ message.text }}</p>
              </div>
            </div>`,
  styleUrls: ['./text-message.component.css']
})
export class TextMessageComponent implements MessageComponent {
  @Input() message;
  constructor() { }

  ngOnInit() {
  }

}
