import * as Injector from "../dist"

console.log("start");

Injector.importValue("A","A")
var A = Injector.instantiate("A")