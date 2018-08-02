import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, TemplateRef, ViewContainerRef, AfterViewInit, ComponentFactoryResolver, Input } from '@angular/core';
import { DialogFlowService } from '../dialog-flow.service';
import { MessageDirective } from '../message/message.directive';
import { MessageItem } from '../message/message-item';
import { MessageComponent } from '../message/message.component';
import { TextMessageComponent } from '../message/text-message/text-message.component';
import { GraphMessageComponent } from '../message/graph-message/graph-message.component';
import { TableMessageComponent } from '../message/table-message/table-message.component';
import { ActivatedRoute } from '@angular/router';
import { ImageMessageComponent } from '../message/image-message/image-message.component';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit, AfterViewChecked {
  textMessage: string;

  @ViewChild('attachment')
  attachment: any;
  
  fileAsDataURL: any;

  date = new Date();
  dd = this.date.getDate();
  mm = this.date.getMonth()+1;
  yyyy = this.date.getFullYear();
  randomNumber = Math.floor(Math.random() * 999) + 101
  sessionId = this.yyyy + "-" + this.mm + "-" + this.dd + "-" + this.randomNumber;
  botTyping:boolean;
  attachmentUploading:boolean = false;

  constructor(private dialogFlowService: DialogFlowService, private componentFactoryResolver: ComponentFactoryResolver, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.dialogFlowService.token = data.token;
    });
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
    //this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      //TODO (mohak) This is a cheap hack for scrolling the chat window to bottom. Need to find out better solution for this.
      setTimeout(()=>{
        this.scrollDownContainer.nativeElement.scrollTop = this.scrollDownContainer.nativeElement.scrollHeight;
      },1);
    } catch (err) {
      console.log(err);
    }
  }

  @ViewChild(MessageDirective) messageHost: MessageDirective;
  createMessage(messageItem: MessageItem){
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(messageItem.messageType);
    let viewContainerRef = this.messageHost.viewContainerRef;
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<MessageComponent>componentRef.instance).sender = messageItem.sender;
    (<MessageComponent>componentRef.instance).message = messageItem.message;
    
    if(messageItem.messageType == TableMessageComponent){
      (<TableMessageComponent>componentRef.instance).quickReplyValue.subscribe(text => {
        this.textMessage = text;
        this.sendRequest();
      });
    }

    this.scrollToBottom();
  }

  sendRequest() {
    if (this.textMessage != '' && this.textMessage != null) {
      this.sendTextMessage();
    }
    if (this.fileAsDataURL != '' && this.fileAsDataURL != null) {
      this.sendEvent();
    }
    this.clearFileSelection();
  }

  async sendEvent() {
    var data = this.fileAsDataURL;
    
    this.attachmentUploading = true;
    this.scrollToBottom();
    
    let messageItem = new MessageItem(TextMessageComponent,'You','Attachment Uploaded');
    //TODO (mohak) This additional delay is for showing user that file upload is taking time. This is a chutiyapa from client not developer.
    console.log("File Upload delay: ");
    await this.sleep(4000);
    this.createMessage(messageItem);
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
    this.attachmentUploading = false;
    
  }
  sendTextMessage() {
    var queryMessage = this.textMessage;
    let messageItem = new MessageItem(TextMessageComponent,'You',queryMessage);
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
      async response => {
        this.botTyping = true;
        this.scrollToBottom();
        console.log(response);
        
        var responseMessages = response['result']['fulfillment']['messages'];
        for (var message in responseMessages) {
          let messageItem = new MessageItem(TextMessageComponent,'ChatBot',responseMessages[message]['speech']);
          //TODO (mohak) This is intentional delay. Should have been handled from Dialogflow but feature not present at the time of writing.
          await this.sleep(responseMessages[message]['speech'].length*50);
          this.createMessage(messageItem);
        }

        if(response['result']['fulfillment']['data']!=null){
          var richMessages = response['result']['fulfillment']['data'];
          for(var i in richMessages){
            let delay;
            let messageItem;
            if(richMessages[i]['representation'] == 'graph'){
              messageItem = new MessageItem(GraphMessageComponent,'ChatBot',{
                "xAxis":richMessages[i]['graphData']['xAxis'],
                "yAxis":richMessages[i]['graphData']['yAxis'],
                "title":richMessages[i]['graphData']['title']
              });
              delay = 5000;
            }
            else if(richMessages[i]['representation'] == 'text'){
              messageItem = new MessageItem(TextMessageComponent,'ChatBot',richMessages[i]['textData']);
              delay = richMessages[i]['textData'].length * 50;
            }
            else if(richMessages[i]['representation'] == 'image'){
              messageItem = new MessageItem(ImageMessageComponent,'ChatBot',richMessages[i]['imageDataUrl']);
              delay = 5000;
            }
            else if(richMessages[i]['representation'] == 'table'){
              messageItem = new MessageItem(TableMessageComponent,'ChatBot',richMessages[i]['tableData']);
              delay = 5000;
            }
            else if(richMessages[i]['representation'] == 'sessionId'){
              messageItem = new MessageItem(TextMessageComponent,'ChatBot',"Chat Reference : " + this.sessionId);
              delay = "Chat Reference : ".length*50;
            }
            else{
              messageItem = new MessageItem(TextMessageComponent,'ChatBot',JSON.stringify(richMessages[i]));
              delay = richMessages[i].length  *50;
            }
            //TODO (mohak) This is intentional delay. Should have been handled from Dialogflow but feature not present at the time of writing.
            await this.sleep(delay);
            this.createMessage(messageItem);
          }
        }
        this.botTyping = false;
      }
    );
    
  }

  async sleep(delay?:number){
    if(!delay){
      delay = Math.floor(Math.random() * 2000) + 1000;
    }
    console.log("Delay in miniseconds: " + delay);
    return new Promise(r => setTimeout(r, delay));
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
  clearFileSelection(){
    this.textMessage = "";
    this.attachment.nativeElement.value="";
    this.fileAsDataURL = null;
  }

  getFileName(){
    if(this.attachment.nativeElement.value){
      let fileFakePath = this.attachment.nativeElement.value;
      let fileFakePathSplitArray = fileFakePath.split('\\');
      return fileFakePathSplitArray[fileFakePathSplitArray.length - 1];
    }
    else{
      return "Choose File";
    }
  }

  reset(){
    window.location.reload();
  }
}