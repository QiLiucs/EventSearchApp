import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import { HttpClient} from '@angular/common/http';
import {EventDetail, SearchRes} from '../searchresult.model';
import {ArtistInfo} from '../searchresult.model';
import {LocalStorageService} from 'angular-2-local-storage';
import {Router} from '@angular/router';
@Component({
  selector: 'app-artistteam',
  templateUrl: './artistteam.component.html',
  styleUrls: ['./artistteam.component.css']
})
export class ArtistteamComponent implements OnInit {
  artistname: string="";
  teamname: string="";
  category:string="";
  artists: ArtistInfo[]=[];
  eventId: string="";
  eventName: string="";
  favlist:Map<String, String>;
  venue:string="";
  buyticket:string="";
  max:Number=100;
  eventIdOfArtist="";
  loading=true;

  constructor(private httpClient: HttpClient, private dataService:DataService,
              private localStorageService: LocalStorageService,
              private router: Router) {
    this.eventId=this.localStorageService.get("eventId");
    this.eventName=this.localStorageService.get("eventName");
    this.category=this.localStorageService.get("genre");
    this.favlist = new Map(this.localStorageService.get("favlist"));
    this.venue=this.localStorageService.get("venue");
    this.buyticket=this.localStorageService.get("buyticket");
    this.eventIdOfArtist=this.localStorageService.get("eventIdOfArtist");
  }

  ngOnInit() {
    this.artistname=this.localStorageService.get("artistname");
    this.teamname=this.localStorageService.get("teamname");

    console.log("ts", this.artistname, this.teamname);
    console.log('https://laevents-219016.appspot.com/artist/' + this.artistname+"/"+this.teamname+"/"+this.category+"/"+this.localStorageService.get("keyword"),);
    if(this.eventIdOfArtist!=this.eventId){
      this.httpClient.get(
        'https://laevents-219016.appspot.com/artist/' + this.artistname+"/"+this.teamname+"/"+this.category+"/"+this.localStorageService.get("keyword"),
        // 'http://localhost:8080/artist/' + this.artistname+"/"+this.teamname+"/"+this.category+"/"+this.localStorageService.get("keyword"),
        {responseType:'json'})
        .subscribe(res=>{
          console.log(res);//may be empty
          const artistInfos=res["filterartists"];
          for(let i=0;i<(<any[]>res).length;i++){
            var searchName=res[i]["term"];
            var name:string = '';
            var popularity:string="";
            var checkat:string="";
            var followers:string="";
            if(res[i]["filterartists"].length>0){
              name= res[i]["filterartists"][0]["name"];
              popularity=res[i]["filterartists"][0]["popular"];
              checkat=res[i]["filterartists"][0]["checkat"];
              var tmp:string=res[i]["filterartists"][0]["followers"].toString(10);
              console.log(typeof tmp,tmp)
              var strlen:number=tmp.length;
              var remaining:number=strlen%3;
              followers=followers.concat(tmp.substring(0,remaining)).concat(remaining==0?"":",");
              for(var start=remaining;start<strlen;start+=3){
                followers=followers.concat(tmp.slice(start,start+3)).concat((start+3>=strlen)?"":",");
              }
              console.log("after",followers)
            }
            this.artists.push(new ArtistInfo(searchName,name,popularity,checkat,followers,res[i]["imgs"]));
          }
          console.log(this.artists);
          this.localStorageService.set("eventIdOfArtist",this.eventId);
          this.localStorageService.set("artists",this.artists);
          this.loading=false;
        });
    }else{
      this.loading=false;
      this.artists=this.localStorageService.get("artists");
    }
  }
  goToList(){
    this.router.navigate(["/search/false"]);
    this.localStorageService.set("search",false);
  }
  favorite(){
    // this.localStorageService.remove("favlist");
    let newfavlist=[];
    if(this.localStorageService.get("favlist")){
      newfavlist=this.localStorageService.get("favlist");
    }
    var key:string=this.localStorageService.get("eventId");
    var date:string=this.localStorageService.get("date");
    var eventName:string=this.localStorageService.get("eventName");
    var tempName=eventName.slice(0,35);
    var lastSpace=tempName.lastIndexOf(" ");
    var validName=tempName.slice(0,lastSpace+1)+"...";
    var genre:string=this.localStorageService.get("genre");
    var venue:string=this.localStorageService.get("venue");
    newfavlist.push([key, new SearchRes(date,"","",eventName,validName,genre,venue,key,
      "","","",false)]);
    this.localStorageService.set("favlist",newfavlist);
    this.favlist = new Map(this.localStorageService.get("favlist"));
  }
  defavorite() {
    console.log("remove", this.eventId);
    this.favlist.delete(this.eventId);
    var favlistarr = <any[]>this.localStorageService.get("favlist");
    console.log(favlistarr,typeof favlistarr)
    for (let i = 0; i < favlistarr.length; i++) {
      if (favlistarr[i][0] === this.eventId) {
        favlistarr.splice(i, 1);
        this.localStorageService.set("favlist", favlistarr);
        break;
      }
    }
  }


}
