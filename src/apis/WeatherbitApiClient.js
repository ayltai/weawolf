import { RequestHelpers, } from '../utils/RequestHelpers';

const argsValidator = (latitude, longitude) => {
    if (!latitude) throw new Error('Missing latitude');
    if (!longitude) throw new Error('Missing longitude');
};

const parseResponse = (weather, data) => {
    weather.humidity        = data.rh / 100;
    weather.precipIntensity = data.precip;
    weather.windSpeed       = Math.round(data.wind_spd * 3.6);
    weather.uvIndex         = Math.round(data.uv);
};

const toCurrentlyWeather = response => {
    const weather = {};

    weather.summary     = response.data[0].weather.description;
    weather.icon        = response.data[0].weather.code;
    weather.temperature = response.data[0].temp;

    parseResponse(weather, response.data[0]);

    return weather;
};

const toHourlyWeather = (response, hours) => {
    const weathers = [];

    for (let i = 0; i < hours; i++) {
        const weather = {};

        weather.time              = response.data[i].ts * 1000;
        weather.icon              = response.data[i].weather.code;
        weather.temperature       = response.data[i].temp;
        weather.precipProbability = response.data[i].pop / 100;

        parseResponse(weather, response.data[i]);

        weathers.push(weather);
    }

    return weathers;
};

const toDailyWeather = (response, days) => {
    const weathers = [];

    for (let i = 1; i < days + 1; i++) {
        const weather = {};

        weather.time              = response.data[i].ts * 1000;
        weather.summary           = response.data[i].weather.description;
        weather.icon              = response.data[i].weather.code;
        weather.temperatureHigh   = response.data[i].max_temp;
        weather.temperatureLow    = response.data[i].min_temp;
        weather.precipProbability = response.data[i].pop / 100;

        parseResponse(weather, response.data[i]);

        weathers.push(weather);
    }

    return weathers;
};

const formatLocale = locale => locale.toLowerCase() === 'zh-tw' ? 'zh-tw' : locale.substr(0, 2).toLowerCase();

const getCurrentlyWeather = async (latitude, longitude, apiKey, locale) => toCurrentlyWeather(await RequestHelpers.request(
    `https://api.weatherbit.io/v2.0/current?key=${apiKey}&lat=${latitude}&lon=${longitude}&lang=${formatLocale(locale)}`,
    () => argsValidator(latitude, longitude),
));

const getHourlyWeather = async (latitude, longitude, hours, apiKey, locale) => toHourlyWeather(await RequestHelpers.request(
    `https://api.weatherbit.io/v2.0/forecast/hourly?key=${apiKey}&lat=${latitude}&lon=${longitude}&lang=${formatLocale(locale)}&hours=${hours}`,
    () => argsValidator(latitude, longitude),
), hours);

const getDailyWeather = async (latitude, longitude, days, apiKey, locale) => toDailyWeather(await RequestHelpers.request(
    `https://api.weatherbit.io/v2.0/forecast/daily?key=${apiKey}&lat=${latitude}&lon=${longitude}&lang=${formatLocale(locale)}&days=${days + 1}`,
    () => argsValidator(latitude, longitude),
), days);

export const WeatherbitApiClient = {};

WeatherbitApiClient.getWeather = async (latitude, longitude, days = 15, hours = 120, apiKey = process.env.REACT_APP_WEATHER_BIT_API_KEY, locale = 'en-US') => {
    const currently = await getCurrentlyWeather(latitude, longitude, apiKey, locale);
    const hourly    = await getHourlyWeather(latitude, longitude, Math.min(120, Math.max(1, hours)), apiKey, locale);
    const daily     = await getDailyWeather(latitude, longitude, Math.min(15, Math.max(1, days)), apiKey, locale);

    return {
        currently,
        hourly,
        daily,
    };
};
