/// <reference types="../../cypress.d.ts" />
import { interceptLogin, interceptUsers, interceptMessages, resetState } from '../../cypress/mocks';


import HomeView from './HomeView.vue'

describe('<HomeView />', () => {
	const userName = 'Chris';

	before(() => {

	});

	beforeEach(() => {
		interceptLogin();
		interceptUsers();
		interceptMessages();
		// @ts-ignore
		cy.mount(HomeView);
		// @ts-ignore
		cy.login(userName);
		console.log('running before');
	});

	afterEach(() => {
		resetState();
	});

  	it('should show the logged-in user in the user list', () => {
		cy.get('#user-list').should('have.text', `*${userName}`);
 	});

	it('should indicate there there are no messages when none have been sent', () => {
		cy.get('#chat-box').should('have.text', 'No messages yet...');
	});

	it('should send a message', () => {
		const message = 'Hello World!';
		cy.get('#message-box').type(message);
		cy.get('#send-btn').click();
		cy.get('#chat-box').should('have.text', `${userName}: ${message}`)
	})
})