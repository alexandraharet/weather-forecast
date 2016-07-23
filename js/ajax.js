$(document).ready(function(){
  var units = {
    us: {
      systemName: "us",
      temperature: "°F",
      speed: "mph",
      distance: "mi.",
      precipitation: "%"},
      si: {
        systemName: "si",
        temperature: "°C",
        speed: "m/s",
        distance: "km",
        precipitation: "%" }
      };
      var currentUnitSystem = units[$("input[name='units']:checked").val()];
      var currentWeatherData;
      var location = {};

      /* onclick callback for the temperature filter */
      var options = $("form[id=selectedUnits] > input");
      for (var i = 0; i < options.length; i++)
      options[i].onclick = function() {
        currentUnitSystem = units[this.value];
        if (typeof currentWeatherData !== 'undefined')
          fetchWeatherData();
      }

      $('#myButton').click(function(event){
        event.preventDefault();
        if ($('#address').val() === "")
          return;
        $("#myButton").focus();
        setTimeout(displayDivs, 1000, 'js-hiddenContent');
        /* First ajax call gets latitude, longitude for address entered */
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

      var displayDivs = function (myClass) {
        $("." + myClass).fadeIn(300);
        $(".viewpanel").matchHeight();
      }

      var getLatLng = function (data) {
        if (typeof data.results[0] === 'undefined')
          return;
        location.latitude = data.results[0].geometry.location.lat;
        location.longitude = data.results[0].geometry.location.lng;
        parseAndRenderLocation('location-info', data);
        fetchWeatherData();
        }

        /* gets weather information for [location] from forecast.io */
        var fetchWeatherData = function () {
          $.ajax({
            url: 'php/forecast.php',
            type: 'GET',
            data: {lat: location.latitude,
              lon: location.longitude,
              units: currentUnitSystem.systemName},
              dataType: 'json',
              success: function(data) {
                renderWeatherInfo(data);
                currentWeatherData = data;
              },
              error: function(xhr, desc, err) {
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
              }
            });
        }

        var renderWeatherInfo = function(data) {
          getDivIdsFromHtml('js-currently');
          parseAndRenderWeatherCurrently('js-currently', data);
          getDivIdsFromHtml('js-tonight');
          parseAndRenderWeather('js-tonight', data);
          getDivIdsFromHtml('js-tomorrow');
          parseAndRenderWeather('js-tomorrow', data);
        }

        /* gets div ids from HMTL, to determine which data must be retrieved from the two APIs used */
        var getDivIdsFromHtml = function (myClass) {
          classDivId = [];
          $('.'+ myClass + " span").each(function() {
            classDivId.push($(this).attr('id'));
          });
          return classDivId;
        }

        /* renders the location information for the address entered */
        var parseAndRenderLocation = function (myClass, data) {
          var divs = getDivIdsFromHtml(myClass);
          $.each(divs, function (k, v) {
            $("#" + v).html(data.results[0].formatted_address);
          })
        }

        /* renders the weather data for the address entered */
        var parseAndRenderWeatherCurrently = function (myClass, data) {
          var divs = getDivIdsFromHtml(myClass);
          $.each(divs, function (k, v) {
            if (v == "icon") {
              $("." + myClass + " #icon").html('<img src="img/' + data.currently.icon + '.png" alt="' + data.currently.icon + '"  />');
            }
            else if (v == "temperature" || v == "apparentTemperature") {
              // attribute = v;
              attribute = (data.currently[v]);
              $("." + myClass + " #" + v).html(attribute.toFixed(0) + " " + currentUnitSystem.temperature);
            }
            else $("." + myClass + " #" + v).html(data.currently[v]);
          })
        };

        var parseAndRenderWeather = function (myClass, data) {
          var divs = getDivIdsFromHtml(myClass);
          var d = new Date(data.currently.time * 1000);
          if (myClass == "js-tonight") dataIndex = 24 - d.getHours() + data.offset;
          else if (myClass == "js-tomorrow") dataIndex = 36 - d.getHours() + data.offset;
          $.each(divs, function (k, v) {
            if (v == "icon") {
              $("." + myClass + " #icon").html('<img src="img/' + data.hourly.data[dataIndex].icon + '.png" alt="' + data.hourly.data[dataIndex].icon + '"  />');
            }
            else if (v == "temperature" || v == "apparentTemperature") {
              attribute = data.hourly.data[dataIndex][v];
              $("." + myClass + " #" + v).html(attribute.toFixed(0) + " " + currentUnitSystem.temperature);
            }
            else $("." + myClass + " #" + v).html(data.hourly.data[dataIndex][v]);
          })
        };

      });
