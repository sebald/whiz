import MarvelApi from '../services/marvel/marvel.api';

class WhizApp {
    public static $inject: string[] = ['MarvelApi'];

    public api:MarvelApi;

    constructor( MarvelApi:MarvelApi ) {
        this.api = MarvelApi;
        // this.api.getSuggestions('Sp')
        //     .then( function ( response ) {
        //         console.log(response);
        //     });
    }
}

export default WhizApp;