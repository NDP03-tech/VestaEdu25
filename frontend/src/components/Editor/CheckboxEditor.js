import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const CheckboxesEditor = ({ options = [], setOptions }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleOptionChange = (index) => {
    const updated = options.map((opt, i) =>
      i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt
    );
    setOptions(updated);
  };

  const handleTextChange = (index, text) => {
    const updated = options.map((opt, i) =>
      i === index ? { ...opt, text } : opt
    );
    setOptions(updated);
  };

  const handleEditorChange = (content, index) => {
    const updated = options.map((opt, i) =>
      i === index ? { ...opt, text: content } : opt
    );
    setOptions(updated);
  };

  const handleRemoveOption = (index) => {
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleAddOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const correctCount = options.filter((opt) => opt.isCorrect).length;

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

          @keyframes checkboxCheck {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }

          .option-card-checkbox {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .option-card-checkbox:hover {
            transform: translateX(4px);
            box-shadow: 0 8px 16px rgba(250, 140, 22, 0.15) !important;
          }

          .checkbox-custom {
            appearance: none;
            width: 22px;
            height: 22px;
            border: 2px solid #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
            background: white;
            flex-shrink: 0;
          }

          .checkbox-custom:hover {
            border-color: #ffa940;
            box-shadow: 0 0 0 3px rgba(250, 140, 22, 0.1);
          }

          .checkbox-custom:checked {
            border-color: #fa8c16;
            background: #fa8c16;
            box-shadow: 0 0 0 3px rgba(250, 140, 22, 0.15);
          }

          .checkbox-custom:checked::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 12px;
            height: 12px;
            background: white;
            mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
            mask-size: contain;
            animation: checkboxCheck 0.3s ease;
          }

          .form-control-checkbox {
            border: 2px solid #e8e8e8;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 15px;
            transition: all 0.3s ease;
            width: 100%;
          }

          .form-control-checkbox:focus {
            outline: none;
            border-color: #fa8c16;
            box-shadow: 0 0 0 3px rgba(250, 140, 22, 0.1);
          }

          .form-control-checkbox:hover {
            border-color: #ffa940;
          }

          .btn-checkbox {
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

          .btn-outline-checkbox {
            background: white;
            border: 2px solid #e8e8e8;
            color: #595959;
          }

          .btn-outline-checkbox:hover {
            border-color: #fa8c16;
            color: #fa8c16;
            background: #fff7e6;
          }

          .btn-danger-checkbox {
            background: white;
            border: 2px solid #ffccc7;
            color: #ff4d4f;
          }

          .btn-danger-checkbox:hover {
            background: #fff2f0;
            border-color: #ff4d4f;
            transform: scale(1.05);
          }

          .btn-add-checkbox {
            background: linear-gradient(135deg, #fa8c16 0%, #d46b08 100%);
            color: white;
            padding: 12px 24px;
            font-size: 15px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(250, 140, 22, 0.2);
          }

          .btn-add-checkbox:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(250, 140, 22, 0.3);
          }

          .option-letter-checkbox {
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

          .option-letter-checkbox.correct {
            background: linear-gradient(135deg, #fa8c16 0%, #d46b08 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(250, 140, 22, 0.3);
          }

          .editor-container-checkbox {
            border: 2px solid #e8e8e8;
            border-radius: 8px;
            overflow: hidden;
            animation: slideIn 0.3s ease;
          }

          .badge-correct-checkbox {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 12px;
            background: linear-gradient(135deg, #fa8c16 0%, #d46b08 100%);
            color: white;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 2px 6px rgba(250, 140, 22, 0.2);
          }
        `}
      </style>

      {/* Header */}
      <div
        style={{
          marginBottom: "1.5rem",
          padding: "16px 20px",
          background: "linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)",
          borderRadius: "12px",
          border: "2px solid #ffd591",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span style={{ fontSize: "20px" }}>☑️</span>
        <div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#d46b08",
              marginBottom: "2px",
            }}
          >
            Multiple Correct Answers
          </div>
          <div style={{ fontSize: "13px", color: "#595959" }}>
            Select multiple correct answers • {options.length} options •{" "}
            <span style={{ color: "#fa8c16", fontWeight: "600" }}>
              {correctCount} correct
            </span>
          </div>
        </div>
      </div>

      {/* Options List */}
      {Array.isArray(options) &&
        options.map((option, index) => (
          <div
            key={option._id || index}
            className="option-card-checkbox"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              marginBottom: "1rem",
              padding: "20px",
              background: "white",
              border: option.isCorrect
                ? "2px solid #fa8c16"
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
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={option.isCorrect}
                onChange={() => handleOptionChange(index)}
                className="checkbox-custom"
              />

              {/* Option Letter */}
              <span
                className={`option-letter-checkbox ${
                  option.isCorrect ? "correct" : ""
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>

              {/* Correct Badge */}
              {option.isCorrect && (
                <span className="badge-correct-checkbox">
                  <span>✓</span>
                  <span>Correct</span>
                </span>
              )}

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Action Buttons */}
              <button
                className="btn-checkbox btn-outline-checkbox"
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
                className="btn-checkbox btn-danger-checkbox"
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
                <div className="editor-container-checkbox">
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
                  className="form-control-checkbox"
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
        className="btn-checkbox btn-add-checkbox"
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
          Check the boxes to mark correct answers. You can select multiple
          correct options.
        </span>
      </div>
    </div>
  );
};

export default CheckboxesEditor;
