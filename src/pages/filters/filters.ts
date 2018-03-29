import { ListPage } from './../list/list';
import { Component } from '@angular/core';
import { NavController, NavParams, Events, ViewController } from 'ionic-angular';

/**
 * Generated class for the FiltersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html',
})
export class FiltersPage {
  price:any = { lower: 0, upper: 49500000 };
  area:any = { lower: 100 , upper: 5000 };
  bedroom:any;
  bathroom : any;
  residential:boolean;
  land:boolean;
  constructor(public navCtrl: NavController, public viewCtrl:ViewController, public navParams: NavParams, public events:Events) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FiltersPage');
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
  applyFilters(){
    this.area.upper = this.area.upper / 43560;
    this.area.lower = this.area.lower / 43560;
    console.log(this.area);
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
    this.events.unsubscribe('filter:applied');
    this.events.publish('filter:reset',true);
    this.viewCtrl.dismiss();
  }
  add(element){
    console.log("add click for " + element);
    if(element == "pu")
    {
      this.price.upper++;
    }
    if(element == "pl")
    {
      this.price.lower++;
    }
    if(element == "au")
    {
      this.area.upper++;
    }
    if(element == "al")
    {
      this.area.lower++;
    }

  }
  minus(element)
  {
    console.log("Minus click for " + element);
    if(element == "pu")
    {
      if(this.price.upper <= 0){
        this.price.upper = 0;
      }
      else{
        this.price.upper--;
      }
    }
    if(element == "pl")
    {
      if(this.price.lower <= 0){
        this.price.lower = 0;
      }
      else{
        this.price.lower--;
      }
    }
    if(element == "au")
    {
      if(this.area.upper <= 0){
        this.area.upper = 0;
      }
      else{
        this.area.upper--;
      }
    }
    if(element == "al")
    {
      if(this.area.lower <= 0){
        this.area.lower = 0;
      }
      else{
        this.area.lower--;
      }
    }

  }

}
