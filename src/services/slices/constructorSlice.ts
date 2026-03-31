import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

export type TConstructorIngredient = TIngredient & {
  id: string;
};

interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient>) {
      state.bun = {
        ...action.payload,
        id: nanoid()
      };
    },

    addIngredient(state, action: PayloadAction<TIngredient>) {
      if (!action.payload) return;

      state.ingredients.push({
        ...action.payload,
        id: nanoid()
      });
    },

    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = Array.isArray(state.ingredients)
        ? state.ingredients.filter((item) => item.id !== action.payload)
        : [];
    },

    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const { setBun, addIngredient, removeIngredient, clearConstructor } =
  constructorSlice.actions;

export const selectConstructor = (state: RootState) => state.burgerConstructor;

export default constructorSlice.reducer;
