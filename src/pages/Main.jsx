import { Divider, Grid, useTheme, } from '@material-ui/core';
import { InfoOutlined, Refresh, Settings, } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import moment from 'moment';
import path from 'path';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation, } from 'react-i18next';
import { withRouter, } from 'react-router-dom';

import { UnsplashApiClient, } from '../apis/UnsplashApiClient';
import { WeatherApiClient, } from '../apis/WeatherApiClient';
import { Button, } from '../components/Button';
import { Timestamp, } from '../components/Timestamp';
import { WeatherCurrently, } from '../components/WeatherCurrently';
import { WeatherDaily, } from '../components/WeatherDaily';
import { WeatherHourly, } from '../components/WeatherHourly';
import { useInterval, } from '../hooks/useInterval';
import { Preferences, } from '../models/Preferences';
import { DateTimeHelpers, } from '../utils/DateTimeHelpers';
import { ErrorHelpers, } from '../utils/ErrorHelpers';
import { Providers, } from '../utils/Providers';
import { Units, } from '../utils/Units';
import { WeatherHelpers, } from '../utils/WeatherHelpers';
import { Configurations, } from '../Configurations';

const shouldRefresh = () => {
    const preferences = Preferences.load();
    return (Date.now() - preferences.lastRefreshTime > preferences.refreshInterval) || !preferences.weather || !preferences.backgroundImageUrl;
};

const refresh = () => {
    if (shouldRefresh()) window.require('electron').remote.getCurrentWindow().reload();
};

const createDummyCurrentWeather = () => (
    <Skeleton
        width={window.innerWidth}
        height={window.innerWidth / 2}
        variant='rect'
        animation='wave' />
);

const createDummyWeatherChart = () => (
    <Skeleton
        width={window.innerWidth}
        height={window.innerWidth / 2}
        variant='rect'
        animation='wave' />
);

const createDummyDailyWeathers = count => {
    const dailyWeathers = [];
    for (let i = 0; i < count; i++) dailyWeathers.push(
        <Grid
            key={i}
            item>
            <Skeleton
                variant='text'
                animation='wave' />
            <Skeleton
                variant='text'
                animation='wave' />
            <Skeleton
                width={48}
                height={48}
                variant='circle'
                animation='wave' />
            <Skeleton
                variant='text'
                animation='wave' />
            <Skeleton
                variant='text'
                animation='wave' />
            <Skeleton
                variant='text'
                animation='wave' />
            <Skeleton
                variant='text'
                animation='wave' />
            <Skeleton
                variant='text'
                animation='wave' />
            <Skeleton
                variant='text'
                animation='wave' />
        </Grid>
    );

    return dailyWeathers;
};

