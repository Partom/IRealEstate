import { FiltersPage } from './../pages/filters/filters';
import { ScheduleitPage } from './../pages/scheduleit/scheduleit';
import { User } from './../providers/user/user';
import { Storage } from '@ionic/storage';
import { LoginPage } from './../pages/login/login';

import { Component , ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//pages imports
import { FavoritesPage } from './../pages/favorites/favorites';

import { ListPage } from './../pages/list/list';
import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';
import { RegisterPage } from '../pages/register/register';
import {ProfilePage} from "../pages/profile/profile";
//import {Firebase} from "@ionic-native/firebase";

import firebase from 'firebase';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = WelcomePage;
  isLogin:boolean;
  user:User;
  user_detail:any ={};
  pages: Array<{title: string, component: any}>;
  constructor(
    platform: Platform,
    events:Events,
    user:User,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    storage:Storage) {
      this.user =user;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
        //getting user details
        storage.ready().then(()=>{
          this.getuser();
        });
      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyA5yjwKY4gNRuXHlaz3ZDpzr5_7aU4lBQo",
        authDomain: "irealestate-1518792113059.firebaseapp.com",
        databaseURL: "https://irealestate-1518792113059.firebaseio.com",
        projectId: "irealestate-1518792113059",
        storageBucket: "irealestate-1518792113059.appspot.com",
        messagingSenderId: "629638894695"
      };
      firebase.initializeApp(config);

    });


     // used for an example of ngFor and navigation
     this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage },
    ];

      if(user.isLogin()){
        console.log('login pages pushed');
        this.pages.push({ title: 'Favorites' , component: FavoritesPage });
        this.pages.push({ title: 'Schedules' , component: ScheduleitPage });
        this.isLogin = true;

      }else{

        console.log('not login pages pushed');
        this.pages.push({ title: 'SignUp', component: RegisterPage });
        this.pages.push({ title: 'Login' , component: LoginPage });
        this.isLogin = false;
        this.user_detail ={};
      }
      events.subscribe('user:login', (check) => {
        // user and time are the same arguments passed in `events.publish(user, time)`
        if(check){
          this.pages.pop();
          this.pages.pop();
          this.pages.push({ title: 'Favorites' , component: FavoritesPage });
          this.pages.push({ title: 'Schedules' , component: ScheduleitPage });
          this.isLogin = true;
          //getting user details
          storage.ready().then(()=>{
            this.getuser();
          });

        }
        else{
          this.pages.pop();
          this.pages.pop();
          this.pages.push({ title: 'SignUp', component: RegisterPage });
          this.pages.push({ title: 'Login' , component: LoginPage });
          this.isLogin = false;
          this.user_detail ={};
        }

      });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
  logout(){
    this.user._logout();
    this.user_detail ={};
  }
  profile(){
    if(this.isLogin)
    {
      this.nav.push(ProfilePage,{user:this.user_detail});
    }
    else {
      console.log('not login');
      return;
    }
  }
  getuser(){

    this.user.getDetails().then((data)=>{
        if(data.status == 200 && data.data != null && data.data[0] != '<'){
          this.user_detail = JSON.parse(data.data);
          console.log(data);
        }
        else{
          //do some thing like refresh token

          // this.getuser();
        }
      },
      (err)=>{
        console.error(err);
      });
  }

}

