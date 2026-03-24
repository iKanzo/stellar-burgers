import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  clearOrder,
  createOrder,
  selectOrderData,
  selectOrderLoading
} from '../../services/slices/orderSlice';
import { selectIsAuthenticated } from '../../services/slices/userSlice';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ingredients = useSelector(selectIngredients);
  const orderData = useSelector(selectOrderData);
  const orderRequest = useSelector(selectOrderLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const bun = ingredients.find((item: TIngredient) => item.type === 'bun');
  const otherIngredients = ingredients.filter(
    (item: TIngredient) => item.type !== 'bun'
  );

  const constructorItems = {
    bun: bun || null,
    ingredients: otherIngredients.map((ing: TIngredient) => ({
      ...ing,
      id: `${ing._id}_${Math.random()}`
    }))
  };

  const orderModalData: TOrder | null = orderData
    ? {
        _id: '',
        status: 'done',
        name: 'Заказ',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: orderData.order.number,
        ingredients: []
      }
    : null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }

    const orderDataArray = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (item: TConstructorIngredient) => item._id
      ),
      constructorItems.bun._id
    ];

    dispatch(createOrder(orderDataArray));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
