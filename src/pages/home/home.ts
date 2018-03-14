import { ListPage } from './../list/list';

import { Component, ViewChild, ElementRef } from '@angular/core';
import {LoadingController, NavController, ToastController} from 'ionic-angular';
import { MlsProvider } from '../../providers/mls/mls';
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
  constructor( public loadingCtrl: LoadingController,public navCtrl: NavController, public mlsProvider:MlsProvider , public toastCtrl : ToastController) {

  }
  ionViewDidLoad(){
    this.loadMap();
    this.getMarkers();
  }

  loadMap(){

    let latLng = new google.maps.LatLng(44.7720691,-123.3013159);

    let mapOptions = {
      center: latLng,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,

    }

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
    }
  }
  List(){
    this.navCtrl.push(ListPage);
    }
}
