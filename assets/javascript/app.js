var beerFacts = ["At any given time, 0.7% of the world is drunk. So, 50 million people right now are drunk.", 
 "The strongest beer in the world has a 67.5% alcohol content. (Its called: Snake Venom).", 
 "Fried beer won Most Creative Fried Food at the 2010 Texas State Fair.", 
 "A barrel contains 31 Gallons of beer. A keg is actually 15.5 Gallons or a half-barrel.", 
 "Beer cans were first introduced in 1935.", 
 "12-ounces of a typical American pale lager has fewer calories than 2 percent milk or apple juice.", 
 "The United States is the second largest hop producer. (Germany is first).", 
 "Abraham Lincoln taxed beer to help pay for the Civil War.", 
 "Shiner Beer made by Spoetzl Brewery is the oldest active brewery in Texas, founded in 1909 in Shiner, TX.", 
 "The first brewery in Texas was Alamo Brewing Association in San Antonio, founded in 1888.",  
 "Beer is the oldest and most widely consumed alcoholic drink in the world.",  
 "Space Barley is the most expensive beer in the world. The barley used to make the beer was kept in the international space station for 5 months! (six pack is $110)", 
 "Bud Light is the third most consumed beer in the world and the most consumed beer in the USA.", 
 "New Hampshire consumes the most alcohol in the United States 4.72 Gallons per capita!", 
 "Homebrewing beer became legal in all 50 states in 2013 - Mississippi was the last state to legalize."];


function loopThroughBeerFacts(beerFacts) {
    for (var i = 0; i < beerFacts.length; i++) {

        (function (i) {
            setTimeout(function () {
                $("#factsDisplay").html(beerFacts[i]);
            }, 10000 * i);
        }       )(i);
    };
}
loopThroughBeerFacts(beerFacts);


//query openweathermap API 

var APIKey = "2bbb96eb5c555bde040963058d6373c3";

    // Here we are building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
      "q=zip=78701,us&units=imperial&appid=" + APIKey;

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
      })
      // We store all of the retrieved data inside of an object called "response"
      .done(function(response) {

        console.log(response);

        // Transfer content to HTML
        $(".wind").text("Wind Speed: " + response.wind.speed);
        $(".humidity").text("Humidity: " + response.main.humidity);
        $(".temp").text("Temperature (F): " + response.main.temp);

      });






var infowindow;
var map;

function initMap() {
    var austin = { lat: 30.2672, lng: -97.7431 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: austin
    });
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    google.maps.event.addListener(map, 'zoom_changed', function() {
        if (this.getZoom() < 12) {
            // Change max/min zoom here
            this.setZoom(12);
        }
    });

    var markers = [];

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    var request = {
        location: austin,
        radius: '10000',
        types: ['bar', 'restaurant', 'night_club']
    };


    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        request.keyword = places;

        service.nearbySearch(request, callback);

        if (places.length == 0) {
            return;
        }
    });

    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            // console.log(i + " " + JSON.stringify(results[i]));
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}



// Run the initialize function when the window has finished loading.
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBQmLKzWu_zmVmo2bjEkQRab3RT35evkR4",
    authDomain: "project-1-4fb0a.firebaseapp.com",
    databaseURL: "https://project-1-4fb0a.firebaseio.com",
    projectId: "project-1-4fb0a",
    storageBucket: "project-1-4fb0a.appspot.com",
    messagingSenderId: "686764555414"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Create a variable to reference the database.
var database = firebase.database();

// -----------------------------

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#connected-viewers").text("Online Now: " + snap.numChildren());
  $("#total-viewers").text("Total Views: " + snap.numChildren());

});

