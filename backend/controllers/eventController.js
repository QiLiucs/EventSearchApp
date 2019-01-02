const axios=require("axios");
var geohash = require('ngeohash');
var SpotifyWebApi = require('spotify-web-api-node');
var moment=require("moment");
var spotifyApi = new SpotifyWebApi({
    clientId:"f44e5b12d6d946529d4bfaee0f3bbc1b",
    clientSecret:"28129c35229d42678b8cceeaead768be"
});


exports.search=(req,res,next)=>{

    const segmentToId = {
        "Music" : "KZFzniwnSyZfZ7v7nJ",
        "Sports" : "KZFzniwnSyZfZ7v7nE",
        "Arts & Theatre" : "KZFzniwnSyZfZ7v7na",
        "Film" : "KZFzniwnSyZfZ7v7nn",
        "Miscellaneous" : "KZFzniwnSyZfZ7v7n1",
        "Default" : "",
    };
    // const apikey=req.body["apikey"];
    // const category=req.body["category"];
    // const segmentId=segmentToId[category];
    // const dist=req.body["dist"];
    // const keyword=req.body["keyword"];
    // const lat=req.body["lat"];
    // const lng=req.body["lng"];
    // const units=req.body["units"];
    const apikey=req.query.apikey;
    const category=req.query.category;
    const segmentId=segmentToId[category];
    const dist=req.query.dist;
    const keyword=req.query.keyword;
    const lat=req.query.lat;
    const lng=req.query.lng;
    const units=req.query.units;


    console.log(units);
    console.log(lat," ",lng)
    const geopoint=geohash.encode(lat, lng,precision=8);
    console.log(geopoint);
    var latlon = geohash.decode(geopoint);
    console.log(latlon.latitude);
    console.log(latlon.longitude);
    const url = 'https://app.ticketmaster.com/discovery/v2/events.json' + '?apikey=' + apikey + "&keyword=" +keyword+ '&segmentId=' +
        segmentId + "&radius=" + dist + "&unit=" +units+ "&geoPoint=" +geopoint;
    console.log(url);
    eventsjson=[]
    codeAndEvents={code:"no result",eventsjson:eventsjson};
    axios.get(url).then(data=>{
        let searchres=data.data;
        if(searchres["_embedded"]){
            codeAndEvents["code"]="succeed";
            let eventsarr = searchres["_embedded"]["events"];
            for(let i=0;i<eventsarr.length;i++) {
                let event=eventsarr[i];
                //handle empty field
                if (event["dates"]) {
                    dates = event["dates"];
                    if (dates["start"]["localDate"])
                        localDate = dates["start"]["localDate"];
                    else localDate = "";
                    if (dates["start"]["localTime"])
                        localTime = dates["start"]["localTime"];
                    else localTime = "";
                }
                imagesarr = event["images"];
                imageurl = imagesarr[0]["url"];
                eventname = event["name"];
                eventid = event["id"];
                if (!event["classifications"]) {
                    genre = "N/A";
                } else {
                    genre = event["classifications"][0]["segment"]["name"];
                }
                if (!event["_embedded"]["venues"][0]["name"]) {
                    venuename = "N/A";
                } else {
                    venuename = event["_embedded"]["venues"][0]["name"];
                }
                if (event["_embedded"]["venues"][0]["location"]) {
                    latitude = event["_embedded"]["venues"][0]["location"]["latitude"];
                    longitude = event["_embedded"]["venues"][0]["location"]["longitude"];
                }
                eventsjson.push( {"localDate" : localDate, "localTime" : localTime, "imageUrl" : imageurl, "eventname" : eventname,
                    "genre" : genre, "venuename" : venuename, "eventid" : eventid, "venueid" : venuename, "latitude" : latitude, "longitude" : longitude});

            }
            codeAndEvents["eventsjson"]=eventsjson;

        }
            res.send(codeAndEvents);


    },
        (error) => { console.log("get an error") })



    //fake data
    // eventsjson=[]
    // codeAndEvents={code:"succeed",eventsjson:eventsjson};
    //
    // eventsjson.push( {"localDate" : "2078-01-02", "localTime" : "32:90:90", "imageUrl" : "", "eventname" : "USC vs UCLA hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
    //     "genre" : "what", "venuename" : "figuroa", "eventid" : "GGGGGGGG1", "venueid" : "figuroa", "latitude" : "38", "longitude" : "-114"});
    // eventsjson.push( {"localDate" : "2098-01-02", "localTime" : "32:90:90", "imageUrl" : "", "eventname" : "USC vs UCLA hhhhhhhhhhhhhhhhhhhhhh a hhhhhhhhhhhhhh",
    //     "genre" : "what", "venuename" : "figuroa", "eventid" : "GGGGGGGG2", "venueid" : "figuroa", "latitude" : "38", "longitude" : "-114"});
    // codeAndEvents["eventsjson"]=eventsjson;
    // res.send(codeAndEvents);

};
exports.eventDetail=(req,res,next)=>{

    const eventid = req.params.id;
    const accesskey="wfHUN63wOkYsxR9lASv6pLfIYlb6uusM";
    axios.get('https://app.ticketmaster.com/discovery/v2/events/'+eventid+"?apikey="+accesskey,
        {responseType:'json'}).then(data=>{
            // console.log(data.data);
        event_detail_dict=data.data;
        event_name=event_detail_dict["name"];
        dates = event_detail_dict["dates"];
        localDate = null;
        if (dates["start"]["localDate"])
            localDate = moment(dates["start"]["localDate"]).format('ll');
        localTime = null;
        if (dates["start"]["localTime"])
            localTime = dates["start"]["localTime"];
        data_time = localDate + " " +localTime;
        attractions = [];
        artist_name = "";
        artist_url = "";
        team_url = "";
        team_name = "";
        if (event_detail_dict["_embedded"]["attractions"]) {
            attractions = event_detail_dict["_embedded"]["attractions"];
            for(let i=0;i<attractions.length;i++){
                artist_name+=attractions[i]["name"];
                if(i<attractions.length-1){
                    artist_name+=" | ";
                }
                team_name=artist_name;
            }
        }
        price_ranges = null;
        genre = null;
        venue_name = null;
        if (event_detail_dict["_embedded"]["venues"][0]["name"])
            venue_name = event_detail_dict["_embedded"]["venues"][0]["name"];
        classifications=null;
        if(attractions[0]["classifications"][0])
            classifications= attractions[0]["classifications"][0];
        if (classifications["subGenre"] && classifications["genre"] && classifications["segment"] && classifications["subType"] && classifications["type"])
            genre = classifications["subGenre"]["name"] + " | " +classifications["genre"]["name"] + " | " +classifications["segment"]["name"] + " | " +
            classifications["subType"]["name"] + " | " +classifications["type"]["name"];
        if (event_detail_dict["priceRanges"])
            price_ranges = "$"+event_detail_dict["priceRanges"][0]["min"] + " ~ " + "$"+event_detail_dict["priceRanges"][0]["max"] + " USD";
        status = dates["status"]["code"];
        buy_tikcket = event_detail_dict["url"];
        seat_map = null;
        if (event_detail_dict["seatmap"])
            seat_map = event_detail_dict["seatmap"]["staticUrl"];
        event_datail_json = {"event_name" : event_name, "data_time" : data_time, "artist_name" : artist_name, "team_name" : team_name, "artist_url" : artist_url, "team_url" : team_url, "venue" : venue_name,
            "genre" : genre, "price_range" : price_ranges, "status" : status, "buy_ticket" : buy_tikcket, "seat_map" : seat_map};
        res.json(event_datail_json);
    },error=>{
        console.log(error)
    })


    //fake data
    // event_datail_json = {"event_name" : "USC vs UCLA hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", "data_time" : moment("2038-01-02").format('ll')+" 32:90:90", "artist_name" : "Troye", "team_name" : "yong", "artist_url" : "", "team_url" : "", "venue" : "figuroa",
    //     "genre" : "any", "price_range" : "$99 ~ $1000", "status" : "on sale", "buy_ticket" : "", "seat_map" : "http://arizona.diamondbacks.mlb.com/ari/images/ballpark/seating_chart/ARI_18_seating_chart_800x684_view.jpg"};
    // res.json(event_datail_json);
};

