import { Dialog, DialogContent, DialogTitle, List, } from '@material-ui/core';
import { Add, } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation, } from 'react-i18next';
import { withRouter, } from 'react-router-dom';

import { BooleanPreference, } from '../components/preferences/BooleanPreference';
import { ChoicePreference, } from '../components/preferences/ChoicePreference';
import { ConfirmationPreference, } from '../components/preferences/ConfirmationPreference';
import { Preference, } from '../components/preferences/Preference';
import { PreferenceTitle, } from '../components/preferences/PreferenceTitle';
import { Button, } from '../components/Button';
import { Confirmation, } from '../components/Confirmation';
import { Notification, } from '../components/Notification';
import { SearchLocation, } from '../components/SearchLocation';
import { Preferences, } from '../models/Preferences';
import { AppHelpers, } from '../utils/AppHelpers';
import { Units, } from '../utils/Units';
import { Configurations, } from '../Configurations';
import { Page, } from './Page';

const Component = ({ history, }) => {
    const preferences = Preferences.load();
    const { t, }      = useTranslation();

    const [ open,                setOpen,                ] = React.useState(false);
    const [ notification,        setNotification,        ] = React.useState(false);
    const [ notificationMessage, setNotificationMessage, ] = React.useState('');
    const [ confirmation,        setConfirmation,        ] = React.useState(false);
    const [ confirmationMessage, setConfirmationMessage, ] = React.useState('');
    const [ updateUrl,           setUpdateUrl,           ] = React.useState('');

    const [ state, setState, ] = React.useState({
        provider          : preferences.provider,
        refreshInterval   : preferences.refreshInterval,
        autoLaunch        : preferences.isAutoLaunch,
        unit              : preferences.unit,
        forecast          : preferences.forecast,
        locale            : preferences.locale,
        militaryTime      : preferences.isMilitaryTime,
        isDarkMode        : preferences.isDarkMode,
        backgroundBlurred : preferences.backgroundBlurred,
        backgroundDarken  : preferences.backgroundDarken,
    });

    return (
        <Page title={t('Settings')}>
            <Dialog
                fullWidth
                maxWidth='xl'
                open={open}
                onBackdropClick={() => setOpen(false)}>
                <DialogTitle>Add Location</DialogTitle>
                <DialogContent>
                    <SearchLocation onSelect={location => {
                        if (!preferences.locations.map(loc => loc.name).includes(location.name)) {
                            preferences.locations.push(location);
                            preferences.save();

                            setOpen(false);
                        }
                    }} />
                </DialogContent>
            </Dialog>
            <List>
                <PreferenceTitle title={t('General')} />
                <Preference
                    title={t('Locations')}
                    description={`${preferences.locations.length} ${t(`location${preferences.locations.length > 1 ? 's' : ''}`)}`}
                    secondaryAction={
                        <Button
                            tooltip={t('Add location')}
                            icon={<Add />}
                            onClick={() => setOpen(true)} />
                    }
                    onClick={() => history.push('/settings/locations')} />
                <ChoicePreference
                    title={t('Refresh interval')}
                    description={`${Math.round(preferences.refreshInterval / 1000 / 60)} minutes`}
                    value={state.refreshInterval}
                    values={Configurations.REFRESH_INTERVALS}
                    onChange={value => {
                        preferences.refreshInterval = value;
                        preferences.save();

                        setState({
                            ...state,
                            refreshInterval : value,
                        });
                    }} />
                <ChoicePreference
                    title={t('Weather provider')}
                    description={Configurations.PROVIDERS[state.provider].label}
                    value={state.provider}
                    values={Configurations.PROVIDERS}
                    onChange={value => {
                        preferences.provider        = value;
                        preferences.weather         = null;
                        preferences.lastRefreshTime = 0;
                        preferences.save();

                        setState({
                            ...state,
                            provider : value,
                        });
                    }} />
                <BooleanPreference
                    title={t('Auto launch')}
                    description={t('Run on startup')}
                    checked={state.autoLaunch}
                    onChange={checked => {
                        preferences.isAutoLaunch = checked;
                        preferences.save();

                        AppHelpers.setAutoLaunch(checked);

                        setState({
                            ...state,
                            autoLaunch : checked,
                        });
                    }} />
                <PreferenceTitle
                    divider
                    title={t('Display')} />
                <ChoicePreference
                    title={t('Units')}
                    description={state.unit === Units.SI ? 'SI (°C, km)' : 'Imperial (°F, mile)'}
                    value={state.unit}
                    values={Configurations.UNITS}
                    onChange={value => {
                        preferences.unit = value;
                        preferences.save();

                        setState({
                            ...state,
                            unit : value,
                        });
                    }} />
                <ChoicePreference
                    title={t('Forecast')}
                    description={state.forecast === 'humidity' ? 'Temperature, precipitation, humidity' : state.forecast === 'wind' ? 'Temperature, precipitation, wind speed' : 'Temperature, precipitation, UV index'}
                    value={state.forecast}
                    values={Configurations.FORECAST}
                    onChange={value => {
                        preferences.forecast = value;
                        preferences.save();

                        setState({
                            ...state,
                            forecast : value,
                        });
                    }} />
                <BooleanPreference
                    title={t('Blur background')}
                    checked={state.backgroundBlurred}
                    onChange={checked => {
                        preferences.backgroundBlurred = checked;
                        preferences.save();

                        setState({
                            ...state,
                            backgroundBlurred : checked,
                        });
                    }} />
                <BooleanPreference
                    title={t('Dim background')}
                    checked={state.backgroundDarken}
                    onChange={checked => {
                        preferences.backgroundDarken = checked;
                        preferences.save();

                        setState({
                            ...state,
                            backgroundDarken : checked,
                        });
                    }} />
                <ChoicePreference
                    title={t('Language')}
                    description={Configurations.LOCALES.filter(locale => locale.value === state.locale)[0].label}
                    value={state.locale}
                    values={Configurations.LOCALES}
                    onChange={value => {
                        preferences.locale          = value;
                        preferences.lastRefreshTime = 0;
                        preferences.weather         = null;
                        preferences.save();

                        AppHelpers.changeLocale(value);

                        setState({
                            ...state,
                            locale : value,
                        });
                    }} />
                <BooleanPreference
                    title={t('Dark mode')}
                    checked={state.isDarkMode}
                    onChange={checked => {
                        preferences.isDarkMode = checked;
                        preferences.save();

                        setState({
                            ...state,
                            isDarkMode : checked,
                        });

                        window.require('electron').remote.getCurrentWindow().reload();
                    }} />
                <BooleanPreference
                    title={t('24-hour clock')}
                    checked={state.militaryTime}
                    onChange={checked => {
                        preferences.isMilitaryTime = checked;
                        preferences.save();

                        setState({
                            ...state,
                            militaryTime : checked,
                        });
                    }} />
                <PreferenceTitle
                    divider
                    title={t('Help')} />
                <Preference
                    title={t('About')}
                    onClick={() => history.push('/about')} />
                <Preference
                    title={t('Check for updates')}
                    onClick={async () => {
                        const [ hasUpdates, url, ] = await AppHelpers.checkForUpdates();

                        if (hasUpdates) {
                            setUpdateUrl(url);
                            setConfirmation(true);
                            setConfirmationMessage(t('An update is available. Do you want to download it now?'));
                        }
                    }} />
                {(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && (
                    <Preference
                        title={t('Toggle Developer Tools')}
                        onClick={() => window.require('electron').remote.getCurrentWindow().webContents.toggleDevTools()} />
                )}
                <ConfirmationPreference
                    title={t('Reset settings')}
                    message={t('Are you sure to reset all settings to default values?')}
                    onResponse={response => {
                        if (response) {
                            window.localStorage.clear();

                            setNotificationMessage(t('Settings are reset to default values'));
                            setNotification(true);
                        }
                    }} />
                <Preference
                    title={t('Documentation')}
                    onClick={() => window.require('electron').remote.shell.openExternal(Configurations.DOCUMENTATION_URL)} />
                <Preference
                    title={t('View License')}
                    onClick={() => window.require('electron').remote.shell.openExternal(Configurations.LICENSE_URL)} />
                <Preference
                    title={t('Report Issues')}
                    onClick={() => window.require('electron').remote.shell.openExternal(Configurations.ISSUES_URL)} />
                <ConfirmationPreference
                    title={t('Exit')}
                    message={t('Are you sure you want to exit?')}
                    onResponse={response => {
                        if (response) window.require('electron').remote.app.quit();
                    }} />
            </List>
            {notification ? (
                <Notification
                    type='info'
                    message={notificationMessage}
                    autoClose
                    onClose={() => setNotification(false)} />
            ) : <span />}
            {confirmation ? (
                <Confirmation
                    title={t('Confirmation')}
                    message={confirmationMessage}
                    show={confirmation}
                    onClose={() => setConfirmation(false)}
                    onResponse={response => {
                        if (response) window.require('electron').remote.shell.openExternal(updateUrl);
                    }} />
            ) : <span />}
        </Page>
    );
};

Component.propTypes = {
    history : PropTypes.object.isRequired,
};

export const Settings = withRouter(Component);
