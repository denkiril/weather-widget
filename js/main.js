/* eslint-disable max-len */
const cityCard1 = document.querySelector('#cityCard-1');
const cityCard2 = document.querySelector('#cityCard-2');

const addBtn = document.querySelector('#addBtn');
const updateBtn = document.querySelector('#updateBtn');
const stopBtn = document.querySelector('#stopBtn');
const durInput = document.querySelector('#durInput');
const citiesSelect = document.querySelector('#citiesSelect');
const citiesInput = document.querySelector('#citiesInput');

const weatherImgPath = 'img/';
const wiSun = 'wi-sun.svg';
const wiClouds = 'wi-clouds.svg';
const wiSunRain = 'wi-sun-rain.svg';
// const wiSunSnow = 'wi-sun-snow.svg';
const wiCloudsRain = 'wi-clouds-rain.svg';
const wiCloudsSnow = 'wi-clouds-snow.svg';

let weatherDataArr = [];
let citiesIds = [472757, 2013348];
let counter = 0; let showDur = 4600; let
  timerId;
// const cloudyPercent = 30;

const cityList = [
  {
    id: 472757,
    name: 'Волгоград',
  },
  {
    id: 2013348,
    name: 'Владивосток',
  },
  {
    id: 515012,
    name: 'Орёл',
  },
  {
    id: 524901,
    name: 'Москва',
  },
  {
    id: 498817,
    name: 'Санкт-Петербург',
  },
  {
    id: 1496747,
    name: 'Новосибирск',
  },
  {
    id: 1486209,
    name: 'Екатеринбург',
  },
  {
    id: 520555,
    name: 'Нижний Новгород',
  },
  {
    id: 551487,
    name: 'Казань',
  },
  {
    id: 1508291,
    name: 'Челябинск',
  },
];

// const apiData = {
//     "coord":{"lon":145.77,"lat":-16.92},
//     "weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],
//     "base":"stations",
//     "main":{"temp":300.5,"pressure":1007,"humidity":74,"temp_min":300.15,"temp_max":300.15},
//     "visibility":10000,
//     "wind":{"speed":3.6,"deg":160},
//     "clouds":{"all":20},
//     "dt":1485790200,
//     "sys":{"type":1,"id":8166,"message":0.2064,"country":"AU","sunrise":1485720272,"sunset":1485766550},
//     "id":2172797,
//     "name":"Cairns",
//     "cod":200
// };

function pushWeatherData(apiData) {
  if (!apiData) {
    return;
  }

  const weatherData = {
    name: (apiData.name) ? apiData.name : '',
    temp: null,
    tempSign: '',
    showTemp: false,
    humidity: null,
    windSpeed: null,
    pressure: null,
    icon: null,
  };

  if (apiData.id) {
    // console.log('apiData.id='+apiData.id);
    const cityListItem = cityList.find((item) => item.id === apiData.id);
    if (cityListItem) {
      weatherData.name = cityListItem.name;
    }
  }

  if (apiData.main) {
    weatherData.temp = (apiData.main.temp) ? Math.abs(Math.round(apiData.main.temp)) : '';
    weatherData.humidity = (apiData.main.humidity) ? `${Math.round(apiData.main.humidity)}%` : '';
    weatherData.pressure = (apiData.main.pressure) ? `${Math.round(apiData.main.pressure)} мм рт.ст.` : '';
    // weatherData.humidity = weatherData.humidity.toString().replace(/\./,',');
  }

  if (apiData.wind) {
    weatherData.windSpeed = (apiData.wind.speed) ? `${Math.round(apiData.wind.speed)} м/с` : '';
    // weatherData.windSpeed = weatherData.windSpeed.toString().replace(/\./,',');
  }

  if (typeof weatherData.temp === 'number') {
    if (weatherData.temp > 0) {
      weatherData.tempSign = '+';
    } else if (weatherData.temp < 0) {
      weatherData.tempSign = '-';
    }
    weatherData.showTemp = true;
    // weatherData.temp = weatherData.temp.toString().replace(/\./,',');
  }

  let weatherImgSrc; let
    weatherImgAlt;
  if (apiData.weather[0]) {
    const weather = apiData.weather[0];
    if (weather.icon) {
      weatherData.icon = weather.icon.substring(0, 2);
    }
    if (weather.description) {
      weatherImgAlt = weather.description;
    }
  }

  switch (weatherData.icon) {
    case '01':
      weatherImgSrc = wiSun;
      break;
    case '02':
    case '03':
    case '04':
    case '50':
      weatherImgSrc = wiClouds;
      break;
    case '09':
    case '11':
      weatherImgSrc = wiCloudsRain;
      break;
    case '10':
      weatherImgSrc = wiSunRain;
      break;
    case '13':
      weatherImgSrc = wiCloudsSnow;
      break;

    default:
      break;
  }
  // if (apiData.clouds != undefined && apiData.clouds.all != undefined) {
  //     cloudy = apiData.clouds.all > cloudyPercent;
  // }
  // if (apiData.rain) {
  //     weatherImgSrc = (cloudy) ? wiCloudsRain : wiSunRain;
  //     weatherImgAlt = (cloudy) ? 'Clouds Rain' : 'Sun Rain';
  // } else if (apiData.snow) {
  //     weatherImgSrc = (cloudy) ? wiCloudsSnow : wiSunSnow;
  //     weatherImgAlt = (cloudy) ? 'Clouds Snow' : 'Sun Snow';
  // } else {
  //     weatherImgSrc = (cloudy) ? wiClouds : wiSun;
  //     weatherImgAlt = (cloudy) ? 'Clouds' : 'Sun';
  // }

  weatherData.imgSrc = (weatherImgSrc) ? weatherImgPath + weatherImgSrc : '';
  weatherData.imgAlt = weatherImgAlt;

  weatherDataArr.push(weatherData);
}

