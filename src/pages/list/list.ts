
import { FiltersPage } from './../filters/filters';
import { HomePage } from './../home/home';
import { Component , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, PopoverController, Events, Content, ToastController } from 'ionic-angular';
import { PropertyPage } from '../property/property';
import { MlsProvider } from './../../providers/mls/mls';

/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  @ViewChild(Content) content: Content;

  properties:any = [];
  filteredProperties:any;
  allProperties:any;
  filtered:boolean = false;

  constructor(public toastCtrl:ToastController, public mls:MlsProvider, public events:Events,public popoverCtrl: PopoverController,public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public mlsProvider:MlsProvider) {

    this.getProperties();
    this.getallproperties();
    console.log(this.filteredProperties);
    events.subscribe('filter:applied', (price,
      area,
      residential,
      land,
      bedroom,
      bathroom) => {
      let loading = this.loadingCtrl.create({
        showBackdrop: false,
        duration:3000
      });
      loading.present();
      // getting filter parameters
      this.filteredProperties = this.allProperties;
      this.filterProperties(price,area,residential,land,bedroom,bathroom);
      console.log(this.filteredProperties);

      this.properties= this.filteredProperties;

    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }
  //present filter popover
  presentFilters(myEvent) {

    let popover = this.popoverCtrl.create(FiltersPage,{},{cssClass:'filter-popup'});
    popover.present({
      ev: myEvent
    });
  }
  //getting properties
  getProperties() {
    let loading = this.loadingCtrl.create({
      showBackdrop: false,
    });
    loading.present();
    this.mlsProvider.getFeatured(10)
      .then((data) => {

        var resultArray = Object.keys(data).map(function(personNamedIndex){
          let person = data[personNamedIndex];
          // do something with person
          return person;
        });

        this.properties = resultArray;
        console.log(this.properties);
        loading.dismissAll();
      },
      (err)=>{
        loading.dismissAll();
        let toast = this.toastCtrl.create({
          message: "Connection Error",
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
    });
  }
  // infinite scrolling
  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.mlsProvider.getFeatured(5)
      .then(data => {
        var resultArray = Object.keys(data).map(function(personNamedIndex){
          let person = data[personNamedIndex];
          // do something with person
          return person;
        });

        for (var i = 0; i < 5; i++) {
          this.properties.push(resultArray[0]);
        }
        console.log(this.properties);
      },
        (err)=>{
          let toast = this.toastCtrl.create({
            message: "Connection Error",
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
      );

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }
  //got to map page
  Map(){
      this.navCtrl.pop();
    }
  //property page link
  property(property){
      console.log(property);
      this.navCtrl.push(PropertyPage,{prop:property});
    }
  //applying filters selected
  filterProperties(price,area,residential,land,bedroom,bathroom){
    this.filtered = true;
    // this.content.scrollToTop();
   // filters the properties according to filtering parameters
   if (residential)
   {
      this.filteredProperties = this.filteredProperties.filter((item) =>
      {
         return item['idxPropType'] == 'Residential';
      });
      if(bathroom){
        this.filteredProperties = this.filteredProperties.filter((item) =>
          {
             return item['fullBaths'] == bathroom;
          });
       }
       if(bedroom){
        this.filteredProperties = this.filteredProperties.filter((item) =>
          {
             return item['bedrooms'] == bedroom;
          });
       }

   }
   if (land)
   {
      this.filteredProperties = this.filteredProperties.filter((item) =>
      {
         return item['idxPropType'] == 'Lots And Land';
      });
   }
   if(price){
    this.filteredProperties = this.filteredProperties.filter((item) =>
    {
       return item['price'] >= price.lower && item['price'] <= price.upper;
    });
   }
   if(area){
    this.filteredProperties = this.filteredProperties.filter((item) =>
    {
       return item['acres'] >= area.lower && item['acres'] <= area.upper;
    });
   }
  }
  //getting all properties for filters and search
  getallproperties(){
    console.log('getting all properties');
    this.mls.getFeaturedall().then((data) => {
      var resultArray = Object.keys(data).map(function(personNamedIndex){
        let person = data[personNamedIndex];
        // do something with person
        return person;
      });
    this.allProperties = resultArray;

    // this.filteredProperties = Array.of(this.filteredProperties);
    console.log(this.allProperties);

    }, (err) => {

      let toast = this.toastCtrl.create({
        message: "Connection Error",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    });
  }

  search(param : any) : void
   {
    this.content.scrollToTop();
     this.filteredProperties = this.allProperties;
      this.filtered = true;
      let val : string 	= param;

      // DON'T filter the technologies IF the supplied input is an empty string
      if (val.trim() !== '')
      {
         this.filteredProperties = this.filteredProperties.filter((item) =>
         {
           return item['remarksConcat'].toLowerCase().indexOf(val.toLowerCase()) > -1 ||
                  item['address'].toLowerCase().indexOf(val.toLowerCase()) > -1 ||
                  item['idxPropType'].toLowerCase().indexOf(val.toLowerCase()) > -1 ||
                  item['cityName'].toLowerCase().indexOf(val.toLowerCase()) > -1 ||
                  item['countyName'].toLowerCase().indexOf(val.toLowerCase()) > -1;
         });
      }else{
        this.properties = this.allProperties;
      }

      this.properties = this.filteredProperties;
   }

}
