import { Component, Input } from '@angular/core';
import { MessageComponent } from '../message.component';

@Component({
  selector: 'app-text-message',
  templateUrl: './text-message.component.html',
  styleUrls: ['./text-message.component.css']
})
export class TextMessageComponent implements MessageComponent {
  @Input() sender;
  @Input() message;
  constructor() { }

  ngOnInit() {
  }

}
