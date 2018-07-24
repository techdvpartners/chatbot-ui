import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogFlowService } from './dialog-flow.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  
  modal:boolean = false;
  constructor(private route: ActivatedRoute, public dialogFlowService: DialogFlowService){
    this.route.queryParamMap.subscribe(map => {
      if(map.get('modal') === 'true'){
        this.modal = true;
      }
    });
  }
}
