import { User } from './../../providers/user/user';
import { ScheduleProvider } from './../../providers/schedule/schedule';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { PropertyPage } from '../property/property';

/**
 * Generated class for the ScheduleitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scheduleit',
  templateUrl: 'scheduleit.html',
})
export class ScheduleitPage {
  scheduleproperties:any;
  constructor(public toastCtrl:ToastController,public navCtrl: NavController,public user:User, public loadingCtrl:LoadingController, public scheduler:ScheduleProvider,public navParams: NavParams) {
  }
  ionViewCanEnter(){
    if(this.user.isLogin()){
      console.log('Login page user already logind');
      // this.navCtrl.push(HomePage);
      return true;
    }else{
      console.log('bosri ca');
      return false;
    }
  }
  ionViewDidLoad() {

    setTimeout(() => {
      this.getSchedules();
    }, 500);
  }
  getSchedules(){
    console.log('ionViewDidLoad ScheduleitPage');
    let loading = this.loadingCtrl.create({
      showBackdrop: false,
    });
    loading.present();
    this.scheduler.get().then((resp) => {
    this.scheduleproperties = JSON.parse(resp.data);

    this.scheduleproperties = Array.of(this.scheduleproperties);
    this.scheduleproperties = this.scheduleproperties[0]['data'];
    console.log(this.scheduleproperties);
    loading.dismissAll();
    }, (err) => {
      loading.dismissAll();
      let toast = this.toastCtrl.create({
        message: "Connection Error",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    });
  }
  property(property){
    console.log(property);
    this.navCtrl.push(PropertyPage,{prop:property});
  }
  Unschedule(property){
    let loading = this.loadingCtrl.create({
      showBackdrop: false,
    });
    loading.present();
    let schedule = {
      'property_id': property['listingID'],

    };
    this.scheduler.remove(schedule).then((resp) => {
      loading.dismissAll();

      let toast = this.toastCtrl.create({
        message: "Schedule Removed",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      this.getSchedules();

    }, (err) => {
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
