/// <reference types="cypress" />

Cypress.Commands.add('getIngredientById', (id: string) => {
  cy.get(`[data-cy="ingredient-item-${id}"]`);
});

Cypress.Commands.add('addIngredient', (id: string) => {
  cy.getIngredientById(id).contains('Добавить').click();
});

Cypress.Commands.add('openIngredient', (id: string) => {
  cy.getIngredientById(id).first().click();
});

Cypress.Commands.add('checkBun', (name: string) => {
  cy.get('[data-cy="topBun"]').should('contain.text', name);
  cy.get('[data-cy="bottomBun"]').should('contain.text', name);
});

Cypress.Commands.add('checkFilling', (name: string) => {
  cy.get('[data-cy="filling"]').should('contain.text', name);
});

Cypress.Commands.add('checkModalVisible', () => {
  cy.get('[data-cy="modal-window"]').should('be.visible');
});

Cypress.Commands.add('closeModalByButton', () => {
  cy.get('[data-cy="button-close"]').click();
});

Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get('[data-cy="overlay"]').click({ force: true });
});

Cypress.Commands.add('checkModalContains', (text: string) => {
  cy.get('[data-cy="modal-window"]').should('contain.text', text);
});

Cypress.Commands.add('createOrder', () => {
  cy.get('[data-cy="orderButton"]').click();
});

Cypress.Commands.add('checkOrderNumber', (number: number) => {
  cy.get('[data-cy="modal-window"]').should('contain.text', number);
});

declare namespace Cypress {
  interface Chainable {
    getIngredientById(id: string): Chainable<JQuery<HTMLElement>>;
    addIngredient(id: string): Chainable<void>;
    openIngredient(id: string): Chainable<void>;

    checkBun(name: string): Chainable<void>;
    checkFilling(name: string): Chainable<void>;

    checkModalVisible(): Chainable<void>;
    closeModalByButton(): Chainable<void>;
    closeModalByOverlay(): Chainable<void>;
    checkModalContains(text: string): Chainable<void>;

    createOrder(): Chainable<void>;
    checkOrderNumber(number: number): Chainable<void>;
  }
}
