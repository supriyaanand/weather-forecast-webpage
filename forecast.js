$(document).ready(function(){

$('a[data-toggle="tab"]').on('click', function (e) {
    var target = $(this.target).attr('href').tab('show');
    });
   
 $('form#form-collect').on('submit' , function(e){
   e.preventDefault();
   form = document.forms[0]
   var valid = getForecast(form);
   if (valid) {
    $.ajax({ 
     url:  '/hw8/forecast.php?',
     data: {  address: form.address.value,  
      city:  form.city.value,
      state: form.state.value,
      degree: form.degree.value 
    },
    type: 'GET',
    success: function(output)  {
                     var obj = JSON.parse(output);
                     var html_display = drawDisplay(obj, form.city.value, form.state.value, form.degree.value);
                     $('#results').html(html_display);
                     getMap(obj['latitude'], obj['longitude']);
                   },
                   error:   function(){
                    alert('got something oopsie');
                  }
                });
  }
});

function getForecast(form) {
 var error = false;

 if(form.address.value == '') {
  var error_message = "Please enter the street address";
  document.getElementById('street-error').innerHTML = error_message;
  error = true;
}
if(form.city.value == ''){
  var error_message = "Please enter the city";
  document.getElementById('city-error').innerHTML = error_message;
  error = true;
}
if(form.state.value == ''){
  var error_message = "Please select a state";
  document.getElementById('state-error').innerHTML = error_message;
  error = true;
}
if(error) {
  return false;
}
else {
  return true;   
}
}

function clear_form(){
 document.getElementById('address').value = "";
 document.getElementById('city').value = "";
   //document.getElementById('state').selected.value = 'Select your state...';
   document.getElementById('street-error').innerHTML = "";
   document.getElementById('city-error').innerHTML = "";
   document.getElementById('state-error').innerHTML = "";
   document.getElementById('F').checked = true;
   document.getElementById('C').checked = false;
   document.getElementById('results').innerHTML = "";
}

function drawDisplay(obj, city, state, degree){
   $('#location_string').val(city + ', ' + state);
   var timezone = obj['timezone'];
   var current_condition = obj['currently']['summary'];
   var nav_tabs = "<ul class='nav nav-tabs' role='tablist'><li role='presentation' class='active'><a href='#right-now' data-toggle='tab'>Right Now</a></li><li role='presentation'><a href='#next24hours' data-toggle='tab'>Next 24 Hours</a></li><li role='presentation'><a href='#next7days' data-toggle='tab'>Next 7 Days</a></li></ul>"
   var img_icon = obj['currently']['icon'];
   var img_src = getImageSource(img_icon);
   $('#img_src').val(img_src);
   var unit;
   if(degree == "celsius"){
    unit = "C";
  }
  else{
    unit = "F";
  }
  var temp = Math.round(obj['currently']['temperature']);
  var minTemp = Math.round(obj['daily']['data'][0]['temperatureMin']);
  var maxTemp = Math.round(obj['daily']['data'][0]['temperatureMax']);
  var precipitation = obj['currently']['precipIntensity'];
  var precipitation_text = "";
  if (precipitation >= 0 && precipitation < 0.002) {
    precipitation_text = 'None'; 
  } else if (precipitation >= 0.002 && precipitation < 0.017) {
    precipitation_text = 'Very Light';
  } else if (precipitation >= 0.017 && precipitation < 0.1) {
    precipitation_text = 'Light';
  } else if (precipitation >= 0.1 && precipitation < 0.4) {
    precipitation_text = 'Moderate';
  } else {
    precipitation_text = 'Heavy';
  }
  var chance_of_rain = obj['currently']['precipProbability'] * 100;
  var windSpeed = obj['currently']['windSpeed'].toFixed(2);
  if(unit == "celsius"){
    windSpeed += " m/s";
  }
  else{
    windSpeed += " mph";
  }
  var dewPoint = obj['currently']['dewPoint'].toFixed(2);
  var humidity = obj['currently']['humidity'] * 100;
  var visibility = Math.round(obj['currently']['visibility']).toFixed(2);
  if(unit == "celsius"){
    visibility += " km";
  }
  else{
    visibility += " mi";
  }
   var sunrise = obj['daily']['data'][0]['sunriseTime'];
   var sunset = obj['daily']['data'][0]['sunsetTime'];
   var riseTime = moment(sunrise * 1000).tz(timezone).format('hh:mm A');
   var setTime = moment(sunset * 1000).tz(timezone).format('hh:mm A');

   $('#curConString').val(current_condition + ", " + temp + "&deg;" + unit);

   var tab_one_left_top_sect_one = "<div class='row' id='left_top'><div class='col-md-6'>" + "\n" + "<img src='" + img_src + "' alt='" + current_condition + "' title='" + current_condition + "' width='130px' height='120px' class='img_icon center-block'></div>";
   var tab_one_left_top_sect_two = "<div class='col-md-6'>" + "\n" + "<span style='color:white;'><h5 class='h5 text-center'>" + current_condition + " in " + city + ", " + state + "</h5></span>" + "<span style='color:white;'><h1 class='h1 text-center'>" + temp + " <sup id='temp_sup'>&deg;" + unit + "</sup>"+ "</h1></span>" + "<h5 class='h5 text-center'><span style='color:blue;'>L: " + minTemp + "&deg;</span> | <span style='color:green;'>H: " + maxTemp + "&deg;</span><input type='button' id='postFB'></input></h5></div></div>";
   var tab_one_table = "<div class='row'><div class='col-md-12' style='padding-right:0px;padding-left:0px;'><table class='table table-striped' id='tableData'>" + 
   "<tr><td>Precipitation</td><td>" + precipitation_text + "</td></tr>" + 
   "<tr><td>Chance of Rain</td><td>" + chance_of_rain + '%' + "</td></tr>" + 
   "<tr><td>Wind Speed</td><td>" + windSpeed + "</td></tr>" + 
   "<tr><td>Dew Point</td><td>" + dewPoint + " &deg;" + unit + "</td></tr>" + 
   "<tr><td>Humidity</td><td>" + humidity + '%' + "</td></tr>" + 
   "<tr><td>Visibility</td><td>" + visibility + "</td></tr>" + 
   "<tr><td>Sunrise</td><td>" + riseTime + "</td></tr>" + 
   "<tr><td>Sunset</td><td>" + setTime + "</td></tr>" + 
   "</table></div></div>";

    var mapData = "<div id='tabMap' class='col-md-6'><div id='map'></div></div>";

   var tab_one = "<div role='tabpanel' class='tab-pane active' id='right-now'>" + "<div id='rightNowTabLeft' class='col-md-6'>" + "\n" + tab_one_left_top_sect_one + tab_one_left_top_sect_two + tab_one_table + "</div>" + mapData + "</div>";

   var hourly_array = obj['hourly']['data'];
   var accordion_string = '<table class="table tableDatatab2 tablehead"><tr><th>Time</th><th>Summary</th><th>Cloud Cover</th><th>Temp (&deg;' + unit + ')</th><th>View Details</th></tr></table><p class="blankp"></p><div class="accordion" id="tab_accordion">';
   for(var i=0;i < 24;i++){
    accordion_string += '<div class="accordion-group">';
    accordion_string += '<div class="accordion-heading">';
    accordion_string += '<table class="table tableDatatab2"><tr><td>' + moment(hourly_array[i]['time'] * 1000).tz(timezone).format('hh:mm A') + '</td><td><img src="' + getImageSource(hourly_array[i]['icon']) + '" alt="' + current_condition + '" title="' + current_condition + '" width="40px" height="40px"></td><td>' + Math.round(hourly_array[i]['cloudCover'] * 100) + '%</td><td>' + hourly_array[i]['temperature'].toFixed(2) + '</td>';
    accordion_string += '<td><a class="accordion-toggle" data-toggle="collapse" data-parent="#tab_accordion" href="#collapse' + i.toString() + '">';
    accordion_string += '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>';
    accordion_string += '</a></td></tr></table>';
    accordion_string += '</div>';
    accordion_string += '<div id="collapse' + i.toString() + '"' + 'class="accordion-body collapse">';
    accordion_string += '<div class="accordion-inner" id="accData">';
    var windSpeed = hourly_array[i]['windSpeed'];
    if(unit == "celsius"){
        windSpeed += "m/s";
    }else{
        windSpeed += "mph";
    }
    var visibility = hourly_array[i]['visibility'];
    if(unit == "celsius"){
        visibility += "km";
    }else{
        visibility += "mi";
    }
    var pressure = hourly_array[i]['pressure'];
    if(unit == "celsius"){
        pressure += "hPa";
    }else{
        pressure += "mb";
    }
    accordion_string += '<table class="table tableDatatab3"><tr><th>Wind</th><th>Humidity</th><th>Visibility</th><th>Pressure</th></tr><tr></table><table class="table tableDatatab4"><tr><td>' + windSpeed + '</td><td>' + Math.round(hourly_array[i]['humidity'] * 100) + '%</td><td>' + visibility + '</td><td>' + pressure + '</td></tr></table>';
    accordion_string += '</div>';
    accordion_string += '</div>';
    accordion_string += '</div>';
  }
  accordion_string += "</div>";
  var tab_two = "<div id='next24hours' role='tabpanel' class='tab-pane'>" + accordion_string + "</div>";

  var modal_string = "";
  var daily_array = obj['daily']['data'];
  modal_string += '<div class="tab3cont col-md-12"><div class="row seven-cols"><div class="tabview">';
  for(var i=1;i < 8;i++){
    modal_string += '<div class="col-md-1 table-curved tabColorClass' + i.toString() + '"><a class="daymodals" href="#myModal' + i.toString() + '" role="button" class="btn" data-toggle="modal">';
    modal_string += '<table class="table-curved"><tr><td>' + moment(daily_array[i]['time'] * 1000).tz(timezone).format('dddd') + '</td></tr><tr><td>' + moment(daily_array[i]['time'] * 1000).tz(timezone).format('MMM DD') + '</td></tr><tr><td>' + '<img width="60px" height="60px" src="' + getImageSource(daily_array[i].icon) + '"></td></tr><tr><td> Min ' + '</td></tr><tr><td>' + 'Temp' + '</td></tr><tr><td><h3><strong style="padding:8px">' + Math.round(daily_array[i].temperatureMin) + '&deg;<strong></h3></td></tr><tr><td> Max ' + '</td></tr><tr><td>' + 'Temp' + '</td></tr><tr><td><h3><strong style="padding:8px">' + Math.round(daily_array[i].temperatureMax) + '&deg;</strong></h3></td></tr></table>' + '</div>';
    modal_string += '</a>'
    modal_string += '<div id="myModal' + i.toString() + '" class="modal fade" role="dialog" aria-hidden="true">';
    modal_string += '<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header">';
    modal_string += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
    modal_string += '<h4>Weather in ' + city + ' on ' + moment(daily_array[i]['time'] * 1000).tz(timezone).format('MMM DD') + '</h4>';
    modal_string += '</div>';
    var windSpeed = daily_array[i]['windSpeed'];
    if(unit == "celsius"){
        windSpeed += "m/s";
    }else{
        windSpeed += "mph";
    }
    var visibility = daily_array[i]['visibility'];
    if(unit == "celsius"){
        visibility += "km";
    }else{
        visibility += "mi";
    }
    var pressure = daily_array[i]['pressure'];
    if(unit == "celsius"){
        pressure += "hPa";
    }else{
        pressure += "mb";
    }
    modal_string += '<div class="modal-body">';
    modal_string += '<p><div class="text-center"><img width="90px" height="90px" src="' + getImageSource(daily_array[i]['icon']) + '"></div><br><div style="margin:0 auto;"><h4 class="text-center">' + moment(daily_array[i]['time'] * 1000).tz(timezone).format('dddd') + ': ' + '<span style="color:#FF9900;">' + daily_array[i]['summary'] + '</span></h4></div><br>';
    modal_string += '<table class="modalTable"><tr><th>Sunrise Time</th><th>Sunset Time</th><th>Humidity</th></tr><tr><td>' + moment(daily_array[i]['sunriseTime'] * 1000).tz(timezone).format('hh:mm A') + '</td><td>' + moment(daily_array[i]['sunsetTime'] * 1000).tz(timezone).format('hh:mm A') + '</td><td>' + Math.round(daily_array[i]['humidity'] * 100) + '%</td></tr>';
    modal_string += '<tr><th>Wind Speed</th><th>Visibility</th><th>Pressure</th></tr><tr><td>' + windSpeed + '</td><td>' + visibility + '</td><td>' + pressure + '</td></tr></table></p>';
    modal_string += '</div>';
    modal_string += '<div class="modal-footer">';
    modal_string += '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>';
    modal_string += '</div></div></div></div>';
  }
  modal_string += '</div></div></div>';
  var tab_three = "<div id='next7days' role='tabpanel' class='tab-pane'>" + modal_string + "</div>";
  var html_string = nav_tabs + "<div class='tab-content'>" + tab_one + tab_two + tab_three + "</div>";
  return html_string;
}

function getMap(lat, lon){
    var lat = lat;
    var lon = lon;
    var zoom = 8;
    var opacity = 0.3;

    var map = new OpenLayers.Map("map", 
    {
        units:'m',
        projection: "EPSG:900913",
        displayProjection: new OpenLayers.Projection("EPSG:4326")
    });

    var mapnik = new OpenLayers.Layer.OSM();

    var layer_cloud = new OpenLayers.Layer.XYZ(
        "clouds",
        "http://${s}.tile.openweathermap.org/map/clouds/${z}/${x}/${y}.png",
        {
            isBaseLayer: false,
            opacity: opacity,
            sphericalMercator: true

        }
    );

    var layer_precipitation = new OpenLayers.Layer.XYZ(
      "precipitation",
      "http://${s}.tile.openweathermap.org/map/precipitation/${z}/${x}/${y}.png",
      {
        isBaseLayer: false,
        opacity: opacity,
        sphericalMercator: true
      }
      );

    var centre = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), 
                                new OpenLayers.Projection("EPSG:900913"));
    map.addLayers([mapnik, layer_cloud, layer_precipitation]);
    map.setCenter( centre, zoom);

    map.events.register("mousemove", map, function (e) {
        var position = map.getLonLatFromViewPortPx(e.xy).transform(new OpenLayers.Projection("EPSG:900913"), 
                                new OpenLayers.Projection("EPSG:4326"));

        $("#mouseposition").html("Lat: " + Math.round(position.lat*100)/100 + " Lon: " + Math.round(position.lon*100)/100 +
            ' zoom: '+ map.getZoom());
    });
  }

  function getImageSource(img_icon){
   var img_src = "";
   switch (img_icon) {
     case "clear-day": 
     img_src = "http://cs-server.usc.edu:45678/hw/hw8/images/clear.png"; 
     break;
     case "clear-night": 
     img_src = "http://cs-server.usc.edu:45678/hw/hw8/images/clear_night.png"; 
     break;
     case "rain": 
     img_src = "http://cs-server.usc.edu:45678/hw/hw8/images/rain.png"; 
     break;
     case "snow": 
     img_src = "http://cs-server.usc.edu:45678/hw/hw8/images/snow.png"; 
     break;
     case "sleet": 
     img_src = "http://cs-server.usc.edu:45678/hw/hw8/images/sleet.png"; 
     break;
     case "wind": 
     img_src = "http://cs-server.usc.edu:45678/hw/hw8/images/wind.png"; 
     break;
     case "fog": 
     img_src = "http://cs-server.usc.edu:45678/hw/hw8/images/fog.png"; 
     break;
     case "cloudy": 
     img_src = "http://cs-server.usc.edu:45678/hw/hw8/images/cloudy.png"; 
     break;
     case "partly-cloudy-day": 
     img_src = "http://cs-server.usc.edu:45678/hw/hw8/images/cloud_day.png"; 
     break;
     case "partly-cloudy-night": 
     img_src = "http://cs-server.usc.edu:45678/hw/hw8/images/cloud_night.png"; 
     break;
   }
   return img_src;
 }
});