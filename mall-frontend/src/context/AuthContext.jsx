import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAuth, operatorAuth } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [operator, setOperator] = useState(null);
  const [authType, setAuthType] = useState(null); // 'user' | 'operator'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const type = localStorage.getItem('auth_type');
    const stored = localStorage.getItem('auth_data');
    if (token && stored) {
      const data = JSON.parse(stored);
      setAuthType(type);
      if (type === 'user') setUser(data);
      if (type === 'operator') setOperator(data);
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    const res = await userAuth.login({ email, password });
    const { user: u, tokens } = res.data.data;
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('auth_type', 'user');
    localStorage.setItem('auth_data', JSON.stringify(u));
    setUser(u);
    setAuthType('user');
    return u;
  };

  const registerUser = async (data) => {
    const res = await userAuth.register(data);
    const { user: u, tokens } = res.data.data;
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('auth_type', 'user');
    localStorage.setItem('auth_data', JSON.stringify(u));
    setUser(u);
    setAuthType('user');
    return u;
  };

  const loginOperator = async (email, password) => {
    const res = await operatorAuth.login({ email, password });
    const { operator: op, tokens } = res.data.data;
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('auth_type', 'operator');
    localStorage.setItem('auth_data', JSON.stringify(op));
    setOperator(op);
    setAuthType('operator');
    return op;
  };

  const registerOperator = async (data) => {
    const res = await operatorAuth.register(data);
    const { operator: op, tokens } = res.data.data;
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('auth_type', 'operator');
    localStorage.setItem('auth_data', JSON.stringify(op));
    setOperator(op);
    setAuthType('operator');
    return op;
  };

  const logout = async () => {
    try {
      if (authType === 'user') await userAuth.logout();
      if (authType === 'operator') await operatorAuth.logout();
    } catch {}
    localStorage.clear();
    setUser(null);
    setOperator(null);
    setAuthType(null);
  };

  const isLoggedIn = !!localStorage.getItem('access_token');
  const currentUser = authType === 'user' ? user : operator;

  return (
    <AuthContext.Provider value={{
      user, operator, authType, loading, isLoggedIn, currentUser,
      loginUser, registerUser, loginOperator, registerOperator, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
