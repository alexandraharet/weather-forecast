$(document).ready(function(){
  var units = {
    us: {
      systemName: "us",
      temperature: "°F",
      speed: "mph",
      distance: "mi." },
      si: {
        systemName: "si",
        temperature: "°C",
        speed: "km/h",
        distance: "km" }
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
        setTimeout(displayDivs, 1500, 'js-hiddenContent');
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
          parseAndRenderWeather('js-currently', data);
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
          $.each(divs, function (key, value) {
            $("#" + value).html(data.results[0].formatted_address);
          })
        }

        var parseAndRenderWeather = function (myClass, data) {
          var divs = getDivIdsFromHtml(myClass);
          var d = new Date(data.currently.time * 1000);
          if (myClass === "js-currently") str = "currently";
          else if (myClass === "js-tonight") {
            dataIndex = 24 - d.getHours() + Math.abs(data.offset);
            str = "hourly.data." + dataIndex;
          }
          else if (myClass === "js-tomorrow") {
            dataIndex = 36 - d.getHours() + Math.abs(data.offset);
            str = "hourly.data." + dataIndex;
          }
          $.each(divs, function(key, value) {
            dataPoint = str + "." + value;
            switch(value) {
              case "icon":
                $("." + myClass + " #icon").html('<img src="img/' + Object.byString(data, dataPoint) + '.png" alt="' + Object.byString(data, dataPoint) + '"  />');
                break;
              case "temperature":
              case "apparentTemperature":
                attribute = Object.byString(data, dataPoint);
                $("." + myClass + " #" + value).html(attribute.toFixed(0) + " " + currentUnitSystem.temperature);
                break;
              case "precipProbability":
                attribute = Math.round(Object.byString(data, dataPoint) * 100);
                $("." + myClass + " #" + value).html(attribute + "%");
                break;
              case "windSpeed":
                attribute = Math.round(Object.byString(data, dataPoint));
                if (currentUnitSystem.systemName === "si") attribute = Math.round(attribute * 3.6); // transforms speed from m/s to km/h
                $("." + myClass + " #" + value).html(attribute + " " + currentUnitSystem.speed);
                break;
            }
          })
        };

        Object.byString = function(o, s) {
          s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
          s = s.replace(/^\./, '');           // strip a leading dot
          var a = s.split('.');
          for (var i = 0, n = a.length; i < n; ++i) {
              var k = a[i];
              if (k in o) {
                  o = o[k];
              } else {
                  return;
              }
          }
          return o;
      }

      });
