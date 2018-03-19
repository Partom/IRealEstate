// import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/share';
import { HTTP } from '@ionic-native/http';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string = 'https://irealestateoregon.com/api/user';

  constructor(private http: HTTP) {
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    // if (!reqOpts) {
    //   reqOpts = {
    //     params: new HttpParams()
    //   };
    // }
    //
    // // Support easy query params for GET requests
    // if (params) {
    //   reqOpts.params = new HttpParams();
    //   for (let k in params) {
    //     reqOpts.params = reqOpts.params.set(k, params[k]);
    //   }
    // }

    return this.http.get(this.url + '/' + endpoint, params,reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }
  posturl(url: string, body: any, reqOpts?: any) {
    return this.http.post(url, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts, {});
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }
}
