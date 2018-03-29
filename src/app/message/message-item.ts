import { Type } from '@angular/core';

export class MessageItem {
  constructor(public messageType: Type<any>, public message: any) {}
}