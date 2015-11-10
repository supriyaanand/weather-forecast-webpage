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

?>