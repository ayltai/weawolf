import Unsplash, { toJson, } from 'unsplash-js';

export const UnsplashApiClient = {};

UnsplashApiClient.getRandomPhoto = async (query, width, height) => {
    const response = await toJson(await new Unsplash({
        apiUrl : process.env.REACT_APP_UNSPLASH_API_ENDPOINT,
    }).photos.getRandomPhoto({
        query,
    }));

    response.urls.regular = response.urls.regular.replace('w=1080', `w=${width}&h=${height}`);

    return response;
};
