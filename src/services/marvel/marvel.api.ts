import MARVEL_CONFIG from './marvel.config';

class MarvelApi {
    public static $inject: string[] = ['$http'];
    public $http:ng.IHttpService;

    constructor( $http:ng.IHttpService ) {
        this.$http = $http;
    }

    getSuggestions ( query:string ) {
        return this.$http.get(
           `${MARVEL_CONFIG.base}${MARVEL_CONFIG.characters}?nameStartsWith=${query}`
        );
    }
}

export default MarvelApi;