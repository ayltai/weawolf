import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import { useInterval, } from '../hooks/useInterval';
import { Preferences, } from '../models/Preferences';
import { Configurations, } from '../Configurations';
import { Label, } from './Label';

export const Timestamp = props => {
    const [ timeAgo, setTimeAgo, ] = React.useState(moment(Preferences.load().lastRefreshTime).fromNow());

    useInterval(() => setTimeAgo(moment(Preferences.load().lastRefreshTime).fromNow()), Configurations.UI_UPDATE_INTERVAL);

    return (
        <Label
            tooltip={moment(Preferences.load().lastRefreshTime).format('LLLL')}
            align='center'
            variant='caption'
            noWrap>
            {`${props.prefix}${timeAgo}`}
        </Label>
    );
};

Timestamp.propTypes = {
    prefix : PropTypes.string,
};
