import {Blueprint} from './blueprint'

/**
 * 
 */
export class Alias extends Blueprint {
    
    constructor(
        public key:string,
        public provider:any,
        dependencies:Array<string>
    ){
        super(key,provider,dependencies);
    }

    instantiate() {
        return this.provider.instantiate();
    }

}