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
        {/* Gradient Headline */}
        <Title style={{ 
          fontSize: "3.5rem", 
          fontWeight: 800, 
          margin: 0, 
          lineHeight: 1.15, 
          letterSpacing: "-0.04em",
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
          fontSize: "1.15rem", 
          lineHeight: 1.5, 
          maxWidth: 600, 
          marginTop: "0.25rem" 
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
              height: "46px",
              padding: "0 24px",
              borderRadius: "6px",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)"
            }}
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
              height: "46px",
              padding: "0 24px",
              borderRadius: "6px",
              fontWeight: 600
            }}
          >
            Sign In
          </Button>
        </Flex>
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