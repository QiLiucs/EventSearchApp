import {Component, OnInit, Output} from '@angular/core';
import {DataService} from './data.service';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import {SearchRes} from './searchresult.model';
import {Router, RouterOutlet} from '@angular/router';
import {LocalStorageService} from 'angular-2-local-storage';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Location } from '@angular/common';
import {animate, animateChild, group, query, state, style, transition, trigger} from '@angular/animations';


export interface KeywordSuggest {
  name: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations:[
    trigger("routeAnimations",[
      transition('VenuePage => SearchPage,ArtistPage => SearchPage,UpPage => SearchPage,EventPage => SearchPage', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ]),
        query(':enter', [
          style({ left: '100%'})
        ]),
        // query(':leave', animateChild()),
        group([
          query(':leave', [
            animate('100ms ease-out', style({ opacity:0, left: '-100%'}))
          ]),
          query(':enter', [
            animate('300ms ease-out', style({ left: '0%'}))
          ])
        ]),
        // query(':enter', animateChild()),
      ]),
    ])
  ]
})

export class AppComponent implements OnInit {
  curlocJson: any;
  errorMsg = "Please enter a keyword";
  keywordBorderStyle = '1px solid red';
  locErrorMsg = "";
  locBorderStyle = '';
  valid = false;
  keywordValid = false;
  locValid = true;
  // diableSearchBtn=true;
  disableLocInput = true;
  showLoad = {show: false, loading: false};
  //initialize form
  keyword:string="";
  category:string="Default";
  distance:string="10";
  units:string="miles";
  radio:string="curloc";
  location:string="";
  stateCtrl = new FormControl();
  filteredKeywords: Observable<KeywordSuggest[]>;
  keywords: KeywordSuggest[] = [];
  favoriteBtnClass:string="btn";
  resultBtnClass:string="btn btn-primary";

