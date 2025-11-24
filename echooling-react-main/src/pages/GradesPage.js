import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Card,
  Tag,
  Typography,
  Space,
  Button,
  Row,
  Col,
  Statistic,
  Empty,
  Avatar,
} from "antd";
import {
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const GradesPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [quizSummaries, setQuizSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/results/best-attempts/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📦 Full API response:", res.data);

        const summaries = Array.isArray(res.data) ? res.data : [];

        // Get user name from first result
        if (summaries.length > 0 && summaries[0].user) {
          const user = summaries[0].user;
          setUserName(
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.email ||
              "User"
          );
        }

        // Log để xem structure
        if (summaries.length > 0) {
          console.log("🔍 First item keys:", Object.keys(summaries[0]));
          console.log("🔍 First item:", summaries[0]);
        }

        // Map data
        const data = summaries.map((item) => {
          console.log("🔹 Processing:", {
            id: item.id,
            quiz_id: item.quiz_id,
            quiz: item.quiz,
            score: item.score,
            attemptNumber: item.attemptNumber,
          });

          return {
            key: item.id || item.quiz_id,
            quizId: item.quiz_id,
            quizTitle: item.quiz?.title || "Untitled Quiz",
            bestScore: item.score || 0,
            attempts: item.attemptNumber || 1,
            duration: "N/A",
            lastAttempt: item.submittedAt
              ? new Date(item.submittedAt).toLocaleString()
              : "N/A",
            status: (item.score || 0) >= 80 ? "passed" : "failed",
            passed: item.passed || (item.score || 0) >= 80,
          };
        });

        console.log("🎯 Final data for table:", data);

        setQuizSummaries(data);
      } catch (err) {
        console.error("❌ Error fetching quiz summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [userId]);

  // Calculate statistics
  const totalQuizzes = quizSummaries.length;
  const passedQuizzes = quizSummaries.filter((q) => q.passed).length;
  const averageScore =
    totalQuizzes > 0
      ? Math.round(
          quizSummaries.reduce((sum, q) => sum + q.bestScore, 0) / totalQuizzes
        )
      : 0;

  const columns = [
    {
      title: "No.",
      width: 60,
      align: "center",
      render: (_, __, index) => (
        <Avatar size={32} style={{ backgroundColor: "#1890ff", fontSize: 14 }}>
          {index + 1}
        </Avatar>
      ),
    },
    {
      title: "Quiz Title",
      dataIndex: "quizTitle",
      key: "quizTitle",
      width: 300,
      render: (text, record) => (
        <Space direction="vertical" size={2}>
          <a
            onClick={() =>
              navigate(`/admin/results/user/${userId}/quiz/${record.quizId}`)
            } // ✅ FIX: Truyền cả userId và quizId
            style={{
              color: "#1890ff",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            {text}
          </a>
          <Space>
            <Tag
              color={record.passed ? "green" : "red"}
              icon={
                record.passed ? (
                  <CheckCircleOutlined />
                ) : (
                  <CloseCircleOutlined />
                )
              }
            >
              {record.passed ? "PASSED" : "FAILED"}
            </Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: "Best Score",
      dataIndex: "bestScore",
      key: "bestScore",
      width: 120,
      align: "center",
      sorter: (a, b) => a.bestScore - b.bestScore,
      render: (score) => (
        <div>
          <div>
            <Text
              strong
              style={{
                fontSize: 20,
                color:
                  score >= 80 ? "#52c41a" : score >= 50 ? "#faad14" : "#ff4d4f",
              }}
            >
              {score}%
            </Text>
          </div>
          <Tag
            color={score >= 80 ? "green" : score >= 50 ? "orange" : "red"}
            style={{ fontSize: 11 }}
          >
            {score >= 80
              ? "Excellent"
              : score >= 50
              ? "Good"
              : "Need Improvement"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Attempts",
      dataIndex: "attempts",
      key: "attempts",
      width: 100,
      align: "center",
      render: (attempts) => (
        <Space>
          <FileTextOutlined style={{ color: "#1890ff" }} />
          <Text strong>{attempts}</Text>
        </Space>
      ),
    },
    {
      title: "Last Attempt",
      dataIndex: "lastAttempt",
      key: "lastAttempt",
      width: 180,
      align: "center",
      render: (date) => (
        <Space>
          <ClockCircleOutlined style={{ color: "#faad14" }} />
          <Text>{date}</Text>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() =>
            navigate(`/admin/results/user/${userId}/quiz/${record.quizId}`)
          }
          size="small"
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{ padding: 24, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={4}>
              <Button
                icon={<ArrowLeftOutlined />}
                type="link"
                onClick={() => navigate(-1)}
                style={{ padding: 0, height: "auto" }}
              >
                Back
              </Button>
              <Title level={2} style={{ margin: 0 }}>
                📊 Quiz Results for {userName || "Student"}
              </Title>
              <Text type="secondary">Complete performance overview</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Quizzes"
              value={totalQuizzes}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Quizzes Passed"
              value={passedQuizzes}
              suffix={`/ ${totalQuizzes}`}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#52c41a", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Average Score"
              value={averageScore}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{
                color:
                  averageScore >= 80
                    ? "#52c41a"
                    : averageScore >= 50
                    ? "#faad14"
                    : "#ff4d4f",
                fontSize: 28,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Results Table */}
      <Card
        title={
          <Space>
            <FileTextOutlined style={{ fontSize: 18, color: "#1890ff" }} />
            <Text strong style={{ fontSize: 16 }}>
              Quiz Results Summary
            </Text>
            <Tag color="blue">{totalQuizzes} quizzes</Tag>
          </Space>
        }
      >
        <Spin spinning={loading} tip="Loading quiz results...">
          <Table
            columns={columns}
            dataSource={quizSummaries}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} quizzes`,
            }}
            bordered
            scroll={{ x: 1000 }}
            rowClassName={(record) =>
              record.status === "passed" ? "row-passed" : "row-failed"
            }
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Space direction="vertical" size={8}>
                      <Text style={{ fontSize: 16 }}>
                        No quiz results found
                      </Text>
                      <Text type="secondary">
                        This student hasn't taken any quizzes yet
                      </Text>
                    </Space>
                  }
                />
              ),
            }}
          />
        </Spin>
      </Card>

      {/* Performance Summary */}
      {quizSummaries.length > 0 && (
        <Card
          style={{ marginTop: 24, background: "#f6ffed" }}
          title={
            <Space>
              <TrophyOutlined style={{ color: "#52c41a", fontSize: 18 }} />
              <Text strong>Performance Summary</Text>
            </Space>
          }
        >
          <Space direction="vertical" size={12}>
            <Text>
              <Text strong>Pass Rate:</Text>{" "}
              {totalQuizzes > 0
                ? `${Math.round((passedQuizzes / totalQuizzes) * 100)}%`
                : "N/A"}{" "}
              ({passedQuizzes} out of {totalQuizzes} quizzes passed)
            </Text>
            <Text>
              <Text strong>Performance Level:</Text>{" "}
              {averageScore >= 80 ? (
                <Tag color="green" icon={<TrophyOutlined />}>
                  Excellent
                </Tag>
              ) : averageScore >= 50 ? (
                <Tag color="orange" icon={<CheckCircleOutlined />}>
                  Good
                </Tag>
              ) : (
                <Tag color="red" icon={<CloseCircleOutlined />}>
                  Needs Improvement
                </Tag>
              )}
            </Text>
          </Space>
        </Card>
      )}

      <style jsx>{`
        .row-passed {
          background-color: #f6ffed !important;
        }
        .row-failed {
          background-color: #fff2e8 !important;
        }
      `}</style>
    </div>
  );
};

export default GradesPage;
