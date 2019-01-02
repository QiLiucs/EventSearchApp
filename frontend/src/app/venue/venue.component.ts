import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {EventDetail, SearchRes} from '../searchresult.model';
import { HttpClient} from '@angular/common/http';
import {VenueInfo} from '../searchresult.model';
import {LocalStorageService} from 'angular-2-local-storage';
import {Router} from '@angular/router';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent implements OnInit {
  venue="";
  detaillat: number = 0;
  detaillng: number = 0;
  venueInfo:VenueInfo;
  eventName:string="";
  eventId:string="";
  category:string="";
  favlist:Map<String,String>;
  buyticket:string="";
  eventIdOfVenue="";
  zoom=16;

  constructor(private dataService: DataService, private httpClient: HttpClient,
              private localStorageService:LocalStorageService,
              private router: Router) {
    this.eventId=this.localStorageService.get("eventId");
    this.category=this.localStorageService.get("genre");
    this.favlist = new Map(this.localStorageService.get("favlist"));
    this.eventName=this.localStorageService.get("eventName");
    this.venue=this.localStorageService.get("venue");
    this.buyticket=this.localStorageService.get("buyticket");
    this.eventIdOfVenue=this.localStorageService.get("eventIdOfVenue");
  }

  ngOnInit() {
    this.venue=this.localStorageService.get("venue");
    this.eventName=this.localStorageService.get("eventName");
    console.log("this is veune page",'https://laevents-219016.appspot.com/venue/'+this.venue);
    if(this.eventIdOfVenue!=this.eventId){
      this.httpClient.get(
        'https://laevents-219016.appspot.com/venue/'+this.venue,
        // 'http://localhost:8080/venue/'+this.venue,
        {responseType:'json'})
        .subscribe(res=>{
          console.log("venue",this.venue);
          console.log(res);
          this.venueInfo=new VenueInfo(
            res["venuename"],
            res["lat"],
            res["lng"],
            res["address"],
            res["city"],
            res["phone"],
            res["openh"],
            res["grule"],
            res["crule"],
          );
          console.log("***",res["lat"],res["lng"]);
          this.detaillat=Number(res["lat"]);
          this.detaillng=Number(res["lng"]);
          console.log("***",this.detaillat,this.detaillng);
          this.localStorageService.set("venueInfo",this.venueInfo);
          this.localStorageService.set("detaillat",this.detaillat);
          this.localStorageService.set("detaillng",this.detaillng);
          this.localStorageService.set("eventIdOfVenue",this.eventId);
        });
    }else{
      console.log("same");
      console.log("***",this.detaillat,this.detaillng);
      this.venueInfo=this.localStorageService.get("venueInfo");
    }
  }
  goToList(){
    this.router.navigate(["/search/false"]);
    this.localStorageService.set("search",false);
  }
    favorite(){
      // this.localStorageService.remove("favlist");
      console.log("favorite func");
      var favlist=[];
      if(this.localStorageService.get("favlist")){
        favlist=<any[]>this.localStorageService.get("favlist");
      }
      var key:string=this.localStorageService.get("eventId");
      var date:string=this.localStorageService.get("date");
      var eventName:string=this.localStorageService.get("eventName");
      var tempName=eventName.slice(0,35);
      var lastSpace=tempName.lastIndexOf(" ");
      var validName=tempName.slice(0,lastSpace+1)+"...";
      var genre:string=this.localStorageService.get("genre");
      var venue:string=this.localStorageService.get("venue");
      favlist.push([key, new SearchRes(date,"","", eventName, validName,genre, venue, key,
          "","","",false)]);//用数组不用字典的原因是用字典的话，key仍是key,并且数组可以转换成map
      this.localStorageService.set("favlist",favlist);
      this.favlist = new Map(this.localStorageService.get("favlist"));

    }
  defavorite(){
    console.log("remove",this.eventId);
    this.favlist.delete(this.eventId);
    var favlistarr=<any[]>this.localStorageService.get("favlist");//return an object not an array
    for(let i=0;i<favlistarr.length;i++){
      if(favlistarr[i][0]===this.eventId){
        favlistarr.splice(i, 1);
        this.localStorageService.set("favlist",favlistarr);
        break;
      }
    }
    console.log(this.localStorageService.get("favlist"));
  }
}
