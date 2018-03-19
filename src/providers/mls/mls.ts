// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { HTTP } from "@ionic-native/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
// import {Http , RequestOptions , Headers} from "@angular/http";
import { HTTP } from '@ionic-native/http';
/*

  Generated class for the MlsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MlsProvider {
  apiUrl = 'https://api.idxbroker.com';
  headers;
  public offset:number;
  constructor(private http: HTTP) {
    console.log('Hello MlsProvider Provider');
    this.headers=
    {
      'Content-Type' :'application/x-www-form-urlencoded',
     'accesskey': '5ovbVDJATGkDo7bgpUM2XR',
      'responseType': 'json'
    };


    this.offset=0
  }
  getFeatured(limit) {

    return new Promise(resolve => {
      // this.http.get(this.apiUrl+'/clients/featured?limit='+limit+'&offset='+this.offset,httpOptions)
      this.http.get(this.apiUrl+'/clients/featured?limit='+limit+'&offset='+this.offset,{},this.headers)
        .then(data => {
        this.offset = this.offset +limit;
        resolve(JSON.parse(data.data));
      },
      err => {
        console.log(err);
      });
    });
  }
  getFeaturedall() {
      return new Promise(resolve => {
        // this.http.get(this.apiUrl+'/clients/featured',httpOptions).subscribe(data => {
        this.http.get(this.apiUrl+'/clients/featured',{} ,this.headers)
          .then(data => {
          resolve(JSON.parse(data.data));
        }, err => {
          resolve(err);
        });
      });
    }
}
