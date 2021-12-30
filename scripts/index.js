window.onload = function() {
	let content = document.querySelector(".content"),
			lat = 0, long = 0, query = "", unit = "", api = "",
			hourForeApi = "",
			location = document.querySelector(".location"),
			celciusBtn = document.querySelector(".celcius"),
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
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			lat = position.coords.latitude;
			long = position.coords.longitude;
			
			api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=2b68c5aecd9c2cdfc4368a50bcc2e815&units=imperial`;
			hourForeApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=2b68c5aecd9c2cdfc4368a50bcc2e815&units=imperial`;
			
			
			getWeatherInfo();
			getHourForeCast();
			
		});
	}
	
	searchIcon.addEventListener("click", function() {
		searchInput = search.value;
		
		if (isNaN(searchInput)) {
			api = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=2b68c5aecd9c2cdfc4368a50bcc2e815&units=imperial`;
			
				fetch(`https://api.myptv.com/geocoding/v1/locations/by-text?searchText=${searchInput}&apiKey=MDY3MmQzYzRjNmJmNGM2NzlkNTFiMTY3MWQ5MDZkYWY6YjNhZGFmMjMtMmU2OC00YmYyLWE1ODItMGRiZmU4NmFjZmU4`)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				console.log(data);
				lat = data.locations[0].referencePosition.latitude;
				long = data.locations[0].referencePosition.longitude;
				
				hourForeApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=2b68c5aecd9c2cdfc4368a50bcc2e815&units=imperial`;
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
				
				hourForeApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=2b68c5aecd9c2cdfc4368a50bcc2e815&units=imperial`;
				getHourForeCast()
			});
		}
		
		getWeatherInfo();
	});
	
	
	
	function getWeatherInfo() {
		
		fetch(api)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log(data);
			content.style.display = "block";
			location.textContent = data.name;
			currentTemp.textContent = Math.round(data.main.temp) + "°C";
			currentDate.textContent = getCurrentDate();
			currentHigh.textContent = `H: ${Math.round(data.main.temp_max)}°C`;
			currentLow.textContent = `L: ${Math.round(data.main.temp_min)}°C`;
			icon.src = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@4x.png';
			feelsLike.textContent = data.main.feels_like + "°C";
			sunrise.textContent = window.moment(data.sys.sunrise * 1000).format('h:mm a');
			sunset.textContent = window.moment(data.sys.sunset * 1000).format('h:mm a');
			windStatus.textContent = data.wind.speed + " mph";
			humidity.textContent = data.main.humidity + "%";
			pressure.textContent = data.main.pressure + "mmHg";
			visibility.textContent = data.visibility;

		});
	}
	
	function getHourForeCast() {
		
		fetch(hourForeApi)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log(data);
			
			var hourly = document.querySelector(".hourly");
			hourly.innerHTML = " ";
			
			for (var i = 0; i < 24; i++) {
				
				var hForDiv = document.createElement("div");
				
				hForDiv.classList.add("hourlyForecast");
				hourly.append(hForDiv);
				
				var hourLabel = document.createElement("p");
				hourLabel.classList.add("hour");
				hourLabel.textContent = window.moment(data.hourly[i].dt * 1000).format('h a');
				hForDiv.append(hourLabel);
				
				var hourImg = document.createElement("img");
				hourImg.src = `http://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}.png`;
				hForDiv.append(hourImg);
				
				var hourTemp = document.createElement("p");
				hourTemp.classList.add("hourTemp");
				hourTemp.textContent = Math.round(data.hourly[i].temp) + "°C";
				hForDiv.append(hourTemp);
//				hourLabel.setAttribute("id", `hour${i}`);
//				console.log(hForDiv.className);
				
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
	
	function getHour() {
		
	}
			
}