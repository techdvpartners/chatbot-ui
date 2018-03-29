import { Directive, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Directive({
  selector: '[message-host]'
})
export class MessageDirective {
  quickReplyValue: Subject<string> = new Subject();
  constructor(public viewContainerRef: ViewContainerRef) { }

}
