import { Providers, } from '../utils/Providers';
import { AccuWeatherApiClient, } from './AccuWeatherApiClient';
import { DarkSkyApiClient, } from './DarkSkyApiClient';
import { OpenWeatherMapApiClient, } from './OpenWeatherMapApiClient';
import { WeatherbitApiClient, } from './WeatherbitApiClient';

export const WeatherApiClient = {};

WeatherApiClient.getWeather = async (provider, latitude, longitude, days, hours, apiKey, locale = 'en-US') => {
    switch (provider) {
        case Providers.ACCU_WEATHER:
            return await AccuWeatherApiClient.getWeather(latitude, longitude, days, hours, apiKey, locale);

        case Providers.DARK_SKY:
            return await DarkSkyApiClient.getWeather(latitude, longitude, days, hours, apiKey, locale);

        case Providers.OPEN_WEATHER_MAP:
            return await OpenWeatherMapApiClient.getWeather(latitude, longitude, days, hours, apiKey, locale);

        case Providers.WEATHERBIT:
            return await WeatherbitApiClient.getWeather(latitude, longitude, days, hours, apiKey, locale);

        default:
            throw new Error(`Unrecognized weather provider ${provider}`);
    }
};
