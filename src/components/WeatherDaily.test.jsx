import { mount, } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';

import { Providers, } from '../utils/Providers';
import { Units, } from '../utils/Units';
import { WeatherDaily, } from './WeatherDaily';

jest.mock('react-i18next', () => ({
    useTranslation : () => ({
        t : key => key,
    }),
}));

const date              = new Date(1587628337);
const summary           = 'Partly Cloudy';
const iconId            = 'partly-cloudy-night';
const provider          = Providers.DARK_SKY;
const unit              = Units.SI;
const temperatureHigh   = 29.7;
const temperatureLow    = 22.4;
const humidity          = 0.77;
const precipProbability = 0.48;
const precipIntensity   = 0.2;
const windSpeed         = 7;
const uvIndex           = 4;

const componentHorizontal = (
    <WeatherDaily
        orientation='horizontal'
        date={date}
        summary={summary}
        provider={provider}
        unit={unit}
        iconId={iconId}
        temperatureHigh={temperatureHigh}
        temperatureLow={temperatureLow}
        humidity={humidity}
        precipProbability={precipProbability}
        precipIntensity={precipIntensity}
        windSpeed={windSpeed}
        uvIndex={uvIndex} />
);

const componentVertical = (
    <WeatherDaily
        orientation='vertical'
        date={date}
        summary={summary}
        provider={provider}
        unit={unit}
        iconId={iconId}
        temperatureHigh={temperatureHigh}
        temperatureLow={temperatureLow}
        humidity={humidity}
        precipProbability={precipProbability}
        precipIntensity={precipIntensity}
        windSpeed={windSpeed}
        uvIndex={uvIndex} />
);

describe('<WeatherDaily />', () => {
    it('renders correctly', () => {
        expect(renderer.create(componentHorizontal).toJSON()).toMatchSnapshot();
    });

    it('renders correctly', () => {
        expect(renderer.create(componentVertical).toJSON()).toMatchSnapshot();
    });

    it('mounts without errors', () => {
        mount(componentHorizontal);
    });

    it('mounts without errors', () => {
        mount(componentVertical);
    });
});
