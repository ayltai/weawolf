import { Configurations, } from '../Configurations';
import { Location, } from './Location';

const KEY = 'preferences';

export class Preferences {
    locations             = [ Configurations.LOCATION, ];
    selectedLocationIndex = 0;
    refreshInterval       = Configurations.REFRESH_INTERVALS[1].value;
    lastRefreshTime       = Date.now();
    isAutoLaunch          = Configurations.IS_AUTO_LAUNCH;
    unit                  = Configurations.UNITS[0].value;
    forecast              = Configurations.FORECAST[0].value;
    locale                = Configurations.LOCALES[0].value;
    isDarkMode            = window.require('electron').remote.getGlobal('IS_DARK_MODE');
    isMilitaryTime        = Configurations.IS_MILITARY_TIME;
    provider              = Configurations.PROVIDERS[0].value;
    backgroundDarken      = true;
    backgroundBlurred     = true;
    backgroundImageUrl;
    backgroundImageAuthor;
    backgroundImageAuthorProfileUrl;
    weather;

    get selectedLocation() {
        return this.locations.length ? this.selectedLocationIndex > this.locations.length - 1 ? this.locations[0] : this.locations[this.selectedLocationIndex] : Configurations.LOCATION;
    }

    save = () => window.localStorage.setItem(KEY, JSON.stringify(this));
}

Preferences.load = () => {
    if (KEY in window.localStorage) {
        const preferences = Object.assign(new Preferences(), JSON.parse(window.localStorage.getItem(KEY)));
        preferences.locations = preferences.locations.map(location => Object.assign(new Location(location.latitude, location.longitude, location.name), location));

        return preferences;
    }

    return new Preferences();
};
