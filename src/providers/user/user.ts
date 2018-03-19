import { Platform } from 'ionic-angular';
import { Api } from './../api/api';
import 'rxjs/add/operator/toPromise';
import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
declare var AccountKitPlugin:any;
@Injectable()
export class User {
  _user: any;
  islogin:boolean = false;
  headers:any;
  constructor(
    public api: Api,
    public plt:Platform,
    public events:Events,
    public storage:Storage
  ) {
    let user;

    storage.ready().then(()=>{
        this.storage.get('userdata').then((data)=>{
        user = data;
        this.headers = {
        'Authorization':  user.token_type+" "+user.access_token,
        'X-Requested-With': 'XMLHttpRequest'
       };
      })
    });

    this.storage.get('user').then((data)=>{
      this.islogin = data;
    });
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {

    this._logout();
    let seq = this.api.posturl('https://irealestateoregon.com/oauth/token', accountInfo);

    seq.then((res: any) => {
      // If the API returned a successful response, mark the user as logged in
        this._user = JSON.parse(res.data)
        console.log(res.data);
        this.storage.set('userdata',this._user);
        // this.storage.set('user','value');
        localStorage.setItem('user', 'true');
      // this.storage.set('access_token',this._user.access_token);
      // this.storage.set('refresh_token',this._user.refresh_token);
      // this.storage.set('token_type',this._user.token_type);
        this.events.publish('user:login', true);
      this.headers = {
        'Authorization':  this._user.token_type+" "+this._user.access_token,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type':'multipart/form-data'
      };
        this.getDetails();
        this._loggedIn(JSON.parse(res.data));

    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    console.log("signup");
    let seq = this.api.post('signup', accountInfo);

    seq.then((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (JSON.parse(res.data) != null) {
        console.log("Logined");
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  _logout() {
    this.storage.clear();
    this.events.publish('user:login', false);
    this._user = null;
    localStorage.clear();
    this.events.unsubscribe('user:profile');

  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user= resp;
    console.log(this._user);
  }
  /**
   * checks that user login or not
   */
  isLogin() : boolean {


    if(this._user || localStorage.getItem('user') == 'true'){

      this.getDetails();
      return true;
    }
    else {
      return false;
    }

  }
  //
  //   returns the detail of User
  //
  getDetails(){
    console.log(this.headers);

    let device_type;
    if (this.plt.is('ios')) {
      // This will only print when on iOS
      device_type = "ios";
    }
    else{
      device_type = "android";
    }
    console.log(device_type);
    let seq = this.api.get('details', {device_type: device_type},this.headers);

    seq.then((res: any) => {
      console.log('another check');
      console.log(res);
      if(res.data[0] != '<')
      {
        console.log('anothercheck2');
        this.events.publish('user:profile', JSON.parse(res.data));
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;

  }
  refeshToken(){
    console.log("Refereshing Token");
  }
  updateProfile(user){
    console.log("updating profile");
    let seq = this.api.post('update/profile', user,this.headers);

    seq.then((res: any) => {
      console.log('updated');
      if(res.data[0] != '<')
      {
        this.events.publish('user:profile', JSON.parse(res.data));
      }


    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }
}
