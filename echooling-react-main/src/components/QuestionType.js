import React from 'react';

const QuestionType = ({ questionType, setQuestionType }) => {
    const handleChange = (event) => {
        setQuestionType(event.target.value); // Cập nhật loại câu hỏi
    };

    return (
        <div className="question-type">
            <select id="questionType" value={questionType} onChange={handleChange}>
                <option value="">-- Chọn loại câu hỏi --</option>
                <option value="blank-boxes">Blank Boxes & Dropdowns</option>
                <option value="generated-dropdowns">Generated Dropdowns</option>
                <option value="drag-drop-matching">Drag & Drop / Matching</option>
                <option value="find-highlight">Find & Highlight (word search)</option>
                <option value="multiple-choice">Multiple Choice (one answer correct)</option>
                <option value="checkboxes">Checkboxes (several answers correct)</option>
                <option value="essay">Essay (open-ended question)</option>
                <option value="speaking">Speaking (Record speaking)</option>
                <option value="reading">Reading Task (open-ended question)</option>
                <option value="description">Description</option>
            </select>
        </div>
    );
};

export default QuestionType;
