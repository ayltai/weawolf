import { LocationOn, } from '@material-ui/icons';
import React from 'react';
import { useTranslation, } from 'react-i18next';

import { Choices, } from '../components/Choices';
import { Preferences, } from '../models/Preferences';
import { Page, } from './Page';

export const Locations = () => {
    const preferences = Preferences.load();

    const [ locations,        setLocations,        ] = React.useState(preferences.locations.map(location => location.displayName));
    const [ selectedLocation, setSelectedLocation, ] = React.useState(preferences.selectedLocation.displayName);

    const { t, } = useTranslation();

    return (
        <Page title={t('Locations')}>
            <Choices
                icon={<LocationOn />}
                value={selectedLocation}
                values={locations}
                onSelect={(selected, index) => {
                    preferences.lastRefreshTime       = 0;
                    preferences.favoriteLocationIndex = index;
                    preferences.save();

                    setSelectedLocation(preferences.selectedLocation.displayName);
                }}
                onDelete={deletedLocation => {
                    preferences.locations = preferences.locations.filter(location => location.displayName !== deletedLocation);
                    preferences.save();

                    setLocations(preferences.locations.map(location => location.displayName));
                }} />
        </Page>
    );
};
