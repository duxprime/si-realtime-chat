import { ReflectiveInjector, type ValueProvider } from 'injection-js';
import type { App, InjectionKey } from 'vue';
import { HttpService, HTTP_FETCH_TOKEN, URL_BASE_TOKEN } from 'utils/services/http';
import { SessionStorageService } from 'utils/services/storage';
import { AuthenticationService, AuthServiceSymbol } from 'domain/authentication';
import { MessageService, MessageServiceSymbol } from 'domain/message';
import { EventBusService, EventBusServiceSymbol } from 'domain/event-bus';
import { UserService, UserServiceSymbol } from 'domain/user';
import type { Ctor } from 'utils/types';

interface ServiceDefinition {
    service: Ctor<any>,
    key: InjectionKey<unknown>
}

const serviceTokenPairs:ServiceDefinition[] = [{
    service: AuthenticationService,
    key: AuthServiceSymbol
}, {
    service: MessageService,
    key: MessageServiceSymbol
}, {
    service: EventBusService,
    key: EventBusServiceSymbol
}, {
    service: UserService,
    key: UserServiceSymbol
}];

const providers: ValueProvider[] = [{
    provide: HTTP_FETCH_TOKEN,
    useValue: fetch
}, {
    provide: URL_BASE_TOKEN,
    useValue: '127.0.0.1:3939'
}];


export function registerServices<T>(app: App<T>, serviceOverrides: (Ctor | ValueProvider)[] = []){
    const services = [
        HttpService,
        SessionStorageService,
        ...providers,
        ...serviceTokenPairs.map(def => def.service),
        ...serviceOverrides
    ];
    const injector = ReflectiveInjector.resolveAndCreate(services);
    const serviceMap = serviceTokenPairs.map(({service, key}) => {
        const instance = injector.get(service);
        return {
            key,
            instance
        };
    });

    serviceMap.forEach(({key, instance}) => {
        app.provide(key, instance);
    });

    return {
        injector,
        serviceMap
    };
}