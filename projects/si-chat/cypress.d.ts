/// <reference types="cypress" />
import { Ctor } from 'utils/types';
import type { mount } from 'cypress/vue'

declare namespace Cypress {
    interface Chainable {
        login(userName: string) : Chainable<void>;
        mount: typeof mount;
        getService<T extends Ctor>(token: T): Chainable<T>;
    }
}
