import React, { useState, useEffect } from "react";
import Axios from "axios";
import RichTextEditor from "../Editor/RichTextEditor";
import ReadingTaskEditor from "../Editor/ReadingTaskEditor";
import ExplanationEditor from "../Explanation/ExplanationEditor";
import QuestionType from "../QuestionType";
import CheckboxesEditor from "../Editor/CheckboxEditor";
import MultipleChoiceEditor from "../Editor/MultipleChoiceEditor";
import "bootstrap/dist/css/bootstrap.min.css";
import "./QuestionForm.css";

const QuestionFormTest = ({
  questionIndex = 0,
  questionData = {},
  onAddQuestion,
  quizId,
  onDelete,
  onFinishEdit,
  onFocusQuestion,
}) => {
  const [questionType, setQuestionType] = useState("");
  const [gaps, setGaps] = useState([]);
  const [dropdowns, setDropdowns] = useState([]);
  const [options, setOptions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [readingContent, setReadingContent] = useState("");
  const [explanation, setExplanation] = useState("");
  const [points, setPoints] = useState(0);
  const [hintWords, setHintWords] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [questionId, setQuestionId] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (
        questionData.id &&
        (!questionData.questionText || !questionData.questionType)
      ) {
        try {
          const res = await Axios.get(`/api/questions/${questionData.id}`);
          setFromData(res.data);
        } catch (err) {
          console.error("❌ Error fetching question:", err);
        }
      } else {
        setFromData(questionData);
      }
    };
    fetchQuestion();
  }, [questionData]);

  const setFromData = (data) => {
    setQuestionId(data.id || "");
    setQuestionType(data.questionType || data.question_type || "");
    setGaps(data.gaps || []);
    setDropdowns(data.dropdowns || []);
    setOptions(data.options || []);
    setQuestionText(data.questionText || data.question_text || "");
    setReadingContent(data.readingContent || data.reading_content || "");
    setExplanation(data.explanation || "");
    setPoints(data.points || 0);
    setHintWords(data.hintWords || data.hint_words || []);
  };

  const handleFocus = () => {
    if (points === 0) setPoints("");
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (points === "") setPoints(0);
    setIsFocused(false);
  };

  const handleEditorFocus = () => {
    onFocusQuestion?.(questionId);
  };

  const handleCreateGap = (selectedText, startPosition) => {
    const newGap = {
      correct_answers: [selectedText],
      position: startPosition,
      length: selectedText.length,
    };
    setGaps((prev) => [...prev, newGap]);
  };

  const handleCreateMultipleGap = (selectedText, startPosition) => {
    const answers = selectedText
      .split("#")
      .map((ans) => ans.trim())
      .filter(Boolean);

    if (answers.length < 2) {
      alert("Multiple gap must contain at least 2 answers, separated by #");
      return;
    }

    const newGap = {
      correct_answers: answers,
      position: startPosition,
      length: selectedText.length,
    };
    setGaps((prev) => [...prev, newGap]);
  };

  const handleDeleteGap = (deletedText) => {
    setGaps((prevGaps) => {
      const newGaps = prevGaps.filter(
        (gap) => !gap.correct_answers.includes(deletedText)
      );
      console.log("🔁 Gaps after deletion:", newGaps);
      return newGaps;
    });
  };

  const handleAddHint = (word, hint) => {
    setHintWords((prev) => [...prev, { word, hint }]);
  };

  const handleCreateDropdown = (dropdownData) => {
    setDropdowns((prev) => [...prev, dropdownData]);
  };

  const handleCreateQuestion = async () => {
    const newQuestion = {
      questionType,
      readingContent,
      questionText,
      explanation,
      points,
      gaps,
      dropdowns,
      hintWords,
      quiz_id: quizId,
      ...(questionType === "checkboxes" || questionType === "multiple-choice"
        ? { options }
        : {}),
    };

    try {
      const response = await Axios.post("/api/questions", newQuestion);
      alert("✅ Question created successfully");
      setQuestionId(response.data.id);
    } catch (error) {
      console.error("❌ Failed to create question:", error);
      alert("❌ Failed to create question.");
    }
  };

  const handleUpdateQuestion = async () => {
    const updatedData = {
      questionType,
      readingContent,
      questionText,
      explanation,
      points,
      gaps,
      dropdowns,
      hintWords,
      quiz_id: quizId,
      ...(questionType === "checkboxes" || questionType === "multiple-choice"
        ? { options }
        : {}),
    };
    console.log("📤 Updating question with:", updatedData);

    try {
      await Axios.put(`/api/questions/${questionId}`, updatedData);
      alert("✅ Question updated successfully");
      onFinishEdit?.({ ...updatedData, id: questionId });
    } catch (error) {
      console.error("❌ Failed to update question:", error);
      alert("❌ Update failed.");
    }
  };

  return (
    <div className="question-form-container mb-4">
      <div className="question-card">
        {/* Header */}
        <div className="question-header">
          <div className="d-flex align-items-center gap-3 flex-grow-1">
            <button
              className="btn btn-sm btn-outline-secondary collapse-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? "▶" : "▼"}
            </button>
            <h5 className="mb-0 question-title">
              <span className="question-number">
                Question {questionIndex + 1}
              </span>
              {questionId && (
                <span className="badge bg-success ms-2">Saved</span>
              )}
              {questionType && (
                <span className="badge bg-info ms-2 text-capitalize">
                  {questionType}
                </span>
              )}
            </h5>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this question?")
              ) {
                onDelete?.(questionIndex, questionId);
              }
            }}
          >
            🗑️ Delete
          </button>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="question-body">
            {/* Settings Row */}
            <div className="settings-row">
              <div className="form-group flex-grow-1">
                <label className="form-label fw-bold">📋 Question Type</label>
                <QuestionType
                  questionType={questionType}
                  setQuestionType={setQuestionType}
                />
              </div>

              <div className="form-group" style={{ minWidth: "150px" }}>
                <label htmlFor="points" className="form-label fw-bold">
                  🎯 Points per gap
                </label>
                <input
                  type="number"
                  id="points"
                  className="form-control"
                  value={isFocused ? points : points === 0 ? "" : points}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Question Content */}
            <div className="question-content-section">
              {questionType === "reading" ? (
                <ReadingTaskEditor
                  readingContent={readingContent}
                  setReadingContent={setReadingContent}
                  questionText={questionText}
                  setQuestionText={setQuestionText}
                  onCreateGap={handleCreateGap}
                  onCreateDropdown={handleCreateDropdown}
                  onFocus={handleEditorFocus}
                />
              ) : (
                <>
                  <div className="editor-section">
                    <label className="form-label fw-bold section-label">
                      📝 Question Text
                    </label>
                    <RichTextEditor
                      key={questionData?.id || "new"}
                      value={questionText}
                      onChange={setQuestionText}
                      onDeleteGap={handleDeleteGap}
                      onCreateMultipleGap={handleCreateMultipleGap}
                      onCreateGap={handleCreateGap}
                      onAddHint={handleAddHint}
                      onCreateDropdown={handleCreateDropdown}
                      onFocus={handleEditorFocus}
                    />
                  </div>

                  {questionType === "multiple-choice" && (
                    <div className="editor-section">
                      <label className="form-label fw-bold section-label">
                        ⭕ Answer Options
                      </label>
                      <MultipleChoiceEditor
                        questionText={questionText}
                        setQuestionText={setQuestionText}
                        options={options}
                        setOptions={setOptions}
                      />
                    </div>
                  )}

                  {questionType === "checkboxes" && (
                    <div className="editor-section">
                      <label className="form-label fw-bold section-label">
                        ☑️ Checkbox Options
                      </label>
                      <CheckboxesEditor
                        options={options}
                        setOptions={setOptions}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Explanation */}
            <div className="editor-section">
              <label className="form-label fw-bold section-label">
                🧠 Explanation (Optional)
              </label>
              <ExplanationEditor
                value={explanation}
                onChange={setExplanation}
              />
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              {!questionId ? (
                <button
                  onClick={handleCreateQuestion}
                  className="btn btn-success btn-lg"
                >
                  <span className="me-2"></span> Save Question
                </button>
              ) : (
                <button
                  onClick={handleUpdateQuestion}
                  className="btn btn-warning btn-lg"
                >
                  <span className="me-3"></span> Update Question
                </button>
              )}
            </div>

            {/* Stats Footer */}
            {(gaps.length > 0 ||
              dropdowns.length > 0 ||
              hintWords.length > 0) && (
              <div className="stats-footer">
                <small className="text-muted">
                  {dropdowns.length > 0 && (
                    <span className="me-3">
                       Dropdowns: {dropdowns.length}
                    </span>
                  )}
                  {hintWords.length > 0 && (
                    <span> Hints: {hintWords.length}</span>
                  )}
                </small>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionFormTest;
