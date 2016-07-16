<?php
/*
// api at https://developers.google.com/maps/documentation/geocoding/start
// max 2,500 requests per day, 50 requests per second
// server key for Google geolocation API: 'AIzaSyBYlvKDvzGZU2X7SGE6vPUZcoWwPOlavec'

	$api_maps = 'https://maps.googleapis.com/maps/';
	$city_name = $_GET['cityName'];
	$api_key1 = 'AIzaSyBvzrK2_Fr84Od185gbDGxlpRapNcJE4BY';
	$url = $api_maps . 'api/geocode/json?address=' . $city_name . '&key=' . $api_key1;
	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	$curl_response = curl_exec($curl);
	curl_close($curl);
  echo ($curl_response);
*/

	// api at https://developer.forecast.io/docs/v2
	// max 1000 calls per day
	// object example: https://api.forecast.io/forecast/2cb2a6600011ce4ca629efa9e07cc9bd/37.8267,-122.423

	$api_weather = 'https://api.forecast.io/forecast/';
	$api_key2 = '2cb2a6600011ce4ca629efa9e07cc9bd';
	$latitude = $_GET['lat'];
	$longitude = $_GET['lon'];
	$url = $api_weather . $api_key2 . '/' . $latitude . ',' . $longitude;
	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	$curl_response = curl_exec($curl);
	curl_close($curl);
  echo ($curl_response);


?>
