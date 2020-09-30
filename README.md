# Weawolf

[![GitHub workflow status](https://img.shields.io/github/workflow/status/ayltai/weawolf/CI?style=flat)](https://github.com/ayltai/weawolf/actions)
[![Code Coverage](https://img.shields.io/codecov/c/github/ayltai/weawolf.svg?style=flat)](https://codecov.io/gh/ayltai/weawolf)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ayltai_weawolf&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=ayltai_weawolf)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=ayltai_weawolf&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=ayltai_weawolf)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ayltai_weawolf&metric=security_rating)](https://sonarcloud.io/dashboard?id=ayltai_weawolf)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ayltai_weawolf&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=ayltai_weawolf)
![Maintenance](https://img.shields.io/maintenance/yes/2020)
[![Release](https://img.shields.io/github/release/ayltai/weawolf.svg?style=flat)](https://github.com/ayltai/weawolf/releases)
[![License](https://img.shields.io/github/license/ayltai/weawolf.svg?style=flat)](https://github.com/ayltai/weawolf/blob/master/LICENSE)

A gorgeous weather app for your Mac, Linux, and Windows.

[![Buy me a coffee](https://img.shields.io/static/v1?label=Buy%20me%20a&message=coffee&color=important&style=for-the-badge&logo=buy-me-a-coffee&logoColor=white)](https://buymeacoff.ee/ayltai)

## Features
* Beautiful and easy to use weather app
* Supports [multiple](#weather-providers) weather providers
* Customizable weather locations
* Provides only the information that matters - temperature, humidity, precipitation, wind speed and UV index
* Hourly and daily forecast
* Auto reload data and background image
* Supports Celsius and Fahrenheit and different measurement units
* ... and more. Check out the screenshots below!

## Weather providers
* [AccuWeather](https://www.accuweather.com)
* [Dark Sky](https://darksky.net)
* [OpenWeatherMap](https://openweathermap.org)
* [Weatherbit](https://www.weatherbit.io)

## Screenshots

#### macOS

![macOS](design/screenshot-mac.png)

#### Ubuntu

![Ubuntu](design/screenshot-linux.png)

#### Windows

![Windows](design/screenshot-win.png)

#### Light theme

![Light mode](design/screenshot-mac-light.png)

#### Settings
 
![Settings](design/screenshot-settings-1.png)

![More settings](design/screenshot-settings-2.png)

## Installation packages

| OS      | Download URL                                                          |
|---------|-----------------------------------------------------------------------|
| macOS   | https://github.com/ayltai/weawolf/suites/872277729/artifacts/10155420 |
| Linux   | https://github.com/ayltai/weawolf/suites/872277729/artifacts/10155419 |
| Windows | https://github.com/ayltai/weawolf/suites/872277729/artifacts/10155421 |

## Development

### Installation
1. Install [NodeJS](https://nodejs.org)
2. Install dependencies
   ```shell script
   npm i
   ```

### Configurations

#### AccuWeather API
1. Get an API key from [AccuWeather](https://developer.accuweather.com/)
2. Specify the API key for using AccuWeather:
   ```shell script
   export REACT_APP_ACCU_WEATHER_API_KEY=XXXXX
   ```

#### Dark Sky API
1. <del>Get an API key from [Dark Sky](https://darksky.net/dev) </del> (Dark Sky is no longer accepting new signups)
2. Specify the API key for using Dark Sky:
   ```shell script
   export REACT_APP_DARK_SKY_API_KEY=XXXXX
   ```

#### OpenWeatherMap API
1. Get an API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Specify the API key for using OpenWeatherMap:
   ```shell script
   export REACT_APP_OPEN_WEATHER_MAP_API_KEY=xxxxx
   ```

#### Weatherbit API
1. Get an API key from [Weatherbit](https://www.weatherbit.io/api)
2. Specify the API key for using Weatherbit:
   ```shell script
   export REACT_APP_WEATHER_BIT_API_KEY=XXXXX
   ```

#### Google Maps JavaScript API
1. Go to [Google Cloud Platform Console](https://developers.google.com/maps/documentation/javascript/get-api-key) to get an API key
2. Restrict your API key to the following APIs:
   * Geocoding API
   * Maps JavaScript API
   * Places API
3. Specify the API key for using Google Maps JavaScript APIs:
   ```shell script
   export REACT_APP_GOOGLE_MAPS_API_KEY=xxxxx
   ```
#### Unsplash API
Specify the URL of your Unsplash API proxy:
```shell script
export REACT_APP_UNSPLASH_API_ENDPOINT=https://unsplash-api-proxy.appspot.com
```

### How to run in development environment
```shell script
npm run electron
```

### How to create a production build
```shell script
npm run build
```

### How to create installation packages

For macOS:
```shell script
npm run package:mac
```

For Linux:
```shell script
npm run package:nix
```

For Windows:
```shell script
npm run package:win
```

## License
This project is licensed under the terms of the [MIT license](https://github.com/ayltai/weawolf/blob/LICENSE).
