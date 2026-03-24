import { FC } from 'react';
import styles from './orders-list.module.css';
import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';

export const OrdersListUI: FC<OrdersListUIProps> = ({ orderByDate }) => {
  if (!orderByDate || orderByDate.length === 0) {
    return <div className={styles.empty}>Нет заказов</div>;
  }

  return (
    <div className={styles.content}>
      {orderByDate.map((order) => (
        <OrderCard order={order} key={order._id} />
      ))}
    </div>
  );
};
