import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import QuizPreview from "../components/QuizPreview";
import './QuizPreview.css';
const QuizPreviewPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${quizId}`);
        setQuiz(response.data);
        console.log("✅ Quiz response:", response.data); // DÒNG NÀY
      } catch (err) {
        console.error("❌ Lỗi khi load quiz:", err);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="container my-5">
      <h2>📋 Xem trước Quiz</h2>
      <QuizPreview
        quizId={quizId}
        quizInfo={quiz}
        questions={quiz.questions || []}
      />
    </div>
  );
};

export default QuizPreviewPage;
