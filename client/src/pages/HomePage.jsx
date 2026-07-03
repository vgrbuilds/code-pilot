import React from "react";
import { Button, Flex, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
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
      <Title level={2}>Welcome to CodePilot Dashboard</Title>
      <Paragraph>You are successfully logged in!</Paragraph>
      <Button type="primary" danger onClick={handleLogout}>
        Logout
      </Button>
    </Flex>
  );
}
