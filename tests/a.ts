import * as Injector from "../";

@Injector.service()
export class A {
    private _count:number = 0
    constructor(){}
    public count() {
        return ++this._count;
    }
}