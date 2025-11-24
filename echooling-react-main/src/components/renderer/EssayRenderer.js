import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Input,
  Progress,
  Button,
  Space,
  Typography,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  EditOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  CopyOutlined,
  DeleteOutlined,
  FontSizeOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Text, Title } = Typography;

const EssayRenderer = ({
  question,
  initialAnswer = "",
  frozenAnswer = "",
  onAnswerChange,
  showCorrectAnswer = false,
  editable = true,
}) => {
  const [answer, setAnswer] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const textAreaRef = useRef(null);

  // ✅ FIX: Thêm ref để track lần đầu load
  const isInitialMount = useRef(true);

  const minWords = question?.minWords || 150;
  const taskType = question?.taskType || "Task 1";

  // ✅ FIX: Chỉ chạy 1 lần khi component mount hoặc khi question.id thay đổi
  useEffect(() => {
    let displayAnswer = "";

    if (showCorrectAnswer) {
      // Review mode: ưu tiên frozenAnswer
      displayAnswer = frozenAnswer || initialAnswer || "";
      console.log(`📝 Review mode - Question ${question?.id}:`, {
        frozenAnswer,
        initialAnswer,
        using: displayAnswer,
      });
    } else {
      // Edit mode: dùng initialAnswer
      displayAnswer = initialAnswer || "";
      console.log(`✏️ Edit mode - Question ${question?.id}:`, {
        initialAnswer,
        using: displayAnswer,
      });
    }

    setAnswer(displayAnswer);
    updateCounts(displayAnswer);

    isInitialMount.current = false;
  }, [question?.id]); // ✅ Chỉ phụ thuộc vào question.id như BlankBoxesRenderer

  // ✅ NEW: Separate effect để handle mode changes (edit <-> review)
  useEffect(() => {
    if (isInitialMount.current) return; // Skip lần đầu

    if (showCorrectAnswer) {
      const displayAnswer = frozenAnswer || initialAnswer || "";
      console.log(
        `🔄 Switching to review mode - Question ${question?.id}:`,
        displayAnswer
      );
      setAnswer(displayAnswer);
      updateCounts(displayAnswer);
    }
  }, [showCorrectAnswer, frozenAnswer]);

  const updateCounts = (text) => {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setCharCount(chars);
    setWordCount(words);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setAnswer(newValue);
    updateCounts(newValue);
    onAnswerChange && onAnswerChange(question.id, newValue);
  };

  const getWordCountStatus = () => {
    if (wordCount < minWords) return "exception";
    return "success";
  };

  const getWordCountPercent = () => {
    return Math.min((wordCount / minWords) * 100, 100);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    message.success("Essay copied to clipboard!");
  };

  const handleClear = () => {
    setAnswer("");
    updateCounts("");
    onAnswerChange && onAnswerChange(question.id, "");
    message.info("Essay cleared");
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={containerRef}
      className={`essay-renderer ${isFullscreen ? "fullscreen-mode" : ""}`}
      style={{
        padding: isFullscreen ? 24 : 0,
        background: isFullscreen ? "#fff" : "transparent",
        position: isFullscreen ? "fixed" : "relative",
        top: isFullscreen ? 0 : "auto",
        left: isFullscreen ? 0 : "auto",
        right: isFullscreen ? 0 : "auto",
        bottom: isFullscreen ? 0 : "auto",
        zIndex: isFullscreen ? 9999 : "auto",
        height: isFullscreen ? "100vh" : "auto",
        overflow: isFullscreen ? "auto" : "visible",
      }}
    >
      {/* Question Content */}
      <Card
        style={{ marginBottom: 16 }}
        title={
          <Space>
            <FileTextOutlined style={{ fontSize: 18, color: "#1890ff" }} />
            <Text strong style={{ fontSize: 16 }}>
              Essay Question
            </Text>
            {showCorrectAnswer && (
              <Tag color="green" icon={<CheckCircleOutlined />}>
                Submitted
              </Tag>
            )}
          </Space>
        }
      >
        {question.question_text ? (
          <div
            className="essay-content"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.8,
              color: "#2c3e50",
            }}
            dangerouslySetInnerHTML={{ __html: question.question_text }}
          />
        ) : (
          <Text type="secondary">No question content provided.</Text>
        )}

        {/* Word Count Requirements */}
        {minWords && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: "#f0f2f5",
              borderRadius: 6,
            }}
          >
            <Space size={16} wrap>
              <div>
                <Text strong style={{ fontSize: 14 }}>
                  📏 Minimum Requirement:
                </Text>
              </div>
              <Tag color="blue" style={{ fontSize: 13 }}>
                {taskType}: {minWords}+ words
              </Tag>
              <Text type="secondary" style={{ fontSize: 13 }}>
                (No maximum limit - write as much as needed to fully answer the
                question)
              </Text>
            </Space>
          </div>
        )}
      </Card>

      {/* Control Panel */}
      <Card style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {/* Stats */}
          <Space size={24}>
            <div>
              <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                Words
              </Text>
              <Text
                strong
                style={{
                  fontSize: 20,
                  color:
                    getWordCountStatus() === "success" ? "#52c41a" : "#ff4d4f",
                }}
              >
                {wordCount}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {" "}
                / {minWords}+
              </Text>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                Characters
              </Text>
              <Text strong style={{ fontSize: 20, color: "#1890ff" }}>
                {charCount}
              </Text>
            </div>

            <div style={{ minWidth: 200 }}>
              <Progress
                percent={getWordCountPercent()}
                status={getWordCountStatus()}
                size="small"
                format={() => (
                  <span style={{ fontSize: 11, fontWeight: 600 }}>
                    {wordCount < minWords
                      ? `${minWords - wordCount} more`
                      : `${wordCount - minWords}+ over`}
                  </span>
                )}
              />
            </div>
          </Space>

          {/* Controls */}
          <Space size={8}>
            <Tooltip title="Decrease font size">
              <Button
                icon={<FontSizeOutlined />}
                size="small"
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              >
                A-
              </Button>
            </Tooltip>

            <Tooltip title="Increase font size">
              <Button
                icon={<FontSizeOutlined />}
                size="small"
                onClick={() => setFontSize(Math.min(22, fontSize + 2))}
              >
                A+
              </Button>
            </Tooltip>

            {!showCorrectAnswer && editable && (
              <>
                <Tooltip title="Copy essay">
                  <Button
                    icon={<CopyOutlined />}
                    size="small"
                    onClick={handleCopy}
                    disabled={!answer}
                  />
                </Tooltip>

                <Tooltip title="Clear essay">
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    onClick={handleClear}
                    disabled={!answer}
                  />
                </Tooltip>
              </>
            )}

            <Tooltip
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <Button
                icon={
                  isFullscreen ? (
                    <FullscreenExitOutlined />
                  ) : (
                    <FullscreenOutlined />
                  )
                }
                size="small"
                onClick={toggleFullscreen}
              />
            </Tooltip>
          </Space>
        </div>
      </Card>

      {/* Essay Input */}
      <Card
        title={
          <Space>
            <EditOutlined style={{ fontSize: 16, color: "#52c41a" }} />
            <Text strong>Your Answer</Text>
          </Space>
        }
      >
        <TextArea
          ref={textAreaRef}
          value={answer}
          onChange={handleChange}
          placeholder={
            editable
              ? "Write your answer here...\n\nTips:\n• Be clear and concise\n• Use proper grammar and punctuation\n• Organize your thoughts in paragraphs\n• Review before submitting"
              : ""
          }
          disabled={!editable}
          autoSize={{ minRows: 10, maxRows: isFullscreen ? 30 : 20 }}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: 1.8,
            fontFamily:
              "'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            background: editable ? "#fff" : "#f5f5f5",
          }}
        />

        {/* Word Count Warning/Success */}
        {editable && wordCount > 0 && (
          <div style={{ marginTop: 12 }}>
            {wordCount < minWords && (
              <Text type="warning" style={{ fontSize: 13 }}>
                ⚠️ You need at least {minWords - wordCount} more word(s) to meet
                the minimum requirement.
              </Text>
            )}
            {wordCount >= minWords && (
              <Text type="success" style={{ fontSize: 13 }}>
                ✅ Your essay meets the minimum word count ({wordCount} words).
                You can continue writing if needed.
              </Text>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default EssayRenderer;
