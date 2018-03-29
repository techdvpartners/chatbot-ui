import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[message-host]'
})
export class MessageDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }

}
