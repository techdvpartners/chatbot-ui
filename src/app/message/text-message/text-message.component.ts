import { Component, Input } from '@angular/core';
import { MessageComponent } from '../message.component';

@Component({
  selector: 'app-text-message',
  template: `<div [ngClass]="{
              'card bg-success text-white': sender === 'ChatBot',
              'card bg-light text-right': sender === 'You'
            }">
              <div class="card-body">
                <p class="card-title">
                  <b>{{ sender }}</b>
                </p>
                <p class="card-text">{{ message }}</p>
              </div>
            </div>`,
  styleUrls: ['./text-message.component.css']
})
export class TextMessageComponent implements MessageComponent {
  @Input() sender;
  @Input() message;
  constructor() { }

  ngOnInit() {
  }

}
