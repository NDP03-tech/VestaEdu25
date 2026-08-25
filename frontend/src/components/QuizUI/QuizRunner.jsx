import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Alert,
  Card,
} from "antd";
import QuestionRenderer from "../QuestionRenderer";

const { Title, Text } = Typography;

const QuizRunner = ({
  questions,
  headerText,
  onePerPage,
  onAnswerChange,
  correctAnswers = [],
  onSubmit,
  showCorrectAnswer,
  timeLimit,
  hasSubmitted,
  scoreAfterSubmit,
  initialAnswers = {},
  uiSettings = {},
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(
    timeLimit ? timeLimit * 60 : 0
  );
  const [frozenAnswers, setFrozenAnswers] = useState(null);
  const showQuestionNumbers = uiSettings.showQuestionNumbers ?? true;

  useEffect(() => {
    setCurrentIndex(0);
    setSecondsLeft(timeLimit ? timeLimit * 60 : 0);
    setFrozenAnswers(null);
  }, [questions, timeLimit]);

  useEffect(() => {
    if (!timeLimit) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, onSubmit]);

  useEffect(() => {
    if (hasSubmitted && !frozenAnswers) {
      setFrozenAnswers({ ...normalizedAnswers });
    }
  }, [hasSubmitted]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const normalizedAnswers = useMemo(() => {
    if (Array.isArray(initialAnswers)) {
      return initialAnswers.reduce((acc, curr) => {
        acc[curr.question] = curr.answer;
        return acc;
      }, {});
    }
    return initialAnswers;
  }, [initialAnswers]);

  const getInitialAnswerForQuestion = (question) => {
    const answer = normalizedAnswers[question.id];
    const type = question.questionType || question.question_type;

    // ⚡ Nếu quiz ở chế độ everyone_record → trả về correct answer làm initial
    if (questions?.visibleTo === "everyone_record") {
      return buildPrefilledAnswers(question);
    }

    switch (type) {
      case "checkboxes":
        if (Array.isArray(answer)) return answer;
        if (typeof answer === "string") {
          try {
            const parsed = JSON.parse(answer);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return [];
      case "find-highlight":
        return Array.isArray(answer) ? answer : [];
      case "blank-boxes":
      case "generated-dropdowns":
      case "drag-drop-matching":
        return typeof answer === "object" && answer !== null ? answer : {};
      case "multiple-choice":
        return typeof answer === "string" ? answer : "";
      case "essay":
      case "reading":
        return typeof answer === "string" ? answer : "";
      case "speaking":
        return typeof answer === "string" ? answer : "";
      default:
        return answer;
    }
  };

  const shouldShowOnePerPage = onePerPage && questions.length > 1;

  const buildPrefilledAnswers = (question) => {
    const result = {};
    let index = 0;

    // Gom tất cả gaps, hintWords, dropdowns
    const items = [
      ...(question.gaps?.map((g) => ({ ...g, type: "gap" })) || []),
      ...(question.hintWords?.map((h) => ({ ...h, type: "hint" })) || []),
      ...(question.dropdowns?.map((d) => ({ ...d, type: "dropdown" })) || []),
    ].sort((a, b) => a.position - b.position);

    // Duyệt theo thứ tự position
    items.forEach((item) => {
      if (item.type === "gap")
        result[`gap_${index}`] = item.correct_answers?.[0] || "";
      else if (item.type === "hint") result[`gap_${index}`] = item.word || "";
      else if (item.type === "dropdown")
        result[`gap_${index}`] = item.correct_answer || "";
      index++;
    });

    return result;
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        padding: 24,
        boxSizing: "border-box",
        backgroundColor: "#fff", // Tuỳ chọn: set màu nền để rõ ràng
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        <div dangerouslySetInnerHTML={{ __html: headerText }} />
      </Title>

      {timeLimit > 0 && (
        <Alert
          type="warning"
          showIcon
          message={`⏱ Time remaining: ${formatTime(secondsLeft)}`}
          style={{ marginBottom: 24 }}
        />
      )}

      {shouldShowOnePerPage ? (
        <div>
          <Card
            title={showQuestionNumbers ? `Question ${currentIndex + 1}` : null}
            bordered
            style={{
              marginBottom: 24,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              padding: 16,
            }}
          >
            <QuestionRenderer
              key={questions[currentIndex].id}
              question={questions[currentIndex]}
              showCorrectAnswer={showCorrectAnswer || hasSubmitted}
              hasSubmitted={hasSubmitted}
              frozenAnswer={frozenAnswers?.[questions[currentIndex].id]}
              correctAnswers={correctAnswers}
              initialAnswer={getInitialAnswerForQuestion(
                questions[currentIndex]
              )}
              onAnswerChange={(questionId, answer) =>
                onAnswerChange(questionId, answer)
              }
              editable={questions?.visibleTo !== "everyone_record"} // ✅ thêm dòng này
            />
          </Card>

          <Row justify="space-between" align="middle" style={{ marginTop: 24 }}>
            <Col>
              {currentIndex > 0 && (
                <Button onClick={() => setCurrentIndex(currentIndex - 1)}>
                  ⬅ Back
                </Button>
              )}
            </Col>

            <Col>
              {currentIndex < questions.length - 1 ? (
                <Button
                  type="primary"
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                >
                  Next ➡
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                  onClick={onSubmit}
                >
                  ✅ Submit
                </Button>
              )}
            </Col>
          </Row>

          {hasSubmitted && (
            <div className="text-center mt-6">
              <Divider />
              <Text strong style={{ fontSize: "1.2rem", color: "#389e0d" }}>
                🎉 Score: {scoreAfterSubmit}%
              </Text>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {questions.map((q, index) => (
              <Card
                key={q.id}
                title={showQuestionNumbers ? `Question ${index + 1}` : null}
                bordered
                style={{
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  padding: 16,
                }}
              >
                <QuestionRenderer
                  question={q}
                  showCorrectAnswer={hasSubmitted}
                  hasSubmitted={hasSubmitted}
                  frozenAnswer={frozenAnswers?.[q.id]}
                  correctAnswers={correctAnswers}
                  initialAnswer={getInitialAnswerForQuestion(q)}
                  onAnswerChange={(questionId, answer) =>
                    onAnswerChange(questionId, answer)
                  }
                />
              </Card>
            ))}
          </Space>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            {hasSubmitted && (
              <div style={{ marginTop: 20 }}>
                <Text strong style={{ fontSize: "1.2rem", color: "#389e0d" }}>
                  🎯 Score: {scoreAfterSubmit}%
                </Text>
              </div>
            )}

            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              onClick={onSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizRunner;
