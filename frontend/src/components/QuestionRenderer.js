import React, { useState, useEffect } from "react";
import BlankBoxesRenderer from "./renderer/BlankBoxesRenderer";
import MultipleChoiceRenderer from "./renderer/MultipleChoiceRenderer";
import CheckboxesRenderer from "./renderer/CheckboxesRenderer";
import EssayRenderer from "./renderer/EssayRenderer";
import DescriptionRenderer from "./renderer/DescriptionRenderer";
import GeneratedDropdownRender from "./renderer/GeneratedDropdownRenderer";
import FindHighlightRenderer from "./renderer/FindhighlightRenderer";
import DragDropRenderer from "./renderer/DragDropRenderer";
import SpeakingRenderer from "./renderer/SpeakingRenderer";
import ReadingRenderer from "./renderer/ReadingRenderer";

const QuestionRenderer = ({
  question,
  initialAnswer,
  onAnswerChange,
  showCorrectAnswer,
  frozenAnswers,
  correctAnswers,
  editable = true,
}) => {
  // ✅ ALWAYS call hooks at the top, before any conditions
  const [frozenAnswerStatus, setFrozenAnswerStatus] = useState({});

  const questionType = question?.questionType || question?.question_type;

  // ✅ Safe answer extraction with error handling
  const getAnswerFromCorrectAnswers = () => {
    try {
      if (!Array.isArray(correctAnswers)) {
        return null;
      }

      const found = correctAnswers.find((ca) => {
        if (!ca || ca.question === undefined) return false;
        return ca.question.toString() === question.id.toString();
      });

      return found?.answer ?? null;
    } catch (error) {
      console.error("❌ Error in getAnswerFromCorrectAnswers:", error);
      return null;
    }
  };

  const correctAnswerFromAPI = getAnswerFromCorrectAnswers();

  // ✅ Safe type checking for correctAnswer
  const correctAnswer = (() => {
    try {
      if (correctAnswerFromAPI === null || correctAnswerFromAPI === undefined) {
        return null;
      }

      // Arrays (checkboxes, find-highlight)
      if (Array.isArray(correctAnswerFromAPI)) {
        return correctAnswerFromAPI;
      }

      // Objects (blank-boxes, dropdowns, drag-drop, reading)
      if (typeof correctAnswerFromAPI === "object") {
        return correctAnswerFromAPI;
      }

      // Strings should not be used as correctAnswer for structured questions
      return null;
    } catch (error) {
      console.error("❌ Error processing correctAnswer:", error);
      return null;
    }
  })();

  // ✅ Safe essay answer extraction
  const frozenEssayAnswer = (() => {
    try {
      return typeof correctAnswerFromAPI === "string"
        ? correctAnswerFromAPI
        : "";
    } catch (error) {
      console.error("❌ Error processing frozenEssayAnswer:", error);
      return "";
    }
  })();

  // ✅ Safe frozenAnswer extraction
  const frozenAnswer = (() => {
    try {
      return frozenAnswers?.[question.id] ?? null;
    } catch (error) {
      console.error("❌ Error accessing frozenAnswer:", error);
      return null;
    }
  })();

  // ✅ Safe answer status functions
  const getAnswerStatus = (userAnswer, correctAnswer) => {
    try {
      const status = {};
      if (
        !userAnswer ||
        !correctAnswer ||
        typeof userAnswer !== "object" ||
        typeof correctAnswer !== "object"
      ) {
        return status;
      }

      Object.keys(correctAnswer).forEach((key) => {
        const userVal = userAnswer[key]?.trim?.().toLowerCase?.() ?? "";
        const correctVal = correctAnswer[key]?.trim?.().toLowerCase?.() ?? "";
        status[key] = userVal === correctVal;
      });

      return status;
    } catch (error) {
      console.error("❌ Error in getAnswerStatus:", error);
      return {};
    }
  };

  const generateCheckboxAnswerStatus = (userAnswer, correctAnswer) => {
    try {
      return {
        selected: Array.isArray(userAnswer) ? [...userAnswer] : [],
        correct: Array.isArray(correctAnswer) ? [...correctAnswer] : [],
      };
    } catch (error) {
      console.error("❌ Error in generateCheckboxAnswerStatus:", error);
      return { selected: [], correct: [] };
    }
  };

  // ✅ Freeze answer status on first submit
  useEffect(() => {
    try {
      if (showCorrectAnswer && Object.keys(frozenAnswerStatus).length === 0) {
        if (questionType === "checkboxes") {
          setFrozenAnswerStatus(
            generateCheckboxAnswerStatus(initialAnswer, correctAnswer)
          );
        } else if (questionType !== "essay" && questionType !== "description") {
          setFrozenAnswerStatus(getAnswerStatus(initialAnswer, correctAnswer));
        }
      }
    } catch (error) {
      console.error("❌ Error in useEffect (freeze status):", error);
    }
  }, [showCorrectAnswer, questionType, initialAnswer, correctAnswer]);

  // ✅ Reset when not showing correct answer
  useEffect(() => {
    try {
      if (!showCorrectAnswer) {
        setFrozenAnswerStatus({});
      }
    } catch (error) {
      console.error("❌ Error in useEffect (reset status):", error);
    }
  }, [showCorrectAnswer]);

  const answerStatus = frozenAnswerStatus;

  // ✅ NOW check for invalid data AFTER all hooks
  if (!question) {
    console.error("❌ QuestionRenderer: question is null/undefined");
    return <p>Invalid question data</p>;
  }

  if (!questionType) {
    console.error("❌ QuestionRenderer: questionType is missing", question);
    return <p>Missing question type</p>;
  }

  // ✅ Render with error boundaries
  try {
    switch (questionType) {
      case "blank-boxes":
        return (
          <BlankBoxesRenderer
            question={question}
            editable={editable}
            initialAnswer={
              typeof initialAnswer === "object" ? initialAnswer : {}
            }
            onAnswerChange={onAnswerChange}
            correctAnswer={correctAnswer}
            answerStatus={answerStatus}
            showCorrectAnswer={showCorrectAnswer}
          />
        );

      case "generated-dropdowns":
        return (
          <GeneratedDropdownRender
            key={question.id}
            question={question}
            editable={editable}
            initialAnswer={
              typeof initialAnswer === "object" ? initialAnswer : {}
            }
            onAnswerChange={onAnswerChange}
            correctAnswer={correctAnswer}
            answerStatus={answerStatus}
            showCorrectAnswer={showCorrectAnswer}
          />
        );

      case "multiple-choice":
        return (
          <MultipleChoiceRenderer
            question={question}
            initialAnswer={
              typeof initialAnswer === "string" ? initialAnswer : ""
            }
            frozenAnswer={frozenAnswer}
            showCorrectAnswer={showCorrectAnswer}
            answerStatus={answerStatus}
            onAnswerChange={onAnswerChange}
            editable={editable} // ✅ ADDED
          />
        );

      case "checkboxes":
        return (
          <CheckboxesRenderer
            question={question}
            initialAnswer={initialAnswer}
            onAnswerChange={onAnswerChange}
            correctAnswer={correctAnswer}
            showCorrectAnswer={showCorrectAnswer}
            answerStatus={answerStatus}
            editable={editable} 
          />
        );

      case "drag-drop-matching":
        return (
          <DragDropRenderer
            question={question}
            questionId={question.id}
            initialAnswer={
              typeof initialAnswer === "object" ? initialAnswer : {}
            }
            onAnswerChange={onAnswerChange}
            correctAnswer={correctAnswer}
            showCorrectAnswer={showCorrectAnswer}
            answerStatus={answerStatus}
            editable={editable} // ✅ ADDED
          />
        );

      case "find-highlight":
        return (
          <FindHighlightRenderer
            question={question}
            questionId={question.id}
            initialAnswer={Array.isArray(initialAnswer) ? initialAnswer : []}
            onAnswerChange={onAnswerChange}
            correctAnswer={correctAnswer}
            showCorrectAnswer={showCorrectAnswer}
            answerStatus={answerStatus}
            editable={editable} // ✅ ADDED
          />
        );

      case "essay":
        // ✅ Safe essay answer preparation
        const essayAnswer = (() => {
          try {
            if (showCorrectAnswer) {
              return frozenEssayAnswer || initialAnswer || "";
            }
            return initialAnswer || "";
          } catch (error) {
            console.error("❌ Error preparing essay answer:", error);
            return "";
          }
        })();

        return (
          <EssayRenderer
            question={question}
            initialAnswer={
              showCorrectAnswer
                ? ""
                : typeof initialAnswer === "string"
                ? initialAnswer
                : ""
            }
            frozenAnswer={
              showCorrectAnswer && typeof essayAnswer === "string"
                ? essayAnswer
                : ""
            }
            onAnswerChange={onAnswerChange}
            showCorrectAnswer={showCorrectAnswer}
            editable={editable}
          />
        );

      case "reading":
        return (
          <ReadingRenderer
            question={question}
            initialAnswer={
              typeof initialAnswer === "object" ? initialAnswer : {}
            }
            onAnswerChange={onAnswerChange}
            frozenAnswers={typeof frozenAnswer === "object" ? frozenAnswer : {}}
            correctAnswer={correctAnswer}
            answerStatus={answerStatus}
            showCorrectAnswer={showCorrectAnswer}
            editable={editable}
          />
        );

      case "speaking":
        return (
          <SpeakingRenderer
            question={question}
            initialAnswer={
              typeof initialAnswer === "string" || initialAnswer instanceof File
                ? initialAnswer
                : null
            }
            onAnswerChange={onAnswerChange}
          />
        );

      case "description":
        return <DescriptionRenderer question={question} />;

      default:
        console.warn(`⚠️ Unsupported question type: ${questionType}`);
        return <p>Unsupported question type: {questionType}</p>;
    }
  } catch (error) {
    console.error("❌ Error rendering question:", error, question);
    return (
      <div style={{ padding: 20, border: "1px solid red", borderRadius: 4 }}>
        <h3 style={{ color: "red" }}>Error Rendering Question</h3>
        <p>Question ID: {question?.id}</p>
        <p>Type: {questionType}</p>
        <p>Error: {error.message}</p>
        <details>
          <summary>Debug Info</summary>
          <pre>
            {JSON.stringify(
              { question, initialAnswer, showCorrectAnswer },
              null,
              2
            )}
          </pre>
        </details>
      </div>
    );
  }
};

export default QuestionRenderer;
