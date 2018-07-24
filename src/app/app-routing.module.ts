import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { CONFIG } from '../../config/app.config';

const routes: Routes = [
  { path: 'product', component: ChatboxComponent, data: {token: CONFIG.productBearerToken} },
  { path: 'energy', component: ChatboxComponent, data: {token: CONFIG.energyBearerToken} },
  { path: '', component: ChatboxComponent, data: {token: CONFIG.energyBearerToken} }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule {
  
}
