import * as Injector from "../src";

@Injector.factory("B_Alias")
export class B {
    private _count:number =  0;
    constructor(@Injector.inject("myValue") public value:Object){}
    public count() {
        return ++this._count;
    }
}