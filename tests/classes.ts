import { Injector } from "../src/";

@Injector.service()
export class A {
    private _count:number = 0
    constructor(){
        console.info("Constructed:", this);
    }
    public count() {
        return ++this._count;
    }
}
@Injector.factory("B")
export class B {
    private _count:number =  0;
    constructor(){
        console.info("Constructed:", this);
    }
    public count() {
        return ++this._count;
    }
}
@Injector.injectable()
export class C {
    constructor(@Injector.inject() public a:A, 
                @Injector.inject() public b:B) {
        console.info("Constructed:", this, this.a.count(), this.b.count());
    }
}
@Injector.injectable()
export class D {
    constructor(@Injector.inject() public b:B) {
        console.info("Constructed:", this, this.b.count());
    }
}
@Injector.injectable()
export class E {
    constructor(@Injector.inject() public c:C, 
                @Injector.inject() public d:D) {
        console.info("Constructed:", this, this.c.a.count(), this.d.b.count());
    }
}