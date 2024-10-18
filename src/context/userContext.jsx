import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Check if there's a user state in localStorage when initializing
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    return storedLoginStatus === 'true'; // Parse as boolean
  });
  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem('userRole'); // Use 'userRole' here
    return storedRole ? storedRole : null;
  });

  // Use useEffect to update localStorage whenever the login state changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('userRole', role); // Use 'userRole' here
    } else {
      localStorage.removeItem('userRole'); // Clean up when role is null
    }
  }, [role]);

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
