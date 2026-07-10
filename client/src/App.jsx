import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LibPage from "./pages/LibPage";
import RepoPage from "./pages/RepoPage";
import ProfilePage from "./pages/ProfilePage";
import MainLayout from "./components/MainLayout";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    // Check local storage token changes (e.g. from same domain)
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (!token) {
    return <LandingPage />;
  }

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/library" element={<LibPage />} />
          <Route path="/repo/:id" element={<RepoPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/library" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
