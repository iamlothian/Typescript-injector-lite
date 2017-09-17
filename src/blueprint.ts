import { Dependency } from './dependency'
import * as debug from 'loglevel-debug'

const logger = debug("typescript-injector-light")

/**
 *  
 */
export abstract class Blueprint {

    private static container:Map<string,Blueprint> = new Map();
    private static deferredBlueprints:Map<string,Array<Blueprint>> = new Map();
    private _isReady;

    public dependencies: Array<Dependency>;

    constructor(
        public key:string,
        public provider:any,
        dependencies:Array<string>
    ){
        this._isReady = false;
        this.dependencies = new Array<Dependency>();
        for (let dependency of dependencies){
            this.dependencies.push(
                new Dependency(dependency)
            );
        }

        logger.debug("Blueprint: " + this.key)

        if(Blueprint.container.has(this.key)){
            throw new Error("A provider for "+this.key+" already exists in the container");
        } else {
            Blueprint.container.set(this.key, this); 
        }
        
    }

    private tryResolveDependencies():Array<string>{

        let unresolved:Array<string> = [];
        for (let dependency of this.dependencies){
            let blueprint = Blueprint.container.get(dependency.required);
            if(blueprint !== undefined && blueprint._isReady){
                dependency.resolved = blueprint.instantiate();
            } else {
                unresolved.push(dependency.required);
            }
        }
        return unresolved;

    }

    private deferDependencyResolution(unresolvedDependencies:Array<string>):void {

        logger.debug('Defer: ' + this.key + '. waiting for ' + unresolvedDependencies);

        for (let dependency of unresolvedDependencies){
            
            let dependents:Array<Blueprint> = 
                Blueprint.deferredBlueprints.has(dependency) ?
                Blueprint.deferredBlueprints.get(dependency) :
                Blueprint.deferredBlueprints.set(dependency, new Array<Blueprint>()).get(dependency);

            if (dependents.findIndex(b => b.key === this.key) === -1){
                dependents.push(this);
                Blueprint.deferredBlueprints.set(dependency, dependents);
            }
            
        }

    } 

    protected getResolvedDependencies():Array<any>{
        return this.dependencies.map( v => v.resolved)
    }

    build(): void{

        logger.debug("build: "+ this.key);
    
        let unresolvedDependencies = this.tryResolveDependencies();
        if (unresolvedDependencies.length !== 0){
            this.deferDependencyResolution(unresolvedDependencies);
        } else {
            this._isReady = true;
        }

        let dependents:Array<Blueprint> = 
            Blueprint.deferredBlueprints.has(this.key) ? 
            Blueprint.deferredBlueprints.get(this.key) : [];   

        logger.debug('dependents waiting for ['+ this.key+ '] = '+ dependents.length);

        for (let dependent of dependents){ 
            logger.debug('Update: ' + dependent.key);
            dependent.build();
        }

        Blueprint.deferredBlueprints.delete(this.key);

    }

    instantiate() {}

    static instantiate(key:string) {

        if (Blueprint.container.has(key)){
            var blueprint = Blueprint.container.get(key)
            if (blueprint._isReady){
                return blueprint.instantiate();
            } else {
                throw new Error("The provider for "+key+" is deferred and waiting for: [" + blueprint.tryResolveDependencies().join(',') + "]");
            }
            
        } else {
            throw new Error("A provider for "+key+" does not exists in the container");
        }
        
    }    

}