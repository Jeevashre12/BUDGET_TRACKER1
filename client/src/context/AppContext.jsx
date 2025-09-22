import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/is-auth')
      if (data.success) {
        setIsLoggedIn(true)
        fetchUserData() // Fixed: call the local function instead of imported one
      }
    }
    catch (error) {
      // Ignore expected 401 before login; only surface unexpected errors
      const status = error?.response?.status
      if (status && status !== 401) {
        toast.error(error.message)
      }
    }
    finally {
      setAuthChecked(true)
    }
  }

  const fetchUserData = async () => { // Renamed to avoid conflict
    try {
      const { data } = await axios.get(backendUrl + '/api/user/data')
      data.success ? setUserData(data.userData) : toast.error(data.message)
    }
    catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getAuthState();
  }, [])

  const value = {
    backendUrl,
    isLoggedIn,
    authChecked,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData: fetchUserData // Export the renamed function
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};