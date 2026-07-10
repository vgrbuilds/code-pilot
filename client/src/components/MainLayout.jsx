import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Flex } from "antd";

export default function MainLayout({ children }) {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/repo/");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%", textAlign: "left" }}>
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.85rem 2rem",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-card)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 1px 3px rgba(0,0,0,0.01)"
      }}>
        <Flex align="center" gap="large">
          <Link to="/library" style={{ fontWeight: "800", fontSize: "1.4rem", color: "var(--accent)", textDecoration: "none", letterSpacing: "-0.04em" }}>
            CodePilot
          </Link>
          <nav style={{ display: "flex", gap: "1.5rem" }}>
            <Link to="/library" style={{ color: "var(--text-h)", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem" }}>
              Library
            </Link>
            <Link to="/profile" style={{ color: "var(--text-h)", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem" }}>
              Profile
            </Link>
          </nav>
        </Flex>
        <Button 
          type="primary" 
          danger 
          onClick={handleLogout}
          style={{ borderRadius: 6, fontWeight: 500 }}
        >
          Logout
        </Button>
      </header>
      <main style={{ 
        flex: 1, 
        background: "var(--bg)", 
        display: "flex", 
        flexDirection: "column",
        width: "100%"
      }}>
        {isChatPage ? (
          children
        ) : (
          <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "2rem 1.5rem", boxSizing: "border-box" }}>
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
