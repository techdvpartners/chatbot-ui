import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { DialogFlowService } from './dialog-flow.service';
import { MessageDirective } from './message/message.directive';
import { MessageComponent } from './message/message.component';
import { TextMessageComponent } from './message/text-message/text-message.component';
import { GraphMessageComponent } from './message/graph-message/graph-message.component';
import { TableMessageComponent } from './message/table-message/table-message.component';


@NgModule({
  entryComponents: [ TextMessageComponent, GraphMessageComponent, TableMessageComponent ],
  declarations: [
    AppComponent,
    ChatboxComponent,
    MessageDirective,
    TextMessageComponent,
    GraphMessageComponent,
    TableMessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DialogFlowService],
  bootstrap: [AppComponent]
})
export class AppModule { }
