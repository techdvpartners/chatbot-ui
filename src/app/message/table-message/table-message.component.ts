import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MessageComponent } from '../message.component';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-table-message',
  templateUrl: './table-message.component.html',
  styleUrls: ['./table-message.component.css']
})
export class TableMessageComponent implements MessageComponent {
  @Input() sender;
  @Input() message;
  quickReplyValue: Subject<string> = new Subject();
  constructor() { }

  isA(text: string){
    return text.split(":")[0];
  }

  replaceType(text: string){
    return text.replace(this.isA(text)+":","");
  }

  sendTextMessage(text: string){
    this.quickReplyValue.next(text);
  }
}
