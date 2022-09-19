window.onload = function() {
	let content = document.querySelector(".content"),
			lat = 0, long = 0, query = "", unit = "", api = "",
			forecastApi = "", degreeType = "", newCelciusBtn = "",
			newFahrnBtn = "", windType = "",
			error = document.querySelector("#error"),
			tempUnit = document.querySelector('.tempUnit'),
			logo = document.querySelector(".name"),
			loading = document.querySelector(".loading"),
			daily = document.querySelector(".daily"),
			today = document.querySelector(".today"),
			week = document.querySelector(".week"),
			currentDiv = document.querySelector(".current"),
			location = document.querySelector(".location"),
			currentTemp = document.querySelector(".currentTemp"),
			currentDate = document.querySelector(".currentDate"),
			currentHigh = document.querySelector(".currentHigh"),
			currentLow = document.querySelector(".currentLow"),
			icon = document.querySelector(".icon"),
			feelsLike = document.querySelector(".feelsLike"),
			sunrise = document.querySelector(".riseTime"),
			sunset = document.querySelector(".setTime"),
			windStatus = document.querySelector(".windStatus"),
			humidity = document.querySelector(".humidity"),
			pressure = document.querySelector(".pressure"),
			visibility = document.querySelector(".visibility"),
			search = document.querySelector(".search"),
			searchIcon = document.querySelector("#sIcon");
	
	logo.addEventListener("click", function() {
		window.location.reload();
	});
	
	getLocation();
	
	function getLocation() {
		if (navigator.geolocation ) {
			navigator.geolocation.getCurrentPosition(function (position) {
				lat = position.coords.latitude;
				long = position.coords.longitude;
				var celciusBtn = document.querySelector(".celcius");
				var fahrnBtn = document.querySelector(".fah");

				api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=2b68c5aecd9c2cdfc4368a50bcc2e815&units=imperial`;
				forecastApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=2b68c5aecd9c2cdfc4368a50bcc2e815&units=imperial`;
				degreeType = "°C";
				windType = "mph";

				celciusBtn.style.opacity = 1.0;
				fahrnBtn.style.opacity = 0.5;

				clickDegree(api, forecastApi, celciusBtn, fahrnBtn);

				getWeatherInfo();
				getHourForeCast();

			});
		}
	}

	function returnData() {
		searchInput = search.value;
		let chars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
		
		if (chars.test(searchInput) || searchInput == "") {
			error.style.display = "block"; 
		} else {
			error.style.display = "none"; 
		
			tempUnit.innerHTML = "";
			newCelciusBtn = document.createElement("button");
			newCelciusBtn.classList.add("celcius");
			newCelciusBtn.innerHTML = "°C";
			document.querySelector(".tempUnit").prepend(newCelciusBtn);

			newFahrnBtn = document.createElement("button");
			newFahrnBtn.classList.add("fah");
			newFahrnBtn.innerHTML = "°F";
			tempUnit.append(newFahrnBtn);

			api = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=2b68c5aecd9c2cdfc4368a50bcc2e815&units=imperial`;
			degreeType = "°C";
			windType = "mph";
			newCelciusBtn.style.opacity = 1.0;
			newFahrnBtn.style.opacity = 0.5;

			if (isNaN(searchInput)) {
				fetch(`https://api.myptv.com/geocoding/v1/locations/by-text?searchText=${searchInput}&apiKey=MDY3MmQzYzRjNmJmNGM2NzlkNTFiMTY3MWQ5MDZkYWY6YjNhZGFmMjMtMmU2OC00YmYyLWE1ODItMGRiZmU4NmFjZmU4`)

				.then(function (response) {
					return response.json();
				})
				.then(function (data) {
					console.log(data);
					lat = data.locations[0].referencePosition.latitude;
					long = data.locations[0].referencePosition.longitude;

					forecastApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=2b68c5aecd9c2cdfc4368a50bcc2e815&units=imperial`;

					clickDegree(api, forecastApi, newCelciusBtn, newFahrnBtn);
					getHourForeCast();
				});

			} else {

				api = `https://api.openweathermap.org/data/2.5/weather?zip=${searchInput}&appid=2b68c5aecd9c2cdfc4368a50bcc2e815&units=imperial`;

				fetch(`http://api.zippopotam.us/us/${searchInput}`)
				.then(function (response) {
					return response.json();
				})
				.then(function (data) {

					console.log(data);
					lat = data.places[0].latitude;
					long = data.places[0].longitude;

					forecastApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=2b68c5aecd9c2cdfc4368a50bcc2e815&units=imperial`;
					degreeType = "°C";
					windType = "mph";

					clickDegree(api, forecastApi, newCelciusBtn, newFahrnBtn);
					getHourForeCast();
				});
			}

			getWeatherInfo();
		
		}
	}

	
	searchIcon.addEventListener("click", function() {
		returnData();
	});

	document.addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			returnData();
		}
	});
	

	function getWeatherInfo() {
		
		fetch(api)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			
			searchInput = search.value; 
			if (data.cod != 404 && data.cod != 400) {
				error.style.display = "none"; 
				console.log(data);
				console.log(searchInput);
				loading.style.display = "none";
				content.style.display = "block";
				location.textContent = data.name;
				currentTemp.textContent = Math.round(data.main.temp) + degreeType;
				currentDate.textContent = getCurrentDate();
				currentHigh.textContent = `H: ${Math.round(data.main.temp_max)}${degreeType}`;
				currentLow.textContent = `L: ${Math.round(data.main.temp_min)}${degreeType}`;
				icon.src = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@4x.png';
				feelsLike.textContent = Math.round(data.main.feels_like) + degreeType;
				sunrise.textContent = "Sunrise: " + window.moment(data.sys.sunrise * 1000).format('h:mm a');
				sunset.textContent = "Sunset: " + window.moment(data.sys.sunset * 1000).format('h:mm a');
				windStatus.textContent = data.wind.speed + " " + windType;
				humidity.textContent = data.main.humidity + "%";
				pressure.textContent = data.main.pressure + " mmHg";
				visibility.textContent = data.visibility;
				
			} else {
				error.style.display = "block"; 
				//window.location.reload();
			}
		});
	}
	
	function getHourForeCast() {
		
		fetch(forecastApi)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			if (data.length != 0) {
				console.log(data);
			
				var hourly = document.querySelector(".hourly");
				hourly.innerHTML = " ";

				for (var i = 0; i < 24; i++) {

					var hForDiv = document.createElement("div");
					hForDiv.classList.add("hourlyForecast");
					hourly.append(hForDiv);

					var hourLabel = document.createElement("p");
					hourLabel.classList.add("hour");

					if (i == 0) {
						hourLabel.textContent = "Now";
					} else {
						hourLabel.textContent = window.moment(data.hourly[i].dt * 1000).format('h a');
					}
					hForDiv.append(hourLabel);

					var hourImg = document.createElement("img");
					hourImg.src = `http://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}.png`;
					hForDiv.append(hourImg);

					var hourTemp = document.createElement("p");
					hourTemp.classList.add("hourTemp");
					hourTemp.textContent = Math.round(data.hourly[i].temp) + degreeType;
					hForDiv.append(hourTemp);

				}
			} 
			
		});
	}
	
	function getCurrentDate() {
		var newDate = new Date();
		var date = newDate.getDate();
		var month = newDate.getMonth();
		var day = newDate.getDay();
		
		var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    var months = ["January ", "February ", "March ", "April ", "May ", "June ", "July ", "August ", "September ", "October ", "November ", "December"];
		
		return `${weekday[day]}, ${months[month]} ${date}`;
		
	}

	function displayWeeklyForecast() {
		currentDiv.style.display = "none";
		daily.style.display = "inline-block";
		week.style.textDecoration = "underline";
		week.style.opacity = 1.0;

		today.style.textDecoration = "none";
		today.style.opacity = 0.5;
		getDailyForeCast();
	}

	week.addEventListener("click", function() {
		displayWeeklyForecast();
	});



	today.addEventListener("click", function() {
		daily.style.display = "none";
		currentDiv.style.display = "block";
		today.style.textDecoration = "underline";
		today.style.opacity = 1.0;

		week.style.textDecoration = "none";
		week.style.opacity = 0.5;
	});

	function getDailyForeCast() {
		fetch(forecastApi)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log(data);
			
			daily.innerHTML = " ";
			
			for (var i = 0; i < 8; i++) {
				
				var forecastDiv = document.createElement("div");
				
				forecastDiv.classList.add("dailyForeCast");
				daily.append(forecastDiv);
				
				var dayLabel = document.createElement("p");
				dayLabel.classList.add("day");
				dayLabel.textContent = getDate(data.daily[i].dt);
				forecastDiv.append(dayLabel);

				var imgLabel = document.createElement("p");
				imgLabel.classList.add("imgLabel");
				imgLabel.textContent = data.daily[i].weather[0].description;
				forecastDiv.append(imgLabel);
				
				var dailyImg = document.createElement("img");
				dailyImg.classList.add("dailyImg");
				dailyImg.src = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png`;
				forecastDiv.append(dailyImg);

				var maxTemp = document.createElement("p");
				maxTemp.classList.add("maxTemp");
				maxTemp.textContent = `High: ${Math.round(data.daily[i].temp.max)}${degreeType}`;
				forecastDiv.append(maxTemp);
				
				var minTemp = document.createElement("p");
				minTemp.classList.add("minTemp");
				minTemp.textContent = `Low: ${Math.round(data.daily[i].temp.min)}${degreeType}`;
				forecastDiv.append(minTemp);
				
			}
		
		});
	}

	function getDate(forecastDate) {
		var theDate = new Date(forecastDate * 1000);
		var month = theDate.getMonth();
		var date = theDate.getDate();
		var day = theDate.getDay();
		var i = 0;

		function checkDay(i) {
			if (i + day > 6) {
					return i + day - 7;
			} else {
					return i + day;
			}
		}

		var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    var months = ["January ", "February ", "March ", "April ", "May ", "June ", "July ", "August ", "September ", "October ", "November ", "December"];

		return weekday[checkDay(i)] + ", " + months[month] + " " + date;

	}
	
	function clickDegree(newApi, newForecastApi, celciusBtn, fahrnBtn) {
		celciusBtn.addEventListener("click", function() {		
			api = newApi.replace("metric", "imperial");
			forecastApi = newForecastApi.replace("metric", "imperial");
			degreeType = "°C";
			windType = "mph";

			celciusBtn.style.opacity = 1.0;
			fahrnBtn.style.opacity = 0.5;

			getWeatherInfo();
			getHourForeCast();
			
		});
		
		fahrnBtn.addEventListener("click", function() {	
			api = newApi.replace("imperial", "metric");
			forecastApi = newForecastApi.replace("imperial", "metric");
			degreeType = "°F";
			windType = "m/s";

			fahrnBtn.style.opacity = 1.0;
			celciusBtn.style.opacity = 0.5;
			getWeatherInfo();
			getHourForeCast();
			
		});
	}	
}