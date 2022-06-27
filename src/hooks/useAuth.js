import axios from "axios";
import { createContext, useContext, useMemo } from "react"; 
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage.js";

const DOMAIN = "https://lubrytics.com:8443";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("auth", null);
  const navigate = useNavigate();

  const login = async ({user_name,password,remember}) => {
 
   await axios
    .post(
      DOMAIN + "/nadh-api-crm/login",
      {
        user_name,
        password
      } 
    )
    .then((res) => {
        setUser(res.data);
        if(remember) {
            localStorage.setItem('a', JSON.stringify({
                user_name, 
                remember
            }))
        }
        else{
            localStorage.removeItem('a')
        }
    }).catch(err => err.response.status); 
    navigate("/candidates", { replace: true });
  };

  const logout = () => {
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
