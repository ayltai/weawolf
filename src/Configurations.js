import { Location, } from './models/Location';
import { Providers, } from './utils/Providers';
import { Units, } from './utils/Units';

export const Configurations = {};

Configurations.APP_NAME    = 'Weawolf';
Configurations.APP_VERSION = '1.0.0';
Configurations.UPDATE_URL  = 'https://raw.githubusercontent.com/ayltai/weawolf/master/package.json';

Configurations.TRAY_ICON_SIZE = process.platform === 'darwin' ? 22 : process.platform === 'win32' ? '16' : '24';

Configurations.FORECAST_HOURS = 8;
Configurations.FORECAST_DAYS  = 4;

Configurations.LOCATION           = new Location(process.env.REACT_APP_WEATHER_LATITUDE || 22.3080, process.env.REACT_APP_WEATHER_LONGITUDE || 113.9185, process.env.REACT_APP_WEATHER_LOCATION || 'Hong Kong International Airport, Sky Plaza Road, Chek Lap Kok');
Configurations.UI_UPDATE_INTERVAL = 1000 * 20;
Configurations.REFRESH_INTERVAL   = 1000 * 60 * 30;
Configurations.IS_AUTO_LAUNCH     = process.env.NODE_ENV !== 'development';
Configurations.IS_MILITARY_TIME   = false;

Configurations.DOCUMENTATION_URL = 'https://github.com/ayltai/weawolf/blob/master/README.md';
Configurations.LICENSE_URL       = 'https://github.com/ayltai/weawolf/blob/master/LICENSE';
Configurations.ISSUES_URL        = 'https://github.com/ayltai/weawolf/issues';

Configurations.PROVIDERS = [
    {
        label : 'Dark Sky',
        value : Providers.DARK_SKY,
    },
    {
        label : 'AccuWeather',
        value : Providers.ACCU_WEATHER,
    },
    {
        label : 'Weatherbit',
        value : Providers.WEATHERBIT,
    },
    {
        label : 'OpenWeatherMap',
        value : Providers.OPEN_WEATHER_MAP,
    },
];

Configurations.REFRESH_INTERVALS = [
    {
        label : '10 minutes',
        value : 1000 * 60 * 10,
    },
    {
        label : '15 minutes',
        value : 1000 * 60 * 15,
    },
    {
        label : '30 minutes',
        value : 1000 * 60 * 30,
    },
    {
        label : '60 minutes',
        value : 1000 * 60 * 60,
    },
];

Configurations.UNITS = [
    {
        label : 'SI (°C, km)',
        value : Units.SI,
    },
    {
        label : 'Imperial (°F, mile)',
        value : Units.IMPERIAL,
    },
];

Configurations.FORECAST = [
    {
        label : 'Temperature, precipitation, humidity',
        value : 'humidity',
    },
    {
        label : 'Temperature, precipitation, wind speed',
        value : 'windSpeed',
    },
    {
        label : 'Temperature, precipitation, UV index',
        value : 'uvIndex',
    },
];

Configurations.LOCALES = [
    {
        label : 'English',
        value : 'en',
    },
    {
        label : '繁體中文',
        value : 'zh-tw',
    },
];

Configurations.createPalette = isDarkMode => ({
    primary   : {
        main  : '#2196f3',
        light : '#2196f3',
        dark  : '#1976d2',
    },
    secondary : {
        main  : '#ff9800',
        light : '#ff9800',
        dark  : '#f57c00',
    },
    info      : {
        main  : '#00bcd4',
        light : '#00bcd4',
        dark  : '#0097a7',
    },
    type      : isDarkMode ? 'dark' : 'light',
});
