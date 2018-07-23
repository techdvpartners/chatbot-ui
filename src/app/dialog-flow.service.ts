import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../config/app.config';

@Injectable()
export class DialogFlowService {
  constructor(private http: HttpClient) { }

  query(requestBody,sessionId){
    const url = 'https://dialogflow.googleapis.com/v2/projects/products-1c0bd/agent/sessions/'+ sessionId +':detectIntent';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+CONFIG.bearerToken
      })
    };

    return this.http.post(url,requestBody,httpOptions);
  }
}
