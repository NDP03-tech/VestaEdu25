import React, { useEffect, useState } from "react";
import { Card, Button, Space, Typography, Tag, Tooltip, Alert } from "antd";
import {
  HighlightOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

// ✅ Chuẩn hóa text để so sánh
const normalizeText = (text) =>
  text
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]"]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .toLowerCase();

// ✅ Cắt đoạn văn bản thành các chunk gồm 1 từ + khoảng trắng (nếu có)
const splitTextIntoChunks = (text) => {
  const regex = /[^\s]+[\s]?/g;
  let match;
  let position = 0;
  const chunks = [];

  while ((match = regex.exec(text)) !== null) {
    const word = match[0];
    chunks.push({
      text: word,
      start: position,
      end: position + word.length,
    });
    position += word.length;
  }

  return chunks;
};

const FindHighlightRenderer = ({
  question,
  questionId,
  editable = true,
  initialAnswer = [],
  onAnswerChange,
  showCorrectAnswer = false,
  correctAnswer = [],
  answerStatus = {},
}) => {
  const [chunks, setChunks] = useState([]);
  const [highlights, setHighlights] = useState(initialAnswer || []);
  const [selection, setSelection] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    setHighlights(initialAnswer || []);
  }, [initialAnswer]);

  useEffect(() => {
    const rawHtml = question?.question_text || "";

    // ✅ Unwrap <a class="cloze"> bằng cách giữ lại khoảng trắng nếu có
    const tmp = document.createElement("div");
    tmp.innerHTML = rawHtml;

    tmp.querySelectorAll("a.cloze").forEach((el) => {
      // ✅ Nếu phía trước không có khoảng trắng, thì thêm 1 dấu cách
      const prev = el.previousSibling;
      const needLeadingSpace =
        !prev ||
        (prev.nodeType === 3 && !/\s$/.test(prev.textContent)) ||
        prev.nodeType === 1;

      if (needLeadingSpace) {
        el.before(document.createTextNode(" "));
      }

      // ✅ Nếu phía sau không có khoảng trắng, thì thêm 1 dấu cách
      const textNode = document.createTextNode(el.textContent);
      const next = el.nextSibling;
      const spaceNeeded =
        !next ||
        (next.nodeType === 3 && !/^\s/.test(next.nodeValue)) ||
        next.nodeType === 1;

      const space = spaceNeeded ? document.createTextNode(" ") : null;

      el.replaceWith(textNode);
      if (space) textNode.after(space);
    });

    const plainText = tmp.textContent || tmp.innerText || "";
    const newChunks = splitTextIntoChunks(plainText);
    setChunks(newChunks);
  }, [question]);

  const handleMouseUp = () => {
    if (!editable) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelection([]);
      setIsSelecting(false);
      return;
    }

    const selectedSpanIds = [];
    const allSpans = document.querySelectorAll("[data-index]");
    const range = selection.getRangeAt(0);

    allSpans.forEach((span) => {
      if (range.intersectsNode(span)) {
        selectedSpanIds.push(parseInt(span.dataset.index, 10));
      }
    });

    setSelection(selectedSpanIds);
    setIsSelecting(selectedSpanIds.length > 0);
  };

  const highlightSelection = () => {
    if (!editable || selection.length === 0) return;
    const newHighlights = [...highlights];
    selection.forEach((index) => {
      const chunk = chunks[index];
      if (!chunk) return;
      const exists = newHighlights.find(
        (h) => h.start === chunk.start && h.end === chunk.end
      );
      if (!exists) {
        newHighlights.push({
          text: normalizeText(chunk.text),
          start: chunk.start,
          end: chunk.end,
        });
      }
    });

    setHighlights(newHighlights);
    onAnswerChange?.(questionId, newHighlights);
    setSelection([]);
    setIsSelecting(false);
    window.getSelection()?.removeAllRanges();
  };

  const removeHighlight = () => {
    if (!editable || selection.length === 0) return;

    const updated = highlights.filter((h) => {
      return !selection.some((index) => {
        const chunk = chunks[index];
        return h?.start === chunk?.start && h?.end === chunk?.end;
      });
    });

    setHighlights(updated);
    onAnswerChange?.(questionId, updated);
    setSelection([]);
    setIsSelecting(false);
    window.getSelection()?.removeAllRanges();
  };

  const clearAll = () => {
    if (!editable) return;
    setHighlights([]);
    onAnswerChange?.(questionId, []);
    setSelection([]);
    setIsSelecting(false);
  };

  // Calculate stats
  const totalHighlights = highlights.length;
  const targetCount = question?.gaps?.length || 0;

  return (
    <div style={{ padding: "16px 0" }}>
      {/* Instructions Card */}
      {editable && !showCorrectAnswer && (
        <Alert
          message="How to highlight text"
          description={
            <Space direction="vertical" size={4}>
              <Text>
                • <strong>Select text</strong> by clicking and dragging across
                the words
              </Text>
              <Text>
                • Click <strong>"Highlight"</strong> to mark the selected text
              </Text>
              <Text>
                • To remove, select highlighted text and click{" "}
                <strong>"Remove"</strong>
              </Text>
              <Text>
                • You need to highlight <strong>{targetCount}</strong> word(s)
              </Text>
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

      {/* Control Panel */}
      {editable && (
        <Card
          size="small"
          style={{
            marginBottom: 16,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            border: "1px solid #f0f0f0",
          }}
        >
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
            <Space size={16}>
              <div>
                <Text
                  type="secondary"
                  style={{ fontSize: 12, display: "block" }}
                >
                  Highlighted
                </Text>
                <Text
                  strong
                  style={{
                    fontSize: 20,
                    color:
                      totalHighlights >= targetCount ? "#52c41a" : "#1890ff",
                  }}
                >
                  {totalHighlights}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {" "}
                  / {targetCount}
                </Text>
              </div>

              {isSelecting && (
                <Tag
                  color="processing"
                  style={{ fontSize: 13, padding: "4px 12px" }}
                >
                  {selection.length} word(s) selected
                </Tag>
              )}

              {totalHighlights >= targetCount && !showCorrectAnswer && (
                <Tag
                  color="success"
                  icon={<CheckCircleOutlined />}
                  style={{ fontSize: 13, padding: "4px 12px" }}
                >
                  Complete!
                </Tag>
              )}
            </Space>

            {/* Buttons */}
            <Space size={8}>
              <Tooltip title="Highlight selected text">
                <Button
                  type="primary"
                  icon={<HighlightOutlined />}
                  onClick={highlightSelection}
                  disabled={!isSelecting}
                  style={{
                    background: isSelecting
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : undefined,
                    borderColor: isSelecting ? "#667eea" : undefined,
                  }}
                >
                  Highlight
                </Button>
              </Tooltip>

              <Tooltip title="Remove selected highlight">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={removeHighlight}
                  disabled={!isSelecting}
                >
                  Remove
                </Button>
              </Tooltip>

              {totalHighlights > 0 && (
                <Tooltip title="Clear all highlights">
                  <Button onClick={clearAll} type="text">
                    Clear All
                  </Button>
                </Tooltip>
              )}
            </Space>
          </div>
        </Card>
      )}

      {/* Text Content */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <div
          onMouseUp={handleMouseUp}
          style={{
            userSelect: editable ? "text" : "none",
            minHeight: 150,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            width: "100%",
            fontSize: 16,
            lineHeight: 2,
            color: "#262626",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            cursor: editable ? "text" : "default",
          }}
        >
          {chunks.map((chunk, index) => {
            const isHighlighted = highlights.some(
              (h) =>
                Math.abs(h.start - chunk.start) <= 1 &&
                Math.abs(h.end - chunk.end) <= 1
            );
            const isSelected = selection.includes(index);

            return (
              <span
                key={index}
                data-index={index}
                style={{
                  backgroundColor: isHighlighted
                    ? "#fff566"
                    : isSelected
                    ? "#bae7ff"
                    : "transparent",
                  display: "inline-block",
                  padding: isHighlighted || isSelected ? "2px 0" : "0",
                  borderRadius: isHighlighted || isSelected ? "2px" : "0",
                  transition: "all 0.2s ease",
                  fontWeight: isHighlighted ? "500" : "normal",
                  boxShadow:
                    isHighlighted && isSelected ? "0 0 0 2px #1890ff" : "none",
                }}
              >
                {chunk.text}
              </span>
            );
          })}
        </div>
      </Card>

      {/* Summary */}
      {editable && totalHighlights > 0 && (
        <Card
          size="small"
          style={{
            marginTop: 16,
            borderRadius: 12,
            background: "#f6ffed",
            borderColor: "#b7eb8f",
          }}
        ></Card>
      )}

  
      <style jsx>{`
        ::selection {
          background-color: ${editable ? "#bae7ff" : "transparent"};
        }
        ::-moz-selection {
          background-color: ${editable ? "#bae7ff" : "transparent"};
        }
      `}</style>
    </div>
  );
};

export default FindHighlightRenderer;
