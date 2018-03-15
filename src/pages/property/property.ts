import { ScheduleProvider } from './../../providers/schedule/schedule';
import { Storage } from '@ionic/storage';
import { LoginPage } from './../login/login';
import { User } from './../../providers/user/user';
import { FavoriteProvider } from './../../providers/favorite/favorite';
import { MapitPage } from './../mapit/mapit';
import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController} from 'ionic-angular';

/**
 * Generated class for the PropertyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-property',
  templateUrl: 'property.html',
})
export class PropertyPage {
  isFav:boolean;
  prop:any;
  propertyInfo:any;
  constructor(private alertCtrl: AlertController,public loadingCtrl: LoadingController,public scheduler:ScheduleProvider,public navCtrl: NavController,public storage:Storage, public user:User ,public navParams: NavParams, public toastCtrl: ToastController,public favorite:FavoriteProvider) {

    this.prop = navParams.get('prop');
    if (user.isLogin())
    {
      console.log("property page : userlogin");
      this.propertyInfo = {
        property_id: this.prop['listingID']
      };
      this.favorite.check(this.propertyInfo).then((data:any)=>{
        console.log(data);

        let status =  JSON.parse(data.data);
        console.log(status);
        if(status.status == 'true')
        {
          this.isFav = true;
        }
        else {
          this.isFav = false;
        }
      },
        (err)=>{
          let toast = this.toastCtrl.create({
            message: JSON.parse(err.error).message ,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        });

    }
    else
    {
      this.isFav = false;
    }

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad PropertyPage');
  }
  Mapit(){
    this.navCtrl.push(MapitPage,{property:this.prop});
  }
  Fav(){
    if(this.user.isLogin()){
      //if login then add to Favorite or remove the Favorite
      if(this.isFav){
        //if already favorite then remove the favorite
        console.log("already Favorite Removing Favorite");
        this.isFav = false;
        this.removeFav(this.propertyInfo);
      }
      else{
        // if not favorite then add the favorite
        console.log("adding to Favorite");
        this.isFav = true;
        this.setFav(this.propertyInfo);
      }
    }
    else{
      this.navCtrl.push(LoginPage);
    }
  }
  setFav(propertyInfo){
    this.favorite.add(propertyInfo).then((resp) => {
      let toast = this.toastCtrl.create({
        message: "Favorites Added",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();

    }, (err) => {

      let toast = this.toastCtrl.create({
        message: JSON.parse(err.error).message,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
  removeFav(propertyInfo){
    this.favorite.remove(propertyInfo).then((resp) => {

      let toast = this.toastCtrl.create({
        message: "Favorites removed",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();

    }, (err) => {

      let toast = this.toastCtrl.create({
        message: JSON.parse(err.error).message,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
  schedule(){
    if (this.user.isLogin()){
      this.scheduler.check({'property_id': this.prop['listingID']})
      .then((data:any)=>{
        if(JSON.parse(data.data).status == 'true')
        {
          this.toastCtrl.create({
            message: 'Already Scheduled !!',
            duration: 3000,
            position: 'bottom'
          }).present();

        }
        else {
          this.scheduleit();
        }
      },(err)=>{
        let toast = this.toastCtrl.create({
          message: JSON.parse(err.error).message,
          duration: 3000,
          position: 'top'
        });
        toast.present()
      });

    }
    else{
      this.navCtrl.push(LoginPage);
    }
  }
  scheduleit(){
    let alert = this.alertCtrl.create({
      title: 'Schedule it',
      message: "Select Date & Time",
      inputs: [
        {

          name: 'date',
          value: '10:10:2018',
          type: 'date',
          checked: true
        },
        {
          value:'05:30AM',
          name: 'time',
          placeholder: 'Time',
          type: 'Time'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Schedule',
          handler: data => {
            console.log(data);
            let schedule = {
              'property_id': this.prop['listingID'],
              'schedule_time' : data.time,
              'schedule_date' : data.date
            };

              if(data.time && data.date){
                this.scheduler.add(schedule).then((resp) => {
                  let toast = this.toastCtrl.create({
                    message: "Property Scheduled",
                    duration: 3000,
                    position: 'bottom'
                  });
                  toast.present();

                }, (err) => {

                  let toast = this.toastCtrl.create({
                    message: JSON.parse(err.error).message,
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                });
              }
          }
        }
      ]
    });
    alert.present();
  }
}
