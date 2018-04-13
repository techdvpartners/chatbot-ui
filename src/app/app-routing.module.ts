import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { ModalviewComponent } from './modalview/modalview.component';

const routes: Routes = [
  { path: 'fullview', component: ChatboxComponent },
  { path: '', component: ModalviewComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule {
  
}
