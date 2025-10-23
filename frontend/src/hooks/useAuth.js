import { useSelector, useDispatch } from "react-redux";
import { useGetMeQuery } from "../store/api/apiSlice";
import { setCredentials, logout } from "../store/slices/authSlice";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    data: meData,
    isLoading: isMeLoading,
    error: meError,
  } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Logout function
  const logoutUser = () => {
    localStorage.removeItem("token");
    dispatch(logout());
  };

  // Update user data when me query succeeds
  useEffect(() => {
    if (meData?.user) {
      dispatch(
        setCredentials({
          user: meData.user,
          token: localStorage.getItem("token"),
        })
      );
    }
  }, [meData, dispatch]);

  // Handle me query error
  useEffect(() => {
    if (meError && isAuthenticated) {
      dispatch(logout());
    }
  }, [meError, isAuthenticated, dispatch]);

  return {
    user,
    isAuthenticated,
    loading: loading || isMeLoading,
    error,
    logout: logoutUser,
  };
};
