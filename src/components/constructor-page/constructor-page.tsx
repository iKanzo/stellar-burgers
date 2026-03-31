import { useDispatch, useSelector } from '../../services/store';
import {
  addIngredient,
  clearConstructor,
  removeIngredient,
  selectConstructor
} from '../../services/slices/constructorSlice';
import { createOrder, selectOrderData } from '../../services/slices/orderSlice';
import { useState } from 'react';
import { Modal, OrderInfo } from '../index';
import { TIngredient } from '@utils-types';

export const ConstructorPage = () => {
  const dispatch = useDispatch();
  const constructor = useSelector(selectConstructor);
  const orderData = useSelector(selectOrderData);

  const [isModalOpen, setModalOpen] = useState(false);

  const handleAddIngredient = (ingredient: TIngredient) => {
    dispatch(addIngredient(ingredient));
  };

  const handleRemoveIngredient = (uuid: string) => {
    dispatch(removeIngredient(uuid));
  };

  const handleClear = () => {
    dispatch(clearConstructor());
  };

  const handleCreateOrder = () => {
    if (!constructor.bun) return alert('Выберите булку!');

    const bunId = constructor.bun._id;
    const ingredientIds = constructor.ingredients.map((i) => i._id);

    const orderIds = [bunId, ...ingredientIds, bunId];

    dispatch(createOrder(orderIds));
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <h1>Конструктор бургера</h1>

      <div>
        {constructor.bun ? (
          <div>
            <span>{constructor.bun.name} (булка)</span>
          </div>
        ) : (
          <span>Выберите булку</span>
        )}
      </div>

      <div>
        {constructor.ingredients.map((ing) => (
          <div key={ing.id}>
            <span>{ing.name}</span>
            <button onClick={() => handleRemoveIngredient(ing.id)}>
              Удалить
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleClear}>Очистить</button>
      <button onClick={handleCreateOrder}>Добавить в корзину</button>

      {isModalOpen && orderData && (
        <Modal
          title={`Заказ №${orderData.order.number}`}
          onClose={handleCloseModal}
        >
          <OrderInfo />
        </Modal>
      )}
    </div>
  );
};
