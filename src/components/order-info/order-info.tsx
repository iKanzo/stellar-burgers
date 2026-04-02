import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OrderInfoUI, Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { TIngredient, TOrder } from '@utils-types';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectFeedOrders } from '../../services/slices/feedSlice';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams();

  const ingredients = useSelector(selectIngredients);
  const orders = useSelector(selectFeedOrders);

  const [orderFromApi, setOrderFromApi] = useState<TOrder | null>(null);

  const orderData =
    orders.find((order) => String(order.number) === number) || orderFromApi;

  useEffect(() => {
    if (!number || orderData) return;

    getOrderByNumberApi(number)
      .then((data) => setOrderFromApi(data))
      .catch((err) => console.error(err));
  }, [number, orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
