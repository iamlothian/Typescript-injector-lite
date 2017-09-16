import * as Injector from "../src/";
import {A} from './a'
import {B} from './b'

@Injector.service()
export class C {
    constructor(@Injector.inject() public a:A, 
                @Injector.inject() public b:B,
                @Injector.inject("deferredValue") public deferredValue:Object) {
    }
}