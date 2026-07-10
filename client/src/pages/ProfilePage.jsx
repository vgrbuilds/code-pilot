import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, List, Typography, Space, Tag, Modal, Alert, Row, Col, Spin, Empty } from "antd";
import { UserOutlined, LockOutlined, DeleteOutlined, MessageOutlined, ArrowRightOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { getCurrentUser, updateProfile, deleteProfile } from "../services/user.service";
import { getUserConversations } from "../services/chat.service";

const { Title, Paragraph, Text } = Typography;

export default function ProfilePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, chatRes] = await Promise.all([
        getCurrentUser(),
        getUserConversations()
      ]);
      setUser(userRes);
      setConversations(chatRes.data || []);
      form.setFieldsValue({ username: userRes.username });
    } catch (err) {
      console.error("Failed to load profile data:", err);
      setErrorMsg("Failed to load profile data. Please reload page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (values) => {
    setUpdating(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const { username, password } = values;
      const data = { username };
      if (password) {
        data.password = password;
      }
      
      const result = await updateProfile(data);
      setSuccessMsg(result.message || "Profile updated successfully!");
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      form.setFieldsValue({ password: "" }); // Reset password field
    } catch (err) {
      console.error("Failed to update profile:", err);
      setErrorMsg(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete your account?",
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      content: "This action is permanent. All your profile information and active codebase conversation threads will be deleted forever.",
      okText: "Delete Account",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setDeleting(true);
        setErrorMsg("");
        try {
          await deleteProfile();
          localStorage.removeItem("token");
          window.location.reload(); // Redirects to LandingPage
        } catch (err) {
          console.error("Failed to delete account:", err);
          setErrorMsg(err.response?.data?.message || "Failed to delete account.");
        } finally {
          setDeleting(false);
        }
      }
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "5rem" }}>
        <Spin size="large" tip="Loading profile details..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "1rem" }}>
      <Title level={2} style={{ marginBottom: "2rem" }}>Profile Settings</Title>
      
      {errorMsg && <Alert message={errorMsg} type="error" showIcon closable onClose={() => setErrorMsg("")} style={{ marginBottom: "1.5rem" }} />}
      {successMsg && <Alert message={successMsg} type="success" showIcon closable onClose={() => setSuccessMsg("")} style={{ marginBottom: "1.5rem" }} />}

      <Row gutter={[24, 24]}>
        {/* Left Column: Account details */}
        <Col xs={24} md={10}>
          <Card 
            title="Account Management" 
            style={{ borderRadius: 12, boxShadow: "var(--shadow)", border: "1px solid var(--border)" }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdate}
              initialValues={{ username: user?.username }}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Username is required" }]}
              >
                <Input prefix={<UserOutlined />} size="large" />
              </Form.Item>

              <Form.Item
                label="Change Password"
                name="password"
                extra="Leave blank to keep your current password"
              >
                <Input.Password prefix={<LockOutlined />} size="large" placeholder="New Password" />
              </Form.Item>

              <Form.Item>
                <Space style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={updating}
                    style={{ background: "var(--accent)", borderColor: "var(--accent)" }}
                  >
                    Update Profile
                  </Button>
                  <Button 
                    type="primary" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={handleDelete}
                    loading={deleting}
                  >
                    Delete Account
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Right Column: Chat history list */}
        <Col xs={24} md={14}>
          <Card 
            title={
              <Space>
                <MessageOutlined style={{ color: "var(--accent)" }} />
                <span>Active Conversation History</span>
              </Space>
            }
            style={{ borderRadius: 12, boxShadow: "var(--shadow)", border: "1px solid var(--border)", height: "100%" }}
          >
            {conversations.length === 0 ? (
              <Empty 
                description="No active conversations. Open the library and chat with a repository!" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={conversations}
                renderItem={(chat) => {
                  const repo = chat.repo_id;
                  if (!repo) return null; // Handle deleted repositories
                  
                  return (
                    <List.Item
                      actions={[
                        <Button 
                          type="link" 
                          icon={<ArrowRightOutlined />} 
                          onClick={() => navigate(`/repo/${repo._id}`)}
                          style={{ color: "var(--accent)" }}
                        >
                          Resume Chat
                        </Button>
                      ]}
                      style={{ 
                        borderBottom: "1px solid var(--border)",
                        padding: "1rem",
                        borderRadius: "8px",
                        transition: "background 0.2s ease",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-bg)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      onClick={() => navigate(`/repo/${repo._id}`)}
                    >
                      <List.Item.Meta
                        title={<Text strong style={{ fontSize: "1.05rem" }}>{repo.repo_name}</Text>}
                        description={
                          <Space direction="vertical" size={2}>
                            <Text type="secondary" style={{ fontSize: "0.85rem", wordBreak: "break-all" }}>
                              {repo.repo_url}
                            </Text>
                            <Space size={[0, 4]} wrap style={{ marginTop: "4px" }}>
                              {repo.languages && repo.languages.slice(0, 3).map((lang) => (
                                <Tag color="purple" key={lang} style={{ fontSize: "0.75rem" }}>
                                  {lang}
                                </Tag>
                              ))}
                              {repo.languages && repo.languages.length > 3 && (
                                <Tag style={{ fontSize: "0.75rem" }}>+{repo.languages.length - 3} more</Tag>
                              )}
                            </Space>
                          </Space>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

