import { ErrorHelpers, } from '../utils/ErrorHelpers';

let service;
let geoCoder;

export const GoogleMapApiClient = {};

GoogleMapApiClient.predict = (address, callback) => {
    if (!service) service = new window.google.maps.places.AutocompleteService();

    service.getPlacePredictions({
        input : address,
    }, (results, status) => {
        if (status === 'OK') {
            callback(results.map(result => result.description));
        } else {
            ErrorHelpers.handle(new Error(`Autocomplete service failed for the following reason: ${status}`));

            callback();
        }
    });
};

GoogleMapApiClient.resolve = (address, callback) => {
    if (!geoCoder) geoCoder = new window.google.maps.Geocoder();

    geoCoder.geocode({
        address,
    }, (results, status) => {
        if (status === 'OK') {
            if (results.length > 0) {
                callback(results[0].geometry.location.lat(), results[0].geometry.location.lng());
            } else {
                ErrorHelpers.handle(new Error('Geocoder returned empty results'));

                callback();
            }
        } else {
            ErrorHelpers.handle(new Error(`Geocoder failed for the following reason: ${status}`));

            callback();
        }
    });
};
