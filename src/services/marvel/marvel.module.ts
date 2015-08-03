import * as angular from 'angular';
import MarvelApi from './marvel.api';
import MarvelKeyInterceptor from './marvel-key.interceptor';

export default angular
    .module('whiz.marvel', [])
    .config(['$httpProvider', ( provider:ng.IHttpProvider ) =>  {
        provider.interceptors.push(() => new MarvelKeyInterceptor());
    }])
    .service('MarvelApi', MarvelApi);