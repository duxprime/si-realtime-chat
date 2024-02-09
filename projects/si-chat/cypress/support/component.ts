// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import { addCustomCommands } from './commands';
import '../../src/assets/main.css'

import { createApp } from 'vue'
import { bootstrap } from '../../src/setup';
import { createMockEventBus } from '../mocks';
import { type ValueProvider } from 'injection-js';
import { EventBusService } from 'domain/event-bus';
import App from '../../src/App.vue'

const app = createApp(App);
const mockedProviders: ValueProvider[] = [{
    provide: EventBusService,
    useValue: createMockEventBus()
}];
const { injector, serviceMap } = bootstrap(app, mockedProviders);
addCustomCommands(injector, serviceMap);

