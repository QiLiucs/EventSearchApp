import { Injectable } from '@angular/core';
import {SearchRes,EventDetail,VenueInfo,UpcomingDetail,ArtistInfo} from './searchresult.model';
// import {LocalStorageService} from 'angular-2-local-storage';
import {HttpClient} from '@angular/common/http';
export class DataService {

  keyword="";
  // errorMsg="";
  category="";
  distance="";
  units="";
  radio="";
  locInput="";
  lat="";
  lng="";
  artistname="";
  teamname="";
  venue="";
  eventId="";
  eventName="";
  genre="";

  ticketmasterEventAPIK="wfHUN63wOkYsxR9lASv6pLfIYlb6uusM";
  searResults:SearchRes[]=[];
  // favlist=null;
  changeKeyword(keyword:string){
    this.keyword=keyword;
  }
  // constructor(private localStorageService: LocalStorageService) {
  //   console.log("&&&")
  //   this.favlist = new Map(this.localStorageService.get("favlist"));
  // }
}
