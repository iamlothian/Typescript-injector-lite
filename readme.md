# Typescript-injector-lite

A light dependency injection framework utilizing typescript annotations.

- No binding
- No bootstrapping
- Deferred dependency resolution and injection

## Service
A class annotated as a `service` will be injected as a singleton instance, and shared between all instances that require it.
```
import * as Injector from "typescript-injector-lite";

@Injector.service()
export class A {
    constructor(){}
}
```

## Factory
A class annotated as a `factory` will be injected as a new instance every time it is require.
- An optional alias lets you choose a second name to use to inject the class.

```
import * as Injector from "typescript-injector-lite";

@Injector.factory('my:B')
export class B {
    constructor(){}
}
```

## Inject
Annotated classes can make use of constructor injecting using the `inject` annotation.
- For class typed attributes the type name will be used by default to resolve the instance from the container
- Else an explicit name can be used to resolve the instance.
```
import * as Injector from "typescript-injector-lite";

@Injector.service()
export class C {
    constructor(
        @Injector.inject() public a:A,
        @Injector.inject('my:B') public b,
    ){}
}
```

## ImportValue
where there are non classical objects or external instances that you with to inject, you can make use of the `importValue` method to make the container aware of them.

```
Injector.importValue("myValue", [1,2,3]);
```

## Instantiate
In cases where you want to retrieve an instance from the container without constructor injection, the `instantiate` method can be used.

```
Injector.instantiate("myValue");
```

## Deferred Resolution
When a class is registered with the container, it will attempt to find all of is dependencies. If one or more dependencies are missing, the class will deffer is resolution and listen for the required class to be registered.

If there are no dependencies, or all of the required dependencies have been resolved, the registering class will build and instance itself in the container. Then call out to any listening classes who require it.

