import { FC } from 'react';
import { OrderDetailsUI } from '@ui';

type OrderDetailsProps = {
  orderNumber: number;
};

export const OrderDetails: FC<OrderDetailsProps> = ({ orderNumber }) => (
  <OrderDetailsUI orderNumber={orderNumber} />
);
