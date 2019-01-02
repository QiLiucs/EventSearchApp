import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {SearchRes, VenueInfo} from '../searchresult.model';
import { HttpClient} from '@angular/common/http';
import {UpcomingDetail} from '../searchresult.model';
import {trigger, state, style, transition, animate, query, stagger} from '@angular/animations';
import {LocalStorageService} from 'angular-2-local-storage';
import {Router} from '@angular/router';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.css'],
  // animations:[
  //   trigger("cardstate",[
  //     state("in",style({
  //       "opacity":1,//total visible,
  //       transform:"translateY(0)",
  //     })),
  //     transition("void=>*",[
  //       //right before animation starts
  //       style({
  //         opacity:0,//invisible
  //         transform:"translateY(-10px)",//start position
  //       }),
  //       animate(300),
  //     ]),
  //     transition("*=>void",
  //       animate(500,style({
  //         opacity:0,//invisible
  //         transform:"translateY(-100px)"
  //       })),
  //     ),
  //   ])
  // ]
  animations: [
    // trigger('listAnimation', [
    //   transition('* => *', [ // each time the binding value changes
    //     query(':leave', [
    //       stagger(-100, [
    //         animate('200ms', style({ opacity: 0 }))
    //       ])
    //     ], { optional: true }),
    //     query(':enter', [
    //       style({ opacity: 0 }),
    //       stagger(10, [
    //         animate('100ms', style({ opacity: 1 }))
    //       ])
    //     ], { optional: true })
    //   ])
    // ])
    trigger('filterAnimation', [
      transition(':enter, * => 0, * => -1', []),
      transition(':increment', [
        query(':enter', [
          style({ opacity: 0, width: '0px' }),
          stagger(50, [
            animate('500ms ease-in', style({ opacity: 1, width: '*' })),
          ]),
        ], { optional: true })
      ]),
      transition(':decrement', [
        query(':leave', [
          stagger(-50, [
            // animate('500ms ease-out', style({ opacity: 0, width: '0px' })),
            animate('500ms ease-out', style({ opacity: 0, transform:"translateY(-500px)" })),
          ]),
        ])
      ]),
    ]),
  ],

})
export class UpcomingComponent implements OnInit {
  venue:string;
  upcomings:UpcomingDetail[]=[];
  upcomingsSlice:UpcomingDetail[]=[];
  disable:boolean=true;
  more:boolean=true;
  less:boolean=false;
  eventName:string="";
  eventId:string="";
  category:string="";
  favlist:Map<String,String>;
  buyticket:string="";
  eventIdOfUpcoming="";
  btnvalue="Show More";
  loading:boolean=true;

  constructor(private dataService:DataService,private httpClient: HttpClient,
              private localStorageService:LocalStorageService,
              private router: Router) {
    this.venue=this.localStorageService.get("venue");
    this.eventName=this.localStorageService.get("eventName");
    this.eventId=this.localStorageService.get("eventId");
    this.category=this.localStorageService.get("genre");
    this.favlist = new Map(this.localStorageService.get("favlist"));
    this.buyticket=this.localStorageService.get("buyticket");
    this.eventIdOfUpcoming=this.localStorageService.get("eventIdOfUpcoming");
  }

