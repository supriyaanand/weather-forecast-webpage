$(document).ready(function(){
 $('form#form-collect').on('submit' , function(e){
   e.preventDefault();
   form = document.forms[0]
   var valid = getForecast(form);
   if (valid) {
    $.ajax({ 
     url:  'http://localhost/forecast.php?',
     data: {  address: form.address.value,  
      city:  form.city.value,
      state: form.state.value,
      degree: form.degree.value 
    },
    type: 'GET',
    success: function(output)  {
                     // parse the   data  here
                     var html_display = drawDisplay(output, form.city.value, form.state.value, form.degree.value);
                     $('#results').html(html_display);
                     getMap();
                   },
                   error:   function(){
                    alert('got something oopsie');
                  }
                });
  }
});

 (function() {

  Date.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  Date.longMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  Date.shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  Date.longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

          // defining patterns
          var replaceChars = {
              // Day
              d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
              D: function() { return Date.shortDays[this.getDay()]; },
              j: function() { return this.getDate(); },
              l: function() { return Date.longDays[this.getDay()]; },
              N: function() { return (this.getDay() == 0 ? 7 : this.getDay()); },
              S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
              w: function() { return this.getDay(); },
              z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
              // Week
              W: function() {
                var target = new Date(this.valueOf());
                var dayNr = (this.getDay() + 6) % 7;
                target.setDate(target.getDate() - dayNr + 3);
                var firstThursday = target.valueOf();
                target.setMonth(0, 1);
                if (target.getDay() !== 4) {
                  target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
                }
                return 1 + Math.ceil((firstThursday - target) / 604800000);
              },
              // Month
              F: function() { return Date.longMonths[this.getMonth()]; },
              m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
              M: function() { return Date.shortMonths[this.getMonth()]; },
              n: function() { return this.getMonth() + 1; },
              t: function() {
                var year = this.getFullYear(), nextMonth = this.getMonth() + 1;
                if (nextMonth === 12) {
                  year = year++;
                  nextMonth = 0;
                }
                return new Date(year, nextMonth, 0).getDate();
              },
              // Year
              L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },   // Fixed now
              o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
              Y: function() { return this.getFullYear(); },
              y: function() { return ('' + this.getFullYear()).substr(2); },
              // Time
              a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
              A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
              B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
              g: function() { return this.getHours() % 12 || 12; },
              G: function() { return this.getHours(); },
              h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
              H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
              i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
              s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
              u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ?
                '0' : '')) + m; },
              // Timezone
              e: function() { return /\((.*)\)/.exec(new Date().toString())[1]; },
              I: function() {
                  // var DST = null;
                  //     for (var i = 0; i < 12; ++i) {
                  //             var d = new Date(this.getFullYear(), i, 1);
                  //             var offset = d.getTimezoneOffset();

                  //             if (DST === null) DST = offset;
                  //             else if (offset < DST) { DST = offset; break; }                     
                  //             else if (offset > DST) break;
                  //     }
                  //     return (this.getTimezoneOffset() == DST) | 0;
                  var day;
                  var weekday = new Array(7);
                  weekday[0]=  "Sunday";
                  weekday[1] = "Monday";
                  weekday[2] = "Tuesday";
                  weekday[3] = "Wednesday";
                  weekday[4] = "Thursday";
                  weekday[5] = "Friday";
                  weekday[6] = "Saturday";
                  return weekday[this.getDay()];
                },
                O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
              P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now
              T: function() { return this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); },
              Z: function() { return -this.getTimezoneOffset() * 60; },
              // Full Date/Time
              c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
              r: function() { return this.toString(); },
              U: function() { return this.getTime() / 1000; }
            };

          // Simulates PHP's date function
          Date.prototype.format = function(format) {
            var date = this;
            return format.replace(/(\\?)(.)/g, function(_, esc, chr) {
              return (esc === '' && replaceChars[chr]) ? replaceChars[chr].call(date) : chr;
            });
          };

        }).call(this);
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

 function drawDisplay(response, city, state, degree){
   var obj = JSON.parse(response);
   var current_condition = obj['currently']['summary'];
   var nav_tabs = "<ul class='nav nav-tabs' role='tablist'><li role='presentation' class='active'><a href='#right-now' data-toggle='tab'>Right Now</a></li><li role='presentation'><a href='#next24hours' data-toggle='tab'>Next 24 Hours</a></li><li role='presentation'><a href='#next7days' data-toggle='tab'>Next 7 Days</a></li></ul>"
   var img_icon = obj['currently']['icon'];
   var img_src = getImageSource(img_icon);
   var unit;
   if(degree == "celcius"){
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
  var windSpeed = Math.round(obj['currently']['windSpeed']);
  var dewPoint = Math.round(obj['currently']['dewPoint']);
  var humidity = obj['currently']['humidity'] * 100;
  var visibility = Math.round(obj['currently']['visibility']);
   //date_default_timezone_set('America/Los_Angeles');
   var sunrise = obj['daily']['data'][0]['sunriseTime'];
   var sunset = obj['daily']['data'][0]['sunsetTime'];
   var riseTime = new Date(sunrise * 1000).format('h:i A');
   var setTime = new Date(sunset * 1000).format('h:i A');

   var tab_one_left_top_sect_one = "<div class='row' id='left_top'><div class='col-md-6'>" + "\n" + "<img src='" + img_src + "' alt='" + current_condition + "' title='" + current_condition + "' width='130px' height='120px' class='img_icon center-block'></div>";
   var tab_one_left_top_sect_two = "<div class='col-md-6'>" + "\n" + "<span style='color:white;'><h5 class='h5 text-center'>" + current_condition + " in " + city + ", " + state + "</h5></span>" + "<span style='color:white;'><h1 class='h1 text-center'>" + temp + " <sup id='temp_sup'>&deg;" + unit + "</sup>"+ "</h1></span>" + "<h5 class='h5 text-center'><span style='color:blue;'>L: " + minTemp + "&deg;</span> | <span style='color:green;'>H: " + maxTemp + "&deg;</span></h5></div></div>";
   var tab_one_table = "<div class='row'><div class='col-md-12' style='padding-right:0px;padding-left:0px;'><table class='table table-striped' id='tableData'>" + 
   "<tr><td>Precipitation</td><td>" + precipitation_text + "</td></tr>" + 
   "<tr><td>Chance of Rain</td><td>" + chance_of_rain + '%' + "</td></tr>" + 
   "<tr><td>Wind Speed</td><td>" + windSpeed + ' mph' + "</td></tr>" + 
   "<tr><td>Dew Point</td><td>" + dewPoint + " &deg;" + unit + "</td></tr>" + 
   "<tr><td>Humidity</td><td>" + humidity + '%' + "</td></tr>" + 
   "<tr><td>Visibility</td><td>" + visibility + ' mi' + "</td></tr>" + 
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
    accordion_string += '<table class="table tableDatatab2"><tr><td>' + new Date(hourly_array[i]['time'] * 1000).format('h:i A') + '</td><td><img src="' + getImageSource(hourly_array[i]['icon']) + '" alt="' + current_condition + '" title="' + current_condition + '" width="40px" height="40px"></td><td>' + Math.round(hourly_array[i]['cloudCover'] * 100) + '%</td><td>' + hourly_array[i]['temperature'] + '</td>';
    accordion_string += '<td><a class="accordion-toggle" data-toggle="collapse" data-parent="#tab_accordion" href="#collapse' + i.toString() + '">';
    accordion_string += '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>';
    accordion_string += '</a></td></tr></table>';
    accordion_string += '</div>';
    accordion_string += '<div id="collapse' + i.toString() + '"' + 'class="accordion-body collapse">';
    accordion_string += '<div class="accordion-inner" id="accData">';
    accordion_string += '<table class="table tableDatatab3"><tr><th>Wind</th><th>Humidity</th><th>Visibility</th><th>Pressure</th></tr><tr></table><table class="table tableDatatab4"><tr><td>' + hourly_array[i]['windSpeed'] + '</td><td>' + Math.round(hourly_array[i]['humidity'] * 100) + '%</td><td>' + hourly_array[i]['visibility'] + '</td><td>' + hourly_array[i]['pressure'] + '</td></tr></table>';
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
    modal_string += '<table class="table-curved"><tr><td>' + new Date(daily_array[i]['time'] * 1000).format('I') + '</td></tr><tr><td>' + new Date(daily_array[i]['time'] * 1000).format('M d') + '</td></tr><tr><td>' + '<img width="60px" height="60px" src="' + getImageSource(daily_array[i].icon) + '"></td></tr><tr><td> Min ' + '</td></tr><tr><td>' + 'Temp' + '</td></tr><tr><td><h4>' + daily_array[i].temperatureMin + '</h4></td></tr><tr><td> Max ' + '</td></tr><tr><td>' + 'Temp' + '</td></tr><tr><td><h4>' + daily_array[i].temperatureMax + '</h4></td></tr></table>' + '</div>';
    modal_string += '</a>'
    modal_string += '<div id="myModal' + i.toString() + '" class="modal fade" role="dialog" aria-hidden="true">';
    modal_string += '<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header">';
    modal_string += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
    modal_string += '<h4>Weather in ' + city + ' on ' + new Date(daily_array[i]['time'] * 1000).format('M d') + '</h4>';
    modal_string += '</div>';
    modal_string += '<div class="modal-body">';
    modal_string += '<p><div class="text-center"><img width="80px" height="80px" src="' + getImageSource(daily_array[i]['icon']) + '"></div><br><div style="margin:0 auto;"><h3 class="text-center">' + new Date(daily_array[i]['time'] * 1000).format('I') + ': ' + daily_array[i]['summary'] + '</h3><br>';
    modal_string += '<table class="modalTable"><tr><th>Sunrise Time</th><th>Sunset Time</th><th>Humidity</th></tr><tr><td>' + new Date(daily_array[i]['sunriseTime'] * 1000).format('H:i A') + '</td><td>' + new Date(daily_array[i]['sunsetTime'] * 1000).format('H:i A') + '</td><td>' + Math.round(daily_array[i]['humidity']) + '%</td></tr>';
    modal_string += '<tr><th>Wind Speed</th><th>Visibility</th><th>Pressure</th></tr><tr><td>' + daily_array[i]['windSpeed'] + '</td><td>' + daily_array[i]['visibility'] + '</td><td>' + daily_array[i]['pressure'] + '</td></tr></table></div></p>';
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

$('a[data-toggle="tab"]').on('click', function (e) {
 var target = $(this.target).attr('href').tab('show');
});

function getMap(){
    var lat = 34.027696; 
    var lon = -118.287324;
    var lonlat = new OpenLayers.LonLat(lon, lat);
    var map = new OpenLayers.Map("map");
    var mapnik = new OpenLayers.Layer.OSM();
    var layer_cloud = new OpenLayers.Layer.XYZ(
      "clouds",
      "http://${s}.tile.openweathermap.org/map/clouds/${z}/${x}/${y}.png",
      {
        isBaseLayer: false,
        opacity: 0.7,
        sphericalMercator: true
      }
      );

    var layer_precipitation = new OpenLayers.Layer.XYZ(
      "precipitation",
      "http://${s}.tile.openweathermap.org/map/precipitation/${z}/${x}/${y}.png",
      {
        isBaseLayer: false,
        opacity: 0.7,
        sphericalMercator: true
      }
      );
    map.addLayers([mapnik, layer_precipitation, layer_cloud]);
    map.setCenter(lonlat, 5);
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