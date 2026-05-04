import reducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient,
  setBun
} from './constructorSlice';

import { TIngredient } from '@utils-types';

describe('burgerConstructor slice', () => {
  const ingredient: TIngredient = {
    _id: '1',
    name: 'cheese',
    type: 'main',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  it('should add ingredient', () => {
    const state = reducer(undefined, addIngredient(ingredient));

    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0].name).toBe('cheese');
    expect(state.ingredients[0].id).toBeDefined();
  });

  it('should remove ingredient', () => {
    const stateWithItem = reducer(undefined, addIngredient(ingredient));

    const id = stateWithItem.ingredients[0].id;

    const state = reducer(stateWithItem, removeIngredient(id));

    expect(state.ingredients.length).toBe(0);
  });

  it('should move ingredient', () => {
    const state1 = reducer(undefined, addIngredient(ingredient));
    const state2 = reducer(
      state1,
      addIngredient({ ...ingredient, name: 'sauce' })
    );

    const state = reducer(state2, moveIngredient({ from: 0, to: 1 }));

    expect(state.ingredients[1].name).toBe('cheese');
  });

  it('should set bun', () => {
    const state = reducer(undefined, setBun(ingredient));

    expect(state.bun?.name).toBe('cheese');
    expect(state.bun?.id).toBeDefined();
  });

  it('should clear constructor', () => {
    const state1 = reducer(undefined, setBun(ingredient));
    const state2 = reducer(state1, addIngredient(ingredient));

    const cleared = reducer(state2, clearConstructor());

    expect(cleared.bun).toBeNull();
    expect(cleared.ingredients.length).toBe(0);
  });
});
