chrome.runtime.onInstalled.addListener(function (checkWeather, showNotification){
    navigator.geolocation.watchPosition(function(position){
        var lat = position.coords.latitude;
        var long = position.coords.longitude;

        // Fetch Data every 3 secs
        setInterval(function () {
            getWeatherData(lat, long, 
            function(weatherMain, weatherData) {
                
                chrome.storage.sync.set({main: weatherMain, data: weatherData}, function(){});
            },
            function(errorMessage) {
                alert(errorMessage);
            });
        }, 3000)



        }, function(error){
            
    });
})

chrome.storage.sync.get(["main", "data"], function(request){
    // Fire a notification if there is any weather anomalies
    if (checkWeather(request.main, request.data)){
        showNotification(request.main, request.data);
    }
});




// Retrieve weather data from OpenWeather API
function getWeatherData(lat, long, callback, errorCallback) {

    var searchUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=8f406ae37d8e9c9671262ab1d496fd2a';
    var x = new XMLHttpRequest();
    x.open('GET', searchUrl);

    x.responseType = 'json';
    x.onload = function() {

        var response = x.response;
        if (response.cod == "404") {
            errorCallback('City not found');
            return;
        }

        var weatherMain = response.weather[0].main;
        var weatherDescription = response.weather[0].description;

        callback(weatherMain, weatherDescription);
    };
    x.onerror = function() {
        errorCallback('Network error.');
    };
    x.send();
}

// Check if there is any weather emergency in the report
function checkWeather(weatherMain, weatherData) {
    // keys to look for
    var dangerKeys = ['hurricane', 'tornado', 'twister', 'tsunami', 'earthquake', 
                        'tremor', 'flood', 'storm', 'crest', 'extreme', 'fire', 'avalanche',
                        'typhoon', 'blizzard', 'sleet', 'mudslice', 'mud', 'outage', 'warning',
                        'emergency', 'clear'];
    var isDanger = false;

    var dataKeys = weatherMain.split(' ').concat(weatherData.split(' '));
    
    dataKeys.forEach(function(el) {
        if(dangerKeys.includes(el)) {
            isDanger = true;
            return;
        }
    });
    return isDanger;
}

// Shows notification 
function showNotification(weatherMain, weatherData){
    var opt = {
        type: "basic",
        title: weatherMain,
        message: weatherData,
        iconUrl: "thunder.png"
    };
    chrome.notifications.create('alert', opt, function(){});
}