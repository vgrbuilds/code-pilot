import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Space, Tag, Descriptions, Spin, Alert, Input, Flex } from "antd";
import { ArrowLeftOutlined, GithubOutlined, CalendarOutlined, CodeOutlined, SendOutlined } from "@ant-design/icons";
import { getRepoById } from "../services/repo.service";
import { getChatHistory, sendMessage } from "../services/chat.service";

const { Title, Paragraph, Text } = Typography;

export default function RepoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  
  const messagesEndRef = useRef(null);

  const fetchRepoAndChat = async () => {
    try {
      setLoading(true);
      const [repoRes, chatRes] = await Promise.all([
        getRepoById(id),
        getChatHistory(id)
      ]);
      setRepo(repoRes.data);
      setMessages(chatRes.data || []);
    } catch (err) {
      console.error("Failed to fetch repository details and chat history:", err);
      setError("Could not load repository and chat data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRepoAndChat();
    }
  }, [id]);

  useEffect(() => {
    // Scroll to bottom whenever messages list updates
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;

    const userMessageText = inputText.trim();
    const userMsg = { role: "user", content: userMessageText, createdAt: new Date() };
    
    // Optimistically add user message
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setSending(true);

    try {
      const res = await sendMessage(id, userMessageText);
      // Add assistant response
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to send message:", err);
      const errMsg = {
        role: "assistant",
        content: "⚠ Failed to get response. Please make sure the search index is configured on your MongoDB collection.",
        createdAt: new Date()
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setSending(false);
    }
  };

  // Helper to parse basic markdown code blocks dynamically
  const renderMessageContent = (content) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        const language = lines[0] && !lines[0].startsWith(" ") ? lines[0] : "";
        const code = language ? lines.slice(1).join("\n") : lines.join("\n");
        return (
          <pre key={index} style={{ 
            background: "var(--code-bg)", 
            padding: "0.85rem", 
            borderRadius: "8px", 
            overflowX: "auto", 
            margin: "8px 0",
            textAlign: "left",
            border: "1px solid var(--border)"
          }}>
            <code style={{ fontSize: "14px", color: "var(--text-h)", fontFamily: "var(--mono)" }}>{code}</code>
          </pre>
        );
      }
      return <span key={index} style={{ whiteSpace: "pre-wrap" }}>{part}</span>;
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "5rem" }}>
        <Spin size="large" tip="Loading repository workspace..." />
      </div>
    );
  }

  if (error || !repo) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "1rem" }}>
        <Alert
          message="Error"
          description={error || "Repository not found."}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={() => navigate("/library")}>
              Back to Library
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      height: "calc(100vh - 5.5rem)", 
      margin: "-2rem", 
      overflow: "hidden", 
      background: "var(--bg)" 
    }}>
      {/* Left Pane - Sidebar Metadata */}
      <div style={{ 
        width: 320, 
        borderRight: "1px solid var(--border)", 
        padding: "1.5rem", 
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate("/library")}
          style={{ paddingLeft: 0, width: "fit-content", color: "var(--text-h)" }}
        >
          Back to Library
        </Button>

        <div>
          <Title level={4} style={{ margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <CodeOutlined style={{ color: "var(--accent)" }} />
            {repo.repo_name}
          </Title>
          <a href={repo.repo_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <GithubOutlined />
            GitHub URL
          </a>
        </div>

        <Descriptions column={1} size="small" title="Repository Info">
          <Descriptions.Item label="Ingested">
            <span style={{ fontSize: "0.85rem" }}>{new Date(repo.createdAt).toLocaleDateString()}</span>
          </Descriptions.Item>
        </Descriptions>

        <div>
          <Text strong style={{ display: "block", marginBottom: "0.5rem" }}>Languages</Text>
          <Space size={[0, 4]} wrap>
            {repo.languages && repo.languages.length > 0 ? (
              repo.languages.map((lang) => (
                <Tag color="purple" key={lang}>
                  {lang}
                </Tag>
              ))
            ) : (
              <Tag>None detected</Tag>
            )}
          </Space>
        </div>

        <div>
          <Text strong style={{ display: "block", marginBottom: "0.5rem" }}>Tags</Text>
          <Space size={[0, 4]} wrap>
            {repo.tags && repo.tags.length > 0 ? (
              repo.tags.map((tag) => (
                <Tag color="blue" key={tag}>
                  {tag}
                </Tag>
              ))
            ) : (
              <Tag>None</Tag>
            )}
          </Space>
        </div>
      </div>

      {/* Right Pane - Chat Window */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        height: "100%",
        background: "var(--bg)"
      }}>
        {/* Messages Body */}
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}>
          {messages.length === 0 ? (
            <div style={{ 
              margin: "auto", 
              textAlign: "center", 
              maxWidth: 450,
              padding: "2rem",
              background: "var(--social-bg)",
              borderRadius: "12px",
              border: "1px solid var(--border)"
            }}>
              <Title level={4}>Chat with {repo.repo_name}</Title>
              <Paragraph type="secondary">
                Ask questions about the directory layout, search files, explain algorithms, or request documentation helper snippets.
              </Paragraph>
              <Tag color="purple">RAG Search Active</Tag>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div 
                key={i} 
                style={{ 
                  display: "flex", 
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  width: "100%"
                }}
              >
                <div style={{ 
                  maxWidth: "75%", 
                  padding: "0.85rem 1.15rem", 
                  borderRadius: msg.role === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
                  background: msg.role === "user" ? "var(--accent-bg)" : "var(--code-bg)",
                  border: msg.role === "user" ? "1px solid var(--accent-border)" : "1px solid var(--border)",
                  color: "var(--text-h)",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.02)"
                }}>
                  {renderMessageContent(msg.content)}
                  <div style={{ 
                    textAlign: "right", 
                    fontSize: "0.7rem", 
                    opacity: 0.5, 
                    marginTop: "4px" 
                  }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
          {sending && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ 
                padding: "0.85rem 1.15rem", 
                borderRadius: "16px 16px 16px 0",
                background: "var(--code-bg)",
                border: "1px solid var(--border)",
                color: "var(--text-h)"
              }}>
                <Space>
                  <Spin size="small" />
                  <Text type="secondary">Analyzing codebase context...</Text>
                </Space>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div style={{ 
          padding: "1.5rem 2rem", 
          borderTop: "1px solid var(--border)",
          background: "var(--bg)"
        }}>
          <Flex gap="middle">
            <Input
              size="large"
              placeholder="Ask CodePilot anything about this repository..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPressEnter={handleSend}
              disabled={sending}
            />
            <Button 
              type="primary" 
              size="large" 
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={sending}
              style={{ background: "var(--accent)", borderColor: "var(--accent)" }}
            />
          </Flex>
        </div>
      </div>
    </div>
  );
}


