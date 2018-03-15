
import { FavoriteProvider } from './../../providers/favorite/favorite';
import { User } from './../../providers/user/user';
import { PropertyPage } from './../property/property';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

/**
 * Generated class for the FavoritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {

  favproperties: any;
  haveproperties:boolean = true;
  constructor(public toastCtrl:ToastController, public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams,public user:User,public favorites:FavoriteProvider) {
    this.getFavorites();
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

  }

  getFavorites(){
    //showing loading
    let loading = this.loadingCtrl.create({
      showBackdrop: false,
    });
    loading.present();
    //getting Favorite properties
    this.favorites.get().then((resp) => {
      loading.dismissAll();
      console.log(resp);
      if(resp.data[0] == '<')
      {
        this.getFavorites();
      }
      else
      {
        this.favproperties = JSON.parse(resp.data);
        this.favproperties = Array.of(this.favproperties);
        this.favproperties = this.favproperties[0]['data'];
        if(this.favproperties.length == 0 ){
          this.haveproperties = false;
        }
        console.log(this.favproperties);
      }





    }, (err) => {
      console.error(err);
      loading.dismissAll();
      let toast = this.toastCtrl.create({
        message: "Connection Error",
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    });
  }
  property(property){
    console.log(property);
    this.navCtrl.push(PropertyPage,{prop:property});
  }
}