const Page = ({ history, }) => {
    const [ state, setState, ] = React.useState({
        weather                         : {},
        backgroundImageUrl              : '',
        backgroundImageAuthor           : '',
        backgroundImageAuthorProfileUrl : '',
    });

    const theme  = useTheme();
    const { t, } = useTranslation();

    const createTrayIcon = (temperature, icon) => {
        const scale = window.devicePixelRatio;
        const size  = Configurations.TRAY_ICON_SIZE;

        const canvas = document.createElement('canvas');
        canvas.width  = size * scale;
        canvas.height = size * scale;

        const context = canvas.getContext('2d');
        const image   = new Image(size, size);

        image.onload = () => {
            context.scale(scale, scale);
            context.drawImage(image, 0, 0, size * scale, size * scale, 0, 0, size, size);

            window.require('electron').ipcRenderer.send('refresh', {
                temperature,
                icon : canvas.toDataURL(),
            });
        };

        image.src = process.env.NODE_ENV === 'development' ? path.join(__dirname, '..', 'img', Preferences.load().isDarkMode ? 'dark' : 'light', icon) : require('url').format({
            pathname : path.join(window.require('electron').remote.getGlobal('APP_DIR'), 'build', 'img', Preferences.load().isDarkMode ? 'dark' : 'light', icon),
            protocol : 'file:',
            slashes  : true,
        });
    };

    React.useMemo(() => {
        const pref = Preferences.load();
        const loc  = pref.selectedLocation;

        const getApiKey = provider => {
            if (provider === Providers.ACCU_WEATHER) return process.env.REACT_APP_ACCU_WEATHER_API_KEY;
            if (provider === Providers.DARK_SKY) return process.env.REACT_APP_DARK_SKY_API_KEY;
            if (provider === Providers.OPEN_WEATHER_MAP) return process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY;
            if (provider === Providers.WEATHERBIT) return process.env.REACT_APP_WEATHER_BIT_API_KEY;

            return undefined;
        };

        if (shouldRefresh()) {
            WeatherApiClient.getWeather(pref.provider, loc.latitude, loc.longitude, Configurations.FORECAST_DAYS, Configurations.FORECAST_HOURS, getApiKey(pref.provider), pref.locale)
                .then(weather => {
                    UnsplashApiClient.getRandomPhoto(`${DateTimeHelpers.getPartOfDay()} ${weather.currently.icon}`, window.innerWidth * 2, window.innerWidth)
                        .then(response => {
                            pref.lastRefreshTime                 = Date.now();
                            pref.weather                         = weather;
                            pref.backgroundImageUrl              = response.urls.regular;
                            pref.backgroundImageAuthor           = response.user.name;
                            pref.backgroundImageAuthorProfileUrl = response.user.links.html;
                            pref.save();

                            createTrayIcon(`${Units.toTemperature(weather.currently.temperature, pref.unit, 0)}`, `${WeatherHelpers.toIcon(pref.provider, weather.currently.icon)}.svg`);

                            setState({
                                weather                         : weather,
                                backgroundImageUrl              : response.urls.regular,
                                backgroundImageAuthor           : response.user.name,
                                backgroundImageAuthorProfileUrl : response.user.links.html,
                            });
                        })
                        .catch(ErrorHelpers.handle);
                })
                .catch(ErrorHelpers.handle);
        } else {
            createTrayIcon(`${Units.toTemperature(pref.weather.currently.temperature, pref.unit, 0)}`, `${WeatherHelpers.toIcon(pref.provider, pref.weather.currently.icon)}.svg`);

            setState({
                weather                         : pref.weather,
                backgroundImageUrl              : pref.backgroundImageUrl,
                backgroundImageAuthor           : pref.backgroundImageAuthor,
                backgroundImageAuthorProfileUrl : pref.backgroundImageAuthorProfileUrl,
            });
        }
    }, []);

    useInterval(refresh, Configurations.UI_UPDATE_INTERVAL);

    const preferences = Preferences.load();

    const dailyWeathers = [];
    if (state.weather.daily) for (let i = 0; i < Configurations.FORECAST_DAYS; i++) dailyWeathers.push(
        <React.Fragment key={i}>
            {i > 0 && (
                <Divider
                    orientation='vertical'
                    flexItem />
            )}
            <Grid item>
                <WeatherDaily
                    orientation='vertical'
                    date={moment().add(i, 'days')}
                    provider={preferences.provider}
                    unit={preferences.unit}
                    summary={state.weather.daily[i].summary}
                    iconId={state.weather.daily[i].icon}
                    temperatureHighPrefix='🥵'
                    temperatureHigh={state.weather.daily[i].temperatureHigh}
                    temperatureLowPrefix='🥶'
                    temperatureLow={state.weather.daily[i].temperatureLow}
                    humidityPrefix='💧'
                    humidity={state.weather.daily[i].humidity}
                    precipPrefix='🌧'
                    precipProbability={state.weather.daily[i].precipProbability}
                    precipIntensity={state.weather.daily[i].precipIntensity}
                    windSpeedPrefix='🌬'
                    windSpeed={state.weather.daily[i].windSpeed}
                    uvIndexPrefix='🌞'
                    uvIndex={state.weather.daily[i].uvIndex} />
            </Grid>
        </React.Fragment>
    );

    return (
        <>
            {state.backgroundImageUrl ? (
                <WeatherCurrently
                    width={window.innerWidth}
                    height={window.innerWidth / 2}
                    backgroundImageUrl={state.backgroundImageUrl}
                    location={preferences.selectedLocation.displayName}
                    provider={preferences.provider}
                    unit={preferences.unit}
                    iconId={state.weather.currently?.icon}
                    summaryCurrently={state.weather.currently?.summary}
                    summaryToday={state.weather.daily[0]?.summary}
                    temperature={state.weather.currently?.temperature}
                    temperatureHigh={state.weather.daily[0]?.temperatureHigh}
                    temperatureLow={state.weather.daily[0]?.temperatureLow}
                    humidity={state.weather.currently?.humidity}
                    humidityPrefix='💧'
                    windSpeed={state.weather.currently?.windSpeed}
                    uvIndex={state.weather.currently?.uvIndex} />
            ) : createDummyCurrentWeather()}
            {state.weather.hourly ? (
                <WeatherHourly
                    width={window.innerWidth - theme.spacing(1)}
                    height={window.innerWidth / 2}
                    provider={preferences.provider}
                    unit={preferences.unit}
                    data={state.weather.hourly}
                    title={t('8-hour forecast')}
                    temperaturePrefix='🌡'
                    humidityPrefix='💧'
                    precipPrefix='🌧'
                    windSpeedPrefix='🌬'
                    uvIndexPrefix='🌞'
                    forecast={preferences.forecast}
                    timeFormat={preferences.militaryTime ? 'HH' : 'ha'} />
            ) : createDummyWeatherChart()}
            <Divider />
            <Grid
                container
                alignItems='center'
                justify='space-evenly'>
                {dailyWeathers.length ? dailyWeathers : createDummyDailyWeathers(4)}
            </Grid>
            <Divider />
            <Grid
                container
                alignItems='center'
                justify='space-between'>
                <Grid
                    item
                    xs={7}>
                    {state.weather.currently && <Timestamp prefix={t('Last updated ')} />}
                </Grid>
                <Button
                    tooltip={t('Settings')}
                    icon={<Settings />}
                    size='small'
                    onClick={() => history.push('/settings')} />
                <Button
                    tooltip={`${t('Photo by')} ${state.backgroundImageAuthor} / Unsplash`}
                    icon={<InfoOutlined />}
                    size='small'
                    onClick={() => window.require('electron').remote.shell.openExternal(state.backgroundImageAuthorProfileUrl)} />
                <Button
                    tooltip={t('Refresh')}
                    icon={<Refresh />}
                    size='small'
                    onClick={() => refresh()} />
            </Grid>
        </>
    );
};

Page.propTypes = {
    history : PropTypes.object.isRequired,
};

export const Main = withRouter(Page);
