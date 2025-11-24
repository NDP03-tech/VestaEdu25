import React, { useEffect, useRef } from "react";

const extractCorrectAnswer = (gap) => {
  const answerList = gap?.correct_answers || gap?.correct_answer || [];
  return Array.isArray(answerList) ? answerList[0] : answerList;
};

const getRandomChoices = (correctAnswer, allGaps, count = 4) => {
  const allAnswers = allGaps
    .map((gap) => extractCorrectAnswer(gap))
    .filter((ans) => typeof ans === "string" && ans !== correctAnswer);

  const uniqueWrongAnswers = [...new Set(allAnswers)];
  const wrongChoices = uniqueWrongAnswers
    .sort(() => 0.5 - Math.random())
    .slice(0, count - 1);

  return [...wrongChoices, correctAnswer].sort(() => 0.5 - Math.random());
};

const decodeHtmlEntities = (str) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const GeneratedDropdownRenderer = ({
  question,
  editable = true,
  initialAnswer = {},
  onAnswerChange,
  answerStatus,
  showCorrectAnswer,
}) => {
  const containerRef = useRef();
  const answersRef = useRef({});

  const normalizeInitialAnswer = (initial) => {
    const normalized = {};
    if (!initial || typeof initial !== "object") return normalized;

    Object.keys(initial).forEach((k) => {
      if (/^(gap_|dropdown_|hint_)/.test(k)) {
        normalized[k] = initial[k];
      } else if (/^\d+$/.test(k)) {
        normalized[`gap_${k}`] = initial[k];
      } else {
        normalized[k] = initial[k];
      }
    });

    return normalized;
  };

  useEffect(() => {
    // Add animation styles if not exists
    if (!document.getElementById("generated-dropdown-animations")) {
      const style = document.createElement("style");
      style.id = "generated-dropdown-animations";
      style.textContent = `
        @keyframes checkmark-appear {
          0% { opacity: 0; transform: scale(0.5) rotate(-45deg); }
          50% { transform: scale(1.2) rotate(5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes cross-appear {
          0% { opacity: 0; transform: scale(0.5) rotate(45deg); }
          50% { transform: scale(1.2) rotate(-5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes correct-answer-appear {
          0% { opacity: 0; transform: translateX(-10px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    if (!question) return;

    const normalized = normalizeInitialAnswer(initialAnswer);
    answersRef.current = normalized;

    renderInputs();
    // eslint-disable-next-line
  }, [question?.id]);

  useEffect(() => {
    applyAnswerStatus();
  }, [answerStatus, showCorrectAnswer]);

  const handleChange = (prefixedKey, value) => {
    answersRef.current = {
      ...answersRef.current,
      [prefixedKey]: value,
    };
    onAnswerChange?.(question.id, { ...answersRef.current });
  };

  const renderInputs = () => {
    const container = containerRef.current;
    if (!container) return;

    const gapElements = container.querySelectorAll(".cloze");

    // ✅ Track separate counters for each type
    let gapCounter = 0;
    let dropdownCounter = 0;
    let hintCounter = 0;

    gapElements.forEach((el) => {
      if (el.tagName === "A") {
        el.addEventListener("click", (e) => e.preventDefault());
      }

      const isDropdown = el.classList.contains("dropdown");
      const isHint =
        el.closest(".hint-wrapper") ||
        el.classList.contains("hint") ||
        el.classList.contains("hint-word");

      // ✅ Use appropriate counter based on type
      let key;
      let itemType;
      if (isDropdown) {
        key = `dropdown_${dropdownCounter}`;
        itemType = "dropdown";
        dropdownCounter++;
      } else if (isHint) {
        key = `hint_${hintCounter}`;
        itemType = "hint";
        hintCounter++;
      } else {
        key = `gap_${gapCounter}`;
        itemType = "gap";
        gapCounter++;
      }

      const savedValue = answersRef.current[key] ?? "";
      el.innerHTML = "";

      let field;

      if (itemType === "hint") {
        // 🎨 Enhanced text input for hints
        field = document.createElement("input");
        field.type = "text";
        field.className = "form-control d-inline-block gap-input";
        field.placeholder = editable ? "Type here..." : "";
        field.style.cssText = `
          width: auto;
          min-width: 100px;
          margin: 0 6px;
          padding: 6px 12px;
          font-size: 14px;
          border: 2px solid #d9d9d9;
          border-radius: 6px;
          background: white;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        `;

        // ✅ FIX: Only disable when NOT editable
        if (!editable) {
          field.disabled = true;
          field.style.backgroundColor = "#f5f5f5";
          field.style.cursor = "not-allowed";
          field.style.borderColor = "#e0e0e0";
        } else {
          // Hover effects
          field.addEventListener("mouseenter", () => {
            field.style.borderColor = "#40a9ff";
            field.style.boxShadow = "0 0 0 2px rgba(24, 144, 255, 0.1)";
          });
          field.addEventListener("mouseleave", () => {
            field.style.borderColor = "#d9d9d9";
            field.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
          });
          field.addEventListener("focus", () => {
            field.style.borderColor = "#1890ff";
            field.style.boxShadow = "0 0 0 3px rgba(24, 144, 255, 0.15)";
            field.style.outline = "none";
          });
          field.addEventListener("blur", () => {
            field.style.borderColor = "#d9d9d9";
            field.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
          });
        }

        field.value = savedValue ?? "";

        // ✅ Allow input when editable
        if (editable) {
          field.oninput = (e) => handleChange(key, e.target.value);
        }
      } else if (isDropdown) {
        // 🎨 Enhanced dropdown
        let options = [];
        if (el.dataset && el.dataset.options) {
          try {
            const decoded = decodeHtmlEntities(el.dataset.options);
            options = JSON.parse(decoded);
          } catch (err) {
            console.error("❌ Dropdown parse error:", err, el.dataset.options);
          }
        }

        // ✅ Only shuffle when NOT showing answers
        if (editable && !showCorrectAnswer) {
          options = shuffleArray(options);
        }

        field = document.createElement("select");
        field.className = "form-select d-inline-block gap-dropdown";
        field.style.cssText = `
          width: auto;
          min-width: 120px;
          margin: 0 6px;
          padding: 6px 32px 6px 12px;
          font-size: 14px;
          border: 2px solid #d9d9d9;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        `;

        // ✅ FIX: Only disable when NOT editable
        if (!editable) {
          field.disabled = true;
          field.style.backgroundColor = "#f5f5f5";
          field.style.cursor = "not-allowed";
          field.style.borderColor = "#e0e0e0";
        } else {
          // Hover effects
          field.addEventListener("mouseenter", () => {
            field.style.borderColor = "#40a9ff";
            field.style.boxShadow = "0 0 0 2px rgba(24, 144, 255, 0.1)";
          });
          field.addEventListener("mouseleave", () => {
            field.style.borderColor = "#d9d9d9";
            field.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
          });
          field.addEventListener("focus", () => {
            field.style.borderColor = "#1890ff";
            field.style.boxShadow = "0 0 0 3px rgba(24, 144, 255, 0.15)";
            field.style.outline = "none";
          });
          field.addEventListener("blur", () => {
            field.style.borderColor = "#d9d9d9";
            field.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
          });
        }

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "-- Select an answer --";
        defaultOption.disabled = true;
        defaultOption.hidden = true;
        field.appendChild(defaultOption);

        options.forEach((opt) => {
          const optEl = document.createElement("option");
          optEl.value = opt;
          optEl.textContent = opt;
          field.appendChild(optEl);
        });

        field.value = savedValue ?? "";

        // ✅ Allow change when editable
        if (editable) {
          field.onchange = (e) => handleChange(key, e.target.value);
        }
      } else {
        // 🎨 Enhanced dropdown with generated choices for gaps
        const gapIndex = gapCounter - 1;
        const allGaps = question.gaps || [];
        const gapData = allGaps[gapIndex];

        let options = [];
        if (gapData) {
          const correctAns = extractCorrectAnswer(gapData);
          options = getRandomChoices(correctAns, allGaps, 4);
        }

        field = document.createElement("select");
        field.className = "form-select d-inline-block gap-dropdown";
        field.style.cssText = `
          width: auto;
          min-width: 120px;
          margin: 0 6px;
          padding: 6px 32px 6px 12px;
          font-size: 14px;
          border: 2px solid #d9d9d9;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        `;

        // ✅ FIX: Only disable when NOT editable
        if (!editable) {
          field.disabled = true;
          field.style.backgroundColor = "#f5f5f5";
          field.style.cursor = "not-allowed";
          field.style.borderColor = "#e0e0e0";
        } else {
          // Hover effects
          field.addEventListener("mouseenter", () => {
            field.style.borderColor = "#40a9ff";
            field.style.boxShadow = "0 0 0 2px rgba(24, 144, 255, 0.1)";
          });
          field.addEventListener("mouseleave", () => {
            field.style.borderColor = "#d9d9d9";
            field.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
          });
          field.addEventListener("focus", () => {
            field.style.borderColor = "#1890ff";
            field.style.boxShadow = "0 0 0 3px rgba(24, 144, 255, 0.15)";
            field.style.outline = "none";
          });
          field.addEventListener("blur", () => {
            field.style.borderColor = "#d9d9d9";
            field.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
          });
        }

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "-- Select an answer --";
        defaultOption.disabled = true;
        defaultOption.hidden = true;
        field.appendChild(defaultOption);

        options.forEach((opt) => {
          const optEl = document.createElement("option");
          optEl.value = opt;
          optEl.textContent = opt;
          field.appendChild(optEl);
        });

        field.value = savedValue ?? "";

        // ✅ Allow change when editable
        if (editable) {
          field.onchange = (e) => handleChange(key, e.target.value);
        }
      }

      field.dataset.key = key;
      el.appendChild(field);
    });

    applyAnswerStatus();
  };

  const applyAnswerStatus = () => {
    const container = containerRef.current;
    if (!container || !showCorrectAnswer) return;

    const gapElements = container.querySelectorAll(".cloze");

    // ✅ Track separate counters again for status
    let gapCounter = 0;
    let dropdownCounter = 0;
    let hintCounter = 0;

    gapElements.forEach((el) => {
      const isDropdown = el.classList.contains("dropdown");
      const isHint =
        el.closest(".hint-wrapper") ||
        el.classList.contains("hint") ||
        el.classList.contains("hint-word");

      let key;
      if (isDropdown) {
        key = `dropdown_${dropdownCounter}`;
        dropdownCounter++;
      } else if (isHint) {
        key = `hint_${hintCounter}`;
        hintCounter++;
      } else {
        key = `gap_${gapCounter}`;
        gapCounter++;
      }

      const input = el.querySelector("input, select");
      const correct = answerStatus?.correctAnswers?.[key];

      if (input) {
        input.style.backgroundColor = "";
        input.style.borderColor = "#d9d9d9";
        input.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
      }

      // Remove old correct answer displays and icons
      el.querySelectorAll(".correct-answer").forEach((n) => n.remove());
      el.querySelectorAll("span[style*='animation']").forEach((n) =>
        n.remove()
      );

      if (input && answerStatus[key] === true) {
        // ✅ Correct answer styling
        input.style.backgroundColor = "#f6ffed";
        input.style.borderColor = "#52c41a";
        input.style.color = "#135200";
        input.style.fontWeight = "500";
        input.style.boxShadow = "0 0 0 2px rgba(82, 196, 26, 0.1)";

        // Add checkmark icon
        const icon = document.createElement("span");
        icon.innerHTML = "✓";
        icon.style.cssText = `
          display: inline-block;
          margin-left: 6px;
          font-size: 18px;
          color: #52c41a;
          font-weight: bold;
          animation: checkmark-appear 0.3s ease;
        `;
        el.appendChild(icon);
      } else if (input && answerStatus[key] === false) {
        // ❌ Incorrect answer styling
        input.style.backgroundColor = "#fff2f0";
        input.style.borderColor = "#ff4d4f";
        input.style.color = "#cf1322";
        input.style.fontWeight = "500";
        input.style.boxShadow = "0 0 0 2px rgba(255, 77, 79, 0.1)";

        // Add cross icon
        const icon = document.createElement("span");
        icon.innerHTML = "✗";
        icon.style.cssText = `
          display: inline-block;
          margin-left: 6px;
          font-size: 18px;
          color: #ff4d4f;
          font-weight: bold;
          animation: cross-appear 0.3s ease;
        `;
        el.appendChild(icon);

        // Show correct answer
        if (correct) {
          const wrapper = document.createElement("span");
          wrapper.className = "correct-answer";
          wrapper.style.cssText = `
            display: inline-block;
            margin-left: 8px;
            padding: 4px 10px;
            background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
            color: white;
            font-size: 13px;
            font-weight: 600;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(82, 196, 26, 0.3);
            animation: correct-answer-appear 0.4s ease;
          `;

          const label = document.createElement("span");
          label.textContent = "✓ ";
          label.style.marginRight = "4px";

          const text = document.createElement("span");
          text.textContent = correct;

          wrapper.appendChild(label);
          wrapper.appendChild(text);
          el.appendChild(wrapper);
        }
      }
    });
  };

  if (!question?.question_text) {
    return <p>Invalid question data</p>;
  }

  return (
    <div
      ref={containerRef}
      className="rendered-question"
      style={{
        fontSize: "16px",
        lineHeight: "2",
        color: "#262626",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
      dangerouslySetInnerHTML={{ __html: question.question_text }}
    />
  );
};

export default GeneratedDropdownRenderer;
