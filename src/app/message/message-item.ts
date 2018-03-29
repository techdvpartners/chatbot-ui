import { Type } from '@angular/core';

export class MessageItem {
  constructor(public messageType: Type<any>, public sender: string, public message: any) {}
}