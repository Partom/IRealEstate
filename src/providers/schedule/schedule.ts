import { Injectable } from '@angular/core';
import { Api } from './../api/api';
// import { Events } from 'ionic-angular';
import { Storage } from "@ionic/storage";

/*
  Generated class for the ScheduleProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ScheduleProvider {
  options:any;
  user:any;
  constructor(public api: Api,public storage:Storage) {
    console.log('Hello ScheduleProvider Provider');
    storage.ready().then(()=> {
      storage.get('userdata').then((data) => {
        console.log(data);
        this.user = data;
        this.options = {
          'Authorization': this.user.token_type + " " + this.user.access_token,
          'X-Requested-With': 'XMLHttpRequest'
        };
      });
    });

  }
  add(propertyInfo: any) {
    console.log("Schedule Add Funtion");

    let seq = this.api.post('schedules/add', propertyInfo, this.options);

    seq.then((res: any) => {
      // If the API returned a successful response
      console.error('Scchedule added!!');
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }
  remove(propertyInfo: any) {
    console.log("schedule remove Funtion");

    let seq = this.api.post('schedules/remove', propertyInfo, this.options);

    seq.then((res: any) => {
      // If the API returned a successful response,
      console.error('Schedule Removed');
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }
  get() {
    console.log("schedule get Funtion");
    let seq = this.api.get('schedules/get',{},this.options);

    seq.then((res: any) => {



    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }
  check(propertyInfo: any)  {
    console.log(propertyInfo);
    console.log(this.options);

    let seq = this.api.get('schedules/check', propertyInfo, this.options);

    seq.then((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log(JSON.parse(res.data).status);

    }, err => {
      console.error('ERROR', err);
    });
     return seq;
  }

}
