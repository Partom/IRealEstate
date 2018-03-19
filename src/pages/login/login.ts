import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { User } from './../../providers/user/user';
import { RegisterPage } from '../register/register';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  account = {
    username: '',
    password: '',
    grant_type:'password',
    client_id: '1',
    client_secret: 'SavTUZxFRwToIkvyDPqZq5x4xuaxtRsTsfAUsM0q'
   };
  private loginForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public user: User,
    public storage:Storage,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  ionViewCanEnter(){
    if(this.user.isLogin()){
      console.log('Login page user already logind');
      // this.navCtrl.push(HomePage);
      return false;
    }else{
      console.log('bosri ca');
      return true;
    }
  }
  Login(){
        let loading = this.loadingCtrl.create({
            showBackdrop: false,
        });
        loading.present();
        // Attempt to login in through our User service
        this.user.login(this.account).then((resp) => {
          loading.dismissAll();
          let toast = this.toastCtrl.create({
            message: "Logged in successfully",
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
          this.navCtrl.pop();
        }, (err) => {
          // Unable to sign in
          loading.dismissAll();
          if(JSON.parse(err.error).error == "invalid_credentials"){
            let toast = this.toastCtrl.create({
              // message: JSON.parse(err.error).message,
              message: "Invalid credentials !",
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
          }
          else
          {
            let toast = this.toastCtrl.create({
              // message: JSON.parse(err.error).message,
              message: "Connection Error",
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
          }

        });
  }
  public createAccount() {
    this.navCtrl.push(RegisterPage);
  }
}
