import React from "react";
import { Modal, Form, Input, Button, Typography, message } from "antd";
import { login, register } from "../services/user.service";

const { Text } = Typography;

export default function AuthForm({ open, onClose, mode, setMode }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (mode === "login") {
        const data = await login(values);
        if (data.token) {
          localStorage.setItem("token", data.token);
          message.success("Logged in successfully!");
          onClose();
          form.resetFields();
          // Optionally trigger a reload or state change
          window.location.reload();
        } else {
          message.error("Login failed. No token received.");
        }
      } else {
        await register(values);
        message.success("Registered successfully! Please login.");
        setMode("login");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "An error occurred";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={mode === "login" ? "Login to CodePilot" : "Create Account"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ username: "", password: "" }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters!" }
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {mode === "login" ? "Login" : "Register"}
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          {mode === "login" ? (
            <Text>
              Don't have an account?{" "}
              <Button type="link" onClick={() => setMode("register")} style={{ padding: 0 }}>
                Register
              </Button>
            </Text>
          ) : (
            <Text>
              Already have an account?{" "}
              <Button type="link" onClick={() => setMode("login")} style={{ padding: 0 }}>
                Login
              </Button>
            </Text>
          )}
        </div>
      </Form>
    </Modal>
  );
}
