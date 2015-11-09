<?php 
$address = $city = $state = $degree = "";

function sanitize_input($data) {
   $data = trim($data);
   $data = stripslashes($data);
   $data = htmlspecialchars($data);
   return $data;
}

$address = sanitize_input($_GET["address"]);
$city = sanitize_input($_GET["city"]);
$state = sanitize_input($_GET["state"]);
$degree = sanitize_input($_GET["degree"]);

$google_api_key = 'AIzaSyA7W3mhcAjA1PqmCqxTn916x0R8_txwHRw';
$address = preg_replace('/\s+/', '+', $address);
$city = preg_replace('/\s+/', '+', $city);
$geocode_url = "https://maps.googleapis.com/maps/api/geocode/xml?address=" . $address . "," . $city . ',' . $state . "&key=" . $google_api_key;
$forecast_api_key = '6403d52b9ed21c5a38af6f691f91b0ab';
$geocode_response = file_get_contents($geocode_url);
$xml = simplexml_load_string($geocode_response);
$status = $xml->status;
if($status == "ZERO_RESULTS"){
   echo "<br><br><div id='results'>" . "Oops, we could not retrieve the weather forecast for the given location. Please verify the location." . "</div>"; 
   exit();
}
$lng = $xml->result->geometry->location->lng;
$lat = $xml->result->geometry->location->lat;

$unit = '';
$unit_name = '';
if($degree == 'celsius'){
   $unit = 'si';
   $unit_name = "C";
   echo "<script>document.getElementById('C').checked = true;document.getElementById('F').checked = false;</script>";
}
else{
   $unit = 'us';
   $unit_name = "F";
}
$forecast_url = "https://api.forecast.io/forecast/" . $forecast_api_key . "/" . $lat . "," . $lng . '?units=' . $unit . "&exclude=flags";
$forecast_response = file_get_contents($forecast_url);
if ($forecast_response == false){
   echo "<br><br><div id='results'>" . "Oops, we could not retrieve the weather forecast for the given location. Please verify the location or try again." . "</div>";
   exit();
}
print_r($forecast_response);
return $forecast_response;
//var_dump(json_decode($forecast_response));
$response = json_encode((array)$forecast_response);
//var_dump($response);
return $response;

$current_condition = $decoded_response->currently->summary;
$temp = round($decoded_response->currently->temperature);
$icon = $decoded_response->currently->icon;
$icon_image = '';
switch ($icon) {
   case "clear-day": 
                        $icon_image = "http://cs-server.usc.edu:45678/hw/hw8/images/clear.png"; 
                        break;
   case "clear-night": 
                        $icon_image = "http://cs-server.usc.edu:45678/hw/hw8/images/clear_night.png"; 
                        break;
   case "rain": 
                        $icon_image = "http://cs-server.usc.edu:45678/hw/hw8/images/rain.png"; 
                        break;
   case "snow": 
                        $icon_image = "http://cs-server.usc.edu:45678/hw/hw8/images/snow.png"; 
                        break;
   case "sleet": 
                        $icon_image = "http://cs-server.usc.edu:45678/hw/hw8/images/sleet.png"; 
                        break;
   case "wind": 
                        $icon_image = "http://cs-server.usc.edu:45678/hw/hw8/images/wind.png"; 
                        break;
   case "fog": 
                        $icon_image = "http://cs-server.usc.edu:45678/hw/hw8/images/fog.png"; 
                        break;
   case "cloudy": 
                        $icon_image = "http://cs-server.usc.edu:45678/hw/hw8/images/cloudy.png"; 
                        break;
   case "partly-cloudy-day": 
                        $icon_image = "http://cs-server.usc.edu:45678/hw/hw8/images/cloud_day.png"; 
                        break;
   case "partly-cloudy-night": 
                        $icon_image = "http://cs-server.usc.edu:45678/hw/hw8/images/cloud_night.png"; 
                        break;
}

$precipitation = $decoded_response->currently->precipIntensity;
if ($precipitation >= 0 && $precipitation < 0.002) {
   $precipitation_text = 'None'; 
} else if ($precipitation >= 0.002 && $precipitation < 0.017) {
   $precipitation_text = 'Very Light';
} else if ($precipitation >= 0.017 && $precipitation < 0.1) {
   $precipitation_text = 'Light';
} else if ($precipitation >= 0.1 && $precipitation < 0.4) {
   $precipitation_text = 'Moderate';
} else {
   $precipitation_text = 'Heavy';
}


$chance_of_rain = $decoded_response->currently->precipProbability * 100;
$windSpeed = round($decoded_response->currently->windSpeed);
$dewPoint = round($decoded_response->currently->dewPoint);
$humidity = $decoded_response->currently->humidity * 100;
$visibility = round($decoded_response->currently->visibility);
date_default_timezone_set('America/Los_Angeles');
$sunrise = $decoded_response->daily->data[0]->sunriseTime;
$sunset = $decoded_response->daily->data[0]->sunsetTime;

$html_string = "";
$html_string = "<br><fieldset><table width='300px' align='center'>" . "<tr><th colspan=2><h3>" . $current_condition. "</h3></th></tr>" . 
      "<tr><th colspan=2><h3>" . $temp . " &deg;" . $unit_name . "</h3></th></tr>" . 
      "<tr><th colspan=2><img src='" . $icon_image . "' alt='" . $icon . "' title='" . $current_condition . "'" . "></th></tr>" .
      "<tr><td>Precipitation:</td><td>" . $precipitation_text . "</td></tr>" . 
      "<tr><td>Chance of Rain:</td><td>" . $chance_of_rain . '%' . "</td></tr>" . 
      "<tr><td>Wind Speed:</td><td>" . $windSpeed . ' mph' . "</td></tr>" . 
      "<tr><td>Dew Point:</td><td>" . $dewPoint . " &deg;" . $unit_name . "</td></tr>" . 
      "<tr><td>Humidity:</td><td>" . $humidity . '%' . "</td></tr>" . 
      "<tr><td>Visibility:</td><td>" . $visibility . ' mi' . "</td></tr>" . 
      "<tr><td>Sunrise:</td><td>" . Date('h:i A', $sunrise) . "</td></tr>" . 
      "<tr><td>Sunset:</td><td>" . Date('h:i A', $sunset) . "</td></tr>" . 
      "</table></fieldset>";

echo "<div id='results'>" . $html_string . "</div>";
?>
