import { useState } from "react";
import { Button, Flex, Typography } from "antd";
import { GithubOutlined, ArrowRightOutlined } from "@ant-design/icons";
import AuthForm from "../components/AuthForm";

const { Title, Paragraph } = Typography;

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login");

  const openLogin = () => {
    setMode("login");
    setOpen(true);
  };

  const openRegister = () => {
    setMode("register");
    setOpen(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 50% 30%, #062f21 0%, #020403 70%)",
      color: "#f3f4f6",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "4rem 2rem",
      position: "relative",
      overflow: "hidden",
      textAlign: "center"
    }}>
      {/* Abstract Glowing Aura */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "50vw",
        height: "50vw",
        background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 60%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Grid Pattern Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <Flex
        vertical
        align="center"
        style={{ zIndex: 1, maxWidth: 800, margin: "0 auto" }}
        gap="large"
      >
        {/* Brand Tag */}
        <div style={{
          background: "rgba(16, 185, 129, 0.1)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          padding: "4px 16px",
          borderRadius: 20,
          fontSize: "0.85rem",
          fontWeight: 600,
          color: "#10b981",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: "1rem"
        }}>
          ✨ AI-Powered Code Explorer
        </div>

        {/* Gradient Headline */}
        <Title style={{ 
          fontSize: "4.5rem", 
          fontWeight: 900, 
          margin: 0, 
          lineHeight: 1.05, 
          letterSpacing: "-0.05em",
          color: "#ffffff"
        }}>
          Chat with any{" "}
          <span style={{
            background: "linear-gradient(135deg, #10b981 30%, #059669 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            GitHub Repository
          </span>
        </Title>

        <Paragraph style={{ 
          color: "#9ca3af", 
          fontSize: "1.25rem", 
          lineHeight: 1.6, 
          maxWidth: 640, 
          marginTop: "0.5rem" 
        }}>
          Understand complex architectures, generate documentation, and search files instantly. CodePilot indexes any public repository using semantic vector embeddings.
        </Paragraph>

        {/* Action Buttons */}
        <Flex gap="middle" style={{ marginTop: "1rem" }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={openRegister}
            style={{ 
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
              borderColor: "transparent",
              height: "48px",
              padding: "0 28px",
              borderRadius: "8px",
              fontWeight: 600,
              boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Get Started Free <ArrowRightOutlined />
          </Button>

          <Button 
            size="large" 
            onClick={openLogin}
            style={{ 
              background: "rgba(255, 255, 255, 0.05)", 
              color: "#ffffff",
              borderColor: "rgba(255, 255, 255, 0.1)",
              height: "48px",
              padding: "0 28px",
              borderRadius: "8px",
              fontWeight: 600,
              transition: "background 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
          >
            Sign In
          </Button>
        </Flex>

        {/* Dashboard Mockup Preview */}
        <div style={{
          marginTop: "4rem",
          width: "100%",
          maxWidth: 760,
          background: "rgba(17, 24, 39, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 16,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          padding: "8px",
          backdropFilter: "blur(20px)",
          position: "relative",
          zIndex: 1
        }}>
          {/* Mock Browser Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
            <div style={{ 
              marginLeft: "1.5rem", 
              background: "rgba(255,255,255,0.05)", 
              fontSize: "0.75rem", 
              padding: "2px 16px", 
              borderRadius: 6, 
              color: "#9ca3af",
              fontFamily: "var(--mono)"
            }}>
              codepilot.ai/repo/supabase/supabase
            </div>
          </div>
          
          {/* Mock UI Body */}
          <div style={{
            background: "rgba(3, 7, 18, 0.6)",
            borderRadius: 12,
            height: 280,
            display: "flex",
            overflow: "hidden"
          }}>
            {/* Sidebar */}
            <div style={{ width: 160, borderRight: "1px solid rgba(255, 255, 255, 0.05)", padding: "12px", display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
              <div style={{ width: "80%", height: 12, background: "rgba(255, 255, 255, 0.2)", borderRadius: 4 }} />
              <div style={{ width: "50%", height: 8, background: "rgba(255, 255, 255, 0.08)", borderRadius: 3 }} />
              <div style={{ width: "65%", height: 8, background: "rgba(255, 255, 255, 0.08)", borderRadius: 3 }} />
              <div style={{ width: "40%", height: 8, background: "rgba(255, 255, 255, 0.08)", borderRadius: 3 }} />
            </div>
            
            {/* Chat Body */}
            <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12, textAlign: "left" }}>
              {/* User Bubble */}
              <div style={{ alignSelf: "flex-end", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "8px 12px", borderRadius: "12px 12px 0 12px", maxWidth: "60%" }}>
                <div style={{ width: 120, height: 6, background: "#f3f4f6", borderRadius: 3 }} />
              </div>
              {/* AI Bubble */}
              <div style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 12px", borderRadius: "12px 12px 12px 0", maxWidth: "70%", display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ width: 180, height: 6, background: "#9ca3af", borderRadius: 3 }} />
                <div style={{ width: 150, height: 6, background: "#9ca3af", borderRadius: 3 }} />
                <div style={{ width: 100, height: 6, background: "#9ca3af", borderRadius: 3 }} />
              </div>
            </div>
          </div>
        </div>
      </Flex>

      <AuthForm
        open={open}
        onClose={() => setOpen(false)}
        mode={mode}
        setMode={setMode}
      />
    </div>
  );
}