import { Component, OnInit, Input } from '@angular/core';
import { MessageComponent } from '../message.component';

@Component({
  selector: 'app-image-message',
  templateUrl: './image-message.component.html',
  styleUrls: ['./image-message.component.css']
})
export class ImageMessageComponent implements MessageComponent {

  @Input() sender;
  @Input() message;

  constructor() { }


}
