import { FiltersPage } from './../pages/filters/filters';
import { ScheduleitPage } from './../pages/scheduleit/scheduleit';
import { LoginPage } from './../pages/login/login';

import { Device } from '@ionic-native/device';



import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, List } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
//imports of pages
import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';
import { FavoritesPage } from './../pages/favorites/favorites';
import { PropertyPage } from './../pages/property/property';
import { ListPage } from './../pages/list/list';
import { MapitPage } from './../pages/mapit/mapit';

//imports of providers
import { MlsProvider } from '../providers/mls/mls';
import { RegisterPage } from '../pages/register/register';
import { User } from '../providers/user/user';
import { Api } from '../providers/api/api';
import { Firebase } from '@ionic-native/firebase';
import { IonicStorageModule } from '@ionic/storage';
import { FavoriteProvider } from '../providers/favorite/favorite';
import { ScheduleProvider } from '../providers/schedule/schedule';
// import { HttpModule } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import {ProfilePage} from "../pages/profile/profile";

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import firebase from 'firebase';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    WelcomePage,
    ListPage,
    PropertyPage,
    FavoritesPage,
    RegisterPage,
    MapitPage,
    LoginPage,
    ScheduleitPage,
    FiltersPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    WelcomePage,
    ListPage,
    PropertyPage,
    FavoritesPage,
    RegisterPage,
    MapitPage,
    LoginPage,
    ScheduleitPage,
    FiltersPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MlsProvider,
    User,
    Api,
    Firebase,
    Device,
    FavoriteProvider,
    ScheduleProvider,
    HTTP,
    Camera,
    File,
    Transfer,
    FilePath,
  ]
})
export class AppModule {}
