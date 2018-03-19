// import { HomePage } from './../home/home';
import { ListPage } from './../list/list';
import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { User } from './../../providers/user/user';
import { Firebase } from '@ionic-native/firebase';
import { Device } from '@ionic-native/device';
// import firebase from 'firebase';
// import {Device} from '@ionic-native';
import { Platform } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var AccountKitPlugin:any;

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers:[Firebase,Device]
})

export class RegisterPage {
  // public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  public verified = false;
  contrycode = '+1';
  mobilenumber='23748293423';
  account = {
    social_unique_id: '',
    device_type: '',
    device_token: '',
    device_id: '',
    login_by: 'manual',
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    password: '',
   };
   login={
    username: '',
    password: '',
    grant_type:'password',
    client_id: '1',
    client_secret: 'SavTUZxFRwToIkvyDPqZq5x4xuaxtRsTsfAUsM0q'
   }
  private signupForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public user: User,
    private firebase: Firebase,
    private device: Device,
    public loadingCtrl:LoadingController,
    public alertCtrl: AlertController,
    public plt: Platform,
    private formBuilder: FormBuilder,) {
    this.signupForm = this.formBuilder.group({
      last_name: ['', Validators.compose([ Validators.required])],
      first_name: ['', Validators.compose([ Validators.required])],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }
  ionViewCanEnter(){
    if(this.user.isLogin()){
      console.log('Login page user already logind');
      return false;
    }else{
      console.log('bosri ca');
      return true;
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    // console.log(this.device.platform + this.device.uuid + this.firebase.getToken());
    // this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    // getting token
    this.firebase.getToken()
    .then(token => {
      this.account.device_token = token;
    }).catch(error => console.error('Error getting token', error));
    // getting device type
    if (this.plt.is('ios')) {
      // This will only print when on iOS
      this.account.device_type = "ios";
    }
    else{
      this.account.device_type = "android";
    }

    // getting device id
      this.account.device_id = this.device.uuid;


  // });
  // this.account.device_id = 'xncjajkds';
  // this.account.device_token = "asdasdas";
  }


  verifyuser(){
    AccountKitPlugin.logout();
     this.contrycode = '1';
     this.mobilenumber='';
    let options = {
      useAccessToken: true,
      defaultCountryCode: "USA",
      facebookNotificationsEnabled: true,
      initialPhoneNumber: [this.contrycode, this.mobilenumber]
    };
    let that = this;
    let success = function(response){
      console.log(response);
      let tempthat = that;
      AccountKitPlugin.getAccount(function (fbaccount) {
        tempthat.account.mobile = fbaccount.phoneNumber;
        tempthat.doSignup();
      } , function (err) {
        console.log(err);
        let toast = tempthat.toastCtrl.create({
          message: err,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        return error;
      } );


    };
    let error = function(err){
      console.log(err);
      let toast = that.toastCtrl.create({
        message: err,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      return error;
    };
    AccountKitPlugin.loginWithPhoneNumber(options, success, error);
  }
  public doSignup() {

    let loading = this.loadingCtrl.create({
      showBackdrop: false,
    });
    loading.present();

    // Attempt to login in through our User service
    this.user.signup(this.account).then((resp) => {
      //if success then login the user automatically
      this.login.username = this.account.email;
      this.login.password = this.account.password;
      this.user.login(this.login).then((resp) => {
        loading.dismissAll();
        let toast = this.toastCtrl.create({
          message: "Logged in successfully",
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        this.navCtrl.pop();
      }, (err) => {
        loading.dismissAll();
        // Unable to sign in
        let toast = this.toastCtrl.create({
          message: JSON.parse(err.error).message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
      this.navCtrl.push(ListPage);
    }, (err) => {
      // Unable to sign up
      loading.dismissAll();
      let toast = this.toastCtrl.create({
        message: JSON.parse(err.error).message,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
