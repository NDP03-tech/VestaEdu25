import React from "react";

const DescriptionRender = ({ question }) => {
  if (!question || !question.question_text) {
    return <div>No description available.</div>; // fallback khi thiếu data
  }

  return (
    <div
      className="description-render"
      dangerouslySetInnerHTML={{ __html: question.question_text }}
    />
  );
};

export default DescriptionRender;
