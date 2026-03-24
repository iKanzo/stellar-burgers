import { FC } from 'react';
import styles from './profile-orders.module.css';
import { ProfileOrdersUIProps } from './type';
import { OrdersList, ProfileMenu } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({ orders }) => {
  console.log('🎨 ProfileOrdersUI - received orders:', orders?.length);
  console.log('🎨 ProfileOrdersUI - orders data type:', typeof orders);
  console.log('🎨 ProfileOrdersUI - is array:', Array.isArray(orders));

  return (
    <main className={`${styles.main}`}>
      <div className={`mt-30 mr-15 ${styles.menu}`}>
        <ProfileMenu />
      </div>
      <div className={`mt-10 ${styles.orders}`}>
        <OrdersList orders={orders} />
      </div>
    </main>
  );
};
