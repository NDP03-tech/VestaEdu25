import React, { useEffect } from 'react';
import RichTextEditor from './RichTextEditor';

const ReadingTaskEditor = ({
  readingContent,
  setReadingContent,
  questionText,
  setQuestionText,
  onCreateGap,
  onCreateMultipleGap,
  onDeleteGap,
  onAddHint,
  onCreateDropdown
}) => {
  // Ghi log khi readingContent hoặc questionText thay đổi
  useEffect(() => {
    console.log('📘 Bài đọc (readingContent):', readingContent);
  }, [readingContent]);

  useEffect(() => {
    console.log('📝 Câu hỏi (questionText):', questionText);
  }, [questionText]);

  return (
    <div className="container-fluid">
      <div className="row g-4">
        {/* Cột trên: bài đọc */}
        <div className="col-12">
          <label className="form-label fw-bold">📘 Bài đọc</label>
          <RichTextEditor
            value={readingContent}
            onChange={setReadingContent}
          />
        </div>

        {/* Cột dưới: câu hỏi */}
        <div className="col-12">
          <label className="form-label fw-bold">📝 Câu hỏi</label>
          <RichTextEditor
            value={questionText}
            onChange={setQuestionText}
            onCreateGap={onCreateGap}
            onCreateMultipleGap={onCreateMultipleGap}
            onDeleteGap={onDeleteGap}
            onAddHint={onAddHint}
            onCreateDropdown={onCreateDropdown}
          />
        </div>
      </div>
    </div>
  );
};

export default ReadingTaskEditor;
