import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '../store';
import { useEffect } from 'react';
import { authActions } from '../store/auth';

let timer: NodeJS.Timeout;
const useAuthHook = () => {
  const token = useSelector<RootState>((state) => state.auth.token) as
    | string
    | null;
  const userId = useSelector<RootState>((state) => state.auth.userId) as
    | string
    | null;
  const expiration = useSelector<RootState>(
    (state) => state.auth.expiration
  ) as string | null;

  const dispatch = useAppDispatch();
  // auto-login -> set expiration token date
  useEffect(() => {
    if (token && userId && expiration) {
      dispatch(authActions.login({ token, userId, expiration }));
    }
  }, [dispatch, token, userId, expiration]);

  // auto-logout -> chk s.exp > c.exp
  useEffect(() => {
    if (token && userId && expiration) {
      const remainingTime =
        new Date(expiration).getTime() - new Date().getTime();
      if (remainingTime > 0) {
        // exp.date ahead curr.date
        timer = setTimeout(() => dispatch(authActions.logout()), remainingTime);
      }
    } else {
      // curr.date ahead exp.date or manual logout
      clearTimeout(timer);
    }
  }, [token, userId, expiration, dispatch]);

  return { token };
};

export default useAuthHook;
