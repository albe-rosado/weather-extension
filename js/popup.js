
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

// Displays weather status on the popup
function renderStatus(desc) {
    document.getElementById('status').textContent = desc;
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


document.addEventListener('DOMContentLoaded', function() {
    // Get user location
    navigator.geolocation.watchPosition(function(position){
        var lat = position.coords.latitude;
        var long = position.coords.longitude;

        getWeatherData(lat, long, 
        function(weatherMain, weatherData) {
            renderStatus(weatherData);
            showNotification(weatherMain, weatherData)

        }, 
        function(errorMessage) {
            renderStatus('Cannot display image. ' + errorMessage);
        });
        // After fetching the first time will do it again every 3 mins.
        setInterval( function() {        
            
            getWeatherData(lat, long, 
            function(weatherMain, weatherData) {
                renderStatus(weatherData);
                console.log(weatherData);
            },
            function(errorMessage) {
                renderStatus('Cannot display image. ' + errorMessage);
            });
        },3000);

        }, function(error){
            renderStatus(error.message);
    });

});

// TODO: 
// 1- Fix icon in notifications
// 2- Make notifications appear only when weather anomalies
// 3- Make "danger" keywords array and implement search