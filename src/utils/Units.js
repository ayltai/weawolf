import { NumberFormatHelpers, } from './NumberFormatHelpers';

export const Units = {};

Units.SI       = 'si';
Units.IMPERIAL = 'imperial';

Units.toTemperature = (temperature, unit, digits = 1, withSymbol = true) => unit === Units.SI ? `${NumberFormatHelpers.toFixed(temperature, digits)}${withSymbol ? '°C' : ''}` : `${NumberFormatHelpers.toFixed(temperature * 1.8 + 32, digits)}${withSymbol ? '°F' : ''}`;

Units.toWindSpeed = (windSpeed, unit, digits = 1, withSymbol = true) => unit === Units.SI ? `${NumberFormatHelpers.toFixed(windSpeed, digits)}${withSymbol ? 'km/h' : ''}` : `${NumberFormatHelpers.toFixed(windSpeed / 1.60934, digits)}${withSymbol ? 'mi/h' : ''}`;
