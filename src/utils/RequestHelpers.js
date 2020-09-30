import superagent from 'superagent';

import { ErrorHelpers, } from './ErrorHelpers';

export const RequestHelpers = {};

RequestHelpers.request = async (url, argsValidator = () => {}) => {
    argsValidator();

    const response = await superagent.get(url).set('Accept', 'application/json');

    if (response.status >= 200 && response.status < 300) return response.body;

    ErrorHelpers.handle(new Error(`Received HTTP ${response.status} for URL ${url}`));
};