async function loadWeatherDataBiID(id) {
  const url = `https://api.openweathermap.org/data/2.5/weather?APPID=6efd3552dfd6752694c0febc0bb90f73&units=metric&lang=ru&id=${id}`;
  let apiData;

  const response = await fetch(url);
  // console.log(response);
  if (response.ok) {
    apiData = await response.json();
    // console.log(apiData);
  }

  return apiData;
}

async function loadWeatherData() {
  weatherDataArr = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const id of citiesIds) {
    // eslint-disable-next-line no-await-in-loop
    const apiData = await loadWeatherDataBiID(id);
    if (apiData) {
      pushWeatherData(apiData);
    }
  }
  // console.log('len='+weatherDataArr.length);
}

function getWeatherData() {
  const data = weatherDataArr[counter];
  // eslint-disable-next-line no-plusplus
  if (++counter >= weatherDataArr.length) {
    counter = 0;
  }

  return data;
}

function renderWidget(weatherData, cityCard, imgName) {
  const cityNameEl = cityCard.querySelector('.cityName');
  const tempIndicatorEl = cityCard.querySelector('.tempIndicator');
  const tempSignEl = cityCard.querySelector('.tempSign');
  const tempValueEl = cityCard.querySelector('.tempValue');
  const weatherImgEl = cityCard.querySelector('.weatherImg');
  const humidityEl = cityCard.querySelector('.humidity');
  const windSpeedEl = cityCard.querySelector('.windSpeed');
  const pressureEl = cityCard.querySelector('.pressure');

  if (weatherData.showTemp) {
    tempIndicatorEl.classList.remove('hide');
  } else {
    tempIndicatorEl.classList.add('hide');
  }

  cityNameEl.innerHTML = weatherData.name;
  tempSignEl.innerHTML = weatherData.tempSign;
  tempValueEl.innerHTML = weatherData.temp;
  humidityEl.innerHTML = weatherData.humidity;
  windSpeedEl.innerHTML = weatherData.windSpeed;
  pressureEl.innerHTML = weatherData.pressure;

  if (imgName) {
    weatherImgEl.setAttribute('src', weatherImgPath + imgName);
  } else {
    weatherImgEl.setAttribute('src', weatherData.imgSrc);
  }
  weatherImgEl.setAttribute('alt', weatherData.imgAlt);
  weatherImgEl.setAttribute('title', weatherData.imgAlt);
}

function renderWeatherData() {
  const weatherData = getWeatherData();

  renderWidget(weatherData, cityCard1);
  renderWidget(weatherData, cityCard2, wiSunRain);
}

function fadeoutWidget(fadeout = true, cityCard) {
  const cityNameEl = cityCard.querySelector('.cityName');
  const tempIndicatorEl = cityCard.querySelector('.tempIndicator');
  const humidityEl = cityCard.querySelector('.humidity');
  const windSpeedEl = cityCard.querySelector('.windSpeed');
  const pressureEl = cityCard.querySelector('.pressure');
  const weatherImgEl = cityCard.querySelector('.weatherImg');

  if (fadeout) {
    cityNameEl.classList.add('fadeoutUp');
    tempIndicatorEl.classList.add('fadeout');
    humidityEl.classList.add('fadeoutDown3');
    windSpeedEl.classList.add('fadeoutDown2');
    pressureEl.classList.add('fadeoutDown1');
    weatherImgEl.classList.add('fadeoutInst');
  } else {
    cityNameEl.classList.remove('fadeoutUp');
    tempIndicatorEl.classList.remove('fadeout');
    humidityEl.classList.remove('fadeoutDown3');
    windSpeedEl.classList.remove('fadeoutDown2');
    pressureEl.classList.remove('fadeoutDown1');
    weatherImgEl.classList.remove('fadeoutInst');
  }
}

function fadeoutWeatherData(fadeout = true) {
  fadeoutWidget(fadeout, cityCard1);
  fadeoutWidget(fadeout, cityCard2);
}

function updateWeatherData() {
  fadeoutWeatherData();

  setTimeout(() => {
    renderWeatherData();
    fadeoutWeatherData(false);
  }, 800);
}

async function updateWidget() {
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(durInput.value)) {
    showDur = durInput.value;
  }
  if (citiesInput.value) {
    let citiesInputStr = citiesInput.value;
    citiesInputStr = citiesInputStr.replace(' ', '');
    citiesIds = citiesInputStr.split(',');
  }

  counter = 0;
  clearInterval(timerId);
  await loadWeatherData();
  renderWeatherData();
  timerId = setInterval(updateWeatherData, showDur);
}

// controls
durInput.value = showDur;
citiesInput.value = citiesIds.join();

updateBtn.addEventListener('click', updateWidget);

stopBtn.addEventListener('click', () => { clearInterval(timerId); });

addBtn.addEventListener('click', () => {
  const optionStr = citiesSelect.options[citiesSelect.selectedIndex].id;
  let citiesInputStr = citiesInput.value;
  if (citiesInputStr) {
    citiesInputStr += `,${optionStr}`;
  } else {
    citiesInputStr = optionStr;
  }

  citiesInput.value = citiesInputStr;
});

function renderControls() {
  let options = '';
  cityList.forEach((item) => {
    options += `<option id="${item.id}">${item.name} (${item.id})</option>`;
  });
  citiesSelect.insertAdjacentHTML('beforeend', options);
}

// main
updateWidget();
renderControls();
