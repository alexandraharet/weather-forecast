<?php
// api at https://darksky.net/dev/docs
// max 1000 calls per day
// object example: https://api.darksky.net/forecast/2cb2a6600011ce4ca629efa9e07cc9bd/55.9533,3.1883
// object example with EXCLUDE: https://api.darksky.net/forecast/2cb2a6600011ce4ca629efa9e07cc9bd/55.9533,3.1883?exclude=minutely,daily,flags

$api_weather = 'https://api.darksky.net/forecast/';
$api_key2 = '2cb2a6600011ce4ca629efa9e07cc9bd';
$latitude = $_GET['lat'];
$longitude = $_GET['lon'];
$units = $_GET['units'];
$url = $api_weather . $api_key2 . '/' . $latitude . ',' . $longitude . '?exclude=minutely,daily,flags&units=' . $units;
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$curl_response = curl_exec($curl);
curl_close($curl);
echo ($curl_response);

?>
