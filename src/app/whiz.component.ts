import controller from './whiz.controller';


let WhizComponentFactory:ng.IDirectiveFactory = () => {
    return {
        restrict: 'E',
        scope: {},
        template: `<strong>Good Day, Sir!!!</strong>`,
        controller
    };
}


export default WhizComponentFactory;