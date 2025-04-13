// app/context/UserContext.js
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [contextLoginData, setContextLoginData] = useState(null);
  const [login, setIsLogin]=useState(false);
  const [sessionToken, setSessionToken]=useState(null);

  return (
    <UserContext.Provider value={{ contextLoginData, setContextLoginData, login, setIsLogin, sessionToken, setSessionToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
