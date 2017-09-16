import 'jasmine'
import * as Injector from "../";

import {A} from './a'
import {B} from './b'
import {C} from './c'

Injector.importValue("myValue", [1,2,3]);

describe("Injector", () => {

    it("can throw an error if an instance is requested but not defined", () => {
        expect(()=>{
            Injector.instantiate("E");
        }).toThrowError('A provider for E does not exists in the container');
    })

    it("can throw an error if an instance is already registered with the container", () => {
        expect(()=>{
            Injector.importValue("A", "A");
        }).toThrowError('A provider for A already exists in the container');
    })

    it("can register external or non class injectable objects using the value() method", () => {
        var myValue = Injector.instantiate("myValue");
        expect(myValue).toEqual([1,2,3]);
    })

    it("can instance injectable classes", () => {
        var a:A = Injector.instantiate("A");
        expect(a instanceof A).toBe(true);
    });

    it("can instance singleton services using the service annotation", () => {
        var a1:A = Injector.instantiate("A"),
            a2:A = Injector.instantiate("A");
        expect(a1.count()).toBe(1);
        expect(a2.count()).toBe(2);
        expect(a1.count()).toBe(3);
        expect(a2.count()).toBe(4);
    });

    it("can instance an injectable using an alias", () => {
        var b1:B = Injector.instantiate("B_Alias"),
            b2:B = Injector.instantiate("B");
        expect(b1 instanceof B).toBe(true);
        expect(b2 instanceof B).toBe(true);
    });

    it("can instance factory instance using the factory annotation", () => {
        var b1:B = Injector.instantiate("B"),
            b2:B = Injector.instantiate("B");
        expect(b1.count()).toBe(1);
        expect(b2.count()).toBe(1);
        expect(b1.count()).toBe(2);
        expect(b2.count()).toBe(2);
    });

    it("can throw an error if an instance is defined but not ready yet, and give details", () => {
        expect(()=>{
            Injector.instantiate("C");
        }).toThrowError('The provider for C is deferred and waiting for: [deferredValue]');
    })

    it("can defer the construction of a class until all of the required dependencies are constructed", () => {
        Injector.importValue("deferredValue", "deferred");
        var c:C = Injector.instantiate("C");
        expect(c.deferredValue).toEqual('deferred');
    })

    it ('can throw as error if a injected constructor tries to inject itself', ()=>{

        expect(()=>{
            @Injector.service()
            class Test{constructor(@Injector.inject() public t:Test){}}
        }).toThrowError('Argument 0 of the constructor for Test can not inject itself.');

    })

});

