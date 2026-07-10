import React from "react";
import { Link } from "react-router-dom";
import { Button, Flex } from "antd";

export default function MainLayout({ children }) {
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
        padding: "1rem 2rem",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)"
      }}>
        <Flex align="center" gap="large">
          <Link to="/library" style={{ fontWeight: "bold", fontSize: "1.4rem", color: "var(--accent)", textDecoration: "none" }}>
            CodePilot
          </Link>
          <nav style={{ display: "flex", gap: "1.5rem" }}>
            <Link to="/library" style={{ color: "var(--text-h)", textDecoration: "none", fontWeight: 500 }}>
              Library
            </Link>
            <Link to="/profile" style={{ color: "var(--text-h)", textDecoration: "none", fontWeight: 500 }}>
              Profile
            </Link>
          </nav>
        </Flex>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </header>
      <main style={{ flex: 1, padding: "2rem", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
        {children}
      </main>
    </div>
  );
}
