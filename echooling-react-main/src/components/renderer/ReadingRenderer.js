import React, { useState, useEffect, useRef } from "react";
import { Button, Progress, Tooltip, message } from "antd";
import {
  FontSizeOutlined,
  ColumnWidthOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";
import "./ReadingRenderer.css";

const ReadingRenderer = ({
  question,
  initialAnswer = {},
  onAnswerChange,
  frozenAnswers = {},
  answerStatus = {},
  correctAnswer = {},
  showCorrectAnswer = false,
  editable = true,
}) => {
  const [answers, setAnswers] = useState(initialAnswer || {});
  const [fontSize, setFontSize] = useState(18);
  const [splitRatio, setSplitRatio] = useState(60);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    if (
      showCorrectAnswer &&
      frozenAnswers &&
      Object.keys(frozenAnswers).length > 0
    ) {
      console.log("📌 Review mode - using frozenAnswers:", frozenAnswers);
      console.log("📊 Answer status:", answerStatus);
      setAnswers(frozenAnswers);
    } else if (initialAnswer && typeof initialAnswer === "object") {
      console.log("✏️ Edit mode - using initialAnswer:", initialAnswer);
      setAnswers(initialAnswer);
    } else {
      setAnswers({});
    }
  }, [initialAnswer, frozenAnswers, showCorrectAnswer]);

  const handleChange = (index, value) => {
    const updated = { ...answers, [index]: value };
    setAnswers(updated);
    onAnswerChange?.(question.id, updated);
  };

  const getStyle = (index) => {
    if (!showCorrectAnswer) return {};
    if (answerStatus[index] === true) {
      return { backgroundColor: "#d4edda", borderColor: "#28a745" };
    } else if (answerStatus[index] === false) {
      return { backgroundColor: "#f8d7da", borderColor: "#dc3545" };
    }
    return {};
  };

  const calculateProgress = () => {
    const totalGaps = Object.keys(question?.gaps?.correct_answers || {}).length;
    if (totalGaps === 0) return 0;
    const filledGaps = Object.values(answers).filter(
      (val) => val && val.trim()
    ).length;
    return Math.round((filledGaps / totalGaps) * 100);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
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

  const parseQuestionText = () => {
    const container = document.createElement("div");
    container.innerHTML = question.question_text;
    let gapIndex = 0;
    let dropdownIndex = 0;

    const walkNodes = (node) => {
      const children = [];

      node.childNodes.forEach((child, i) => {
        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
          children.push(child.textContent);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child;
          const tagName = el.tagName.toLowerCase();
          const isVoidTag = [
            "br",
            "img",
            "hr",
            "input",
            "meta",
            "link",
          ].includes(tagName);
          const style = Object.fromEntries(
            [...el.style].map((k) => [k, el.style[k]])
          );

          if (el.classList.contains("cloze")) {
            const isDropdown = el.classList.contains("dropdown");
            const index = isDropdown
              ? `dropdown_${dropdownIndex++}`
              : `gap_${gapIndex++}`;
            const correct = question?.gaps?.correct_answers?.[index];

            let currentValue = "";
            if (showCorrectAnswer && frozenAnswers?.[index] !== undefined) {
              currentValue = frozenAnswers[index];
            } else {
              currentValue = answers?.[index] ?? "";
            }

            const isIncorrect =
              showCorrectAnswer && answerStatus[index] === false;
            const isCorrect = showCorrectAnswer && answerStatus[index] === true;

            if (isDropdown) {
              let options = [];
              try {
                options = JSON.parse(el.dataset.options || "[]");

                if (!shuffledOptions[index]) {
                  const shuffled = shuffleArray(options);
                  setShuffledOptions((prev) => ({
                    ...prev,
                    [index]: shuffled,
                  }));
                  options = shuffled;
                  console.log(`🔀 Shuffled ${index}:`, shuffled);
                } else {
                  options = shuffledOptions[index];
                }
              } catch (e) {
                console.error(
                  "Invalid dropdown options JSON:",
                  el.dataset.options
                );
              }

              children.push(
                <span
                  key={`dropdown-${index}`}
                  style={{ display: "inline-block", position: "relative" }}
                >
                  <select
                    className={`gap-dropdown ${
                      isCorrect ? "correct-answer" : ""
                    } ${isIncorrect ? "incorrect-answer" : ""}`}
                    style={{
                      margin: "0 4px",
                      padding: "6px 10px",
                      fontSize: `${fontSize}px`,
                      ...getStyle(index),
                    }}
                    disabled={!editable}
                    value={currentValue}
                    onChange={(e) => handleChange(index, e.target.value)}
                  >
                    <option value="" disabled hidden>
                      -- Select --
                    </option>
                    {options.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {isIncorrect && correct && (
                    <Tooltip title="Correct answer">
                      <span className="correct-answer-hint">✓ {correct}</span>
                    </Tooltip>
                  )}
                </span>
              );
            } else {
              children.push(
                <span
                  key={`input-${index}`}
                  style={{ display: "inline-block", position: "relative" }}
                >
                  <input
                    type="text"
                    className={`gap-input ${
                      isCorrect ? "correct-answer" : ""
                    } ${isIncorrect ? "incorrect-answer" : ""}`}
                    style={{
                      width: "auto",
                      minWidth: 50,
                      maxWidth: 150,
                      margin: "0 4px",
                      padding: "6px 10px",
                      fontSize: `${fontSize}px`,
                      ...getStyle(index),
                    }}
                    disabled={!editable}
                    value={currentValue}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder="..."
                  />
                  {isIncorrect && correct && (
                    <Tooltip title="Correct answer">
                      <span className="correct-answer-hint">✓ {correct}</span>
                    </Tooltip>
                  )}
                </span>
              );
            }
          } else if (isVoidTag) {
            children.push(
              React.createElement(tagName, {
                key: `${tagName}-${i}-${gapIndex}`,
                style,
              })
            );
          } else {
            children.push(
              React.createElement(
                tagName,
                { key: `${tagName}-${i}-${gapIndex}`, style },
                walkNodes(el)
              )
            );
          }
        }
      });

      return children;
    };

    return walkNodes(container);
  };

  const progress = calculateProgress();

  return (
    <div
      ref={containerRef}
      className={`reading-container ${isFullscreen ? "fullscreen-mode" : ""}`}
      style={{ padding: "16px", maxWidth: "1800px", margin: "0 auto" }}
    >
      <div className="reading-controls">
        <div className="controls-left">
          <Tooltip title="Completion Progress">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                minWidth: 200,
              }}
            >
              <Progress
                percent={progress}
                size="small"
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                format={(percent) => (
                  <span style={{ fontSize: 12, fontWeight: 600 }}>
                    {percent}%
                  </span>
                )}
              />
            </div>
          </Tooltip>
        </div>

        <div className="controls-right">
          <Tooltip title="Decrease font size">
            <Button
              icon={<FontSizeOutlined />}
              size="small"
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
            >
              A-
            </Button>
          </Tooltip>

          <Tooltip title="Increase font size">
            <Button
              icon={<FontSizeOutlined />}
              size="small"
              onClick={() => setFontSize(Math.min(26, fontSize + 2))}
            >
              A+
            </Button>
          </Tooltip>

          <Tooltip title="Adjust column width">
            <Button
              icon={<ColumnWidthOutlined />}
              size="small"
              onClick={() =>
                setSplitRatio(
                  splitRatio === 60 ? 50 : splitRatio === 50 ? 70 : 60
                )
              }
            >
              {splitRatio}%
            </Button>
          </Tooltip>

          <Tooltip title="Reset font size">
            <Button
              icon={<SyncOutlined />}
              size="small"
              onClick={() => {
                setFontSize(18);
                setSplitRatio(60);
                message.success("Settings reset");
              }}
            >
              Reset
            </Button>
          </Tooltip>

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
        </div>
      </div>

      <table className="reading-table">
        <thead>
          <tr>
            <th
              className="reading-table-header"
              style={{ width: `${splitRatio}%` }}
            >
              📖 Reading Passage
            </th>
            <th
              className="reading-table-header"
              style={{ width: `${100 - splitRatio}%` }}
            >
              ✍️ Questions (
              {Object.keys(question?.gaps?.correct_answers || {}).length} gaps)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="reading-cell">
              <div
                className="scrollable-left"
                style={{ fontSize: `${fontSize}px` }}
                dangerouslySetInnerHTML={{ __html: question.readingContent }}
              />
            </td>
            <td className="reading-cell">
              <div
                className="scrollable-right"
                style={{ fontSize: `${fontSize}px` }}
              >
                <div className="rendered-question">{parseQuestionText()}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {editable && (
        <div className="reading-footer">
          <div className="footer-info">
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
            <span>
              Fill in all{" "}
              {Object.keys(question?.gaps?.correct_answers || {}).length} gaps
              to complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const evaluateAnswers = (answers = {}, correctAnswers = {}) => {
  const result = {};
  for (const index in correctAnswers) {
    result[index] =
      (answers[index]?.trim?.() || "") ===
      (correctAnswers[index]?.trim?.() || "");
  }
  return result;
};

export default ReadingRenderer;
