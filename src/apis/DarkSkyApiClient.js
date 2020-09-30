import { RequestHelpers, } from '../utils/RequestHelpers';

const parseResponse = (weather, data) => {
    weather.time              = data.time * 1000;
    weather.icon              = data.icon;
    weather.humidity          = data.humidity;
    weather.precipProbability = data.precipProbability;
    weather.precipIntensity   = data.precipIntensity;
    weather.windSpeed         = data.windSpeed;
    weather.uvIndex           = data.uvIndex;
};

const toCurrentlyWeather = response => {
    const weather = {};

    weather.summary         = response.currently.summary;
    weather.icon            = response.currently.icon;
    weather.temperature     = response.currently.temperature;
    weather.humidity        = response.currently.humidity;
    weather.precipIntensity = response.currently.precipIntensity;
    weather.windSpeed       = response.currently.windSpeed;
    weather.uvIndex         = response.currently.uvIndex;

    return weather;
};

const toHourlyWeather = (response, hours) => {
    const weathers = [];

    for (let i = 0; i < hours; i++) {
        const weather = {};

        weather.temperature = response.hourly.data[i].temperature;

        parseResponse(weather, response.hourly.data[i]);

        weathers.push(weather);
    }

    return weathers;
};

const toDailyWeather = (response, days) => {
    const weathers = [];

    for (let i = 1; i < days + 1; i++) {
        const weather = {};

        weather.summary         = response.daily.data[i].summary;
        weather.temperatureHigh = response.daily.data[i].temperatureHigh;
        weather.temperatureLow  = response.daily.data[i].temperatureLow;

        parseResponse(weather, response.daily.data[i]);

        weathers.push(weather);
    }

    return weathers;
};

const formatLocale = locale => locale === 'zh-TW' ? locale : locale.substr(0, 2);

export const DarkSkyApiClient = {};

DarkSkyApiClient.getWeather = async (latitude, longitude, days = 5, hours = 48, apiKey = process.env.REACT_APP_DARK_SKY_API_KEY, locale = 'en-US') => {
    const response = await RequestHelpers.request(
        `https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}?exclude=minutely,alerts,flags&extend=hourly&units=si&lang=${formatLocale(locale)}`,
        () => {
            if (!latitude) throw new Error('Missing latitude');
            if (!longitude) throw new Error('Missing longitude');
        },
    );

    return {
        currently : toCurrentlyWeather(response),
        hourly    : toHourlyWeather(response, Math.min(48, Math.max(1, hours))),
        daily     : toDailyWeather(response, Math.min(6, Math.max(1, days))),
    };
};
