import { Component , ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MapitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-mapit',
  templateUrl: 'mapit.html',
})
export class MapitPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  property:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.property = navParams.get('property');
  }

  ionViewDidLoad() {
    this.loadMap();
  }
  loadMap(){
 
    let latLng = new google.maps.LatLng(this.property['latitude'], this.property['longitude']);
 
    let mapOptions = {
      center: latLng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    var newmarker = new google.maps.Marker({
      map:this.map,
      visible: true,
      title: this.property['address'],
      draggable: false,
      animation: google.maps.Animation.DROP,
      position: {lat: this.property['latitude'], lng: this.property['longitude']},
      icon: {         
        url: "./assets/imgs/home/map-nav.png",
        scaledSize: new google.maps.Size(30, 30)    
      }
  }); 
 
  }
}
