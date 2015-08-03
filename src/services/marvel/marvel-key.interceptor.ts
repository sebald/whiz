import MARVEL_API_KEY from 'marvel.key';
import MARVEL_CONFIG from './marvel.config';


export default class MarvelKeyInterceptor {
    constructor () {
        if( !MARVEL_API_KEY ) {
            console.warn(`
                [whiz] Warning: No Marvel API key found!
                A key is required to fetch data.

                If you do not have a Marvel API, you can create one here:
                http://developer.marvel.com/signup !
            `);
        }
    }

    request ( config:ng.IRequestConfig ) {
        // Request pings Marvel API?
        if( config.url.startsWith(MARVEL_CONFIG.base) ) {
            if( !config.params ) {
                config.params = {};
            }
            config.params.apikey = MARVEL_API_KEY;
        }
        return config;
    }
}