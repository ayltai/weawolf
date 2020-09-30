import { mount, } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';

import { Providers, } from '../utils/Providers';
import { Units, } from '../utils/Units';
import { WeatherCurrently, } from './WeatherCurrently';

jest.mock('react-i18next', () => ({
    useTranslation : () => ({
        t : key => key,
    }),
}));

const width            = 200;
const height           = 100;
const location         = 'Los Angeles';
const provider         = Providers.DARK_SKY;
const unit             = Units.SI;
const summaryCurrently = 'Partly Cloudy';
const summaryToday     = 'No precipitation throughout the week';
const iconId           = 'partly-cloudy-night';
const temperature      = 28.3;
const temperatureHigh  = 29.7;
const temperatureLow   = 22.4;
const humidity         = 0.77;
const windSpeed        = 7;
const uvIndex          = 4;

const component = (
    <WeatherCurrently
        width={width}
        height={height}
        location={location}
        provider={provider}
        unit={unit}
        summaryCurrently={summaryCurrently}
        summaryToday={summaryToday}
        iconId={iconId}
        temperature={temperature}
        temperatureHigh={temperatureHigh}
        temperatureLow={temperatureLow}
        humidity={humidity}
        windSpeed={windSpeed}
        uvIndex={uvIndex} />
);

describe('<WeatherCurrently />', () => {
    it('renders correctly', () => {
        expect(renderer.create(component).toJSON()).toMatchSnapshot();
    });

    it('mounts without errors', () => {
        mount(component);
    });
});
