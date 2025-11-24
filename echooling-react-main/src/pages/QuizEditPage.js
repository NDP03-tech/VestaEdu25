import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const QuizEditPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/api/quizzes/${quizId}`);
        setQuiz(res.data);
        setForm({ title: res.data.title, description: res.data.description });
      } catch (err) {
        console.error("Lỗi khi tải quiz", err);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/quizzes/${quizId}`, form);
      alert("✅ Cập nhật thành công!");
      navigate("/quizzes");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật quiz", err);
    }
  };

  if (!quiz) return <div>Đang tải quiz...</div>;

  return (
    <div className="container mt-4">
      <h3>✏️ Chỉnh sửa Quiz</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Tiêu đề:</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <label>Mô tả:</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-success me-2" type="submit">
          💾 Lưu
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/quizzes")}>
          🔙 Quay lại
        </button>
      </form>
    </div>
  );
};

export default QuizEditPage;
