
/**
 * Dependency Injection
 */
export function inject (...dependencies:string[]) {
    function decorator (target:Function) {
        target.$inject = dependencies;
    }
    return decorator;
}