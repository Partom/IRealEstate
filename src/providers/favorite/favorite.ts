
import { Injectable } from '@angular/core';
import { Api } from './../api/api';
import { Storage } from "@ionic/storage";
/*
  this is simple provider which hadels the Favorites Fuctions.
  This Favorite provider makes calls to our API at the `Favorites` endpoints.
*/
@Injectable()
export class FavoriteProvider {
  headers:any;
  user:any;
  constructor( public api: Api, public storage:Storage) {
    console.log('Hello FavoriteProvider Provider');
    storage.ready().then(()=> {
      storage.get('userdata').then((data) => {
        console.log(data);
        this.user = data;
        this.headers = {
          'Authorization': this.user.token_type + " " + this.user.access_token,
          'X-Requested-With': 'XMLHttpRequest'
        };
        console.log(this.headers);
      });
    });
  }
  add(propertyInfo: any) {
    console.log("Favorite Add Funtion");

    let seq = this.api.post('favorites/add', propertyInfo, this.headers);

    seq.then((res: any) => {
      // If the API returned a successful response
      console.error('Favorite added!!');
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }
  remove(propertyInfo: any) {
    console.log("Favorite remove Funtion");

    let seq = this.api.post('favorites/remove', propertyInfo, this.headers);

    seq.then((res: any) => {
      // If the API returned a successful response,
      console.error('Favorite Removed');
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }
  get() {
    console.log("Favorite get Funtion");
    let seq = this.api.get('favorites/get',{},this.headers);

    seq.then((res: any) => {



    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }
  check(propertyInfo: any)  {
    console.log(propertyInfo);
    console.log(this.headers);
    let seq = this.api.get('favorites/check', propertyInfo, this.headers);

    seq.then((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      // console.log(JSON.parse(res.data).status);

    }, err => {
      console.error('ERROR', err);
    });
     return seq;
  }


}
