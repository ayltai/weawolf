import { createApi, } from 'unsplash-js';

export const UnsplashApiClient = {};

UnsplashApiClient.getRandomPhoto = async (query, width, height) => {
    const response = await new createApi({
        apiUrl : process.env.REACT_APP_UNSPLASH_API_ENDPOINT,
    }).photos.getRandom({
        query,
    });

    if (response.type === 'error') {
        throw new Error(response.errors[0]);
    }

    response.response.urls.regular = response.response.urls.regular.replace('w=1080', `w=${width}&h=${height}`);

    return response.response;
};
