import {Blueprint} from './blueprint'

/**
 * 
 */
export class Service extends Blueprint {
    
    private _service;

    constructor(
        public key:string,
        public provider:any,
        dependencies:Array<string>
    ){
        super(key,provider,dependencies);
    }

    instantiate() {
        this._service = 
            !!this._service ? 
            this._service : 
            new this.provider(...this.getResolvedDependencies());
        return this._service;
    }

}