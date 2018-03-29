import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../config/app.config';

@Injectable()
export class DialogFlowService {
  url = "https://api.dialogflow.com/v1/query?v=20150910";
  constructor(private http: HttpClient) { }

  query(requestBody){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+CONFIG.bearerToken
      })
    };

    return this.http.post(this.url,requestBody,httpOptions);
  }
}
