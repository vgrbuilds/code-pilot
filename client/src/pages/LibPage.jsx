import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, Button, List, Typography, Space, Tag, Alert, Row, Col, Empty, Spin } from "antd";
import { GithubOutlined, PlusOutlined, CodeOutlined, GlobalOutlined } from "@ant-design/icons";
import { getAllRepos, ingestRepo } from "../services/repo.service";

const { Title, Paragraph, Text } = Typography;

export default function LibPage() {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingIngest, setLoadingIngest] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchRepositories = async () => {
    setLoadingList(true);
    try {
      const res = await getAllRepos();
      setRepos(res.data || []);
    } catch (err) {
      console.error("Failed to load repositories:", err);
      setErrorMsg("Failed to load repositories. Please try again.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const handleIngest = async () => {
    if (!repoUrl) return;
    
    // Quick validation
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\/)?$/;
    if (!githubRegex.test(repoUrl.trim())) {
      setErrorMsg("Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)");
      return;
    }

    setLoadingIngest(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const result = await ingestRepo(repoUrl.trim());
      setSuccessMsg(result.message || "Repository successfully ingested!");
      setRepoUrl("");
      fetchRepositories(); // Refresh list
    } catch (err) {
      console.error("Failed to ingest repository:", err);
      setErrorMsg(err.response?.data?.message || err.message || "Failed to ingest repository.");
    } finally {
      setLoadingIngest(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "1rem" }}>
      {/* Page Header */}
      <Space direction="vertical" size="middle" style={{ display: "flex", marginBottom: "2rem" }}>
        <Title level={2}>Repository Library</Title>
        <Paragraph>
          Ingest public GitHub repositories to analyze and interact with their codebase. Discover already indexed codebases below.
        </Paragraph>
      </Space>

      {/* Ingestion Panel */}
      <Card 
        style={{ 
          marginBottom: "2rem", 
          borderRadius: 12, 
          boxShadow: "var(--shadow)", 
          border: "1px solid var(--border)" 
        }}
        title={
          <Space>
            <PlusOutlined style={{ color: "var(--accent)" }} />
            <span>Ingest New Repository</span>
          </Space>
        }
      >
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {errorMsg && <Alert message={errorMsg} type="error" showIcon closable onClose={() => setErrorMsg("")} />}
          {successMsg && <Alert message={successMsg} type="success" showIcon closable onClose={() => setSuccessMsg("")} />}
          
          <div style={{ display: "flex", gap: "10px" }}>
            <Input
              size="large"
              placeholder="https://github.com/owner/repository"
              prefix={<GithubOutlined />}
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={loadingIngest}
              onPressEnter={handleIngest}
            />
            <Button 
              type="primary" 
              size="large" 
              loading={loadingIngest} 
              onClick={handleIngest}
              style={{ background: "var(--accent)", borderColor: "var(--accent)" }}
            >
              Ingest
            </Button>
          </div>
          <Text type="secondary" style={{ fontSize: "0.85rem" }}>
            Currently supports public GitHub repositories. Processing might take a minute depending on repository size.
          </Text>
        </Space>
      </Card>

      {/* List / Grid of repositories */}
      <Title level={3} style={{ marginBottom: "1rem" }}>Ingested Repositories</Title>
      
      {loadingList ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <Spin size="large" tip="Loading repositories..." />
        </div>
      ) : repos.length === 0 ? (
        <Card style={{ borderRadius: 12, border: "1px solid var(--border)" }}>
          <Empty 
            description="No repositories ingested yet. Add your first repository above!" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {repos.map((repo) => (
            <Col xs={24} sm={12} key={repo._id}>
              <Card
                hoverable
                style={{ 
                  borderRadius: 12, 
                  border: "1px solid var(--border)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.01)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.01)";
                }}
                onClick={() => navigate(`/repo/${repo._id}`)}
              >
                <Space direction="vertical" style={{ width: "100%" }} size="small">
                  <Title level={4} style={{ margin: 0, fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    <CodeOutlined style={{ color: "var(--accent)" }} />
                    {repo.repo_name}
                  </Title>
                  
                  <Text type="secondary" style={{ fontSize: "0.85rem", wordBreak: "break-all" }}>
                    <GlobalOutlined style={{ marginRight: 4 }} />
                    {repo.repo_url}
                  </Text>

                  <div style={{ marginTop: "8px" }}>
                    {repo.languages && repo.languages.length > 0 ? (
                      repo.languages.map((lang) => (
                        <Tag color="purple" key={lang} style={{ marginBottom: "4px" }}>
                          {lang}
                        </Tag>
                      ))
                    ) : (
                      <Tag>No Languages Detected</Tag>
                    )}
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

