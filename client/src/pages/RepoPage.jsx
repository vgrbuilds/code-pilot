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

  // Helper to parse basic markdown elements and escape raw HTML tags safely
  const renderMessageContent = (content) => {
    // 1. Split by block code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      // If it is a block code block
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
            margin: "12px 0",
            textAlign: "left",
            border: "1px solid var(--border)"
          }}>
            <code style={{ 
              fontSize: "13.5px", 
              color: "var(--text-h)", 
              fontFamily: "var(--mono)",
              background: "transparent",
              border: "none",
              padding: 0
            }}>{code}</code>
          </pre>
        );
      }
      
      // For standard text sections, parse sub-elements (bold, inline code, headers, lists)
      // 2. Escape HTML special characters to prevent raw bracket strings rendering as HTML tags
      const escapedText = part
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      // 3. Line-by-line parsing
      const lines = escapedText.split("\n");
      
      const parsedLines = lines.map((line, lineIdx) => {
        let contentEl = line;

        // Parse bold: **text**
        contentEl = contentEl.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Parse inline code: `code`
        contentEl = contentEl.replace(/`(.*?)`/g, "<code style='font-size: 13.5px; font-family: var(--mono); background: var(--code-bg); padding: 2px 4px; border-radius: 4px; border: 1px solid var(--border)'>$1</code>");

        // Check if list item: "* item" or "- item"
        if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
          const listContent = contentEl.replace(/^[\s]*[\*-]\s/, "");
          return (
            <li 
              key={lineIdx} 
              style={{ marginLeft: "1.25rem", listStyleType: "disc", marginBlock: "4px" }}
              dangerouslySetInnerHTML={{ __html: listContent }} 
            />
          );
        }

        // Check if header: "### title" or "## title" or "# title"
        if (line.trim().startsWith("#")) {
          const match = line.match(/^(#{1,6})\s+(.*)$/);
          if (match) {
            const level = match[1].length;
            const headerText = match[2];
            let parsedHeader = headerText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            parsedHeader = parsedHeader.replace(/`(.*?)`/g, "<code style='font-size: 13.5px; font-family: var(--mono)'>$1</code>");
            const HeaderTag = `h${Math.min(level + 1, 6)}`;
            return (
              <HeaderTag 
                key={lineIdx} 
                style={{ margin: "14px 0 6px 0", color: "var(--text-h)" }} 
                dangerouslySetInnerHTML={{ __html: parsedHeader }}
              />
            );
          }
        }

        // Standard line break handling
        if (line.trim() === "") {
          return <div key={lineIdx} style={{ height: "8px" }} />;
        }

        return (
          <p 
            key={lineIdx} 
            style={{ margin: "0 0 6px 0" }} 
            dangerouslySetInnerHTML={{ __html: contentEl }} 
          />
        );
      });

      return <div key={index}>{parsedLines}</div>;
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
      height: "calc(100vh - 3.75rem)", 
      width: "100%", 
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
        gap: "1.5rem",
        background: "var(--bg-card)"
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
          <Space size="small" wrap>
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
          <Space size="small" wrap>
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
              padding: "2.5rem 2rem",
              background: "var(--bg-card)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow)"
            }}>
              <Title level={4}>Chat with {repo.repo_name}</Title>
              <Paragraph type="secondary" style={{ fontSize: "0.95rem" }}>
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
                <div 
                  className={msg.role === "user" ? "user-message-bubble" : ""}
                  style={{ 
                    maxWidth: "75%", 
                    padding: "0.85rem 1.15rem", 
                    borderRadius: msg.role === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
                    background: msg.role === "user" ? "linear-gradient(135deg, var(--accent) 0%, #6366f1 100%)" : "var(--bg-card)",
                    border: msg.role === "user" ? "none" : "1px solid var(--border)",
                    color: msg.role === "user" ? "#ffffff" : "var(--text-h)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                  }}
                >
                  {renderMessageContent(msg.content)}
                  <div style={{ 
                    textAlign: "right", 
                    fontSize: "0.7rem", 
                    opacity: 0.6, 
                    marginTop: "4px",
                    color: msg.role === "user" ? "#e0e7ff" : "var(--text)"
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
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-h)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
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
          background: "var(--bg-card)"
        }}>
          <Flex gap="middle">
            <Input
              size="large"
              placeholder="Ask CodePilot anything about this repository..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPressEnter={handleSend}
              disabled={sending}
              style={{ borderRadius: 8 }}
            />
            <Button 
              type="primary" 
              size="large" 
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={sending}
              style={{ background: "var(--accent)", borderColor: "var(--accent)", borderRadius: 8 }}
            />
          </Flex>
        </div>
      </div>
    </div>
  );
}