  ngOnInit() {
    console.log("this is up page",'https://laevents-219016.appspot.com/upcoming/'+this.venue);
    if(this.eventIdOfUpcoming!=this.eventId){
      this.upcomings=[];
      this.upcomingsSlice=[];
      this.httpClient.get(
        'https://laevents-219016.appspot.com/upcoming/'+this.venue,
        // 'http://localhost:8080/upcoming/'+this.venue,
        {responseType:'json'})
        .subscribe(res=>{
          console.log(res);
          if(res["code"]=="succeed"){
            for(let i=0;i< (<any[]>res["upcomings"]).length;i++){
              let up=res["upcomings"][i];
              this.upcomings.push(new UpcomingDetail(up["displayName"],up["type"],
                up["url"],up["artist"],up["date"],up["time"]));
            }
            this.upcomingsSlice=this.upcomings.slice(0,5);
            this.localStorageService.set("upcomings",this.upcomings);
          }else{
            this.localStorageService.set("upcomings",this.upcomings);
          }
          this.loading=false;
        });
      this.localStorageService.set("eventIdOfUpcoming",this.eventId);
    }else{
      this.upcomings = this.localStorageService.get("upcomings");
      this.upcomingsSlice=this.upcomings.slice(0,5);
      this.loading=false;
    }
  }
  goToList(){
    this.router.navigate(["/search/false"]);
    this.localStorageService.set("search",false);
  }
  compare(prop,order) {
    return function (obj1, obj2) {
      if(order==1){
        return obj1[prop] > obj2 [prop]?1:-1;
      }else{
        return obj1[prop] < obj2 [prop]?1:-1;
      }
    };
  }
  compareTime(order){
    return (o1,o2)=>{
      var o1time=o1["date"]+" "+o1["time"];
      var o2time=o2["date"]+" "+o2["time"];
      var timestampo1 = Date.parse(new Date(o1time).toString());
      timestampo1 = timestampo1 / 1000;
      var timestampo2 = Date.parse(new Date(o2time).toString());
      timestampo2 = timestampo2 / 1000;
      if(order==1){
        return timestampo1-timestampo2;
      }else{
        return timestampo2-timestampo1;
      }
    }
  }
  onChangeSortType(typeSelect,orderSelect) {
   // const selectedIndex=event.target.selectedIndex;
    const type = typeSelect.value;
    const order=orderSelect.value;
    let orderNumber=1;
    console.log(type,order);
    if (order=="Descending"){
      orderNumber=2;
    }

    switch (type){
      case "Event Name":
        this.upcomings.sort(this.compare("displayName",orderNumber));
        this.disable=false;
        break;
      case "Time":
        this.upcomings.sort(this.compareTime(orderNumber));
        this.disable=false;
        break;
      case "Artist":
        this.upcomings.sort(this.compare("artist",orderNumber));
        this.disable=false;
        break;
      case "Type":
        this.upcomings.sort(this.compare("type",orderNumber));
        this.disable=false;
        break;
      default:
        this.disable=true;
    }
    this.upcomingsSlice=this.upcomings.slice(0,5);

  }
  logAnimation(_event) {
    console.log(_event);
  }
  onShowMore(){
    // this.upcomingsSlice=this.upcomings;
    for(let i=5;i<this.upcomings.length;i++){
      this.upcomingsSlice.push(this.upcomings[i]);
    }
    this.more=false;
    this.less=true;
  }
  onShowLess(){
    // this.upcomingsSlice=this.upcomings.slice(0,5);
    for(let i=this.upcomings.length-1;i>=5;i--){
      this.upcomingsSlice.splice(i,1);
    }
    this.more=true;
    this.less=false;
  }
  onShowMoreOrLess(){
    if(this.btnvalue==="Show More"){
      for(let i=5;i<this.upcomings.length;i++){
        this.upcomingsSlice.push(this.upcomings[i]);
      }
      this.btnvalue="Show Less";
    }else{
      for(let i=this.upcomings.length-1;i>=5;i--){
        this.upcomingsSlice.splice(i,1);
      }
      this.btnvalue="Show More";
    }
  }
  favorite(){
    // this.localStorageService.remove("favlist");
    let favlist=[];
    if(this.localStorageService.get("favlist")){
      favlist=this.localStorageService.get("favlist");
    }
    var key:string=this.localStorageService.get("eventId");
    var date:string=this.localStorageService.get("date");
    var eventName:string=this.localStorageService.get("eventName");
    var tempName=eventName.slice(0,35);
    var lastSpace=tempName.lastIndexOf(" ");
    var validName=tempName.slice(0,lastSpace+1)+"...";
    var genre:string=this.localStorageService.get("genre");
    var venue:string=this.localStorageService.get("venue");
    favlist.push([key, new SearchRes(date,"","",eventName,validName,genre,venue,key,
      "","","",false)]);
    this.localStorageService.set("favlist",favlist);
    this.favlist = new Map(this.localStorageService.get("favlist"));

  }
  defavorite() {
    console.log("remove", this.eventId);
    this.favlist.delete(this.eventId);
    var favlistarr = <any[]>this.localStorageService.get("favlist");
    for (let i = 0; i < favlistarr.length; i++) {
      if (favlistarr[i][0] === this.eventId) {
        favlistarr.splice(i, 1);
        this.localStorageService.set("favlist", favlistarr);
        break;
      }
    }
  }

}
