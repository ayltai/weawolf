import i18next from 'i18next';
import moment from 'moment';

import { Configurations, } from '../Configurations';
import { RequestHelpers, } from './RequestHelpers';

export const AppHelpers = {};

AppHelpers.setAutoLaunch = enabled => {
    const app = window.require('electron').remote.app;

    app.setLoginItemSettings({
        openAtLogin  : enabled,
        openAsHidden : true,
        path         : app.getPath('exe'),
    });
};

AppHelpers.changeLocale = locale => {
    i18next.changeLanguage(locale);
    moment.locale(locale);
};

AppHelpers.checkForUpdates = async () => {
    const response = RequestHelpers.request(Configurations.UPDATE_URL);

    const extension = process.platform === 'darwin' ? 'dmg' : process.platform === 'win32' ? 'exe' : 'AppImage';
    return [ Configurations.APP_VERSION !== response.version, `https://github.com/ayltai/weawolf/archive/release/Weawolf-${response.version}.${process.platform}.${extension}`, ];
};
