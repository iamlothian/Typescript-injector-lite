
/**
 * 
 */
export class Dependency {
    constructor(
        public required:string,
        public resolved:any = undefined
    ){}
}