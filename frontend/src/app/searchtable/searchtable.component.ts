import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {SearchRes} from '../searchresult.model';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import {LocalStorageService} from 'angular-2-local-storage';
import { Router, NavigationStart } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-searchtable',
  templateUrl: './searchtable.component.html',
  styleUrls: ['./searchtable.component.css'],
  animations:[
    trigger("searchstate",[
      state("in",style(
        {
          "opacity":1,//total visible,
          transform:"translateX(0)",
        }
      )),
      transition("void=>*",[
        //right before animation starts
        style({
          opacity:0,//invisible
          transform:"translateX(3000px)",//start position
        }),
        animate(800),
      ]),
    ])
  ]
})
export class SearchtableComponent implements OnInit {
  showLoad:{show:boolean,loading:boolean}={show:true,loading:true};
  searchres: {id: string, returnval: SearchRes}[]=[];
  detailBtnDisable=true;
  eventId:string="";
  genre:string="";
  favlist:Map<String,String>;
  hasAnimation=false;

  constructor(private dataService: DataService, private httpClient: HttpClient,
              private localStorageService: LocalStorageService,
              private router: Router) {
    console.log("search table",this.dataService.keyword);
      // this.eventId=this.dataService.eventId;
    this.eventId=this.localStorageService.get("eventId");
    this.genre=this.localStorageService.get("genre");
    this.favlist = new Map(this.localStorageService.get("favlist"));
    this.detailBtnDisable=this.localStorageService.get("search");
    this.hasAnimation=!this.localStorageService.get("search");
  }
  ngOnInit() {
    // this.localStorageService.remove("searchResults")
    if(!this.localStorageService.get("searchResults") || this.localStorageService.get("search")){
      console.log("begin search");
    // .post(
    //     // "https://laevents-219016.appspot.com/search",
    //     "http://localhost:8080/search",
    //     {
    //       keyword: this.localStorageService.get("keyword"),
    //       lat: this.localStorageService.get("lat"),
    //       lng: this.localStorageService.get("lng"),
    //       apikey: "wfHUN63wOkYsxR9lASv6pLfIYlb6uusM",
    //       category: this.localStorageService.get("category"),
    //       dist: this.localStorageService.get("distance"),
    //       units: this.localStorageService.get("units"),
    //     }
    //   )
      console.log('https://laevents-219016.appspot.com/search?keyword='+this.localStorageService.get("keyword")+"&lat="+this.localStorageService.get("lat")
        +"&lng="+this.localStorageService.get("lng")+"&apikey="+"wfHUN63wOkYsxR9lASv6pLfIYlb6uusM"+"&category="+this.localStorageService.get("category")
        +"&dist="+this.localStorageService.get("distance")+"&units="+this.localStorageService.get("units"));
      this.httpClient.get('https://laevents-219016.appspot.com/search?keyword='+this.localStorageService.get("keyword")+"&lat="+this.localStorageService.get("lat")
        +"&lng="+this.localStorageService.get("lng")+"&apikey="+"wfHUN63wOkYsxR9lASv6pLfIYlb6uusM"+"&category="+this.localStorageService.get("category")
        +"&dist="+this.localStorageService.get("distance")+"&units="+this.localStorageService.get("units"),
        {responseType: 'json'})
        .subscribe(
          val => {
            console.log("Post call successful value returned in body", val);
            if(val["code"]="succeed"){
              for (let i = 0; i < (<any[]>val["eventsjson"]).length; i++) {
                var tempName=val["eventsjson"][i]["eventname"].slice(0,35);
                var lastSpace=tempName.lastIndexOf(" ");
                var validName=tempName.slice(0,lastSpace+1)+"...";
                console.log(validName)
                this.searchres.push({
                  id:val["eventsjson"][i]["eventid"],
                  returnval:new SearchRes(val["eventsjson"][i]["localDate"], val["eventsjson"][i]["localTime"],
                    val["eventsjson"][i]["imageUrl"], val["eventsjson"][i]["eventname"], validName,val["eventsjson"][i]["genre"],
                    val["eventsjson"][i]["venuename"], val["eventsjson"][i]["eventid"], val["eventsjson"][i]["venueid"],
                    val["eventsjson"][i]["latitude"], val["eventsjson"][i]["longitude"],false),
                });
              }
            }else{
              this.searchres=[];
            }
            // this.dataService.searResults=this.searchres;
            this.localStorageService.set("searchResults",this.searchres);
            this.showLoad.loading = false;
            console.log(this.searchres);
          },
          error => {
            console.log("Post call in error", error);
          },
          () => {
            console.log("The Post observable is now completed.");
          });
    }else{
      console.log("&&&");
      console.log(this.localStorageService.get("searchResults"));
      this.searchres=this.localStorageService.get("searchResults");
      this.showLoad.loading = false;
    }
  }
  favorite(eventid,date,eventname,processedName,genre,venue){
    // this.localStorageService.remove("favlist");
    let favlist=[];
    if(this.localStorageService.get("favlist")){
      favlist=this.localStorageService.get("favlist");
    }
    favlist.push([eventid, new SearchRes(date,"","",eventname,processedName,genre,venue,eventid,
      "","","",false)]);
    this.localStorageService.set("favlist",favlist);
    this.favlist = new Map(this.localStorageService.get("favlist"));
    console.log(this.localStorageService.get("favlist"));
  }
  defavorite(eventid){
    console.log("remove",eventid);
      this.favlist.delete(eventid);
      var favlistarr=<any[]>this.localStorageService.get("favlist");
      for(let i=0;i<favlistarr.length;i++){
        if(favlistarr[i][0]===eventid){
          favlistarr.splice(i, 1);
          this.localStorageService.set("favlist",favlistarr);
          break;
        }
      }
    console.log(this.localStorageService.get("favlist"));
  }
}
