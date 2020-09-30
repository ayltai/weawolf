import { Grid, Tooltip, } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Fragment, } from 'react';
import { useTranslation, } from 'react-i18next';

import { NumberFormatHelpers, } from '../utils/NumberFormatHelpers';
import { Providers, } from '../utils/Providers';
import { Units, } from '../utils/Units';
import { WeatherHelpers, } from '../utils/WeatherHelpers';
import { Label, } from './Label';
import { Temperature, } from './Temperature';

export const WeatherDaily = props => {
    const { t, } = useTranslation();

    const summary = props.summary.charAt(0).toUpperCase() + props.summary.slice(1);

    let i = 0;

    const date = (
        <Label
            key={i++}
            align='center'
            variant='body2'
            noShadow={props.noShadow}
            noWrap>
            {moment(props.date || new Date()).format('ddd')}
        </Label>
    );

    const icon = (
        <Label
            key={i++}
            align='center'
            variant='h4'
            noShadow={props.noShadow}
            noWrap>
            <i className={`wi ${WeatherHelpers.toIcon(props.provider, props.iconId)}`}></i>
        </Label>
    );

    const temperatureHigh = (
        <Temperature
            key={i++}
            align='center'
            variant='body2'
            unit={props.unit}
            prefix={t(props.temperatureHighPrefix)}
            noShadow={props.noShadow}
            noWrap>
            {props.temperatureHigh}
        </Temperature>
    );

    const temperatureLow = (
        <Temperature
            key={i++}
            align='center'
            variant='body2'
            unit={props.unit}
            prefix={t(props.temperatureLowPrefix)}
            noShadow={props.noShadow}
            noWrap>
            {props.temperatureLow}
        </Temperature>
    );

    const precip = (
        <Label
            key={i++}
            align='center'
            variant='body2'
            noShadow={props.noShadow}
            noWrap>
            {`${t(props.precipPrefix || '')}${Math.round(props.precipProbability * 100)}%`}
        </Label>
    );

    const blocks = [];

    if (props.orientation === 'horizontal') {
        blocks.push(
            <Grid
                key={i++}
                item
                xs={2}>
                {date}
                {precip}
            </Grid>
        );

        blocks.push(
            <Grid
                key={i++}
                item
                xs={2}>
                {icon}
            </Grid>
        );

        blocks.push(
            <Grid
                key={i++}
                item
                xs={6}>
                <Label
                    align='left'
                    variant='caption'
                    noShadow={props.noShadow}
                    noWrap>
                    {summary}
                </Label>
            </Grid>
        );

        blocks.push(
            <Grid
                key={i}
                item
                xs={2}>
                {(props.temperatureHighPrefix || '🥵') + ' ' + temperatureHigh}
                {(props.temperatureLowPrefix || '🥶') + ' ' + temperatureLow}
            </Grid>
        );
    } else if (props.orientation === 'vertical') {
        blocks.push(date);
        blocks.push(icon);
        blocks.push(temperatureHigh);
        blocks.push(temperatureLow);
        blocks.push(precip);
    }

    return (
        <Tooltip title={
            <Fragment>
                {moment(props.date).format('LL')}<br />
                {summary}<br />
                {`${t(props.temperaturePrefix || '')}${Units.toTemperature(props.temperatureLow, props.unit)} - ${Units.toTemperature(props.temperatureHigh, props.unit)}`}<br />
                {`${t(props.precipPrefix || '')}${NumberFormatHelpers.toFixed(props.precipProbability * 100, 0)}% ${NumberFormatHelpers.toFixed(props.precipIntensity)}mm`}<br />
                {props.humidity ? (
                    <>
                        {`${t(props.humidityPrefix || '')}${NumberFormatHelpers.toFixed(props.humidity * 100, 0)}%`}<br />
                    </>
                ) : null}
                {`${t(props.windSpeedPrefix || '')}${Units.toWindSpeed(props.windSpeed, props.unit, 0)}`}<br />
                {`${t(props.uvIndexPrefix || '')}${NumberFormatHelpers.toFixed(props.uvIndex, 0)}`}
            </Fragment>
        }>
            <Grid
                container
                direction={props.orientation === 'vertical' ? 'column' : 'row'}
                alignItems='center'
                justify='space-evenly'>
                {blocks}
            </Grid>
        </Tooltip>
    );
};

WeatherDaily.propTypes = {
    orientation           : PropTypes.oneOf([
        'horizontal',
        'vertical',
    ]),
    date                  : PropTypes.object,
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
    summary               : PropTypes.string,
    iconId                : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    temperaturePrefix     : PropTypes.string,
    temperatureHighPrefix : PropTypes.string,
    temperatureHigh       : PropTypes.number,
    temperatureLowPrefix  : PropTypes.string,
    temperatureLow        : PropTypes.number,
    humidityPrefix        : PropTypes.string,
    humidity              : PropTypes.number,
    precipPrefix          : PropTypes.string,
    precipProbability     : PropTypes.number,
    precipIntensity       : PropTypes.number,
    windSpeedPrefix       : PropTypes.string,
    windSpeed             : PropTypes.number,
    uvIndexPrefix         : PropTypes.string,
    uvIndex               : PropTypes.number,
    noShadow              : PropTypes.bool,
};
