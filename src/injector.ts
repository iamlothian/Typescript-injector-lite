import "reflect-metadata";
import { Blueprint }    from './blueprint'
import { Value }        from './value'
import { Service }      from './service'
import { Factory }      from './factory'
import { Alias }        from './alias'

export enum INJECT_METHOD {SERVICE,FACTORY,VALUE,ALIAS};

export let Injector = (function(){

    /**
     * 
     * @param target 
     */
    function getDependencies(target){
        let dependents = Reflect.getMetadata("design:dependants", target);
        if (dependents === undefined){
            dependents = [];
            Reflect.defineMetadata("design:dependants", dependents, target);
        }
        return dependents
    }


    /**
     * 
     * @param target 
     * @param dependent 
     * @param index 
     */
    function addDependency(target, dependent, index){
        let dependents = getDependencies(target);
        dependents[index] = dependent;
        Reflect.defineMetadata("design:dependants", dependents, target);
        return dependent
    }

    /**
     * 
     * @param blueprint 
     */
    function register(blueprint:Blueprint) {                
        blueprint.build();
    }

    /**
     * 
     * @param injectorKey 
     */
     function inject(injectorKey?:string):any {
        return (target: any, propertyKey: string, parameterIndex: number):void => {
            let attributes = Reflect.getOwnMetadata("design:paramtypes", target, propertyKey),
                require = injectorKey || attributes[parameterIndex].name;
            if (attributes[parameterIndex] === undefined){
                throw new Error("Argument "+parameterIndex+" of the constructor for "+target.name+" is undefined.");
            }
            let dependents = addDependency(target, require, parameterIndex)
        }
    }

    /**
     * 
     * @param key 
     * @param value 
     */
    function value(key:string, value:any ){
        register(new Value(key, value, []));
    }

    /**
     * 
     * @param key 
     */
    function service(key?:string){
        return function<T extends {new(...args:any[]):{}}> (constructor:T) {
            let dependencies = getDependencies(constructor);
            let blueprint = new Service(
                constructor["name"],
                constructor,
                dependencies
            );
            register(blueprint);
            if (!!key && constructor["name"] !== key){
                register(blueprint.makeAlias(key));
            }
            return constructor;
        }
    }

    /**
     * 
     * @param key 
     */
    function factory(key?:string){
        return function<T extends {new(...args:any[]):{}}> (constructor:T) {
            let dependencies = getDependencies(constructor);
            let blueprint = new Factory(
                constructor["name"],
                constructor,
                dependencies
            );
            register(blueprint);
            if (!!key && constructor["name"] !== key){
                register(blueprint.makeAlias(key));
            }
            return constructor;
        }
    }

    /**
     * 
     * @param key 
     */
    function instantiate(key:string):any{
        return Blueprint.instantiate(key);
    }

    return {
        inject,
        instantiate,
        service,
        factory,
        value
    }

})();