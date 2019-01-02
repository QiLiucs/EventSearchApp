export class SearchRes {
  public localDate: string;
  public localTime: string;
  public imageurl: string;
  public eventname: string;
  public processedename: string;
  public genre: string;
  public venuename: string;
  public eventid: string;
  public venueid: string;
  public latitude: string;
  public longitude: string;
  public isfav: boolean;
  constructor(localDate: string,
              localTime: string,
              imageurl: string,
              eventname: string,
              processedename: string,
              genre: string,
              venuename: string,
              eventid: string,
              venueid: string,
              latitude: string,
              longitude: string,
              isfav:boolean,
  ) {
    this.localDate=localDate;
    this.localTime=localTime;
    this.imageurl=imageurl;
    this.eventid=eventid;
    this.eventname=eventname;
    this.processedename=processedename;
    this.genre=genre;
    this.venuename=venuename;
    this.venueid=venueid;
    this.latitude=latitude;
    this.longitude=longitude;
    this.isfav=isfav;
  }
}
export class EventDetail{
  public event_name:string;
  public data_time:string;
  public artist_name:string;
  public team_name:string;
  public artist_url:string;
  public team_url:string;
  public venue:string;
  public genre:string;
  public price_range:string;
  public status:string;
  public buy_ticket:string;
  public seat_map:string;

  constructor(
    event_name:string,
    data_time:string,
    artist_name:string,
    team_name:string,
    artist_url:string,
    team_url:string,
    venue:string,
    genre:string,
    price_range:string,
    status:string,
    buy_ticket:string,
    seat_map:string,
  ) {
    this.event_name=event_name;
    this.data_time=data_time;
    this.artist_name=artist_name;
    this.team_name=team_name;
    this.artist_url=artist_url;
    this.team_url=team_url;
    this.venue=venue;
    this.genre=genre;
    this.price_range=price_range;
    this.status=status;
    this.buy_ticket=buy_ticket;
    this.seat_map=seat_map;
  }
}
export class ArtistInfo {
  public searchName:string;
  public name:string;
  public popularity:string;
  public checkat:string;
  public followers:string;
  public imgs:string[];
  constructor(searchName:string,name:string,popularity:string,checkat:string,followers:string, imgs:string[]){
    this.searchName=searchName;
    this.name=name;
    this.popularity=popularity;
    this.checkat=checkat;
    this.followers=followers;
    this.imgs=imgs;
  }
}
export class VenueInfo{
  public venuename:string;
  public lat:string;
  public lng:string;
  public address:string;
  public city:string;
  public phone:string;
  public openhours:string;
  public genrule:string;
  public childrule:string;
  constructor(
    venuename:string,
    lat:string,
    lng:string,
    address:string,
    city:string,
    phone:string,
    openhours:string,
    genrule:string,
    childrule:string,
  ){
    this.venuename=venuename;
    this.lat=lat;
    this.lng=lng;
    this.address=address;
    this.city=city;
    this.phone=phone;
    this.openhours=openhours;
    this.genrule=genrule;
    this.childrule=childrule;
  }
}
export class UpcomingDetail{
  public displayName:string;
  public type:string;
  public url:string;
  public artist:string;
  public date:string;
  public time:string;
  constructor(
    displayName:string,
    type:string,
    url:string,
    artist:string,
    date:string,
    time:string,
  ){
    this.displayName=displayName;
    this.time=time;
    this.type=type;
    this.date=date;
    this.url=url;
    this.artist=artist;
  }
}
