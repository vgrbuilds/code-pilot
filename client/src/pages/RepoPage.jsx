import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Typography, Space, Tag, Descriptions, Spin, Alert } from "antd";
import { ArrowLeftOutlined, GithubOutlined, CalendarOutlined, CodeOutlined } from "@ant-design/icons";
import { getRepoById } from "../services/repo.service";

const { Title, Paragraph } = Typography;

export default function RepoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        setLoading(true);
        const res = await getRepoById(id);
        setRepo(res.data);
      } catch (err) {
        console.error("Failed to fetch repository details:", err);
        setError("Could not load repository details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRepo();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "5rem" }}>
        <Spin size="large" tip="Loading repository details..." />
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
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1rem" }}>
      {/* Back Navigation */}
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate("/library")}
        style={{ paddingLeft: 0, marginBottom: "1.5rem" }}
      >
        Back to Library
      </Button>

      {/* Main Details Card */}
      <Card 
        style={{ borderRadius: 12, boxShadow: "var(--shadow)", border: "1px solid var(--border)" }}
        title={
          <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <CodeOutlined style={{ color: "var(--accent)" }} />
            {repo.repo_name}
          </Title>
        }
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Descriptions title="Repository Metadata" bordered column={1}>
            <Descriptions.Item label="GitHub URL">
              <a href={repo.repo_url} target="_blank" rel="noopener noreferrer">
                <Space>
                  <GithubOutlined />
                  {repo.repo_url}
                </Space>
              </a>
            </Descriptions.Item>
            
            <Descriptions.Item label="Languages">
              <Space size={[0, 8]} wrap>
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
            </Descriptions.Item>

            <Descriptions.Item label="Discovery Tags">
              <Space size={[0, 8]} wrap>
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
            </Descriptions.Item>

            <Descriptions.Item label="Ingestion Date">
              <Space>
                <CalendarOutlined />
                {new Date(repo.createdAt).toLocaleString()}
              </Space>
            </Descriptions.Item>
          </Descriptions>

          <Card type="inner" title="Repository Interaction Status" style={{ borderRadius: 8 }}>
            <Paragraph>
              This repository is fully ingested and indexed. Codeopilot is currently indexing its chunks and semantic vector embeddings.
            </Paragraph>
            <Alert
              message="Chat Functionality Incoming"
              description="Interactive AI chatting and code reasoning for this repository is currently under development."
              type="info"
              showIcon
            />
          </Card>
        </Space>
      </Card>
    </div>
  );
}

