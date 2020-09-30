import { Grid, makeStyles, } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation, } from 'react-i18next';

import { NumberFormatHelpers, } from '../utils/NumberFormatHelpers';
import { Providers } from '../utils/Providers';
import { Units, } from '../utils/Units';
import { WeatherHelpers, } from '../utils/WeatherHelpers';
import { Label, } from './Label';
import { Temperature, } from './Temperature';

export const WeatherCurrently = props => {
    const classes = makeStyles(theme => ({
        background : {
            backgroundImage : `url(${props.backgroundImageUrl})`,
            backgroundSize  : 'cover',
            padding         : theme.spacing(0.5),
            height          : props.height + theme.spacing(1),
        },
        padding    : {
            paddingTop : theme.spacing(1),
        },
    }))();

    const { t, } = useTranslation();

    const summaryCurrently = props.summaryCurrently.charAt(0).toUpperCase() + props.summaryCurrently.slice(1);
    const summaryToday     = props.summaryToday.charAt(0).toUpperCase() + props.summaryToday.slice(1);
    const humidity         = NumberFormatHelpers.toFixed(props.humidity * 100, 0);

    return (
        <div className={classes.background}>
            <Label
                align='center'
                variant='body2'
                tooltip={props.location}
                noShadow={props.noShadow}
                noWrap>
                {props.location}
            </Label>
            <Label
                align='center'
                variant='body2'
                tooltip={summaryCurrently}
                noShadow={props.noShadow}
                noWrap>
                {summaryCurrently}
            </Label>
            <Grid
                container
                alignItems='center'
                justify='space-around'>
                <Grid
                    item
                    xs={4}>
                    <Temperature
                        align='center'
                        variant='h4'
                        unit={props.unit}
                        noShadow={props.noShadow}
                        noWrap>
                        {props.temperature}
                    </Temperature>
                    <Label
                        align='center'
                        variant='body2'
                        tooltip={`${humidity}%`}
                        noShadow={props.noShadow}
                        noWrap>
                        {`${t(props.humidityPrefix || 'Humidity')} ${humidity}%`}
                    </Label>
                </Grid>
                <Grid
                    item
                    xs={4}>
                    <Label
                        align='center'
                        variant='h2'
                        tooltip={`${t(props.windSpeedPrefix || 'Wind')}: ${Units.toWindSpeed(props.windSpeed, props.unit)}, ${t(props.uvIndexPrefix || 'UV')}: ${NumberFormatHelpers.toFixed(props.uvIndex, 0)}`}
                        noShadow={props.noShadow}>
                        <i className={`wi ${WeatherHelpers.toIcon(props.provider, props.iconId)}`}></i>
                    </Label>
                </Grid>
                <Grid
                    item
                    xs={4}>
                    <Temperature
                        align='center'
                        variant='body2'
                        prefix={`${t(props.temperatureHighPrefix || '🥵')}`}
                        unit={props.unit}
                        noShadow={props.noShadow}
                        noWrap>
                        {props.temperatureHigh}
                    </Temperature>
                    <Temperature
                        align='center'
                        variant='body2'
                        prefix={`${t(props.temperatureLowPrefix || '🥶')}`}
                        unit={props.unit}
                        noShadow={props.noShadow}
                        noWrap>
                        {props.temperatureLow}
                    </Temperature>
                </Grid>
            </Grid>
            <Label
                align='center'
                variant='caption'
                tooltip={summaryToday}
                noShadow={props.noShadow}
                noWrap>
                {summaryToday}
            </Label>
        </div>
    );
};

WeatherCurrently.propTypes = {
    width                 : PropTypes.number.isRequired,
    height                : PropTypes.number.isRequired,
    backgroundImageUrl    : PropTypes.string,
    location              : PropTypes.string,
    provider              : PropTypes.oneOf([
        Providers.ACCU_WEATHER,
        Providers.DARK_SKY,
        Providers.OPEN_WEATHER_MAP,
        Providers.WEATHERBIT,
    ]),
    unit                  : PropTypes.oneOf([
        Units.SI,
        Units.IMPERIAL,
    ]),
    summaryCurrently      : PropTypes.string,
    summaryToday          : PropTypes.string,
    iconId                : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    temperature           : PropTypes.number,
    temperatureHighPrefix : PropTypes.string,
    temperatureHigh       : PropTypes.number,
    temperatureLowPrefix  : PropTypes.string,
    temperatureLow        : PropTypes.number,
    humidityPrefix        : PropTypes.string,
    humidity              : PropTypes.number,
    windSpeedPrefix       : PropTypes.string,
    windSpeed             : PropTypes.number,
    uvIndexPrefix         : PropTypes.string,
    uvIndex               : PropTypes.number,
    noShadow              : PropTypes.bool,
};
