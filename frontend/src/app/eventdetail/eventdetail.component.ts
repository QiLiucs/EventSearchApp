import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {EventDetail, SearchRes} from '../searchresult.model';
import {DataService} from '../data.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {LocalStorageService} from 'angular-2-local-storage';
import {Router} from '@angular/router';

@Component({
  selector: 'app-eventdetail',
  templateUrl: './eventdetail.component.html',
  styleUrls: ['./eventdetail.component.css'],
  animations:[
    trigger("eventdetailstate",[
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
          transform:"translateX(-1000px)",//start position
        }),
        animate(400),
      ]),
    ])
  ]
})
export class EventdetailComponent implements OnInit {
  loading:boolean=false;
  eventDetail:EventDetail;
  seatmap:string="";
  eventId:string="";
  favlist:Map<String,String>;
  venue:string="";
  buyticket:string="";
  eventName: string="";
  showBackdrop: boolean=false;

  constructor(private httpClient: HttpClient, private route: ActivatedRoute,
              private dataService:DataService, public dialog:MatDialog, private localStorageService:LocalStorageService,
              private router: Router) {
    this.favlist = new Map(this.localStorageService.get("favlist"));
    this.eventName=this.localStorageService.get("eventName");
    this.venue=this.localStorageService.get("venue");
    this.buyticket=this.localStorageService.get("buyticket");
  }

  ngOnInit() {
    this.loading = true;
    const eventid = this.route.snapshot.params['id'];
    const genre = this.route.snapshot.params['catogory'];
    this.localStorageService.set("genre",genre);
    console.log("this is eventdetail page",'https://laevents-219016.appspot.com/search/'+eventid);
    if(!this.localStorageService.get("eventDetail") || this.localStorageService.get("eventId")!=eventid){
      this.httpClient.get(
        'https://laevents-219016.appspot.com/search/'+eventid,
        // 'http://localhost:8080/search/'+eventid,
        {responseType:'json'})
        .subscribe(res=>{
          console.log(res);
          this.eventDetail=new EventDetail(res["event_name"],res["data_time"],res["artist_name"],res["team_name"],
            res["artist_url"],res["team_url"],res["venue"],res["genre"],res["price_range"],res["status"],res["buy_ticket"],res["seat_map"]);
          this.localStorageService.set("artistname",res["artist_name"]);
          this.localStorageService.set("teamname",res["team_name"]);
          this.localStorageService.set("venue",res["venue"]);
          this.localStorageService.set("eventName",res["event_name"]);
          this.localStorageService.set("buyticket",res["buy_ticket"]);
          // console.log(res["data_time"].split(" ")[0]);
          this.localStorageService.set("date",res["data_time"].split(" ")[0]);
          this.loading=false;
          this.seatmap=res["seat_map"];
          this.localStorageService.set("eventDetail",this.eventDetail);
          this.localStorageService.set("seatmap",this.seatmap);
        });
    }else{
      console.log("hahhah")
      this.loading=false;
      this.eventDetail=this.localStorageService.get("eventDetail");
      this.seatmap=this.localStorageService.get("seatmap");
    }
    this.localStorageService.set("eventId",eventid);
    this.eventId = this.localStorageService.get("eventId");
    if(this.localStorageService.get("loadSeatMap")){
      this.openSeatMap();
    }
  }
  openSeatMap(): void {
    this.showBackdrop=true;
    this.localStorageService.set("loadSeatMap",true);
    const dialogRef = this.dialog.open(SeatMapDialogComponent, {
      width: '350px',
      height: '350px',
      data: {seatmap: this.seatmap, showBackdrop:this.showBackdrop}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.showBackdrop = false;
      this.localStorageService.set("loadSeatMap",false);
    });
  }
  goToList(){
    this.router.navigate(["/search/false"]);
    this.localStorageService.set("search",false);
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
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'seatmap-dialog.html',
})
export class SeatMapDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SeatMapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
