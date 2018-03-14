import { ListPage } from './../list/list';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';

/**
 * Generated class for the FiltersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html',
})
export class FiltersPage {
  price:any = { lower: 0, upper: 49500000 };
  area:any = { lower: 0 , upper: 520 };
  bedroom:any;
  bathroom : any;
  residential:boolean;
  land:boolean;
  constructor(public navCtrl: NavController, public viewCtrl:ViewController, public navParams: NavParams, public events:Events) {
    this.events.subscribe('filter:applied', (price,
                                             area,
                                             residential,
                                             land,
                                             bedroom,
                                             bathroom) => {
      // getting filter parameters
      this.area = area;
      this.price = price;
      this.residential = residential;
      this.land = land;
      this.bedroom = bedroom;
      this.bathroom = bathroom;

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FiltersPage');

  }
  applyFilters(){
    this.viewCtrl.dismiss();
    this.events.publish('filter:applied',
    this.price,
    this.area,
    this.residential,
    this.land,
    this.bedroom,
    this.bathroom);
  }
  resetFilters(){
    this.viewCtrl.dismiss();
    this.navCtrl.push(ListPage);
  }

}
