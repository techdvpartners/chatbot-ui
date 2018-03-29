import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, TemplateRef, ViewContainerRef, AfterViewInit, ComponentFactoryResolver } from '@angular/core';
import { DialogFlowService } from '../dialog-flow.service';
import { Chart } from 'chart.js';
import { MessageDirective } from '../message/message.directive';
import { MessageItem } from '../message/message-item';
import { MessageComponent } from '../message/message.component';
import { TextMessageComponent } from '../message/text-message/text-message.component';
import { GraphMessageComponent } from '../message/graph-message/graph-message.component';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit, AfterViewChecked {
  textMessage: string;
  fileAsDataURL: any;
  sessionId = Math.random();

  constructor(private dialogFlowService: DialogFlowService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    var requestBodyWithEvent = {
      "lang": "en",
      "event": {
        "name": "Welcome",
        "data":{}
      },
      "sessionId": this.sessionId
    };
    this.queryAndHandleResponse(requestBodyWithEvent);    
  }

  @ViewChild('keepScrollDown') private scrollDownContainer: ElementRef;
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      this.scrollDownContainer.nativeElement.scrollTop = this.scrollDownContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  @ViewChild(MessageDirective) messageHost: MessageDirective;
  createMessage(messageItem: MessageItem){
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(messageItem.messageType);
    let viewContainerRef = this.messageHost.viewContainerRef;
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<MessageComponent>componentRef.instance).message = messageItem.message;
  }

  sendRequest() {
    if (this.textMessage != '' && this.textMessage != null) {
      this.sendTextMessage();
    }
    if (this.fileAsDataURL != '' && this.fileAsDataURL != null) {
      this.sendEvent();
    }
  }

  sendEvent() {
    var data = this.fileAsDataURL;
    this.fileAsDataURL = null;
    let messageObject = {
      'sender': 'You',
      'text': 'User uploads file'
    };
    let messageItem = new MessageItem(TextMessageComponent,messageObject);
    this.createMessage(messageItem)
    var requestBodyWithEvent = {
      "lang": "en",
      "event": {
        "name": "file-upload",
        "data":{
          "dataUrl":data
        }
      },
      "sessionId": this.sessionId
    };
    this.queryAndHandleResponse(requestBodyWithEvent);
  }

  sendTextMessage() {
    var queryMessage = this.textMessage;
    this.textMessage = '';
    let messageObject = {
      'sender': 'You',
      'text': queryMessage
    };
    let messageItem = new MessageItem(TextMessageComponent,messageObject);
    this.createMessage(messageItem);
    var requestBodyWithText = {
      "lang": "en",
      "query": queryMessage,
      "sessionId": this.sessionId
    };
    this.queryAndHandleResponse(requestBodyWithText);
  }

  queryAndHandleResponse(requestBody){
    console.log(requestBody);
    this.dialogFlowService.query(requestBody).subscribe(
      response => {
        console.log(response);
        var responseMessages = response['result']['fulfillment']['messages'];
        for (var message in responseMessages) {
          let messageObject = {
            'sender':'ChatBot',
            'text':responseMessages[message]['speech']
          };
          let messageItem = new MessageItem(TextMessageComponent,messageObject);
          this.createMessage(messageItem);
        }

        if(response['result']['fulfillment']['data']!=null){
          for(var message in response['result']['fulfillment']['data']){
            let messageObject = {
              'sender':'ChatBot',
              'data':response['result']['fulfillment']['data'][message]
            };
            let messageItem = new MessageItem(GraphMessageComponent,messageObject);
            this.createMessage(messageItem);
          }

        }
      }
    );
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.fileAsDataURL = reader.result;
      };

    }
  }

}
