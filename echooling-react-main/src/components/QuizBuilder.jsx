import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuizInfo from "./QuizInfo/QuizInfo";
import QuestionFormTest from "./QuestionForm/QuestionFormTest";
import "./QuizBuilder.css";

const QuizBuilder = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizInfo, setQuizInfo] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [focusedQuestionId, setFocusedQuestionId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizRes = await fetch(`/api/quizzes/${quizId}`);
        if (!quizRes.ok) throw new Error("Quiz not found.");
        const quizData = await quizRes.json();
        console.log("✅ Quiz Info:", quizData);
        setQuizInfo(quizData);

        const questionRes = await fetch(`/api/questions/by-quiz/${quizId}`);
        if (!questionRes.ok) throw new Error("Failed to fetch questions.");
        const questionsData = await questionRes.json();
        console.log("✅ Questions Fetched:", questionsData);
        setQuestions(questionsData);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        alert("Failed to load quiz data.");
        navigate("/quiz-manage");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId, navigate]);

  const handleSaveQuizInfo = async () => {
    setSaving(true);
    try {
      const quizRes = await fetch(`/api/quizzes/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizInfo),
      });

      if (!quizRes.ok) throw new Error("Failed to update quiz.");
      const updatedQuiz = await quizRes.json();
      setQuizInfo(updatedQuiz);
      console.log("✅ Quiz updated!");

      // Lọc bỏ các câu hỏi rỗng hoặc trùng lặp
      const filteredQuestions = questions.filter((q) => {
        const keys = Object.keys(q);
        if (keys.length <= 1 && q.quiz_id) return false;
        if (!q.question_text && !q.questionText) return false;
        return true;
      });

      // Loại bỏ trùng lặp theo nội dung câu hỏi
      const uniqueQuestions = [];
      const seenTexts = new Set();
      for (const q of filteredQuestions) {
        const text = q.question_text || q.questionText;
        if (!seenTexts.has(text)) {
          uniqueQuestions.push(q);
          seenTexts.add(text);
        }
      }

      const updatedQuestions = await Promise.all(
        uniqueQuestions.map(async (q) => {
          const questionData = {
            ...q,
            quiz_id: quizId,
          };

          if (q.id) {
            const res = await fetch(`/api/questions/${q.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(questionData),
            });
            if (!res.ok) throw new Error("Failed to update question.");
            return await res.json();
          } else {
            const res = await fetch(`/api/questions`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(questionData),
            });
            if (!res.ok) throw new Error("Failed to create question.");
            return await res.json();
          }
        })
      );

      setQuestions(updatedQuestions);
      alert("🎉 Quiz and questions saved successfully.");
    } catch (err) {
      console.error("❌ Error saving quiz and questions:", err);
      alert("Failed to save quiz and questions.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = (newQuestion) => {
    if (Object.keys(newQuestion).length === 0) {
      setQuestions((prev) => [...prev, { quiz_id: quizId }]);
    } else {
      setQuestions((prev) => [...prev, newQuestion]);
    }
    // Scroll to bottom after adding
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const handleDeleteQuestion = async (index, questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      if (questionId) {
        const res = await fetch(`/api/questions/${questionId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete question.");
      }

      const updated = [...questions];
      updated.splice(index, 1);
      setQuestions(updated);
    } catch (err) {
      console.error("❌ Error deleting question:", err);
      alert("Failed to delete question.");
    }
  };

  const handleFinishEdit = (updatedQuestion) => {
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.id === updatedQuestion.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = updatedQuestion;
        return updated;
      }

      const emptyIndex = prev.findIndex((q) => !q.id);
      if (emptyIndex !== -1) {
        const updated = [...prev];
        updated[emptyIndex] = updatedQuestion;
        return updated;
      }

      return [...prev, updatedQuestion];
    });
  };

  const handleFocusQuestion = (questionId) => {
    setFocusedQuestionId(questionId);
  };

  if (loading) {
    return (
      <div className="quiz-builder-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">⏳ Loading quiz data...</p>
      </div>
    );
  }

  return (
    <div className="quiz-builder-container">
      {/* Header */}
      <div className="quiz-builder-header">
        <div className="header-content">
          <button
            className="btn btn-outline-light btn-sm back-btn"
            onClick={() => navigate("/quiz-manage")}
          >
            ← Back to Quiz List
          </button>
          <h2 className="header-title">
            <span className="icon">📝</span>
            Quiz Builder
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="quiz-builder-content">
        {/* Quiz Info Section */}
        <div className="quiz-info-section">
          <QuizInfo
            quizId={quizId}
            quizInfo={quizInfo}
            onQuizInfoChange={setQuizInfo}
          />
        </div>

        {/* Questions Section */}
        <div className="questions-section">
          <div className="section-header">
            <h4 className="section-title">
              <span className="icon">❓</span>
              Questions ({questions.length})
            </h4>
          </div>

          {questions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h5>No questions yet</h5>
              <p className="text-muted">
                Click "Add Question" button below to create your first question
              </p>
            </div>
          ) : (
            <div className="questions-list">
              {questions.map((question, index) => (
                <div
                  key={question.id || index}
                  className={`question-wrapper ${
                    focusedQuestionId === question.id ? "focused" : ""
                  }`}
                >
                  <QuestionFormTest
                    questionIndex={index}
                    questionData={question}
                    quizId={quizId}
                    onAddQuestion={handleAddQuestion}
                    onDelete={handleDeleteQuestion}
                    onFinishEdit={handleFinishEdit}
                    onFocusQuestion={handleFocusQuestion}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="action-bar">
          <div className="action-bar-content">
            <div className="action-info">
              <span className="badge bg-info me-2">
                {questions.length}{" "}
                {questions.length === 1 ? "Question" : "Questions"}
              </span>
              {questions.filter((q) => q.id).length > 0 && (
                <span className="badge bg-success">
                  {questions.filter((q) => q.id).length} Saved
                </span>
              )}
            </div>
            <div className="action-buttons">
              {/* ✅ Add Question Button - Moved Here */}
              <button
                className="btn btn-primary"
                onClick={() => handleAddQuestion({})}
              >
                <span className="me-2">➕</span>
                Add Question
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/quiz-manage")}
              >
                Cancel
              </button>

              <button
                className="btn btn-info"
                onClick={() => navigate(`/user/do-quiz/${quizId}`)}
              >
                <span className="me-2">👁️</span>
                Preview Quiz
              </button>

              <button
                className="btn btn-success"
                onClick={handleSaveQuizInfo}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="me-2">💾</span>
                    Save Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder;
