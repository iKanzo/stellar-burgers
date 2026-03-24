import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import {
  getFeed,
  selectFeedLoading,
  selectFeedOrders
} from '../../services/slices/feedSlice';
import { TOrder } from '@utils-types';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);

  useEffect(() => {
    console.log('Feed - загрузка ленты заказов');
    dispatch(getFeed())
      .unwrap()
      .then((data) => {
        console.log(
          'Feed - успешно загружено:',
          data?.orders?.length,
          'заказов'
        );
      })
      .catch((err) => {
        console.error('Feed - ошибка загрузки:', err);
      });
  }, [dispatch]);

  const handleGetFeeds = () => {
    console.log('Feed - ручное обновление');
    dispatch(getFeed());
  };

  if (isLoading && !orders.length) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '100px'
        }}
      >
        <Preloader />
      </div>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
