import { RequestHelpers, } from '../utils/RequestHelpers';

const argsValidator = locationKey => {
    if (!locationKey) throw new Error('Missing location key');
};

const toCurrentlyWeather = response => {
    const weather = {};

    weather.summary         = response[0].WeatherText;
    weather.icon            = response[0].WeatherIcon;
    weather.temperature     = response[0].Temperature.Metric.Value;
    weather.humidity        = response[0].RelativeHumidity / 100;
    weather.precipIntensity = response[0].PrecipitationSummary.Precipitation.Metric.Value;
    weather.windSpeed       = response[0].Wind.Speed.Metric.Value;
    weather.uvIndex         = response[0].UVIndex;

    return weather;
};

const toHourlyWeather = (response, hours) => {
    const weathers = [];

    for (let i = 0; i < hours; i++) {
        const weather = {};

        weather.time              = response[i].EpochDateTime * 1000;
        weather.icon              = response[i].WeatherIcon;
        weather.temperature       = response[i].Temperature.Value;
        weather.humidity          = response[i].RelativeHumidity / 100;
        weather.precipProbability = response[i].PrecipitationProbability / 100;
        weather.precipIntensity   = response[i].TotalLiquid.Value;
        weather.windSpeed         = response[i].Wind.Speed.Value;
        weather.uvIndex           = response[i].UVIndex;

        weathers.push(weather);
    }

    return weathers;
};

const toDailyWeather = (response, days) => {
    const weathers = [];

    for (let i = 1; i < days + 1; i++) {
        const weather = {};

        weather.time              = response.DailyForecasts[i].EpochDateTime * 1000;
        weather.summary           = response.DailyForecasts[i].Day.LongPhrase;
        weather.icon              = response.DailyForecasts[i].Day.Icon;
        weather.temperatureHigh   = response.DailyForecasts[i].Temperature.Maximum.Value;
        weather.temperatureLow    = response.DailyForecasts[i].Temperature.Minimum.Value;
        weather.precipProbability = response.DailyForecasts[i].Day.PrecipitationProbability / 100;
        weather.precipIntensity   = response.DailyForecasts[i].Day.TotalLiquid.Value;
        weather.windSpeed         = response.DailyForecasts[i].Day.Wind.Speed.Value;

        weathers.push(weather);
    }

    return weathers;
};

const formatLocale = locale => locale.toLowerCase();

const getLocationKey = async (latitude, longitude, apiKey) => (await RequestHelpers.request(
    `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${latitude}%2C${longitude}`,
    () => {
        if (!latitude) throw new Error('Missing latitude');
        if (!longitude) throw new Error('Missing longitude');
    },
)).Key;

const getCurrentlyWeather = async (locationKey, apiKey, locale) => toCurrentlyWeather(await RequestHelpers.request(
    `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true&language=${formatLocale(locale)}`,
    () => argsValidator(locationKey),
));

const getHourlyWeather = async (locationKey, hours, apiKey, locale) => toHourlyWeather(await RequestHelpers.request(
    `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&details=true&metric=true&language=${formatLocale(locale)}`,
    () => argsValidator(locationKey),
), hours);

const getDailyWeather = async (locationKey, days, apiKey, locale) => toDailyWeather(await RequestHelpers.request(
    `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&details=true&metric=true&language=${formatLocale(locale)}`,
    () => argsValidator(locationKey),
), days);

export const AccuWeatherApiClient = {};

AccuWeatherApiClient.getWeather = async (latitude, longitude, days = 4, hours = 12, apiKey = process.env.REACT_APP_ACCU_WEATHER_API_KEY, locale = 'en-US') => {
    const locationKey = await getLocationKey(latitude, longitude, apiKey);
    const currently   = await getCurrentlyWeather(locationKey, apiKey, locale);
    const hourly      = await getHourlyWeather(locationKey, Math.min(12, Math.max(1, hours)), apiKey, locale);
    const daily       = await getDailyWeather(locationKey, Math.min(4, Math.max(1, days)), apiKey, locale);

    return {
        currently,
        hourly,
        daily,
    };
};
