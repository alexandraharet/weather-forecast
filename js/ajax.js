$(document).ready(function(){

  var coordinates;

  $('#myButton').click(function(e){
    var latitude = "";
    var longitude = "";
    e.preventDefault();

    // get latitude, longitude for selected city
    $.ajax({
      url: 'php/coordinates.php',
      type: 'GET',
      data: {cityName: $('#address').val()},
      dataType: 'json',
      success: function(data) {
        stringCoordinates(data);
    },
      error: function(xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      }
    });



    getDivIdsFromHtml('weather');
  });

  // console.log(coordinates);

  var stringCoordinates = function (data) {
    latitude = data.results[0].geometry.location.lat;
    longitude = data.results[0].geometry.location.lng;
//    coordinates = latitude + "," + longitude;
    // get weather from forecast.io
    $.ajax({
      url: 'php/forecast.php',
      type: 'GET',
      data: {lat: latitude,
             lon: longitude},
      dataType: 'json',
      success: function(data) {
        parseAndRender('weather', data);
      },
      error: function(xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      }
    });
//    return coordinates;
  }

  var getDivIdsFromHtml = function (myClass) {
    classDivId = [];
    $('.'+ myClass).children('div').each(function() {
      classDivId.push($(this).attr('id'));
    });
    return classDivId;
  }

  var parseAndRender = function (myClass, data) {
    var divs = getDivIdsFromHtml(myClass);
    $.each(divs, function (key, value) {
      if (value == "icon") {
        switch(data.currently.icon) {
          case "clear-day":
            $("#" + value).html('<img src="https://cdn0.iconfinder.com/data/icons/good-weather-1/96/weather_icons-01-128.png" />');
            break;
          case "clear-night":
            $("#" + value).html('<img src="https://cdn0.iconfinder.com/data/icons/good-weather-1/96/weather_icons-05-128.png" />');
            break;
          case "rain":
            $("#" + value).html('<img src="https://cdn0.iconfinder.com/data/icons/good-weather-1/96/weather_icons-36-128.png" />');
            break;
          case "snow":
            $("#" + value).html('<img src="https://cdn0.iconfinder.com/data/icons/good-weather-1/96/weather_icons-68-128.png" />');
            break;
          case "sleet":
            $("#" + value).html('<img src="https://cdn0.iconfinder.com/data/icons/good-weather-1/96/weather_icons-52-128.png" />');
            break;
          case "wind":
            $("#" + value).html('<img src="https://cdn0.iconfinder.com/data/icons/good-weather-1/96/weather_icons-58-128.png" />');
            break;
          case "fog":
            $("#" + value).html('<img src="https://cdn0.iconfinder.com/data/icons/good-weather-1/96/weather_icons-39-128.png" />');
            break;
          case "cloudy":
            $("#" + value).html('<img src="https://cdn0.iconfinder.com/data/icons/good-weather-1/96/weather_icons-16-128.png" />');
            break;
          case "partly-cloudy-day":
            $("#" + value).html('<img src="https://cdn0.iconfinder.com/data/icons/good-weather-1/96/weather_icons-17-128.png" />');
            break;
          case "partly-cloudy-night":
            $("#" + value).html('<img src="https://cdn0.iconfinder.com/data/icons/good-weather-1/96/weather_icons-18-128.png" />');
            break;
          default:
            $("#" + value).html('<img src="https://cdn0.iconfinder.com/data/icons/good-weather-1/96/weather_icons-18-128.png" />');
          }
        }

      else if (value == "temperature") {
        temperature = ((data.currently[value]) - 32) * 5 / 9;
        $("#" + value).html(value + ": " + temperature.toFixed(0) + " °C");
      }
      else $("#" + value).html(value + ": " + data.currently[value]);
    })
  }
});




//
