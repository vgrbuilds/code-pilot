import { useState } from "react";
import { Button, Flex, Typography } from "antd";
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
    <>
      <Flex
        vertical
        justify="center"
        align="center"
        style={{
          minHeight: "100vh",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <Title>CodePilot</Title>

        <Paragraph style={{ maxWidth: 600 }}>
          Chat with any GitHub repository. Generate documentation, understand
          architecture, and explore codebases using AI.
        </Paragraph>

        <Flex gap="middle">
          <Button type="primary" size="large" onClick={openRegister}>
            Get Started
          </Button>

          <Button size="large" onClick={openLogin}>
            Login
          </Button>
        </Flex>
      </Flex>

      <AuthForm
        open={open}
        onClose={() => setOpen(false)}
        mode={mode}
        setMode={setMode}
      />
    </>
  );
}