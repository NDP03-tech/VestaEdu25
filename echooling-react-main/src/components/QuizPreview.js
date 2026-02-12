import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizService from "../services/quizService";
import config from "../config";

import QuizStartScreen from "../components/QuizUI/QuizStartScreen";
import QuizRunner from "../components/QuizUI/QuizRunner";
import QuizSubmitScreen from "../components/QuizUI/QuizSubmitScreen";

const QuizPreviewWrapper = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setQuiz(null);
    setQuestions([]);
    setAnswers({});
    setHasStarted(false);
    setHasSubmitted(false);
    setResult(null);
    setAttemptNumber(1);

    const fetchData = async () => {
      try {
        const [fetchedQuiz, fetchedQuestions] = await Promise.all([
          quizService.getQuizById(quizId),
          fetch(`${config.API_URL}/api/questions/by-quiz/${quizId}`).then(res => res.json()),
        ]);

        setQuiz(fetchedQuiz);
        setQuestions(fetchedQuestions);

        const token = localStorage.getItem("token");
        const res = await fetch(`${config.API_URL}/api/results/latest/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data?.answers && !data?.completed) {
          console.log("✅ Resume from previous attempt");
          setAnswers(data.answers);
          setResult(data);
          setAttemptNumber(data.attemptNumber || 1);
        } else if (data?.completed && data.result?.passed) {
          alert("Bạn đã hoàn thành bài này và đạt yêu cầu. Không thể làm lại.");
          navigate("/user");
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
      }
    };

    fetchData();
  }, [quizId]);

  const handleStart = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${config.API_URL}/api/results/start/${quizId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("📥 [RECEIVE] Start attempt:", data);
      setResult(data);
      setHasStarted(true);
      if (data.attemptNumber) setAttemptNumber(data.attemptNumber);
    } catch (err) {
      console.error("❌ Lỗi khi bắt đầu làm bài:", err);
    }
  };

  const handleAnswerChange = (questionId, userAnswer) => {
    const newAnswers = { ...answers, [questionId]: userAnswer };
    setAnswers(newAnswers);

    const validQuestionIds = questions.map(q => q.id);
    const answersArray = Object.entries(newAnswers)
      .filter(([qid]) => validQuestionIds.includes(qid))
      .map(([qid, ans]) => ({
        question: qid,
        answer: ans,
        type: questions.find(q => q.id === qid)?.question_type || "unknown",
      }));

    if (result?.id) {
      fetch(`${config.API_URL}/api/results/temp/${result.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ answers: answersArray }),
      }).catch(err => console.error("❌ Lỗi khi lưu tạm:", err));
    }
  };

  const handleSubmit = async () => {
    const validQuestionIds = questions.map(q => q.id);
    const answersArray = Object.entries(answers)
      .filter(([qid]) => validQuestionIds.includes(qid))
      .map(([qid, ans]) => ({
        question: qid,
        answer: ans,
        type: questions.find(q => q.id === qid)?.question_type || "unknown",
      }));

    try {
      const res = await fetch(`${config.API_URL}/api/results/submit/${result.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ answers: answersArray }),
      });

      const resultData = await res.json();
      setResult(resultData.result);
      setHasSubmitted(true);

      if (resultData.result?.passed) {
        navigate("/user");
      }
    } catch (err) {
      console.error("❌ Lỗi khi nộp bài:", err);
    }
  };

  if (!quiz) return <div className="text-center mt-10">⏳ Đang tải quiz...</div>;

  const ui = quiz.uiSettings || {};
  const showInstructions = ui.showInstructionInput && ui.instructionText;

  if (showInstructions && !hasStarted && !hasSubmitted && !result) {
    return (
      <QuizStartScreen
        instruction={ui.instructionText}
        onStart={handleStart}
        timeLimit={ui.timeLimit}
      />
    );
  }

  if (hasSubmitted) {
    return (
      <QuizSubmitScreen
        message={
          result?.passed
            ? ui.quizCompleteMessage || "🎉 Bạn đã hoàn thành và vượt qua bài quiz!"
            : "🚫 Bạn chưa đạt yêu cầu. Hãy thử lại!"
        }
        score={ui.displayScore ? result?.score : null}
      />
    );
  }

  return (
    <QuizRunner
      key={quizId}
      questions={questions}
      headerText={ui.headerText || quiz.title}
      onePerPage={ui.oneQuestionPerPage}
      onAnswerChange={handleAnswerChange}
      onSubmit={handleSubmit}
      timeLimit={ui.timeLimit || 0}
      initialAnswers={answers}
    />
  );
};

export default QuizPreviewWrapper;