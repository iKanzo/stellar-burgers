import { getIngredients, ingredientsSlice } from './ingredientsSlice';

const reducer = ingredientsSlice.reducer;

describe('ingredients slice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('should handle pending', () => {
    const state = reducer(initialState, getIngredients.pending('', undefined));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fulfilled', () => {
    const mockData = [
      {
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
      }
    ];

    const state = reducer(
      initialState,
      getIngredients.fulfilled(mockData, '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockData);
  });

  it('should handle rejected', () => {
    const state = reducer(
      initialState,
      getIngredients.rejected(new Error('network error'), '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('network error');
  });
});
