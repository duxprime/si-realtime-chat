/// <reference types="../../cypress.d.ts" />
import { Subject } from 'rxjs';
import type { AuthenticationRespDto, AuthenticationReqDto } from 'domain/authentication';
import type { UserCollectionDto } from 'domain/user';
import type { MessageDto, MessageHistoryDto, MessageReqDto, MessageRespDto } from 'domain/message';
import type { AppEvent } from 'domain/event-bus';

interface StateStore {
    users: UserCollectionDto['users'];
    messages: MessageDto[];
}

const eventBus = new Subject<AppEvent>();
export const event$ = eventBus.asObservable();

const defaultState: Readonly<StateStore> = Object.freeze({
    users: [],
    messages: [],
});

let sharedState: StateStore = {
    ...defaultState
};

export function interceptLogin(){
    return cy.intercept('POST', '/signin', req => {
        const { user } = req.body as AuthenticationReqDto;
        const respBody: AuthenticationRespDto = {
            user
        };

        sharedState.users.push(user);
        eventBus.next({
            kind: 'signIn',
            user
        });

        req.reply(respBody);
    }).as('signIn');
}

export function interceptUsers(){
    return cy.intercept('GET', '/users', req => {
        const { users } = sharedState;
        const respBody: UserCollectionDto = {
            users
        };

        req.reply(respBody);
    }).as('users');
}

export function interceptMessages(){
    return cy.intercept('GET', '/messages', req => {
        const { messages } = sharedState;
        const respBody: MessageHistoryDto = {
            messages
        };

        req.reply(respBody);
    })
    .as('getMessages')
    .intercept('POST', '/messages', req => {
        const { user, message } = req.body as MessageReqDto; 
        const nextIndex = sharedState.messages.length;
        const respBody: MessageRespDto = {
            index: nextIndex
        };

        sharedState.messages.push({
            user,
            message,
            index: nextIndex
        });

        eventBus.next({
            kind: 'message',
            user,
            index: nextIndex,
            message
        });

        req.reply(respBody);

    })
    .as('sendMessage');
}

export function resetState(){
    sharedState = {
        ...defaultState
    };
}