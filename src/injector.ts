import "reflect-metadata";
import { Blueprint }    from './blueprint'
import { Value }        from './value'
import { Service }      from './service'
import { Factory }      from './factory'
import { Alias }        from './alias'


/**
 * Returns a list of dependencies tagged by metadata to the target 
 * 
 * @param target the object to read metadata from
 */
function getDependencies(target:any): Array<string>{
    let dependents:Array<string> = Reflect.getMetadata("design:dependants", target);
    if (dependents === undefined){
        dependents = new Array<string>();
        Reflect.defineMetadata("design:dependants", dependents, target);
    }
    return dependents
}


/**
 * Adds dependencies metadata to a target use later by the class annotation 
 * 
 * @param target the object to write metadata to
 * @param dependent the 
 * @param index 
 */
function addDependency(target:any, dependent:string, index:number):void{
    let dependents:Array<string> = getDependencies(target);
    dependents[index] = dependent;
    Reflect.defineMetadata("design:dependants", dependents, target);
}

/**
 * Annotation Function designed to be used with constructor arguments.
 * This will make use of the addDependency method to tag a dependency on the class definition
 * 
 * @param injectorKey an optional string to implicitly define what to inject into the argument at this location. 
 * If a class type was specified on the argument this will be used by default
 */
export function inject(injectorKey?:string):any {
    return (target: any, propertyKey: string, parameterIndex: number):void => {
        let attributes = Reflect.getOwnMetadata("design:paramtypes", target, propertyKey),
            require = injectorKey || attributes[parameterIndex].name;
        if (attributes[parameterIndex].name === target.name){
            throw new Error("Argument "+parameterIndex+" of the constructor for "+target.name+" can not inject itself.");
        }
        addDependency(target, require, parameterIndex);
    }
}

/**
 * Manually request an instance by its container key
 * 
 * @param key The key to retrieve the injectable from the container by.
 */
export function instantiate(key:string):any{
    return Blueprint.instantiate(key);
}

/**
 * Function designed to inject non class or external instances into the container for 
 * dependency injection.
 * 
 * @param key the key the injectable will be referenced by in the container
 * @param value the value to store in the container
 */
export function importValue(key:string, value:any ){
    new Value(key, value, []).build();
}

/**
 * Annotation for classes which should act as singletons when injected.
 * The same instance will be injected by every classes that require it.
 * 
 * @param key an optional alias for the class, both the alias and the class name will be available for injection
 */
export function service(key?:string){
    return function<T extends {new(...args:any[]):{}}> (constructor:T) {
        let dependencies = getDependencies(constructor);
        let blueprint = new Service(
            constructor["name"],
            constructor,
            dependencies
        );
        blueprint.build();
        if (!!key && constructor["name"] !== key){
            blueprint.makeAlias(key).build();
        }
        return constructor;
    }
}

/**
 * Annotation for classes which should act as factories when injected.
 * A new instance will be injected into every classes that require it.
 * 
 * @param key an optional alias for the class, both the alias and the class name will be available for injection
 */
export function factory(key?:string){
    return function<T extends {new(...args:any[]):{}}> (constructor:T) {
        let dependencies = getDependencies(constructor);
        let blueprint = new Factory(
            constructor["name"],
            constructor,
            dependencies
        );
        blueprint.build();
        if (!!key && constructor["name"] !== key){
            blueprint.makeAlias(key).build();
        }
        return constructor;
    }
}