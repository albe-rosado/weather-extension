
// var location = 'Beardstown';


// var searchUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(location) + '&appid=8f406ae37d8e9c9671262ab1d496fd2a';



function getWeatherData(callback, errorCallback) {

  var searchUrl = 'http://api.openweathermap.org/data/2.5/weather?q=Beardstown&appid=8f406ae37d8e9c9671262ab1d496fd2a';
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

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {


    getWeatherData(function(weatherData) {

      renderStatus('Weather status: ' + weatherData);      

    }, function(errorMessage) {
      renderStatus('Cannot display image. ' + errorMessage);
    });

});