  constructor(private dataService: DataService, private localStorageService: LocalStorageService,
              private httpClient: HttpClient, private router: Router) {
    console.log("constructor");
    console.log(this.dataService.keyword);
    this.keyword=this.localStorageService.get("keyword");
    console.log("keyword",this.keyword)
    this.category=this.localStorageService.get("category");
    this.distance=this.localStorageService.get("distance");
    this.units=this.localStorageService.get("units");
    this.radio=this.localStorageService.get("radio");
    this.location=this.localStorageService.get("location");
    this.filteredKeywords = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(key => key ? this._filterStates(key) : this.keywords.slice())
      );
    if(this.localStorageService.get("radio")==="other"){
      this.disableLocInput=false;
    }
  }
  ngOnInit(){
  }
  private _filterStates(value: string): KeywordSuggest[] {
    const filterValue = value.toLowerCase();
    console.log("filterValue",filterValue);
    return this.keywords.filter(key => key.name.toLowerCase().indexOf(filterValue) !== -1);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  onTextChange(event) {
    this.dataService.changeKeyword(event.target.value);
  }

  getBorderStyle() {
    return this.keywordBorderStyle;
  }
  changeClass(who){
    if(who==="result"){
      this.favoriteBtnClass="btn";
      this.resultBtnClass="btn btn-primary";
      this.localStorageService.set("search",false);
    }else{
      this.favoriteBtnClass="btn btn-primary";
      this.resultBtnClass="btn";
    }
  }
  onBlur(event) {
    const keyword = event.target.value;
    if (!keyword.trimLeft().trim()) {
      this.errorMsg = "Please enter a keyword.";
      this.keywordBorderStyle = '1px solid red';
      this.keywordValid = false;
      this.valid = false;
    } else {
      this.errorMsg = "";
      this.keywordBorderStyle = "";
      this.dataService.changeKeyword(keyword.trimLeft().trim());
      this.valid = this.locValid;
      this.keywordValid = true;
    }
  }

  onBlurLoc(locInputEvent) {
    const loc = locInputEvent.target.value;
    if (!loc.trimLeft().trim()) {
      this.locErrorMsg = "Please enter a location";
      this.locBorderStyle = '1px solid red';
      this.valid = false;
      this.locValid = false;
    } else {
      this.locErrorMsg = "";
      this.locBorderStyle = "";
      this.valid = this.keywordValid;
      this.locValid = true;
    }
  }

  onKeydown(event) {
    this.errorMsg = "";
    this.keywordBorderStyle = "";
    this.keywordValid = true;
    this.valid = this.locValid;
    const tmp=event.target.value;
    this.httpClient.get('https://app.ticketmaster.com/discovery/v2/suggest?apikey=wfHUN63wOkYsxR9lASv6pLfIYlb6uusM'+'&keyword='+tmp, {responseType: 'json'})
      .subscribe(res => {
        const attrctions=res["_embedded"]["attractions"];
        for(let x=0;x<attrctions.length;x++){
          this.keywords.push({
            name:attrctions[x]["name"],
        });
        }
      });
  }

  onLocKeydown(event) {
    this.locErrorMsg = "";
    this.locBorderStyle = "";
    this.locValid = true;
    this.valid = this.keywordValid;

  }

  enableLocInput() {
    this.disableLocInput = false;
    this.valid=false;
  }

  diableLocInput(locInput) {
    this.disableLocInput = true;
    this.locErrorMsg = "";
    this.locBorderStyle = "";
    locInput.value = "";
  }
  //reference
  clear(keywordInput,
        categorySelect,
        distInput,
        unitsSelect,
        curlocRadio,
        otherRadio,
        locInput){
    this.localStorageService.set("keyword","");
    this.keyword=this.localStorageService.get("keyword");
    keywordInput.value=this.keyword;
    this.localStorageService.set("category","Default");
    this.category=this.localStorageService.get("category");
    categorySelect.value=this.category;
    this.localStorageService.set("distance","10");
    this.distance=this.localStorageService.get("distance");
    distInput.value =this.distance;
    this.localStorageService.set("units","miles");
    this.units=this.localStorageService.get("units");
    unitsSelect.value=this.units;
    this.localStorageService.set("radio","curloc");
    this.radio=this.localStorageService.get("radio");
    if(this.radio==="curloc"){
      curlocRadio.checked=true;
    }else{
      otherRadio.checked=false;
    }
    this.localStorageService.set("location","");
    this.location=this.localStorageService.get("location");
    locInput.value=this.location;
  }

  sendSearchReq(keywordInput,
                categorySelect,
                distInput,
                unitsSelect,
                curlocRadio,
                otherRadio,
                locInput) {
    console.log("search")
    if (otherRadio.checked && !locInput.value) {
      this.locErrorMsg = "Please enter a location";
      this.locBorderStyle = '1px solid red';
      this.locValid = false;
      this.valid = false;
      return;
    }
    this.showLoad.show = true;
    this.showLoad.loading = true;
    this.localStorageService.set("keyword",keywordInput.value);
    this.localStorageService.set("category",categorySelect.value);
    this.localStorageService.set("distance",distInput.value ? distInput.value : distInput.getAttribute("placeholder"));
    this.localStorageService.set("units",unitsSelect.value);
    this.localStorageService.set("search",true);
    var href=location.href;
    var lastSlash=href.lastIndexOf("/");
    var tmp=href.slice(0,lastSlash);
    lastSlash=tmp.lastIndexOf("/");
    var param=tmp.slice(lastSlash,tmp.length);
    console.log("param",param)
    if (curlocRadio.checked) {
      // this.dataService.radio = curlocRadio.value;
      this.httpClient.get('http://ip-api.com/json', {responseType: 'json'})
        .subscribe(res => {
          this.curlocJson = res;
          console.log(res);
          this.localStorageService.set("lat",res["lat"]);
          this.localStorageService.set("lng",res["lon"]);
          this.localStorageService.set("radio",curlocRadio.value);
          this.location="";
          this.localStorageService.set("location",this.location);
          if(param==="/search"){
            this.router.navigate(["/search1/true"]);
          } else {
            this.router.navigate(["/search/true"]);
          }
        });
    } else {
      // this.dataService.radio = otherRadio.value;
      this.localStorageService.set("radio",otherRadio.value);
      this.httpClient.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + locInput.value +
        "&key=AIzaSyCt7RAy9HK6ENne2PAeRu7jDTWv0lw7HjA",
        {responseType: 'json'})
        .subscribe(res => {
          this.curlocJson = res;
          this.localStorageService.set("lat",res["results"][0]["geometry"]["location"]["lat"]);
          this.localStorageService.set("lng",res["results"][0]["geometry"]["location"]["lng"]);
          if (locInput.value) {
            this.location=locInput.value;
            this.localStorageService.set("location",this.location);
          }
          if(param==="/search") {
            this.router.navigate(["/search1/true"]);
          } else{
            this.router.navigate(["/search/true"]);
          }
        });
    }
  }
}

