import { FC } from 'react';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/login', { replace: true });
      })
      .catch((err) => {
        console.error('Ошибка выхода:', err);
      });
  };

  return (
    <ProfileMenuUI handleLogout={handleLogout} pathname={location.pathname} />
  );
};