exports.getArtist=async (req,res)=>{

    let artists = req.params.artist;
    console.log(artists)
    // const teamname=req.params.teamname;
    const category=req.params.category;
    //keyword is not used 
    const keyword=req.params.keyword;
    let allartists=artists.split(" | ");
    console.log(allartists);
    const cx="004593994214439919188:de6huk4x-ns";
    const key="AIzaSyDec4fFJPGSy00rlq1fnyrK3g_jHM9uxFk";
    // let filterartists=[];
    // let links=[{term:"",filterartists:[],imgs:[]}];
    let links=[];

    for(let i=0;i<allartists.length;i++){
        let artist = allartists[i];
        links.push({term:"",filterartists:[],imgs:[]});
        // if(category==="Music"){//what if many categories
        if(category.indexOf("Music")!=-1){//contains music
            console.log("*****","type is Music");
            let artist = allartists[i];
            spotifyApi.searchArtists(artist)
                .then(function(data) {
                    returnartists=data["body"]["artists"];
                    if(returnartists["items"].length==1){
                        links[i]["filterartists"].push({
                            name:returnartists["items"]["name"],
                            followers:returnartists["items"]["followers"]["total"],
                            popular:returnartists["items"]["popularity"],
                            checkat:returnartists["items"]["external_urls"]["spotify"]
                        });
                    }else if(returnartists["items"].length>1){
                        for(let i=0;i<returnartists["items"].length;i++){
                            item=returnartists["items"][i];
                            if(item["name"]===artist){
                                links[i]["filterartists"].push({
                                    name:item["name"],
                                    followers:item["followers"]["total"],
                                    popular:item["popularity"],
                                    checkat:item["external_urls"]["spotify"]
                                });
                            }
                        }
                    }
                    console.log("hhhhhh",links[i]["filterartists"][0]);
                }, function(err) {
                    // console.log(err);
                    if(err.statusCode==401){
                        spotifyApi.clientCredentialsGrant().then(
                            function(data) {
                                console.log('The access token expires in ' + data.body['expires_in']);
                                console.log('The access token is ' + data.body['access_token']);

                                // Save the access token so that it's used in future calls
                                spotifyApi.setAccessToken(data.body['access_token']);
                                spotifyApi.searchArtists(artist).then(data=> {
                                    console.log("this is waht I wnat!");
                                    returnartists=data["body"]["artists"];
                                    if(returnartists["items"].length==1){
                                        links[i]["filterartists"].push({
                                            name:returnartists["items"]["name"],
                                            followers:returnartists["items"]["followers"]["total"],
                                            popular:returnartists["items"]["popularity"],
                                            checkat:returnartists["items"]["external_urls"]["spotify"]
                                        });
                                    }else if(returnartists["items"].length>1){
                                        for(let k=0;k<returnartists["items"].length;k++){
                                            item=returnartists["items"][k];
                                            if(item["name"]===artist){
                                                links[i]["filterartists"].push({
                                                    name:item["name"],
                                                    followers:item["followers"]["total"],
                                                    popular:item["popularity"],
                                                    checkat:item["external_urls"]["spotify"]
                                                });
                                            }
                                        }
                                    }
                                    // res.json(filterartists);
                                })
                            },
                            function(err) {
                                console.log('Something went wrong when retrieving an access token');
                            }
                        );

                    }

                });
        }
        console.log('https://www.googleapis.com/customsearch/v1?q='+artist+'&cx='+cx+'&imgSize' +
            '=huge&imgType=news&num=9&searchType=image&key='+key);
        await axios.get('https://www.googleapis.com/customsearch/v1?q='+artist+'&cx='+cx+'&imgSize' +
            '=huge&imgType=news&num=9&searchType=image&key='+key,
            {responseType:'json'}).then(data=>{
            console.log("photos");
            //console.log(data);
            let items=data.data["items"];

            if(links.length>i){
                links[i]["term"]=data.data["queries"]["request"][0]["searchTerms"];
                for(let j=0;j<items.length;j++){
                    links[i]["imgs"].push(items[j]["link"]);
                }
            }else{
                // let links=[{term:"",filterartists:[],imgs:[]}];
                let imgs=[];
                for(let j=0;j<items.length;j++){
                    imgs.push(items[j]["link"]);
                }
                links.push({
                    term:data.data["queries"]["request"][0]["searchTerms"],
                    filterartists:[],
                    imgs:imgs,
                });
            }
        },(error)=>{
            console.log("error");
        });
    }
    // console.log("links:",links);
    res.json(links);



    //fake data
    // links=[];
    // links.push({term:"troye",filterartists:[
    //         {
    //             name:"troye",
    //             followers:777777,
    //             popular:10,
    //             checkat:""
    //         }
    //     ],
    //     imgs:["https://www.latimes.com/resizer/h1_6jc0npDHcj5hm8IJ5e8X02fo=/1400x0/www.trbimg.com/img-5b84d0a6/turbine/la-1535430818-py4nyenox5-snap-image","https://music-b26f.kxcdn.com/wp-content/uploads/2017/07/lady_gaga2-770x470.jpg"]});
    // res.json(links);

};
exports.getVenue=(req,res)=>{

    const venue = req.params.venuename;
    const accesskey = 'wfHUN63wOkYsxR9lASv6pLfIYlb6uusM';
    const venueurl="https://app.ticketmaster.com/discovery/v2/venues" + "?apikey=" +accesskey + "&keyword=" +venue;
    console.log("&&&&&&&&&&&&",venueurl)
    axios.get(venueurl,
        {responseType:'json'}).then(data=>{
        console.log("venue");
        console.log(data.data);
        venue_detail_dict=data.data;
        root = venue_detail_dict["_embedded"];
        venues = root["venues"];
        venue_name = venues[0]["name"];
        lat = null;
        lng = null;
        if (venues[0]["location"]) {
            lat = venues[0]["location"]["latitude"];
            lng = venues[0]["location"]["longitude"];
        }
        address = null;
        if (venues[0]["address"]["line1"])
            address = venues[0]["address"]["line1"];
        else {
            address = "";
        }
        city = null;
        if (venues[0]["city"]["name"]) {
            city = venues[0]["city"]["name"];
        }
        phone="";
        openhours="";
        genrule="";
        childrule="";
        if(venues[0]["boxOfficeInfo"]){
            phone=venues[0]["boxOfficeInfo"]["phoneNumberDetail"];
            openhours=venues[0]["boxOfficeInfo"]["openHoursDetail"];
            genrule=venues[0]["generalInfo"]["generalRule"];
            childrule=venues[0]["generalInfo"]["childRule"];
        }
        venueInfoJson={
            "venuename":venue_name,
            "lat":lat,
            "lng":lng,
            "address":address,
            "city":city,
            "phone":phone,
            "openh":openhours,
            "grule":genrule,
            "crule":childrule
        }
        res.json(venueInfoJson);
    },(error)=>{
        console.log(error);
    });

    //fake data

    // venueInfoJson={
    //     "venuename":"figuroa",
    //     "lat":"33",
    //     "lng":"-114",
    //     "address":"",
    //     "city":"",
    //     "phone":"",
    //     "openh":"",
    //     "grule":"no smoking",
    //     "crule":""
    // };
    // res.json(venueInfoJson);
};
exports.getUpcoming=(req,res)=>{

    apikey="Ozt7wo22TxAG5lZU";
    venue = req.params.venuename;
    upcomings=[];
    codeAndUpcommings={code:"no result",upcomings:upcomings};

    const venueurl="https://api.songkick.com/api/3.0/search/venues.json?query=" + venue+"&apikey=" +apikey;
    axios.get(venueurl,{responseType:'json'}).then(
        data=>{
            console.log(data.data);

            id=data.data["resultsPage"]["results"]["venue"][0]["id"];
            secondurl="https://api.songkick.com/api/3.0/venues/"+id+"/calendar.json?apikey=" +apikey;
            console.log("**",secondurl);
            axios.get(secondurl,{responseType:'json'}).then(
                data=>{
                    if(data.data["resultsPage"] && data.data["resultsPage"]["results"] && data.data["resultsPage"]["results"]["event"]){
                        upcomingarr=data.data["resultsPage"]["results"]["event"];

                        for(let i=0;i<upcomingarr.length;i++){
                            up=upcomingarr[i];
                            console.log(up["id"]);
                            upcomings.push({
                                displayName:up["displayName"],
                                type:up["type"],
                                url:up["uri"],
                                artist:up["performance"][0]["artist"]["displayName"],
                                date:moment(up["start"]["date"]).format('ll'),
                                time:up["start"]["time"],
                            });
                        }
                        console.log(upcomings);
                        codeAndUpcommings["code"]="succeed";
                        codeAndUpcommings["upcomings"]=upcomings;

                    }
                    res.json(codeAndUpcommings);

                },
                error=>{
                console.log(error);
                })

        },
        error=>{
        console.log(error);
        });

    //fake data
    /*
    upcomings=[];
    codeAndUpcommings={code:"no result",upcomings:upcomings};

    upcomings=[];
    upcomings.push({
        displayName:"usc vs xinhang",
        type:"sport",
        url:"http://www.youtube.com",
        artist:"lady gaga",
        date:"Nov,7 2018",
        time:"23:89:00",
    });
    upcomings.push({
        displayName:"usc vs xinhang",
        type:"sport",
        url:"http://www.youtube.com",
        artist:"lady gaga",
        date:"Nov,7 2018",
        time:"23:89:00",
    });
    upcomings.push({
        displayName:"usc vs xinhang",
        type:"sport",
        url:"http://www.youtube.com",
        artist:"lady gaga",
        date:"Nov,7 2018",
        time:"23:89:00",
    });
    upcomings.push({
        displayName:"usc vs xinhang",
        type:"sport",
        url:"http://www.youtube.com",
        artist:"lady gaga",
        date:"Nov,7 2018",
        time:"23:89:00",
    });
    upcomings.push({
        displayName:"usc vs xinhang",
        type:"sport",
        url:"http://www.youtube.com",
        artist:"lady gaga",
        date:"Nov,7 2018",
        time:"23:89:00",
    });
    upcomings.push({
        displayName:"usc vs xinhang",
        type:"sport",
        url:"http://www.youtube.com",
        artist:"lady gaga",
        date:"Nov,7 2018",
        time:"23:89:00",
    });
    upcomings.push({
        displayName:"usc vs xinhang",
        type:"sport",
        url:"http://www.youtube.com",
        artist:"lady gaga",
        date:"Nov,7 2018",
        time:"23:89:00",
    });
    upcomings.push({
        displayName:"usc vs xinhang",
        type:"sport",
        url:"http://www.youtube.com",
        artist:"lady gaga",
        date:"Nov,7 2018",
        time:"23:89:00",
    });
    upcomings.push({
        displayName:"usc vs xinhang",
        type:"sport",
        url:"http://www.youtube.com",
        artist:"lady gaga",
        date:"Nov,7 2018",
        time:"23:89:00",
    });
    upcomings.push({
        displayName:"usc vs xinhang",
        type:"sport",
        url:"http://www.youtube.com",
        artist:"lady gaga",
        date:"Nov,7 2018",
        time:"23:89:00",
    });
    upcomings.push({
        displayName:"usc vs xinhang",
        type:"sport",
        url:"http://www.youtube.com",
        artist:"lady gaga",
        date:"Nov,7 2018",
        time:"23:89:00",
    });
    upcomings.push({
        displayName:"usc vs xinhang",
        type:"sport",
        url:"http://www.youtube.com",
        artist:"lady gaga",
        date:"Nov,7 2018",
        time:"23:89:00",
    });
    upcomings.push({
        displayName:"usc vs xinhang",
        type:"sport",
        url:"http://www.youtube.com",
        artist:"lady gaga",
        date:"Nov,7 2018",
        time:"23:89:00",
    });
    upcomings.push({
        displayName:"usc vs xinhang",
        type:"sport",
        url:"http://www.youtube.com",
        artist:"lady gaga",
        date:"Nov,7 2018",
        time:"23:89:00",
    });
    codeAndUpcommings["code"]="succeed";
    codeAndUpcommings["upcomings"]=upcomings;
    res.json(codeAndUpcommings);
    */
};