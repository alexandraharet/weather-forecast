<?php

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


?>
