import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  data: {
    id: string;
    email: string;
    customerStripeId: string;
  } | null;
  error: string | null;
  loading: boolean;
}

const UserContext = createContext<
  [User, React.Dispatch<React.SetStateAction<User>>]
>([{ data: null, loading: true, error: null }, () => {}]);

export const UserProvider = ({ children }: any) => {
  // user state
  const [user, setUser] = useState<User>({
    data: null,
    loading: true,
    error: null,
  });

  // Before fetching response from /me, we need to make sure token is inside of header
  const token = localStorage.getItem("token");

  // If token exists, sets all of our request headers to have the Bearer token
  if (token) {
    axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
  }

  // Function to fetch response from Middleware (If pass we'll get a response to update state)
  const fetchUser = async () => {
    const { data: response } = await axios.get("http://localhost:8080/auth/me");

    // If data exists, update User state, else Error
    if (response.data && response.data.user) {
      setUser({
        data: {
          id: response.data.user.id,
          email: response.data.user.email,
          customerStripeId: response.data.user.customerStripeId,
        },
        loading: false,
        error: null,
      });
    } else if (response.data && response.data.errors.length) {
      setUser({
        data: null,
        loading: false,
        error: response.errors[0].msg,
      });
    }
  };

  // on page load, if token exists, we run FetchUser. Else, we set user to initial state.
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser({
        data: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
