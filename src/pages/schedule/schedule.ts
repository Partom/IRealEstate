import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {ScheduleProvider} from "../../providers/schedule/schedule";

/**
 * Generated class for the SchedulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  date;
  time;
  property_id;
  constructor(public scheduler:ScheduleProvider, public toastCtrl: ToastController,public viewCtrl:ViewController,public navCtrl: NavController, public navParams: NavParams) {
    this.property_id = this.navParams.get("property_id");
    console.log(this.property_id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
  }
  Cancel(){
    this.viewCtrl.dismiss();
  }
  ScheduleIt(){
    this.viewCtrl.dismiss();
    let schedule = {
      'property_id': this.property_id,
      'schedule_time' : this.time,
      'schedule_date' : this.date
    };

    if(this.time && this.date){
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
