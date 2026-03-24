import { FC, memo } from 'react';
import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  console.log('📋 OrdersList - received orders prop:', orders?.length);

  if (!orders || orders.length === 0) {
    console.log('📋 OrdersList - no orders, returning null');
    return <div>Нет заказов</div>;
  }

  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  console.log('📋 OrdersList - sorted orders count:', orderByDate.length);
  console.log('📋 OrdersList - first order:', orderByDate[0]?.number);

  return <OrdersListUI orderByDate={orderByDate} />;
});
