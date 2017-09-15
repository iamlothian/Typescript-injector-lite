import {Blueprint} from './blueprint'

/**
 * 
 */
export class Factory extends Blueprint {
    
    constructor(
        public key:string,
        public provider:any,
        dependencies:Array<string>
    ){
        super(key,provider,dependencies);
    }

    instantiate() {
        return new this.provider(...this.getResolvedDependencies());
    }

}