import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from 'angular-2-local-storage';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  favlist:Map<String,String>;
  eventId:string="";
  genre:string="";
  detailBtnDisable:boolean=false;
  constructor(private localStorageService: LocalStorageService) {
    //test set
    // var test:Set<String>=new Set(["12","34"]);
    // console.log(test.has("23"));
    // console.log(test);
    // this.favlist = this.localStorageService.get("favlist");
    this.favlist = new Map(this.localStorageService.get("favlist"));
    this.eventId=this.localStorageService.get("eventId");
    this.genre=this.localStorageService.get("genre");
  }

  ngOnInit() {
    console.log(this.favlist);
  }
  trash(key){
    console.log("go to trash:",key);
    this.favlist.delete(key);
    var favlistarr = <any[]>this.localStorageService.get("favlist");
    for (let i = 0; i < favlistarr.length; i++) {
      if (favlistarr[i][0] === key) {
        favlistarr.splice(i, 1);
        this.localStorageService.set("favlist", favlistarr);
        break;
      }
    }
    console.log(this.localStorageService.get("favlist"));
  }
}
