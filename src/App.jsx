import { createMuiTheme, CssBaseline, ThemeProvider, } from '@material-ui/core';
import React from 'react';
import { withTranslation, } from 'react-i18next';
import { Route, Switch, } from 'react-router-dom';

import { Preferences, } from './models/Preferences';
import { About, } from './pages/About';
import { Locations, } from './pages/Locations';
import { Main, } from './pages/Main';
import { Settings, } from './pages/Settings';
import { Configurations, } from './Configurations';
import './css/weather-icons.min.css';

const Component = () => {
    return (
        <ThemeProvider theme={createMuiTheme({
            palette : Configurations.createPalette(Preferences.load().isDarkMode),
        })}>
            <CssBaseline />
            <Switch>
                <Route
                    exact
                    path='/'
                    component={Main} />
                <Route
                    exact
                    path='/settings'
                    component={Settings} />
                <Route
                    exact
                    path='/settings/locations'
                    component={Locations} />
                <Route
                    exact
                    path='/about'
                    component={About} />
            </Switch>
        </ThemeProvider>
    );
};

export const App = withTranslation()(Component);
