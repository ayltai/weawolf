import { useTheme, } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation, } from 'react-i18next';

import { NumberFormatHelpers, } from '../utils/NumberFormatHelpers';
import { Providers } from '../utils/Providers';
import { Units, } from '../utils/Units';
import { WeatherHelpers, } from '../utils/WeatherHelpers';
import { ChartWrapper, } from './ChartWrapper';

export const WeatherHourly = props => {
    const theme      = useTheme();
    const isDarkMode = theme.palette.type === 'dark';

    const { t, } = useTranslation();

    const commonStyle = {
        label           : '',
        pointRadius     : 0,
        pointHitRadius  : theme.spacing(1),
        fill            : false,
        backgroundColor : isDarkMode ? theme.palette.info.dark : theme.palette.info.light,
        borderColor     : isDarkMode ? theme.palette.info.dark : theme.palette.info.light,
    };

    const commonScale = {
        position  : 'right',
        gridLines : {
            drawOnChartArea : false,
            color           : theme.palette.text.primary,
            zeroLineColor   : theme.palette.text.primary,
        },
    };

    const createData = () => ({
        labels   : [],
        datasets : [
            {
                label           : t(props.title || 'Hourly forecast'),
                yAxisID         : 'temp',
                order           : 2,
                data            : [],
                pointStyle      : [],
                pointHitRadius  : theme.spacing(1),
                fill            : false,
                backgroundColor : isDarkMode ? theme.palette.secondary.dark : theme.palette.secondary.light,
                borderColor     : isDarkMode ? theme.palette.secondary.dark : theme.palette.secondary.light,
            },
            {
                label           : '',
                yAxisID         : 'precip',
                order           : 3,
                data            : [],
                pointRadius     : 0,
                pointHitRadius  : theme.spacing(1),
                fill            : true,
                backgroundColor : isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light,
                borderColor     : isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light,
            },
            {
                label : '',
                order : 4,
                data  : [],
            },
            {
                yAxisID : 'humidity',
                order   : props.forecast === 'humidity' ? 5 : 0,
                data    : [],
                ...commonStyle,
            },
            {
                yAxisID : 'windSpeed',
                order   : props.forecast === 'windSpeed' ? 5 : 0,
                data    : [],
                ...commonStyle,
            },
            {
                yAxisID : 'uvIndex',
                order   : props.forecast === 'uvIndex' ? 5 : 0,
                data    : [],
                ...commonStyle,
            },
        ],
    });

    const updateData = data => {
        data.datasets[3].hidden = props.forecast !== 'humidity';
        data.datasets[4].hidden = props.forecast !== 'windSpeed';
        data.datasets[5].hidden = props.forecast !== 'uvIndex';

        for (let i = 0; i < props.data.length; i++) {
            data.labels.push(moment(props.data[i].time).format(props.timeFormat || 'ha'));
            data.datasets[0].data.push(Units.toTemperature(props.data[i].temperature, props.unit, 1, false));
            data.datasets[1].data.push(NumberFormatHelpers.toFixed(props.data[i].precipProbability * 100, 0));
            data.datasets[2].data.push(props.data[i].precipIntensity);
            data.datasets[3].data.push(NumberFormatHelpers.toFixed(props.data[i].humidity * 100, 0));
            data.datasets[4].data.push(Units.toWindSpeed(props.data[i].windSpeed, props.unit, 1, false));
            if (props.data[i].uvIndex) data.datasets[5].data.push(props.data[i].uvIndex);

            const icon = new Image(theme.spacing(4), theme.spacing(4));
            icon.src = `img/${isDarkMode ? 'dark' : 'light'}/${WeatherHelpers.toIcon(props.provider, props.data[i].icon)}.svg`;

            data.datasets[0].pointStyle.push(icon);
        }
    };

    const chartData = createData();
    updateData(chartData);

    const min = Math.floor(Math.min.apply(Math, chartData.datasets[0].data));
    const max = Math.ceil(Math.max.apply(Math, chartData.datasets[0].data));

    const createScales = () => ({
        xAxes : [
            {
                gridLines : {
                    drawOnChartArea : false,
                    color           : theme.palette.text.primary,
                    zeroLineColor   : theme.palette.text.primary,
                },
            },
            {
                display : false,
            },
        ],
        yAxes : [
            {
                id        : 'temp',
                position  : 'left',
                gridLines : {
                    drawOnChartArea : false,
                    color           : theme.palette.text.primary,
                    zeroLineColor   : theme.palette.text.primary,
                },
                ticks     : {
                    min,
                    max,
                    stepSize : max,
                    callback : value => Units.toTemperature(value, props.unit, 0),
                },
            },
            {
                id      : 'precip',
                display : false,
                ticks   : {
                    min      : 0,
                    max      : 100,
                    stepSize : 51,
                },
            },
            {
                id      : 'humidity',
                display : props.forecast === 'humidity',
                ticks   : {
                    min      : 0,
                    max      : 100,
                    stepSize : 50,
                    callback : label => `${label}%`,
                },
                ...commonScale,
            },
            {
                id      : 'windSpeed',
                display : props.forecast === 'windSpeed',
                ticks   : {
                    min      : 0,
                    max      : Math.max(props.unit === Units.SI ? 200 : 120, Math.ceil(Math.max.apply(Math, chartData.datasets[4].data))),
                    stepSize : Math.max(props.unit === Units.SI ? 50 : 30, Math.ceil(Math.max.apply(Math, chartData.datasets[4].data)) / 4),
                    callback : value => `${Units.toWindSpeed(value, props.unit, 0)}`,
                },
                ...commonScale,
            },
            {
                id      : 'uvIndex',
                display : props.forecast === 'uvIndex',
                ticks   : {
                    min      : 0,
                    max      : 12,
                    stepSize : 2,
                },
                ...commonScale,
            },
        ],
    });

    const createTooltips = () => ({
        displayColors : false,
        callbacks     : {
            label : (tooltipItem, data) => [
                `${props.temperaturePrefix || ''}${Units.toTemperature(data.datasets[0].data[tooltipItem.index], props.unit)}`,
                `${props.precipPrefix || ''}${NumberFormatHelpers.toFixed(data.datasets[1].data[tooltipItem.index])}% ${NumberFormatHelpers.toFixed(data.datasets[2].data[tooltipItem.index])}mm`,
                data.datasets[3].data[tooltipItem.index] || data.datasets[3].data[tooltipItem.index] === 0 ? `${t(props.humidityPrefix || '')}${NumberFormatHelpers.toFixed(data.datasets[3].data[tooltipItem.index], 0)}%` : '',
                `${props.windSpeedPrefix || ''}${Units.toWindSpeed(data.datasets[4].data[tooltipItem.index], props.unit, 0)}`,
                data.datasets[5].data[tooltipItem.index] || data.datasets[5].data[tooltipItem.index] === 0 ? `${props.uvIndexPrefix || ''}${NumberFormatHelpers.toFixed(data.datasets[5].data[tooltipItem.index], 0)}` : '',
            ],
        },
    });

    return (
        <ChartWrapper
            className={props.className}
            width={props.width}
            height={props.height}
            data={chartData}
            options={{
                scales   : createScales(),
                tooltips : createTooltips(),
            }} />
    );
};

WeatherHourly.propTypes = {
    className         : PropTypes.string,
    width             : PropTypes.number.isRequired,
    height            : PropTypes.number.isRequired,
    data              : PropTypes.arrayOf(PropTypes.object),
    provider          : PropTypes.oneOf([
        Providers.ACCU_WEATHER,
        Providers.DARK_SKY,
        Providers.OPEN_WEATHER_MAP,
        Providers.WEATHERBIT,
    ]),
    unit              : PropTypes.oneOf([
        Units.SI,
        Units.IMPERIAL,
    ]),
    title             : PropTypes.string,
    temperaturePrefix : PropTypes.string,
    humidityPrefix    : PropTypes.string,
    precipPrefix      : PropTypes.string,
    windSpeedPrefix   : PropTypes.string,
    uvIndexPrefix     : PropTypes.string,
    forecast          : PropTypes.oneOf([
        'humidity',
        'windSpeed',
        'uvIndex',
    ]),
    timeFormat        : PropTypes.oneOf([
        'HH',
        'ha',
    ]),
};
