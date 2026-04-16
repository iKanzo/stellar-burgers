describe('тесты для страницы конструктора бургера', () => {
  const testUrl = 'http://localhost:4000/';

  const selectors = {
    ingredient: '[data-cy^="ingredient-item-"]',
    modal: '[data-cy="modal-window"]',
    closeBtn: '[data-cy="button-close"]',
    overlay: '[data-cy="overlay"]',
    topBun: '[data-cy="topBun"]',
    bottomBun: '[data-cy="bottomBun"]',
    filling: '[data-cy="filling"]',
    orderButton: '[data-cy="orderButton"]'
  };

  let ingredients: any;

  beforeEach(() => {
    cy.fixture('ingredients.json').then((data) => {
      ingredients = data;

      cy.intercept('GET', '**/ingredients', {
        statusCode: 200,
        body: ingredients
      }).as('getIngredients');

      cy.intercept('GET', '**/auth/user', {
        statusCode: 200,
        body: {
          success: true,
          user: { email: 'test@test.com', name: 'Test User' }
        }
      }).as('getUser');

      cy.visit(testUrl);

      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });
  });

  it('загружает и отображает ингредиенты', () => {
    cy.get(selectors.ingredient).should('have.length.greaterThan', 0);
  });

  it('добавляет ингредиенты в конструктор', () => {
    const bun = ingredients.data.find((i: any) => i.type === 'bun');
    const main = ingredients.data.find((i: any) => i.type === 'main');
    const sauce = ingredients.data.find((i: any) => i.type === 'sauce');

    cy.get(`[data-cy="ingredient-item-${bun._id}"]`)
      .contains('Добавить')
      .click();

    cy.get(selectors.topBun).should('contain.text', bun.name);
    cy.get(selectors.bottomBun).should('contain.text', bun.name);

    cy.get(`[data-cy="ingredient-item-${main._id}"]`)
      .contains('Добавить')
      .click();

    cy.get(selectors.filling).should('contain.text', main.name);

    cy.get(`[data-cy="ingredient-item-${sauce._id}"]`)
      .contains('Добавить')
      .click();

    cy.get(selectors.filling).should('contain.text', sauce.name);
  });

  describe('Модальные окна', () => {
    it('открывает модалку', () => {
      const ingredient = ingredients.data[0];

      cy.get(`[data-cy="ingredient-item-${ingredient._id}"]`).first().click();

      cy.get(selectors.modal)
        .should('be.visible')
        .and('contain.text', 'Детали ингредиента');
    });

    it('закрывается по крестику', () => {
      const ingredient = ingredients.data[0];

      cy.get(`[data-cy="ingredient-item-${ingredient._id}"]`).first().click();

      cy.get(selectors.modal).should('be.visible');

      cy.get(selectors.closeBtn).click();

      cy.get(selectors.modal).should('not.exist');
    });

    it('закрывается по оверлею', () => {
      const ingredient = ingredients.data[0];

      cy.get(`[data-cy="ingredient-item-${ingredient._id}"]`).first().click();

      cy.get(selectors.modal).should('be.visible');

      cy.get(selectors.overlay).click({ force: true });

      cy.get(selectors.modal).should('not.exist');
    });

    it('показывает корректные данные', () => {
      const ingredient = ingredients.data[0];

      cy.get(`[data-cy="ingredient-item-${ingredient._id}"]`).first().click();

      cy.get(selectors.modal)
        .should('contain.text', ingredient.name)
        .and('be.visible');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/api/orders', {
        fixture: 'newOrder.json'
      }).as('createOrder');

      cy.setCookie('accessToken', 'Bearer test-token');

      cy.visit(testUrl);
      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });

    it('создаёт заказ', () => {
      const bun = ingredients.data.find((i: any) => i.type === 'bun');
      const main = ingredients.data.find((i: any) => i.type === 'main');

      cy.get(`[data-cy="ingredient-item-${bun._id}"]`)
        .contains('Добавить')
        .click();

      cy.get(`[data-cy="ingredient-item-${main._id}"]`)
        .contains('Добавить')
        .click();

      cy.get(selectors.orderButton).click();
      cy.wait('@createOrder');

      cy.get(selectors.modal)
        .should('be.visible')
        .and('contain.text', '101552');
    });

    it('закрывает модалку заказа', () => {
      const bun = ingredients.data.find((i: any) => i.type === 'bun');
      const main = ingredients.data.find((i: any) => i.type === 'main');
      cy.get(`[data-cy="ingredient-item-${bun._id}"]`)
        .first()
        .contains('Добавить')
        .click();
      cy.get(`[data-cy="ingredient-item-${main._id}"]`)
        .first()
        .contains('Добавить')
        .click();
      cy.get(selectors.orderButton).click();
      cy.wait('@createOrder');
      cy.get(selectors.modal).should('be.visible');
      cy.get(selectors.closeBtn).click();
      cy.get(selectors.modal).should('not.exist');
    });

    it('конструктор очищается', () => {
      cy.get(selectors.topBun).should('not.exist');
      cy.get(selectors.bottomBun).should('not.exist');

      cy.contains('Выберите начинку').should('exist');
      cy.contains('Выберите булки').should('exist');
    });
  });
});
