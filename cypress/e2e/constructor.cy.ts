import { IngredientsResponse } from '@utils-types';

describe('тесты для страницы конструктора бургера', () => {
  let ingredients: IngredientsResponse;

  const getIngredientByType = (type: string) => {
    const item = ingredients.data.find((i) => i.type === type);
    if (!item) {
      throw new Error(`Ингредиент типа ${type} не найден`);
    }
    return item;
  };

  const addBaseIngredients = () => {
    const bun = getIngredientByType('bun');
    const main = getIngredientByType('main');

    cy.addIngredient(bun._id);
    cy.addIngredient(main._id);
  };

  beforeEach(() => {
    cy.fixture('ingredients.json').then((data: IngredientsResponse) => {
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

      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });
  });

  it('загружает ингредиенты', () => {
    cy.get('[data-cy^="ingredient-item-"]').should(
      'have.length.greaterThan',
      0
    );
  });

  it('добавляет ингредиенты', () => {
    const bun = getIngredientByType('bun');
    const main = getIngredientByType('main');
    const sauce = getIngredientByType('sauce');

    if (!bun || !main || !sauce) {
      throw new Error('Не найдены необходимые ингредиенты');
    }

    cy.addIngredient(bun._id);
    cy.checkBun(bun.name);

    cy.addIngredient(main._id);
    cy.checkFilling(main.name);

    cy.addIngredient(sauce._id);
    cy.checkFilling(sauce.name);
  });

  describe('Модальные окна', () => {
    it('открывает модалку', () => {
      const ingredient = ingredients.data[0];

      cy.openIngredient(ingredient._id);
      cy.checkModalVisible();
      cy.checkModalContains('Детали ингредиента');
    });

    it('закрывается по крестику', () => {
      const ingredient = ingredients.data[0];

      cy.openIngredient(ingredient._id);
      cy.checkModalVisible();

      cy.closeModalByButton();
      cy.get('[data-cy="modal-window"]').should('not.exist');
    });

    it('закрывается по overlay', () => {
      const ingredient = ingredients.data[0];

      cy.openIngredient(ingredient._id);
      cy.checkModalVisible();

      cy.closeModalByOverlay();
      cy.get('[data-cy="modal-window"]').should('not.exist');
    });

    it('показывает данные', () => {
      const ingredient = ingredients.data[0];

      cy.openIngredient(ingredient._id);
      cy.checkModalContains(ingredient.name);
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/api/orders', {
        fixture: 'newOrder.json'
      }).as('createOrder');

      cy.setCookie('accessToken', 'Bearer test-token');

      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });

    it('создаёт заказ', () => {
      addBaseIngredients();

      cy.createOrder();
      cy.wait('@createOrder');

      cy.checkModalVisible();
      cy.checkOrderNumber(101552);
    });

    it('закрывает модалку заказа', () => {
      addBaseIngredients();

      cy.createOrder();
      cy.wait('@createOrder');

      cy.checkModalVisible();
      cy.closeModalByButton();

      cy.get('[data-cy="modal-window"]').should('not.exist');
    });

    it('очищает конструктор', () => {
      cy.get('[data-cy="topBun"]').should('not.exist');
      cy.get('[data-cy="bottomBun"]').should('not.exist');
      cy.get('[data-cy="filling"]').should('not.exist');

      cy.contains('Выберите начинку').should('exist');
      cy.contains('Выберите булки').should('exist');
    });
  });
});
