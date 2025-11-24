import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const MultipleChoiceEditor = ({ options, setOptions }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleOptionChange = (index) => {
    // Chỉ cho phép 1 đáp án đúng
    const newOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const handleTextChange = (index, text) => {
    const newOptions = options.map((option, i) =>
      i === index ? { ...option, text } : option
    );
    setOptions(newOptions);
  };

  const handleEditorChange = (content, index) => {
    const newOptions = options.map((option, i) =>
      i === index ? { ...option, text: content } : option
    );
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleAddOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .option-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .option-card:hover {
            transform: translateX(4px);
            box-shadow: 0 8px 16px rgba(24, 144, 255, 0.15) !important;
          }

          .radio-custom {
            appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid #d9d9d9;
            border-radius: 50%;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
            background: white;
            flex-shrink: 0;
          }

          .radio-custom:hover {
            border-color: #40a9ff;
            box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
          }

          .radio-custom:checked {
            border-color: #1890ff;
            background: #1890ff;
            box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.15);
          }

          .radio-custom:checked::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: white;
            animation: fadeIn 0.2s ease;
          }

          .form-control-modern {
            border: 2px solid #e8e8e8;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 15px;
            transition: all 0.3s ease;
            width: 100%;
          }

          .form-control-modern:focus {
            outline: none;
            border-color: #1890ff;
            box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
          }

          .form-control-modern:hover {
            border-color: #40a9ff;
          }

          .btn-modern {
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            white-space: nowrap;
          }

          .btn-primary-modern {
            background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
            color: white;
          }

          .btn-primary-modern:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
          }

          .btn-outline-modern {
            background: white;
            border: 2px solid #e8e8e8;
            color: #595959;
          }

          .btn-outline-modern:hover {
            border-color: #1890ff;
            color: #1890ff;
            background: #f0f8ff;
          }

          .btn-danger-modern {
            background: white;
            border: 2px solid #ffccc7;
            color: #ff4d4f;
          }

          .btn-danger-modern:hover {
            background: #fff2f0;
            border-color: #ff4d4f;
            transform: scale(1.05);
          }

          .btn-add-option {
            background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
            color: white;
            padding: 12px 24px;
            font-size: 15px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(82, 196, 26, 0.2);
          }

          .btn-add-option:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(82, 196, 26, 0.3);
          }

          .option-letter {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
            color: #595959;
            font-weight: 700;
            font-size: 15px;
            flex-shrink: 0;
            transition: all 0.3s ease;
          }

          .option-letter.correct {
            background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
          }

          .editor-container {
            border: 2px solid #e8e8e8;
            border-radius: 8px;
            overflow: hidden;
            animation: slideIn 0.3s ease;
          }

          .badge-correct {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 12px;
            background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
            color: white;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 2px 6px rgba(82, 196, 26, 0.2);
          }
        `}
      </style>

      {/* Header */}
      <div
        style={{
          marginBottom: "1.5rem",
          padding: "16px 20px",
          background: "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)",
          borderRadius: "12px",
          border: "2px solid #d6e4ff",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span style={{ fontSize: "20px" }}>📝</span>
        <div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#1890ff",
              marginBottom: "2px",
            }}
          >
            Multiple Choice Options
          </div>
          <div style={{ fontSize: "13px", color: "#595959" }}>
            Select one correct answer • {options.length} options
          </div>
        </div>
      </div>

      {/* Options List */}
      {options.map((option, index) => (
        <div
          key={index}
          className="option-card"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            marginBottom: "1rem",
            padding: "20px",
            background: "white",
            border: option.isCorrect
              ? "2px solid #52c41a"
              : "2px solid #e8e8e8",
            borderRadius: "12px",
            boxShadow:
              hoveredIndex === index
                ? "0 4px 12px rgba(0, 0, 0, 0.08)"
                : "0 2px 8px rgba(0, 0, 0, 0.04)",
            animation: "slideIn 0.3s ease",
            animationDelay: `${index * 0.05}s`,
            animationFillMode: "both",
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: editingIndex === index ? "16px" : "0",
            }}
          >
            {/* Radio Button */}
            <input
              type="radio"
              name="multiple-choice"
              checked={option.isCorrect}
              onChange={() => handleOptionChange(index)}
              className="radio-custom"
            />

            {/* Option Letter */}
            <span
              className={`option-letter ${option.isCorrect ? "correct" : ""}`}
            >
              {String.fromCharCode(65 + index)}
            </span>

            {/* Correct Badge */}
            {option.isCorrect && (
              <span className="badge-correct">
                <span>✓</span>
                <span>Correct Answer</span>
              </span>
            )}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Action Buttons */}
            <button
              className="btn-modern btn-outline-modern"
              onClick={() =>
                setEditingIndex(editingIndex === index ? null : index)
              }
              title={
                editingIndex === index
                  ? "Close editor"
                  : "Open rich text editor"
              }
            >
              {editingIndex === index ? (
                <>
                  <span>✕</span>
                  <span>Close</span>
                </>
              ) : (
                <>
                  <span>✏️</span>
                  <span>Edit</span>
                </>
              )}
            </button>

            <button
              className="btn-modern btn-danger-modern"
              onClick={() => handleRemoveOption(index)}
              disabled={options.length <= 2}
              style={{
                opacity: options.length <= 2 ? 0.5 : 1,
                cursor: options.length <= 2 ? "not-allowed" : "pointer",
              }}
              title="Remove option"
            >
              <span style={{ fontSize: "16px" }}>🗑️</span>
            </button>
          </div>

          {/* Content Area */}
          <div style={{ marginTop: editingIndex === index ? "0" : "12px" }}>
            {editingIndex === index ? (
              <div className="editor-container">
                <Editor
                  apiKey="no-api-key"
                  value={option.text}
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: "link image code lists",
                    toolbar:
                      "undo redo | bold italic underline | bullist numlist | link image | code",
                    content_style: `
                      body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        font-size: 15px;
                        line-height: 1.6;
                        padding: 10px;
                      }
                    `,
                  }}
                  onEditorChange={(content) =>
                    handleEditorChange(content, index)
                  }
                />
              </div>
            ) : (
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                className="form-control-modern"
                placeholder={`Enter option ${index + 1} text...`}
              />
            )}
          </div>

          {/* Help Text for Empty Options */}
          {!option.text && editingIndex !== index && (
            <div
              style={{
                marginTop: "8px",
                fontSize: "12px",
                color: "#ff4d4f",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>⚠️</span>
              <span>This option is empty</span>
            </div>
          )}
        </div>
      ))}

      {/* Add Option Button */}
      <button
        className="btn-modern btn-add-option"
        onClick={handleAddOption}
        style={{
          width: "100%",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        <span style={{ fontSize: "18px" }}>+</span>
        <span>Add New Option</span>
      </button>

      {/* Footer Info */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "12px 16px",
          background: "#fafafa",
          borderRadius: "8px",
          border: "1px solid #e8e8e8",
          fontSize: "13px",
          color: "#595959",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "16px" }}>💡</span>
        <span>
          Click the radio button to mark the correct answer. Use the Edit button
          for rich formatting.
        </span>
      </div>
    </div>
  );
};

export default MultipleChoiceEditor;
