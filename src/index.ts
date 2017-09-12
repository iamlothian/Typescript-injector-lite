import "reflect-metadata";

export enum INJECT_METHOD {SERVICE,FACTORY};

export let Injector = (function(){

    let DEBUG = false; 
    let providerCache: Object = {};
    let instanceCache: Object = {};

    function setDEBUG(status:boolean){
        DEBUG = !!status;
    }

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
     * @param injectorKey 
     * @param provider 
     * @param injectMethod 
     */
    function register(injectorKey:string, provider:any, injectMethod: INJECT_METHOD = INJECT_METHOD.SERVICE) {
        
        if (providerCache.hasOwnProperty(injectorKey)) {
            throw new Error("A provider for "+injectorKey+" already exists.");
        }
        providerCache[injectorKey] = provider;
        Reflect.defineMetadata("design:injectMethod", injectMethod, provider);

        let dependencies = getDependencies(provider);

        DEBUG && console.log("register class ["+injectorKey+"] with the following dependencies", dependencies);
        
        let instances = [];
        for (let dependency of dependencies){
            instances.push(get(dependency));
        }

        cache(injectorKey,provider,instances,injectMethod);

        if(DEBUG){
            console.log("Instantiate ["+injectorKey+"] with", instances);
            console.log("======================");
            console.log(instanceCache)
            console.log("======================");
        }
    }

    function get(injectorKey:string) {

        let depIMethod:INJECT_METHOD = Reflect.getMetadata("design:injectMethod", providerCache[injectorKey]);
        
        let instance = undefined;
        switch(depIMethod){
            case INJECT_METHOD.FACTORY:
                instance = new instanceCache[injectorKey]();
                DEBUG && console.log("Resolve factory ["+injectorKey+"] to", instance);
                break;
            case INJECT_METHOD.SERVICE:
                instance = instanceCache[injectorKey];
                DEBUG && console.log("Resolve service ["+injectorKey+"] to", instance);
                break;
        }

        return instance;

    }

    function cache(injectorKey:string, provider:any, args:any[], injectMethod:INJECT_METHOD) {

        switch(injectMethod){
            case INJECT_METHOD.FACTORY:
                instanceCache[injectorKey] = Function.prototype.bind.apply(provider, args);
                break;
            case INJECT_METHOD.SERVICE:
                instanceCache[injectorKey] = new provider(...args);
                break;
        }

    }

    /**
     * 
     * @param injectorKey 
     */
     function inject(injectorKey?:string):any {
        return (target: any, propertyKey: string, parameterIndex: number):void => {
            let attributes = Reflect.getOwnMetadata("design:paramtypes", target, propertyKey);
            if (attributes[parameterIndex] === undefined){
                throw new Error("Argument "+parameterIndex+" of the constructor for "+target.name+" is undefined.");
            }
            let dependents = addDependency(target, attributes[parameterIndex].name, parameterIndex)
            DEBUG && console.log("Parameter "+parameterIndex+" of class ["+target.name+"] depends on:",dependents);
        }
    }


    /**
     * Registers a class as injectable and will cache an instance
     * @param injectorKey 
     */
    function injectable(injectorKey?:string){
        return function<T extends {new(...args:any[]):{}}> (constructor:T) {
            injectorKey = injectorKey || constructor["name"];
            register(injectorKey, constructor);
            return constructor;
        }
    }
    function service(injectorKey?:string){
        return function<T extends {new(...args:any[]):{}}> (constructor:T) {
            injectorKey = injectorKey || constructor["name"];
            register(injectorKey, constructor, INJECT_METHOD.SERVICE);
            return constructor;
        }
    }
    function factory(injectorKey?:string){
        return function<T extends {new(...args:any[]):{}}> (constructor:T) {
            injectorKey = injectorKey || constructor["name"];
            register(injectorKey, constructor, INJECT_METHOD.FACTORY);
            return constructor;
        }
    }

    return {
        inject,
        register,
        get,
        injectable,
        service,
        factory,
        setDEBUG
    }

})();