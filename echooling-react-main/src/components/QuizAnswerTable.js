import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, Typography, Button, Card, Space } from "antd";
import moment from "moment";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { DownloadOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const QuizResultTable = () => {
  const { userId, quizId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [bestAttempt, setBestAttempt] = useState(null);
  const [questionParts, setQuestionParts] = useState([]);
  const [correctAnswersRow, setCorrectAnswersRow] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm chuẩn hóa đáp án để so sánh
  const normalizeAnswer = (answer) => {
    if (!answer) return "";
    return answer.toString().trim().toLowerCase().replace(/\s+/g, " "); // Thay nhiều khoảng trắng thành 1
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `/api/results/user/${userId}/quiz/${quizId}/best-attempt`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("📦 API Response:", res.data);

      const { attempts, bestAttempt, questionParts, correctAnswersRow } =
        res.data;

      // Sắp xếp attempts theo score giảm dần (đáp án tốt nhất lên đầu)
      const sortedAttempts = (attempts || []).sort((a, b) => b.score - a.score);

      setData(sortedAttempts);
      setBestAttempt(bestAttempt);
      setQuestionParts(questionParts || []);
      setCorrectAnswersRow(correctAnswersRow || []);
    } catch (err) {
      console.error("❌ Failed to fetch results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && quizId) fetchResults();
  }, [userId, quizId]);

  const exportToPDF = () => {
    if (!bestAttempt) return;

    const doc = new jsPDF();
    const userName =
      bestAttempt.user?.firstName || bestAttempt.user?.email || "User";
    const quizTitle = bestAttempt.quiz?.title || "Quiz";

    doc.setFontSize(16);
    doc.text(`Results: ${userName} - ${quizTitle}`, 14, 20);

    // Header với đáp án thay vì Gap
    const head = [
      [
        "Attempt",
        "Score",
        "Submitted At",
        ...correctAnswersRow.map((ans, idx) => ans || `Q${idx + 1}`),
      ],
    ];

    const body = data.map((record) => [
      record.attemptNumber,
      `${record.score}%`,
      moment(record.submittedAt).format("YYYY-MM-DD HH:mm"),
      ...record.userAnswersRow.map((ans, idx) => {
        const correct = record.answerStatusRow?.[idx];
        const val = ans || "—";
        return correct === null ? val : correct ? `✔ ${val}` : `✘ ${val}`;
      }),
    ]);

    doc.autoTable({
      head,
      body,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    const correctRow = [
      "Correct Answers",
      "",
      "",
      ...correctAnswersRow.map((ans) => ans || "—"),
    ];

    doc.autoTable({
      body: [correctRow],
      startY: doc.lastAutoTable.finalY + 10,
      styles: { fontStyle: "bold", fillColor: [255, 255, 204] },
    });

    doc.save(`${userName}-${quizTitle}-results.pdf`);
  };

  const baseColumns = [
    {
      title: "Attempt",
      dataIndex: "attemptNumber",
      key: "attempt",
      align: "center",
      width: 100,
      render: (attemptNumber, record, index) => (
        <Space>
          <span>{attemptNumber}</span>
          {index === 0 && (
            <Tag color="gold" style={{ fontSize: 10 }}>
              BEST
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      align: "center",
      width: 100,
      render: (score) => (
        <Tag color={score >= 80 ? "green" : score >= 50 ? "orange" : "red"}>
          {score}%
        </Tag>
      ),
    },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
      key: "date",
      align: "center",
      width: 180,
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
    },
  ];

  // Tạo columns với đáp án đúng làm header thay vì Gap 1, 2, 3
  const answerColumns = correctAnswersRow.map((correctAnswer, idx) => ({
    title: (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: "bold", color: "#52c41a" }}>
          {correctAnswer || `Q${idx + 1}`}
        </div>
        <div style={{ fontSize: 11, color: "#999", fontWeight: "normal" }}>
          (Correct Answer)
        </div>
      </div>
    ),
    key: `q-${idx}`,
    align: "center",
    width: 150,
    render: (record) => {
      const userAnswer = record.userAnswersRow?.[idx];
      const answerStatus = record.answerStatusRow?.[idx];

      // Nếu không có status (câu hỏi không chấm điểm)
      if (answerStatus === null || answerStatus === undefined) {
        return <Tag color="default">{userAnswer || "—"}</Tag>;
      }

      // So sánh với chuẩn hóa
      const normalizedUser = normalizeAnswer(userAnswer);
      const normalizedCorrect = normalizeAnswer(correctAnswer);
      const isCorrect = normalizedUser === normalizedCorrect;

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Tag color={isCorrect ? "green" : "red"}>{userAnswer || "—"}</Tag>
          {!isCorrect && userAnswer && (
            <Text type="secondary" style={{ fontSize: 11 }}>
              Expected: {correctAnswer}
            </Text>
          )}
        </div>
      );
    },
  }));

  return (
    <div style={{ padding: 24, minHeight: "100vh", background: "#f5f5f5" }}>
      <Card>
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Title level={3} style={{ margin: 0 }}>
                📊 Quiz Results
              </Title>
              {bestAttempt && (
                <Text type="secondary">
                  {bestAttempt.user?.firstName || bestAttempt.user?.email} -{" "}
                  {bestAttempt.quiz?.title}
                </Text>
              )}
            </div>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={exportToPDF}
                disabled={!bestAttempt}
              >
                Export PDF
              </Button>
            </Space>
          </div>

          {/* Best Score Card */}
          {bestAttempt && (
            <Card size="small" style={{ background: "#f0f9ff" }}>
              <Space size={24}>
                <div>
                  <Text type="secondary">Best Score</Text>
                  <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                    {bestAttempt.score}%
                  </Title>
                </div>
                <div>
                  <Text type="secondary">Total Attempts</Text>
                  <Title level={2} style={{ margin: 0 }}>
                    {data.length}
                  </Title>
                </div>
                <div>
                  <Text type="secondary">Status</Text>
                  <div>
                    <Tag
                      color={bestAttempt.passed ? "green" : "red"}
                      style={{ fontSize: 16, padding: "4px 12px" }}
                    >
                      {bestAttempt.passed ? "PASSED" : "FAILED"}
                    </Tag>
                  </div>
                </div>
              </Space>
            </Card>
          )}

          {/* Results Table */}
          <Spin spinning={loading}>
            <Table
              columns={[...baseColumns, ...answerColumns]}
              dataSource={data}
              rowKey={(record) => `${record.id}-${record.attemptNumber}`}
              pagination={false}
              bordered
              scroll={{ x: "max-content" }}
              rowClassName={(record, index) =>
                index === 0 ? "best-attempt-row" : ""
              }
            />

            {/* Correct Answers Summary */}
            {correctAnswersRow.length > 0 && (
              <Card
                size="small"
                title="✅ Answer Key"
                style={{ marginTop: 16, background: "#f6ffed" }}
              >
                <Space wrap>
                  {correctAnswersRow.map((answer, idx) => (
                    <Tag key={idx} color="success" style={{ fontSize: 13 }}>
                      {idx + 1}. {answer || "—"}
                    </Tag>
                  ))}
                </Space>
              </Card>
            )}
          </Spin>
        </Space>
      </Card>

      <style jsx>{`
        .best-attempt-row {
          background-color: #fffbe6 !important;
        }
        .best-attempt-row:hover {
          background-color: #fff9db !important;
        }
      `}</style>
    </div>
  );
};

export default QuizResultTable;
