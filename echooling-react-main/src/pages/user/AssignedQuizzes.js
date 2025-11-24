import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Typography,
  Spin,
  Button,
  Tag,
  Empty,
  Progress,
  Card,
  Row,
  Col,
  Statistic,
  Space,
  message,
} from "antd";
import {
  PlayCircleOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const AssignedQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzesWithBestAttempts = async () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        message.error("Please login to view quizzes");
        setLoading(false);
        return;
      }

      let user;
      try {
        user = JSON.parse(userStr);
      } catch (err) {
        console.error("❌ Failed to parse user:", err);
        setLoading(false);
        return;
      }

      const userId = user.id;

      try {
        console.log("📡 Fetching assigned quizzes for user:", userId);

        const res = await fetch(`/api/assigned-quizzes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch quizzes: ${res.status}`);
        }

        const quizzesData = await res.json();
        console.log("📚 Quizzes assigned:", quizzesData);

        if (!Array.isArray(quizzesData) || quizzesData.length === 0) {
          setQuizzes([]);
          setLoading(false);
          return;
        }

        // ✅ OPTION 1: Dùng endpoint đơn giản /api/results/best-attempts/:quizId
        const quizzesWithAttempts = await Promise.all(
          quizzesData.map(async (quiz) => {
            try {
              const bestUrl = `/api/results/best-attempts/${quiz.id}`;

              console.log(`🔍 Fetching: ${bestUrl}`);

              const bestRes = await fetch(bestUrl, {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!bestRes.ok) {
                console.warn(`⚠️ No results for quiz ${quiz.id}`);
                return {
                  ...quiz,
                  bestAttempt: null,
                  attemptsCount: 0,
                };
              }

              // ✅ Response: { id, score, passed, attemptNumber, answers, ... }
              const bestAttempt = await bestRes.json();

              console.log(`✅ Best attempt for quiz ${quiz.id}:`, {
                score: bestAttempt.score,
                passed: bestAttempt.passed,
                attemptNumber: bestAttempt.attemptNumber,
              });

              // ✅ Để lấy tổng số attempts, cần fetch thêm
              let totalAttempts = bestAttempt.attemptNumber || 0;

              // Optional: Fetch all attempts để có số chính xác
              try {
                const allAttemptsUrl = `/api/results/quiz/${quiz.id}/attempts`;
                const attemptsRes = await fetch(allAttemptsUrl, {
                  headers: { Authorization: `Bearer ${token}` },
                });

                if (attemptsRes.ok) {
                  const allAttempts = await attemptsRes.json();
                  totalAttempts = allAttempts.length;
                  console.log(
                    `📊 Total attempts for quiz ${quiz.id}: ${totalAttempts}`
                  );
                }
              } catch (err) {
                console.log(
                  `⚠️ Could not fetch all attempts, using attemptNumber`
                );
              }

              return {
                ...quiz,
                bestAttempt,
                attemptsCount: totalAttempts,
              };
            } catch (err) {
              console.error(`❌ Error for quiz ${quiz.id}:`, err);
              return {
                ...quiz,
                bestAttempt: null,
                attemptsCount: 0,
              };
            }
          })
        );

        console.log("🧩 Final quizzes with attempts:", quizzesWithAttempts);
        setQuizzes(quizzesWithAttempts);
      } catch (err) {
        console.error("❌ Error loading quizzes:", err);
        message.error("Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzesWithBestAttempts();
  }, []);

  const getProgressColor = (score) => {
    if (score >= 90) return "#52c41a";
    if (score >= 70) return "#1890ff";
    if (score >= 50) return "#faad14";
    return "#ff4d4f";
  };

  const getStatusConfig = (quiz) => {
    const attempt = quiz.bestAttempt;

    if (!attempt) {
      return {
        color: "default",
        text: "Not Started",
        icon: <ClockCircleOutlined />,
      };
    }

    // ✅ Ưu tiên field passed
    if (attempt.passed === true) {
      return {
        color: "success",
        text: "✅ Passed",
        icon: <CheckCircleOutlined />,
      };
    }

    if (attempt.passed === false) {
      return {
        color: "error",
        text: "❌ Failed",
        icon: <ClockCircleOutlined />,
      };
    }

    // ✅ Fallback: dựa vào score
    const score = attempt.score || 0;
    if (score >= 90) {
      return {
        color: "success",
        text: "✅ Excellent",
        icon: <CheckCircleOutlined />,
      };
    }
    if (score >= 70) {
      return {
        color: "processing",
        text: "Good",
        icon: <TrophyOutlined />,
      };
    }
    if (score >= 50) {
      return {
        color: "warning",
        text: "Partial",
        icon: <ClockCircleOutlined />,
      };
    }

    return {
      color: "error",
      text: "Need Improvement",
      icon: <ClockCircleOutlined />,
    };
  };

  // Calculate statistics
  const stats = {
    total: quizzes.length,
    completed: quizzes.filter((q) => q.bestAttempt?.passed === true).length,
    inProgress: quizzes.filter((q) => {
      return q.bestAttempt && q.bestAttempt.passed !== true;
    }).length,
    notStarted: quizzes.filter((q) => !q.bestAttempt).length,
  };

  // Calculate completion percentage
  const completionPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const columns = [
    {
      title: "Quiz Title",
      dataIndex: "title",
      key: "title",
      width: "30%",
      render: (text) => (
        <Text strong style={{ fontSize: 15, color: "#262626" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Attempts",
      dataIndex: "attemptsCount",
      key: "attemptsCount",
      align: "center",
      width: "12%",
      render: (count) => {
        const displayCount = count || 0;
        return (
          <Tag
            color={displayCount > 0 ? "blue" : "default"}
            style={{ fontSize: 13, padding: "4px 12px", minWidth: "60px" }}
          >
            {displayCount} {displayCount === 1 ? "time" : "times"}
          </Tag>
        );
      },
    },
    {
      title: "Best Score",
      key: "bestScore",
      align: "center",
      width: "25%",
      render: (_, quiz) => {
        const score = quiz.bestAttempt?.score;

        if (score == null || score === undefined) {
          return (
            <Text type="secondary" style={{ fontSize: 13 }}>
              No attempts yet
            </Text>
          );
        }

        return (
          <div style={{ padding: "0 20px" }}>
            <Progress
              percent={Math.round(score)}
              strokeColor={getProgressColor(score)}
              format={(percent) => (
                <span
                  style={{
                    color: getProgressColor(score),
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  {percent}%
                </span>
              )}
              strokeWidth={12}
            />
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      width: "15%",
      render: (_, quiz) => {
        const status = getStatusConfig(quiz);
        return (
          <Tag
            color={status.color}
            icon={status.icon}
            style={{
              fontSize: 13,
              padding: "5px 12px",
              fontWeight: 500,
              minWidth: "100px",
            }}
          >
            {status.text}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: "18%",
      render: (_, quiz) => (
        <Link to={`/user/do-quiz/${quiz.id}`}>
          <Button
            type="primary"
            icon={
              quiz.bestAttempt ? <ReloadOutlined /> : <PlayCircleOutlined />
            }
            size="middle"
            style={{ fontWeight: 500, minWidth: "90px" }}
          >
            {quiz.bestAttempt ? "Retry" : "Start"}
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          📚 My Learning Journey
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Track your progress and complete your assigned quizzes
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Quizzes"
              value={stats.total}
              prefix="📋"
              valueStyle={{ color: "#1890ff", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed"
              value={stats.completed}
              prefix="✅"
              valueStyle={{ color: "#52c41a", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={stats.inProgress}
              prefix="📊"
              valueStyle={{ color: "#faad14", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Not Started"
              value={stats.notStarted}
              prefix="⏳"
              valueStyle={{ color: "#8c8c8c", fontSize: 28 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Overall Completion Progress */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text strong style={{ fontSize: 16 }}>
              🎯 Overall Completion Rate
            </Text>
            <Text
              strong
              style={{
                fontSize: 20,
                color: getProgressColor(completionPercentage),
              }}
            >
              {completionPercentage}%
            </Text>
          </div>
          <Progress
            percent={completionPercentage}
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
            strokeWidth={16}
            format={(percent) => (
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {stats.completed} / {stats.total} quizzes completed
              </span>
            )}
          />
          <Text type="secondary" style={{ fontSize: 13 }}>
            Complete quizzes with passing score to increase your completion rate
          </Text>
        </Space>
      </Card>

      {/* Quiz Table */}
      {loading ? (
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
            }}
          >
            <Spin size="large" tip="Loading quizzes..." />
          </div>
        </Card>
      ) : quizzes.length === 0 ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical" size={4}>
                <Text style={{ fontSize: 16, fontWeight: 500 }}>
                  No quizzes assigned yet
                </Text>
                <Text type="secondary">
                  Check back later for new assignments
                </Text>
              </Space>
            }
          />
        </Card>
      ) : (
        <Card>
          <Table
            columns={columns}
            dataSource={quizzes.map((quiz) => ({ ...quiz, key: quiz.id }))}
            pagination={{
              pageSize: 5,
              showTotal: (total) => `Total ${total} quizzes`,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
            }}
            bordered
            size="middle"
          />
        </Card>
      )}
    </div>
  );
};

export default AssignedQuizzes;
