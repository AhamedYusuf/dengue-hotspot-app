import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('officialToken'));
  const [email, setEmail] = useState(() => localStorage.getItem('officialEmail'));

  function login(newToken, newEmail) {
    localStorage.setItem('officialToken', newToken);
    localStorage.setItem('officialEmail', newEmail);
    setToken(newToken);
    setEmail(newEmail);
  }

  function logout() {
    localStorage.removeItem('officialToken');
    localStorage.removeItem('officialEmail');
    setToken(null);
    setEmail(null);
  }

  return (
    <AuthContext.Provider value={{ token, email, isOfficial: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
