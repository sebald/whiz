import { inject } from 'utils/decorator';
import MarvelApi from 'services/marvel/marvel.api';

@inject('MarvelApi')
class WhizApp {
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