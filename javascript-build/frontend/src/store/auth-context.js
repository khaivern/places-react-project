import { createContext, useCallback, useEffect, useState } from 'react';

const AuthContext = createContext({
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
});

let logoutTimer;

export const AuthContextProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((uid, token, expirationDate = null) => {
    setUserId(uid);
    setToken(token);
    const tokenExpiration =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpiration);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpiration.toISOString(),
      })
    );
  }, []);
  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
  }, []);

  // Auto login
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (
      userData &&
      userData.token &&
      new Date(userData.expiration) > new Date()
    ) {
      login(userData.userId, userData.token, new Date(userData.expiration));
    }
  }, [login]);

  // Auto logout
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(() => {
        logout();
      }, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  const context = {
    userId,
    token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
