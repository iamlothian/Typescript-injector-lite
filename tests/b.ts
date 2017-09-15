import { Injector } from "../src/";

@Injector.factory("B_Alias")
export class B {
    private _count:number =  0;
    constructor(){}
    public count() {
        return ++this._count;
    }
}