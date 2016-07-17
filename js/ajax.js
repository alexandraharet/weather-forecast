$(document).ready(function(){

  $('#myButton').click(function(event){
    event.preventDefault();

    // gets latitude, longitude for address entered
    $.ajax({
      url: 'php/coordinates.php',
      type: 'GET',
      data: {address: $('#address').val()},
      dataType: 'json',
      success: function(data) {
        getLatLng(data);
    },
      error: function(xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      }
    });
  });

  var getLatLng = function (data) {
    var latitude = data.results[0].geometry.location.lat;
    var longitude = data.results[0].geometry.location.lng;
    parseAndRenderLocation('location-info', data);

    // gets weather information for [location] from forecast.io
    $.ajax({
      url: 'php/forecast.php',
      type: 'GET',
      data: {lat: latitude,
             lon: longitude},
      dataType: 'json',
      success: function(data) {
        getDivIdsFromHtml('currently');
        parseAndRenderWeather('currently', data);
      },
      error: function(xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      }
    });
}
  // gets div ids from HMTL, to determine which data must be retrieved from the two APIs used
  var getDivIdsFromHtml = function (myClass) {
    classDivId = [];
    $('.'+ myClass).children('div').each(function() {
      classDivId.push($(this).attr('id'));
    });
    return classDivId;
  }

  // renders the location information for the address entered
  var parseAndRenderLocation = function (myClass, data) {
    var divs = getDivIdsFromHtml(myClass);
    $.each(divs, function (key, value) {
        $("#" + value).html("Location: " + data.results[0].formatted_address);
    })
  }

  // renders the weather data for the address entered
  var parseAndRenderWeather = function (myClass, data) {
    var divs = getDivIdsFromHtml(myClass);
    $.each(divs, function (key, value) {
      if (value == "icon") {
        var weatherIs = data.currently.icon;
        $("#icon").html('<img src="img/' + weatherIs + '.png" alt="' + weatherIs + '" width="120" height="120" />');
      }

      else if (value == "temperature") {
        temperature = ((data.currently[value]) - 32) * 5 / 9;
        $("#" + value).html(value + ": " + temperature.toFixed(0) + " °C");
      }
      else $("#" + value).html(value + ": " + data.currently[value]);
    })
  }
});
