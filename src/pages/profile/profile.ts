import { Component } from '@angular/core';
import {
 IonicPage, NavParams,NavController, ActionSheetController,
  ToastController, Platform, LoadingController, Loading
} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {User} from "../../providers/user/user";
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var AccountKitPlugin:any;
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user:any;
  defaultimg='./assets/imgs/drawer/avatar.png';
  imgchanged= false;
  loading: Loading;
  private profileForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public toastCtrl:ToastController,
    public loadingCtrl:LoadingController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public userservice:User,
    public actionSheetCtrl:ActionSheetController,
    private camera: Camera,
    public platform: Platform
    ){
    this.user = navParams.get('user');
    this.profileForm = this.formBuilder.group({
      first_name:['',Validators.compose([Validators.minLength(4), Validators.required])],
      last_name:['',Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      mobile:['',Validators.compose([Validators.minLength(6), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    let loading = this.loadingCtrl.create({
      showBackdrop: false,
    });
    loading.present();
    this.userservice.getDetails().then((data)=>{
        if(data.status == 200 && data.data != null && data.data[0] != '<'){
          this.user = JSON.parse(data.data);
          loading.dismissAll();
          console.log(data);
        }
        else{
          //do some thing like refresh token

          // this.getuser();
        }
      },
      (err)=>{
        console.error(err);
        loading.dismissAll();
        let toast = this.toastCtrl.create({
          message: JSON.parse(err.error.message),
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      });
  }
  verifyuser(){
    let options = {
      useAccessToken: true,
      defaultCountryCode: "PK",
      facebookNotificationsEnabled: true,
      initialPhoneNumber: ["+92", this.user.mobile]
    };
    let that = this;
    let success = function(response){
      that.updateProfile();
    }
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
  updateProfile(){
    console.log("updating Profile");
    let loading = this.loadingCtrl.create({
      showBackdrop: false,
    });
    loading.present();
    this.userservice.updateProfile(this.user).then((data)=>{
      console.log('data updated');
      loading.dismissAll();
        let toast = this.toastCtrl.create({
          message: "Profile Updated",
          duration: 3000,
          position: 'bottom'
        });
        toast.present();

    },
      (err)=>{
        loading.dismissAll();
        let toast = this.toastCtrl.create({
          message: "Connection Error",
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      })
  }
  profilepic(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Upload',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(sourceType){
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      allowEdit:true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 500,
      targetWidth: 500
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imgchanged = true;
      this.defaultimg = 'data:image/jpeg;base64,' + imageData;
      this.user.picture = imageData;
    }, (err) => {
      // Handle error
    });
  }

}
