import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Spin,
  message,
  Progress,
  Empty,
} from "antd";
import {
  FileDoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
  FireOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const { Title, Text } = Typography;

const ResultsStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/results/user/results-stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        message.error("Failed to load statistics.");
        console.error(err);
        setLoading(false);
      });
  }, []);

  const calculatePassRate = () => {
    if (!stats || stats.totalSubmitted === 0) return 0;
    return Math.round((stats.totalPassed / stats.totalSubmitted) * 100);
  };

  const calculateTodayRate = () => {
    if (!stats || stats.submittedToday === 0) return 0;
    return Math.round((stats.passedToday / stats.submittedToday) * 100);
  };

  const StatCard = ({ title, value, icon: Icon, gradient, trend }) => (
    <Card
      bordered={false}
      style={{
        background: gradient,
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        height: "100%",
      }}
      bodyStyle={{ padding: "24px" }}
      className="stat-card-hover"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "14px",
              fontWeight: 500,
              display: "block",
              marginBottom: "8px",
            }}
          >
            {title}
          </Text>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.2,
            }}
          >
            {value}
          </div>
          {trend && (
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <RiseOutlined
                style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "14px" }}
              />
              <Text
                style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "13px" }}
              >
                {trend}
              </Text>
            </div>
          )}
        </div>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <Icon style={{ fontSize: "28px", color: "white" }} />
        </div>
      </div>
    </Card>
  );

  if (loading || !stats) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const passRate = calculatePassRate();
  const todayRate = calculateTodayRate();

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          * {
            font-family: 'Inter', sans-serif;
          }

          .results-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 32px 24px;
          }

          .stat-card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
          }

          .chart-card {
            background: white;
            border-radius: 20px;
            padding: 32px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(102, 126, 234, 0.1);
          }

          .chart-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 28px;
            padding-bottom: 20px;
            border-bottom: 2px solid rgba(102, 126, 234, 0.1);
          }

          .chart-title {
            font-size: 24px;
            font-weight: 700;
            color: #2d3748;
            margin: 0;
          }

          .progress-card {
            background: white;
            border-radius: 20px;
            padding: 28px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(102, 126, 234, 0.1);
            transition: all 0.3s ease;
          }

          .progress-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
          }

          .progress-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
          }

          .progress-title {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
          }

          .empty-state {
            padding: 60px 20px;
            text-align: center;
          }

          @media (max-width: 768px) {
            .results-container {
              padding: 20px 16px;
            }

            .chart-card, .progress-card {
              padding: 20px;
            }

            .chart-title {
              font-size: 20px;
            }
          }
        `}
      </style>

      <div className="results-container">
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Page Header */}
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                }}
              >
                <TrophyOutlined style={{ fontSize: "24px", color: "white" }} />
              </div>
              <Title level={2} style={{ margin: 0, color: "#2d3748" }}>
                Results & Statistics
              </Title>
            </div>
            <Text style={{ fontSize: "15px", color: "#718096" }}>
              Track your learning progress and performance
            </Text>
          </div>

          {/* Stats Cards */}
          <Row gutter={[20, 20]} style={{ marginBottom: "32px" }}>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Total Submitted"
                value={stats.totalSubmitted}
                icon={FileDoneOutlined}
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Total Passed"
                value={stats.totalPassed}
                icon={CheckCircleOutlined}
                gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                trend={`${passRate}% pass rate`}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Submitted Today"
                value={stats.submittedToday}
                icon={ClockCircleOutlined}
                gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Passed Today"
                value={stats.passedToday}
                icon={FireOutlined}
                gradient="linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
                trend={stats.submittedToday > 0 ? `${todayRate}% today` : null}
              />
            </Col>
          </Row>

          {/* Progress Cards */}
          <Row gutter={[20, 20]} style={{ marginBottom: "32px" }}>
            <Col xs={24} md={12}>
              <div className="progress-card">
                <div className="progress-header">
                  <TrophyOutlined
                    style={{ fontSize: "24px", color: "#667eea" }}
                  />
                  <h3 className="progress-title">Overall Pass Rate</h3>
                </div>
                <Progress
                  percent={passRate}
                  strokeColor={{
                    "0%": "#667eea",
                    "100%": "#764ba2",
                  }}
                  strokeWidth={12}
                  format={(percent) => (
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#2d3748",
                      }}
                    >
                      {percent}%
                    </span>
                  )}
                />
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    color: "#718096",
                  }}
                >
                  <span>Passed: {stats.totalPassed}</span>
                  <span>
                    Failed: {stats.totalSubmitted - stats.totalPassed}
                  </span>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="progress-card">
                <div className="progress-header">
                  <FireOutlined
                    style={{ fontSize: "24px", color: "#fa709a" }}
                  />
                  <h3 className="progress-title">Today's Performance</h3>
                </div>
                <Progress
                  percent={todayRate}
                  strokeColor={{
                    "0%": "#fa709a",
                    "100%": "#fee140",
                  }}
                  strokeWidth={12}
                  format={(percent) => (
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#2d3748",
                      }}
                    >
                      {percent}%
                    </span>
                  )}
                />
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    color: "#718096",
                  }}
                >
                  <span>Passed: {stats.passedToday}</span>
                  <span>
                    Failed: {stats.submittedToday - stats.passedToday}
                  </span>
                </div>
              </div>
            </Col>
          </Row>

          {/* Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                }}
              >
                <RiseOutlined style={{ fontSize: "24px", color: "white" }} />
              </div>
              <div>
                <h2 className="chart-title">Performance Trend</h2>
                <Text style={{ fontSize: "14px", color: "#718096" }}>
                  Average score over time
                </Text>
              </div>
            </div>

            {stats.chartData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#667eea"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#718096"
                    style={{ fontSize: "13px" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="#718096"
                    style={{ fontSize: "13px" }}
                    label={{
                      value: "Score (%)",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#718096" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                    }}
                    formatter={(value) => [`${value}%`, "Avg Score"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="averageScore"
                    stroke="#667eea"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    dot={{ fill: "#667eea", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <Empty
                  description={
                    <span style={{ fontSize: "15px", color: "#718096" }}>
                      No data available yet. Complete some quizzes to see your
                      performance trend!
                    </span>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsStatsPage;
