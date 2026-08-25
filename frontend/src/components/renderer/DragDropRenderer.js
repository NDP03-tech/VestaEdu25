import React, { useEffect, useRef, useState } from "react";
import { Card, Tag, Space, Typography, Tooltip, Alert } from "antd";
import {
  DragOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "./DragDropRichRenderer.css";

const { Text } = Typography;

const DragDropRichRenderer = ({
  question,
  initialAnswer = {},
  onAnswerChange,
  answerStatus = {},
  showCorrectAnswer = false,
  editable = true,
}) => {
  const containerRef = useRef(null);
  const [droppedAnswers, setDroppedAnswers] = useState({});
  const [availableAnswers, setAvailableAnswers] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [hoveredGap, setHoveredGap] = useState(null);

  // 🔹 Decode HTML entities safely
  const decodeHtmlEntities = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  // 🔹 Shuffle dropdown options
  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // 🔹 Normalize initialAnswer keys
  const normalizeInitialAnswer = (initial) => {
    const normalized = {};
    if (!initial || typeof initial !== "object") return normalized;

    Object.keys(initial).forEach((k) => {
      if (/^(gap_|dropdown_|hint_)/.test(k)) normalized[k] = initial[k];
      else if (/^\d+$/.test(k)) normalized[`gap_${k}`] = initial[k];
      else normalized[k] = initial[k];
    });
    return normalized;
  };

  // 🧩 Init available answers and dropped answers
  useEffect(() => {
    if (!question) return;
    const normalized = normalizeInitialAnswer(initialAnswer);
    setDroppedAnswers(normalized);

    const used = Object.values(normalized);
    const allAnswers =
      question.gaps?.flatMap((g) => g.correct_answers || []) || [];
    const unique = [...new Set(allAnswers)].filter(
      (a) => a && !used.includes(a)
    );
    setAvailableAnswers(unique);
  }, [question, initialAnswer]);

  // 🧩 Re-render DOM each time droppedAnswers changes
  useEffect(() => {
    if (!question?.question_text) return;
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = question.question_text;

    const clozes = container.querySelectorAll("a.cloze");

    // ✅ Track separate counters for each type
    let gapCounter = 0;
    let dropdownCounter = 0;
    let hintCounter = 0;

    clozes.forEach((el) => {
      const isDropdown = el.classList.contains("dropdown");
      const isHint =
        el.closest(".hint-wrapper") ||
        el.classList.contains("hint") ||
        el.classList.contains("hint-word");

      // ✅ Use appropriate counter based on type
      let key;
      if (isDropdown) {
        key = `dropdown_${dropdownCounter}`;
        dropdownCounter++;
      } else if (isHint) {
        key = `hint_${hintCounter}`;
        hintCounter++;
      } else {
        key = `gap_${gapCounter}`;
        gapCounter++;
      }

      const value = droppedAnswers[key] ?? "";

      el.innerHTML = "";

      // 🔸 Dropdown - Enhanced UI
      if (isDropdown) {
        let options = [];
        if (el.dataset?.options) {
          try {
            const decoded = decodeHtmlEntities(el.dataset.options);
            options = JSON.parse(decoded);
          } catch (err) {
            console.error("Dropdown parse error", err);
          }
        }

        // ✅ Shuffle only when editable (during quiz)
        if (editable && !showCorrectAnswer) {
          options = shuffleArray(options);
        }

        const select = document.createElement("select");
        select.className = "drag-drop-select";
        select.style.cssText = `
          width: auto;
          min-width: 120px;
          margin: 0 4px;
          padding: 6px 32px 6px 12px;
          font-size: 14px;
          border: 2px solid #d9d9d9;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        // ✅ Only disable when NOT editable
        if (!editable) {
          select.disabled = true;
          select.style.backgroundColor = "#f5f5f5";
          select.style.cursor = "not-allowed";
        } else {
          select.onmouseenter = () => {
            select.style.borderColor = "#40a9ff";
            select.style.boxShadow = "0 0 0 2px rgba(24, 144, 255, 0.1)";
          };
          select.onmouseleave = () => {
            select.style.borderColor = "#d9d9d9";
            select.style.boxShadow = "none";
          };
        }

        // Apply answer status styling
        if (showCorrectAnswer && answerStatus[key] !== undefined) {
          const isCorrect = answerStatus[key];
          select.style.borderColor = isCorrect ? "#52c41a" : "#ff4d4f";
          select.style.backgroundColor = isCorrect ? "#f6ffed" : "#fff2f0";
        }

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "-- Select an answer --";
        placeholder.disabled = true;
        placeholder.hidden = true;
        select.appendChild(placeholder);

        options.forEach((opt) => {
          const optEl = document.createElement("option");
          optEl.value = opt;
          optEl.textContent = opt;
          select.appendChild(optEl);
        });

        select.value = value ?? "";

        // ✅ Allow change when editable
        if (editable) {
          select.onchange = (e) => handleChange(key, e.target.value);
        }

        el.appendChild(select);
        return;
      }

      // 🔸 Hint word - Enhanced UI
      if (isHint) {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "drag-drop-input";
        input.placeholder = editable ? "Type here..." : "";
        input.style.cssText = `
          width: auto;
          min-width: 100px;
          margin: 0 4px;
          padding: 6px 12px;
          font-size: 14px;
          border: 2px solid #d9d9d9;
          border-radius: 6px;
          background: white;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        input.value = value ?? "";

        // ✅ Only disable when NOT editable
        if (!editable) {
          input.disabled = true;
          input.style.backgroundColor = "#f5f5f5";
          input.style.cursor = "not-allowed";
        } else {
          input.onfocus = () => {
            input.style.borderColor = "#40a9ff";
            input.style.boxShadow = "0 0 0 2px rgba(24, 144, 255, 0.1)";
          };
          input.onblur = () => {
            input.style.borderColor = "#d9d9d9";
            input.style.boxShadow = "none";
          };

          // ✅ Allow input when editable
          input.oninput = (e) => handleChange(key, e.target.value);
        }

        // Apply answer status styling
        if (showCorrectAnswer && answerStatus[key] !== undefined) {
          const isCorrect = answerStatus[key];
          input.style.borderColor = isCorrect ? "#52c41a" : "#ff4d4f";
          input.style.backgroundColor = isCorrect ? "#f6ffed" : "#fff2f0";
        }

        el.appendChild(input);
        return;
      }

      // 🔸 Drag-drop gap - Enhanced UI
      const wrapper = document.createElement("span");
      wrapper.className = "drag-drop-gap";
      wrapper.dataset.key = key;

      const content = document.createElement("span");
      content.className = "gap-content";
      content.textContent = value || "Drop here";

      wrapper.appendChild(content);

      // Base styles
      wrapper.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 100px;
        min-height: 36px;
        margin: 0 6px;
        padding: 6px 12px;
        border: 2px dashed #d9d9d9;
        border-radius: 8px;
        background: ${value ? "#e6f7ff" : "#fafafa"};
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 14px;
        font-weight: 500;
        user-select: none;
        position: relative;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      `;

      content.style.cssText = `
        color: ${value ? "#1890ff" : "#999"};
        transition: all 0.3s ease;
        font-weight: ${value ? "600" : "400"};
      `;

      // ✅ REVIEW MODE: Apply answer status styling
      if (showCorrectAnswer && answerStatus[key] !== undefined) {
        const isCorrect = answerStatus[key];
        wrapper.style.backgroundColor = isCorrect ? "#f6ffed" : "#fff2f0";
        wrapper.style.borderColor = isCorrect ? "#52c41a" : "#ff4d4f";
        wrapper.style.borderStyle = "solid";
        content.style.color = isCorrect ? "#52c41a" : "#ff4d4f";

        // Add icon
        const icon = document.createElement("span");
        icon.innerHTML = isCorrect ? "✓" : "✗";
        icon.style.cssText = `
          margin-left: 6px;
          font-size: 16px;
          color: ${isCorrect ? "#52c41a" : "#ff4d4f"};
        `;
        wrapper.appendChild(icon);
      }

      // ✅ EDIT MODE: Enable all interactions when editable = true
      if (editable) {
        // ===== 1. DOUBLE-CLICK TO REMOVE =====
        if (value) {
          wrapper.ondblclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            wrapper.style.animation = "shake 0.3s ease";
            setTimeout(() => handleRemove(key), 150);
          };
          wrapper.title = "Double-click to remove";
        } else {
          wrapper.title = "Drag an answer here";
        }

        // ===== 2. DRAG & DROP - ALWAYS ENABLED when editable =====
        wrapper.ondragover = (e) => {
          e.preventDefault();
          wrapper.style.backgroundColor = "#bae7ff";
          wrapper.style.borderColor = "#1890ff";
          wrapper.style.borderStyle = "solid";
          wrapper.style.transform = "scale(1.05)";
          setHoveredGap(key);
        };

        wrapper.ondragleave = (e) => {
          e.preventDefault();
          if (showCorrectAnswer && answerStatus[key] !== undefined) {
            const isCorrect = answerStatus[key];
            wrapper.style.backgroundColor = isCorrect ? "#f6ffed" : "#fff2f0";
            wrapper.style.borderColor = isCorrect ? "#52c41a" : "#ff4d4f";
            wrapper.style.borderStyle = "solid";
          } else {
            wrapper.style.backgroundColor = value ? "#e6f7ff" : "#fafafa";
            wrapper.style.borderColor = "#d9d9d9";
            wrapper.style.borderStyle = value ? "solid" : "dashed";
          }
          wrapper.style.transform = "scale(1)";
          setHoveredGap(null);
        };

        wrapper.ondrop = (e) => {
          e.preventDefault();
          e.stopPropagation();

          const text = e.dataTransfer.getData("text");
          if (!text) return;

          // If gap has answer, remove it first
          if (droppedAnswers[key] && droppedAnswers[key] !== text) {
            const oldAnswer = droppedAnswers[key];
            setAvailableAnswers((prev) => [...prev, oldAnswer]);
          }

          // Add new answer
          const updated = { ...droppedAnswers, [key]: text };
          setDroppedAnswers(updated);
          setAvailableAnswers((prev) => prev.filter((a) => a !== text));
          onAnswerChange?.(question.id, updated);

          // Reset styles
          if (showCorrectAnswer && answerStatus[key] !== undefined) {
            const isCorrect = answerStatus[key];
            wrapper.style.backgroundColor = isCorrect ? "#f6ffed" : "#fff2f0";
            wrapper.style.borderColor = isCorrect ? "#52c41a" : "#ff4d4f";
          } else {
            wrapper.style.backgroundColor = "#e6f7ff";
            wrapper.style.borderColor = "#d9d9d9";
          }
          wrapper.style.borderStyle = "solid";
          wrapper.style.transform = "scale(1)";
          setHoveredGap(null);
        };

        // ===== 3. HOVER EFFECTS =====
        if (!showCorrectAnswer) {
          if (value) {
            wrapper.onmouseenter = () => {
              wrapper.style.backgroundColor = "#fff7e6";
              wrapper.style.borderColor = "#ffa940";
              wrapper.style.borderStyle = "solid";
              wrapper.style.transform = "scale(1.03)";
              wrapper.style.boxShadow = "0 2px 8px rgba(255, 169, 64, 0.3)";
              content.style.color = "#fa8c16";
            };
            wrapper.onmouseleave = () => {
              wrapper.style.backgroundColor = "#e6f7ff";
              wrapper.style.borderColor = "#d9d9d9";
              wrapper.style.borderStyle = "dashed";
              wrapper.style.transform = "scale(1)";
              wrapper.style.boxShadow = "none";
              content.style.color = "#1890ff";
            };
          } else {
            wrapper.onmouseenter = () => {
              wrapper.style.backgroundColor = "#f0f5ff";
              wrapper.style.borderColor = "#597ef7";
              wrapper.style.transform = "scale(1.02)";
              content.style.color = "#597ef7";
            };
            wrapper.onmouseleave = () => {
              wrapper.style.backgroundColor = "#fafafa";
              wrapper.style.borderColor = "#d9d9d9";
              wrapper.style.transform = "scale(1)";
              content.style.color = "#999";
            };
          }
        } else {
          wrapper.onmouseenter = () => {
            wrapper.style.opacity = "0.8";
            wrapper.style.transform = "scale(1.02)";
            wrapper.style.cursor = "pointer";
          };
          wrapper.onmouseleave = () => {
            wrapper.style.opacity = "1";
            wrapper.style.transform = "scale(1)";
          };
        }
      } else {
        // ===== NOT EDITABLE: Disable all interactions =====
        wrapper.style.cursor = "not-allowed";
        wrapper.style.opacity = "0.7";
      }

      el.appendChild(wrapper);
    });
  }, [droppedAnswers, showCorrectAnswer, answerStatus, question, editable]);

  // 🧩 Handle events
  const handleChange = (key, value) => {
    const updated = { ...droppedAnswers, [key]: value };
    setDroppedAnswers(updated);
    onAnswerChange?.(question.id, updated);
  };

  const handleDrop = (e, key) => {
    e.preventDefault();
    const text = e.dataTransfer.getData("text");
    if (!text) return;

    // If gap has answer, remove it first
    if (droppedAnswers[key] && droppedAnswers[key] !== text) {
      const oldAnswer = droppedAnswers[key];
      setAvailableAnswers((prev) => [...prev, oldAnswer]);
    }

    // Add new answer
    const updated = { ...droppedAnswers, [key]: text };
    setDroppedAnswers(updated);
    setAvailableAnswers((prev) => prev.filter((a) => a !== text));
    onAnswerChange?.(question.id, updated);
  };

  const handleRemove = (key) => {
    const removed = droppedAnswers[key];
    if (!removed) return;
    const updated = { ...droppedAnswers };
    delete updated[key];
    setDroppedAnswers(updated);
    setAvailableAnswers((prev) => [...prev, removed]);
    onAnswerChange?.(question.id, updated);
  };

  const handleDragStart = (e, text) => {
    e.dataTransfer.setData("text", text);
    e.dataTransfer.effectAllowed = "move";
    setDraggedItem(text);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Calculate progress
  const totalGaps = question.gaps?.length || 0;
  const filledGaps = Object.keys(droppedAnswers).filter(
    (k) => k.startsWith("gap_") && droppedAnswers[k]
  ).length;
  const progressPercent = totalGaps > 0 ? (filledGaps / totalGaps) * 100 : 0;

  return (
    <div style={{ padding: "16px 0" }}>
      {/* Instructions Card */}
      {editable && !showCorrectAnswer && (
        <Alert
          message="How to complete this exercise"
          description={
            <Space direction="vertical" size={4}>
              <Text>
                • <strong>Drag</strong> answer options from below into the gaps
                in the text
              </Text>
              <Text>
                • <strong>Double-click</strong> on placed answers to remove them
              </Text>
              <Text>• All gaps must be filled before submitting</Text>
            </Space>
          }
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          style={{
            marginBottom: 16,
            borderRadius: 8,
            backgroundColor: "#e6f7ff",
            borderColor: "#91d5ff",
          }}
        />
      )}

      {/* Progress Indicator */}
      {editable && !showCorrectAnswer && totalGaps > 0 && (
        <Card
          size="small"
          style={{
            marginBottom: 16,
            borderRadius: 8,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
          }}
        >
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Text strong style={{ color: "white", fontSize: 14 }}>
              📊 Progress: {filledGaps} / {totalGaps} gaps filled
            </Text>
            <div
              style={{
                width: 200,
                height: 8,
                backgroundColor: "rgba(255,255,255,0.3)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  backgroundColor: "#52c41a",
                  transition: "width 0.3s ease",
                  borderRadius: 4,
                }}
              />
            </div>
          </Space>
        </Card>
      )}

      {/* Available Answers - Enhanced */}
      {editable && availableAnswers.length > 0 && (
        <Card
          title={
            <Space>
              <DragOutlined style={{ color: "#1890ff", fontSize: 18 }} />
              <Text strong style={{ fontSize: 15 }}>
                Available Answers ({availableAnswers.length})
              </Text>
              {showCorrectAnswer && (
                <Tag color="warning" style={{ marginLeft: 8 }}>
                  Review Mode
                </Tag>
              )}
            </Space>
          }
          size="small"
          style={{
            marginBottom: 20,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            border: showCorrectAnswer
              ? "2px solid #faad14"
              : "1px solid #f0f0f0",
          }}
          bodyStyle={{ padding: "12px 16px" }}
        >
          <Space size={[8, 8]} wrap>
            {availableAnswers.map((ans, idx) => (
              <Tooltip
                key={idx}
                title={
                  showCorrectAnswer
                    ? "Drag to replace wrong answers"
                    : "Drag me to a gap"
                }
                placement="top"
              >
                <Tag
                  draggable
                  onDragStart={(e) => handleDragStart(e, ans)}
                  onDragEnd={handleDragEnd}
                  className="draggable-answer-tag"
                  style={{
                    margin: 0,
                    padding: "6px 14px",
                    fontSize: 14,
                    fontWeight: 500,
                    borderRadius: 8,
                    border: showCorrectAnswer
                      ? "2px solid #faad14"
                      : "2px solid #1890ff",
                    background:
                      draggedItem === ans
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : showCorrectAnswer
                        ? "#fff7e6"
                        : "#e6f7ff",
                    color:
                      draggedItem === ans
                        ? "white"
                        : showCorrectAnswer
                        ? "#fa8c16"
                        : "#1890ff",
                    cursor: "grab",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    userSelect: "none",
                    boxShadow:
                      draggedItem === ans
                        ? "0 4px 12px rgba(102, 126, 234, 0.4)"
                        : "0 2px 4px rgba(0,0,0,0.05)",
                    transform: draggedItem === ans ? "scale(1.05)" : "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    if (draggedItem !== ans) {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(102, 126, 234, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (draggedItem !== ans) {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 4px rgba(0,0,0,0.05)";
                    }
                  }}
                >
                  {ans}
                </Tag>
              </Tooltip>
            ))}
          </Space>

          {/* Hint for review mode */}
          {showCorrectAnswer && (
            <div
              style={{
                marginTop: 12,
                padding: 8,
                background: "#fffbe6",
                borderRadius: 6,
                border: "1px solid #ffe58f",
              }}
            >
              <Text style={{ fontSize: 13, color: "#ad6800" }}>
                💡 <strong>Tip:</strong> Double-click on wrong answers (red) to
                remove them, then drag the correct answer from here.
              </Text>
            </div>
          )}
        </Card>
      )}

      {/* Question Content */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
        }}
        bodyStyle={{ padding: "24px", lineHeight: 2 }}
      >
        <div
          ref={containerRef}
          className="drag-drop-content"
          style={{
            fontSize: 16,
            color: "#262626",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        />
      </Card>

      {/* Results Summary */}
      {showCorrectAnswer && (
        <Card
          style={{
            marginTop: 16,
            borderRadius: 12,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
          }}
        >
          <Space size={24}>
            <div>
              <CheckCircleOutlined style={{ fontSize: 32, color: "#52c41a" }} />
              <Text
                strong
                style={{ color: "white", marginLeft: 8, fontSize: 16 }}
              >
                {Object.values(answerStatus).filter(Boolean).length} Correct
              </Text>
            </div>
            <div>
              <CloseCircleOutlined style={{ fontSize: 32, color: "#ff4d4f" }} />
              <Text
                strong
                style={{ color: "white", marginLeft: 8, fontSize: 16 }}
              >
                {Object.values(answerStatus).filter((v) => v === false).length}{" "}
                Incorrect
              </Text>
            </div>
          </Space>
        </Card>
      )}
    </div>
  );
};

export default DragDropRichRenderer;
