import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import useAppStore from "./store/index"; // Zustand store
import apiClient from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

// PrivateRoute: Redirect to /auth if user is not authenticated
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore(); // Destructure as an object
  const isAuthenticated = !!userInfo;
  const [loading, setLoading] = useState(true); // Add loading state

  return isAuthenticated ? children : <Navigate to="/auth/" />;
};

// AuthRoute: Redirect to /chat if user is authenticated
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore(); // Destructure as an object
  const isAuthenticated = !!userInfo;

  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore(); // Destructure as an object
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
