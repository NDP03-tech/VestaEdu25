import React from "react";
import { Table, Tooltip } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const QuizResultPage = ({ questions, results }) => {
  const columns = [
    {
      title: "Học viên",
      dataIndex: ["user", "fullName"],
      key: "fullName",
      fixed: "left",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      fixed: "left",
    },
    ...questions.map((question, index) => ({
      title: (
        <Tooltip title={question.text}>
          <span>Câu {index + 1}</span>
        </Tooltip>
      ),
      key: `question-${question._id}`,
      render: (_, record) => {
        const answerObj = record.answers.find(
          (a) => a.question === question._id
        );
        const isCorrect = answerObj?.isCorrect;

        const userAnswer = Array.isArray(answerObj?.answer)
          ? answerObj.answer.join(", ")
          : answerObj?.answer || "—";

        const correctAnswer = Array.isArray(question.correctAnswers)
          ? question.correctAnswers.join(", ")
          : question.correctAnswers || "—";

        return (
          <Tooltip
            placement="top"
            title={
              <div style={{ maxWidth: 300 }}>
                <div>
                  <strong>Câu hỏi:</strong> {question.text}
                </div>
                <div>
                  <strong>Trả lời:</strong> {userAnswer}
                </div>
                <div>
                  <strong>Đáp án đúng:</strong> {correctAnswer}
                </div>
              </div>
            }
          >
            {isCorrect ? (
              <CheckCircleOutlined style={{ color: "green", fontSize: 18 }} />
            ) : (
              <CloseCircleOutlined style={{ color: "red", fontSize: 18 }} />
            )}
          </Tooltip>
        );
      },
    })),
    {
      title: "Tổng điểm",
      dataIndex: "totalScore",
      key: "totalScore",
      fixed: "right",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Kết quả Quiz</h2>
      <Table
        columns={columns}
        dataSource={results}
        rowKey="_id"
        pagination={false}
        scroll={{ x: "max-content" }}
        bordered
      />
    </div>
  );
};

export default QuizResultPage;
