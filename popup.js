

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

        var weatherData = response.weather[0].description;

        callback(weatherData);
    };
    x.onerror = function() {
        errorCallback('Network error.');
    };
    x.send();
}

// Displays weather status
function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}



document.addEventListener('DOMContentLoaded', function() {

// Get user location
navigator.geolocation.watchPosition(function(position){
    var lat = position.coords.latitude;
    var long = position.coords.longitude;

    getWeatherData(lat, long, function(weatherData) {

      renderStatus('Weather status: ' + weatherData);
      console.log(lat);
      console.log(long);

    }, function(errorMessage) {

        renderStatus('Cannot display image. ' + errorMessage);

    });
}, function(error){
    renderStatus(error.message);
});







});