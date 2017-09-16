import {Blueprint} from './blueprint'

/**
 * 
 */
export class Alias extends Blueprint {
    
    private constructor(
        public key:string,
        public provider:any,
        dependencies:Array<string>
    ){
        super(key,provider,dependencies);
    }

    instantiate() {
        return this.provider.instantiate();
    }

    static create(key:string, blueprint:Blueprint): Alias {
        return new Alias(key, blueprint, []);
    }

}