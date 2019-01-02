import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {DataService} from './data.service';
import {HttpClientModule} from '@angular/common/http';
import { SearchtableComponent } from './searchtable/searchtable.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Routes, RouterModule} from '@angular/router';
import {EventdetailComponent, SeatMapDialogComponent} from './eventdetail/eventdetail.component';
import { ArtistteamComponent } from './artistteam/artistteam.component';
import { VenueComponent } from './venue/venue.component';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { AgmCoreModule } from '@agm/core';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from '@angular/material/dialog';
import {LocalStorageModule} from 'angular-2-local-storage';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FavoriteComponent } from './favorite/favorite.component';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { BlankComponent } from './blank/blank.component';

const appRoutes: Routes = [
  {path:"search/:tof",component:SearchtableComponent,data:{animation:'SearchPage'}},
  {path:"search1/:tof",component:SearchtableComponent,data:{animation:'SearchPage'}},
  {path: "eventdetail/:id/:catogory", component: EventdetailComponent,data:{animation:'EventPage'}},
  {path: "artistteam", component: ArtistteamComponent,data:{animation:'ArtistPage'}},
  {path:"venue", component: VenueComponent,data:{animation:'VenuePage'}},
  {path:"upcoming", component: UpcomingComponent,data:{animation:'UpPage'}},
  {path:"favorite",component:FavoriteComponent},
  {path:"blank",redirectTo:"search/true"},
];


@NgModule({
  declarations: [
    AppComponent,
    SearchtableComponent,
    EventdetailComponent,
    ArtistteamComponent,
    VenueComponent,
    UpcomingComponent,
    SeatMapDialogComponent,
    FavoriteComponent,
    BlankComponent,
  ],
  entryComponents: [
    SeatMapDialogComponent
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    RouterModule.forRoot(appRoutes),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCt7RAy9HK6ENne2PAeRu7jDTWv0lw7HjA",
    }),
    MatDialogModule,
    LocalStorageModule.withConfig({
      prefix: 'search-app',
      storageType: 'localStorage'
    }),
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    RoundProgressModule,

  ],
  providers: [DataService, {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
