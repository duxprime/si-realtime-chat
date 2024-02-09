/// <reference types="../../cypress.d.ts" />

import type { ReflectiveInjector } from 'injection-js';
import { AuthenticationService } from 'domain/authentication';
import { Ctor } from 'utils/types';
import type { InjectionKey } from 'vue';
import { mount } from 'cypress/vue'

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

interface ServiceDef<T> {
    key: InjectionKey<T>;
    instance: T;
}

export function addCustomCommands(injector: ReflectiveInjector, resolved: ServiceDef<any>[]){
    Cypress.Commands.add('mount', (...args: Parameters<typeof mount>) => {
        const provide = resolved.reduce((serviceDict, pair ) => {
            const {key, instance} = pair;
            serviceDict[key as symbol] = instance;

            return serviceDict;
        }, {} as Record<symbol, object>);

        let [ component, options] = args;

        if(!options) {
            options = {
                global: {
                }
            };
        }

        if(!options.global) {
            options.global = {}
        }

        options.global.provide = provide;
        return mount(component, options);
    });

    Cypress.Commands.add('login', async userName => {
        const authService:AuthenticationService = injector.get(AuthenticationService);
        await authService.signIn(userName);
    });

    Cypress.Commands.add('getService', (token: Ctor) => {
        return cy.wrap(injector.get(token));
    })
}