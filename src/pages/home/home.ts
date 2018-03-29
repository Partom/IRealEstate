import { ListPage } from './../list/list';

import { Component, ViewChild, ElementRef } from '@angular/core';
import {LoadingController, PopoverController, NavController, ToastController, Events} from 'ionic-angular';
import { MlsProvider } from '../../providers/mls/mls';
import {PropertyPage} from "../property/property";
import {FiltersPage} from "../filters/filters";
// import {PropertyPage} from "../property/property";
declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  properties:any;
  filteredProperties:any;
  allProperties:any;
  constructor(public popoverCtrl:PopoverController,public events:Events, public loadingCtrl: LoadingController,public navCtrl: NavController, public mlsProvider:MlsProvider , public toastCtrl : ToastController) {
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
      this.loadMap(this.filteredProperties[0]);
      this.addMarkersToMap(this.filteredProperties);
    });
    this.events.subscribe('filter:reset',(value)=>{
      if(value){
        this.properties = this.allProperties;
        this.inializemappage();
        this.events.publish('filter:reset',false);
      }
    });
  }
  ionViewDidLoad(){
    this.inializemappage();
  }
  inializemappage(){
    this.loadMap();
    this.getMarkers();
  }
  presentFilters(myEvent) {

    let popover = this.popoverCtrl.create(FiltersPage,{},{cssClass:'filter-popup'});
    popover.present({
      ev: myEvent
    });
  }
  //applying filters selected
  filterProperties(price,area,residential,land,bedroom,bathroom){

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
  //applying serach
  search(param : any) : void
  {
    this.filteredProperties = this.allProperties;

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
      this.loadMap(this.filteredProperties[0]);
      this.addMarkersToMap(this.filteredProperties);
    }else{
      this.properties = this.allProperties;
      this.inializemappage();
    }
  }
  loadMap(property?:any){
    let latLng;
    let zoom = 10;
    if(property){
     latLng = new google.maps.LatLng(property['latitude'],property['longitude']);
     zoom = 12;
    }
    else {
      latLng = new google.maps.LatLng(45.3276917,-123.1745789);
    }
    let mapOptions = {
      center: latLng,
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,

    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  }
  getMarkers() {
    //showing loading
    let loading = this.loadingCtrl.create({
      showBackdrop: false,
    });
    loading.present();
    this.mlsProvider.getFeaturedall()
    .then(data => {
      var resultArray = Object.keys(data).map(function(personNamedIndex){
        let person = data[personNamedIndex];
        // do something with person
        return person;
      });
      this.allProperties = resultArray;
      this.addMarkersToMap(resultArray);
      loading.dismissAll();
      console.log(resultArray);
    },(err)=>{
      loading.dismissAll();
      let toast = this.toastCtrl.create({
        message: "Connection Error",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    });
  }

  addMarkersToMap(markers) {
    for(let marker of markers) {
      var newmarker = new google.maps.Marker({
        map:this.map,
        visible: true,
        title: marker['address'],
        draggable: false,
        animation: google.maps.Animation.DROP,
        position: {lat: marker['latitude'], lng: marker['longitude']},
        icon: {
          url: "./assets/imgs/home/map-nav.png",
          scaledSize: new google.maps.Size(30, 30)
        }
    });
      let that = this;
      newmarker.addListener('click', function() {
        that.navCtrl.push(PropertyPage,{prop:marker});

      });
    }
  }
  List(){
    this.navCtrl.push(ListPage);
    }
}
