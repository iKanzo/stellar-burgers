import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <div
            className={styles.link_position_last}
            onClick={() => {
              navigate('/');
            }}
          >
            <BurgerIcon type={'primary'} />
            <p
              onClick={() => navigate('/')}
              className='text text_type_main-default ml-2 mr-10'
            >
              Конструктор
            </p>
          </div>
          <div
            className={styles.link_position_last}
            onClick={() => {
              navigate('/feed');
            }}
          >
            <ListIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </div>
        </div>
        <div
          onClick={() => {
            navigate('/');
          }}
          className={styles.logo}
        >
          <Logo className='' />
        </div>
        <div
          className={styles.link_position_last}
          onClick={() => {
            navigate('/profile');
          }}
        >
          <ProfileIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </div>
      </nav>
    </header>
  );
};
