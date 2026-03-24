import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

export const getUserOrders = createAsyncThunk(
  'userOrders/getUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

interface UserOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    clearUserOrders: (state) => {
      state.orders = [];
      state.error = null;
    },
    addOrder: (state, action) => {
      const exists = state.orders.some(
        (order) => order.number === action.payload.number
      );
      if (!exists) {
        state.orders = [action.payload, ...state.orders];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      });
  }
});

export const { clearUserOrders, addOrder } = userOrdersSlice.actions;

export const selectUserOrders = (state: RootState) => {
  return state.userOrders.orders;
};
export const selectUserOrdersLoading = (state: RootState) =>
  state.userOrders.isLoading;
export const selectUserOrdersError = (state: RootState) =>
  state.userOrders.error;
