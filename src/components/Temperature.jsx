import PropTypes from 'prop-types';
import React from 'react';

import { Units, } from '../utils/Units';
import { Label, } from './Label';

export const Temperature = props => {
    const value = Number(props.children) || 0;
    const unit  = props.unit || Units.SI;

    return (
        <Label
            {...props}
            tooltip={props.noTooltip ? '' : `${Units.toTemperature(value, unit, props.digits || 1)}`}>
            {`${props.prefix || ''}${Units.toTemperature(value, unit, 0)}`}
        </Label>
    );
};

Temperature.propTypes = {
    children  : PropTypes.number,
    prefix    : PropTypes.string,
    digits    : PropTypes.number,
    unit      : PropTypes.oneOf([
        Units.SI,
        Units.IMPERIAL,
    ]),
    noTooltip : PropTypes.bool,
    ...Label.propTypes,
};
