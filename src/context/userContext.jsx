import { createContext, useContext, useState } from 'react';

// Create the context
const UserContext = createContext(null);

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// UserProvider component to wrap the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',  
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};