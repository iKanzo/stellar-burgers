import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { selectConstructor } from '../../services/slices/constructorSlice';
import {
  clearOrder,
  createOrder,
  selectOrderData,
  selectOrderLoading
} from '../../services/slices/orderSlice';
import { selectIsAuthenticated } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector(selectConstructor);
  const orderData = useSelector(selectOrderData);
  const orderRequest = useSelector(selectOrderLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const otherIngredients: TConstructorIngredient[] = (ingredients || []).filter(
    (item) => item.type !== 'bun'
  );

  const constructorItems = {
    bun,
    ingredients: otherIngredients
  };

  const orderModalData: TOrder | null = orderData
    ? {
        _id: 'temp-id',
        status: 'done',
        name: 'Заказ',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: orderData.order.number,
        ingredients: []
      }
    : null;

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce((sum, item) => sum + item.price, 0),
    [constructorItems]
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }

    const orderArray = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(orderArray));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  return (
    <BurgerConstructorUI
      constructorItems={constructorItems}
      orderRequest={orderRequest}
      orderModalData={orderModalData}
      price={price}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      isModalOpen={!!orderModalData}
    />
  );
};
