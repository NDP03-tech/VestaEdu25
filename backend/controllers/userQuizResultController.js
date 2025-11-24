const UserQuizResult = require("../models/UserQuizResult");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Class = require("../models/Class");
const { Op } = require("sequelize");

const User = require("../models/User");
const { JSDOM } = require("jsdom");

/* ------------------------------------------------------
 🟢 START ATTEMPT
------------------------------------------------------ */
/**
 * Get best attempt for specific user and quiz
 * GET /api/results/user/:userId/quiz/:quizId/best-attempt
 */
exports.getUserQuizBestAttempt = async (req, res) => {
  try {
    const { userId, quizId } = req.params;

    console.log(
      `🎯 Fetching best attempt for user ${userId} in quiz ${quizId}`
    );

    // Get all attempts for this user and quiz
    const results = await UserQuizResult.findAll({
      where: {
        user_id: userId,
        quiz_id: quizId,
        submittedAt: { [Op.ne]: null },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Quiz,
          as: "quiz",
          attributes: ["id", "title"],
        },
      ],
      order: [
        ["score", "DESC"],
        ["submittedAt", "DESC"],
      ],
    });

    if (results.length === 0) {
      console.log("⚠️ No submitted attempts found");
      return res.json({ attempts: [], bestAttempt: null });
    }

    // Get all questions for detailed breakdown
    const questions = await Question.findAll({
      where: { quiz_id: quizId },
    });

    // Process each attempt with detailed answer breakdown
    const processedAttempts = results.map((result) => {
      const questionParts = [];
      const correctAnswersRow = [];
      const userAnswersRow = [];
      const answerStatusRow = [];

      questions.forEach((question) => {
        const userAnswerObj = result.answers.find(
          (a) => a.question.toString() === question.id.toString()
        );
        const userAnswerRaw = userAnswerObj?.answer || {};

        // Process based on question type
        switch (question.question_type) {
          case "blank-boxes":
          case "reading":
          case "drag-drop-matching":
          case "generated-dropdowns": {
            // Gaps
            (question.gaps || []).forEach((gap, idx) => {
              questionParts.push(`Gap ${idx + 1}`);
              const correct = gap.correct_answers?.[0] || "";
              const userAns = userAnswerRaw[`gap_${idx}`] || "";
              correctAnswersRow.push(correct);
              userAnswersRow.push(userAns);
              answerStatusRow.push(
                userAns.toLowerCase() === correct.toLowerCase()
              );
            });

            // Dropdowns
            (question.dropdowns || []).forEach((dd, idx) => {
              questionParts.push(`Dropdown ${idx + 1}`);
              const correct = dd.correct_answer || "";
              const userAns = userAnswerRaw[`dropdown_${idx}`] || "";
              correctAnswersRow.push(correct);
              userAnswersRow.push(userAns);
              answerStatusRow.push(
                userAns.toLowerCase() === correct.toLowerCase()
              );
            });

            // HintWords
            (question.hintWords || []).forEach((hw, idx) => {
              questionParts.push(`Hint ${idx + 1}`);
              const correct = hw.word || "";
              const userAns = userAnswerRaw[`hint_${idx}`] || "";
              correctAnswersRow.push(correct);
              userAnswersRow.push(userAns);
              answerStatusRow.push(
                userAns.toLowerCase() === correct.toLowerCase()
              );
            });
            break;
          }

          case "multiple-choice": {
            questionParts.push(`Q${question.id}`);
            const correct =
              question.options.find((o) => o.isCorrect)?.text || "";
            const userAns = userAnswerRaw || "";
            correctAnswersRow.push(correct);
            userAnswersRow.push(userAns);
            answerStatusRow.push(
              userAns.toLowerCase() === correct.toLowerCase()
            );
            break;
          }

          case "checkboxes": {
            question.options.forEach((opt, idx) => {
              questionParts.push(opt.text);
              const isCorrect = opt.isCorrect;
              const userSelected =
                Array.isArray(userAnswerRaw) && userAnswerRaw.includes(idx);
              correctAnswersRow.push(isCorrect ? opt.text : "");
              userAnswersRow.push(userSelected ? opt.text : "");
              answerStatusRow.push(isCorrect === userSelected);
            });
            break;
          }

          case "essay":
          case "description":
          case "speaking": {
            questionParts.push(`${question.question_type} - Manual grading`);
            correctAnswersRow.push("(manual grading)");
            userAnswersRow.push(
              typeof userAnswerRaw === "string" ? userAnswerRaw : ""
            );
            answerStatusRow.push(null);
            break;
          }

          case "find-highlight": {
            (question.gaps || []).forEach((gap, idx) => {
              questionParts.push(`Highlight ${idx + 1}`);
              const correct = gap.correct_answers?.[0] || "";
              correctAnswersRow.push(correct);

              const userHighlights = Array.isArray(userAnswerRaw)
                ? userAnswerRaw
                : [];
              const found = userHighlights.find(
                (h) =>
                  h.text?.toLowerCase().trim() === correct.toLowerCase().trim()
              );

              userAnswersRow.push(found ? correct : "");
              answerStatusRow.push(!!found);
            });
            break;
          }

          default: {
            questionParts.push(`Q${question.id}`);
            correctAnswersRow.push(
              JSON.stringify(question.correct_answer || "")
            );
            userAnswersRow.push(JSON.stringify(userAnswerRaw));
            answerStatusRow.push(
              JSON.stringify(userAnswerRaw) ===
                JSON.stringify(question.correct_answer)
            );
          }
        }
      });

      return {
        ...result.toJSON(),
        questionParts,
        correctAnswersRow,
        userAnswersRow,
        answerStatusRow,
      };
    });

    const bestAttempt = processedAttempts[0];

    console.log(
      `✅ Found ${processedAttempts.length} attempts, best score: ${bestAttempt.score}%`
    );

    res.json({
      attempts: processedAttempts,
      bestAttempt,
      questionParts: bestAttempt.questionParts,
      correctAnswersRow: bestAttempt.correctAnswersRow,
    });
  } catch (error) {
    console.error("❌ Error fetching user quiz attempt:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.startAttempt = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizId } = req.params;

    // Đếm số lần attempt trước đó
    const previousCount = await UserQuizResult.count({
      where: { user_id: userId, quiz_id: quizId },
    });

    const attemptNumber = previousCount + 1;

    const newAttempt = await UserQuizResult.create({
      user_id: userId,
      quiz_id: quizId,
      attemptNumber,
      answers: [],
      startedAt: new Date(),
    });

    console.log(
      `🟢 User ${userId} started attempt #${attemptNumber} for quiz ${quizId}`
    );
    res.json(newAttempt);
  } catch (err) {
    console.error("❌ Error in startAttempt:", err);
    res.status(500).json({ message: "Failed to start attempt" });
  }
};

/* ------------------------------------------------------
 💾 TEMP SAVE (Auto save answers)
------------------------------------------------------ */

exports.tempSave = async (req, res) => {
  try {
    const { resultId } = req.params;
    const { answers } = req.body;

    await UserQuizResult.update({ answers }, { where: { id: resultId } });

    console.log(`💾 Temporary save successful for resultId: ${resultId}`);
    res.json({ message: "Temporary save successful" });
  } catch (err) {
    console.error("❌ Error in tempSave:", err);
    res.status(500).json({ message: "Temporary save failed" });
  }
};

exports.submitAttempt = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resultId } = req.params;
    const { answers } = req.body;

    console.log("📥 SUBMIT ATTEMPT");
    console.log(`🆔 Result ID: ${resultId}`);
    console.log("📨 Received answers:", JSON.stringify(answers, null, 2));

    const result = await UserQuizResult.findByPk(resultId, {
      include: [{ model: Quiz, as: "quiz" }],
    });
    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    const questions = await Question.findAll({
      where: { quiz_id: result.quiz_id },
    });
    console.log(
      `📄 Loaded ${questions.length} questions for quiz ${result.quiz_id}`
    );

    let totalEarnedScore = 0;
    let totalPossibleScore = 0;

    const gradedAnswers = answers.map((a) => {
      const question = questions.find(
        (q) => q.id.toString() === a.question.toString()
      );
      if (!question) {
        console.log(`⚠️ Question ${a.question} not found in quiz`);
        return { ...a, isCorrect: false, score: 0 };
      }

      console.log(
        `📝 Grading Question ID=${question.id}, type=${question.question_type}`
      );
      const userAnswerObj = a.answer || {};
      console.log("👉 User Answer:", JSON.stringify(userAnswerObj, null, 2));

      let correctItems = 0;
      let totalItems = 0;
      let earnedScore = 0;

      const gaps = question.gaps || [];
      const dropdowns = question.dropdowns || [];
      const hintWords = question.hintWords || [];

      switch (question.question_type) {
        // ✅ ADD: Essay and Description handling
        case "essay":
        case "description": {
          console.log(
            `📝 Question ${question.id} (${question.question_type}): Requires manual grading`
          );
          // Don't add to totalPossibleScore - will be graded manually
          return {
            ...a,
            isCorrect: null,
            score: 0,
            requiresManualGrading: true,
          };
        }

        case "blank-boxes":
        case "drag-drop-matching":
        case "reading":
        case "generated-dropdowns": {
          const points = Number(question.points);
          const safePoints = isNaN(points) || points <= 0 ? 1 : points;

          // ===== Gaps =====
          gaps.forEach((gap, idx) => {
            const userInput = (userAnswerObj[`gap_${idx}`] || "")
              .trim()
              .toLowerCase();
            const correctAnswers = (gap.correct_answers || []).map((ans) =>
              ans.trim().toLowerCase()
            );
            console.log(
              `[Gap] gap_${idx}, user="${userInput}", correct=${JSON.stringify(
                correctAnswers
              )}`
            );
            totalItems++;
            totalPossibleScore += safePoints;
            if (correctAnswers.includes(userInput)) {
              correctItems++;
              earnedScore += safePoints;
            }
          });

          // ===== Dropdowns =====
          dropdowns.forEach((dd, idx) => {
            const userInput = (userAnswerObj[`dropdown_${idx}`] || "")
              .trim()
              .toLowerCase();
            const correct = (dd.correct_answer || "").trim().toLowerCase();
            console.log(
              `[Dropdown] dropdown_${idx}, user="${userInput}", correct="${correct}"`
            );
            totalItems++;
            totalPossibleScore += safePoints;
            if (userInput === correct) {
              correctItems++;
              earnedScore += safePoints;
            }
          });

          // ===== HintWords =====
          hintWords.forEach((hw, idx) => {
            const userInput = (userAnswerObj[`hint_${idx}`] || "")
              .trim()
              .toLowerCase();
            const correct = (hw.word || "").trim().toLowerCase();
            console.log(
              `[HintWord] hint_${idx}, user="${userInput}", correct="${correct}"`
            );
            totalItems++;
            totalPossibleScore += safePoints;
            if (userInput === correct) {
              correctItems++;
              earnedScore += safePoints;
            }
          });

          break;
        }

        case "multiple-choice": {
          totalItems = 1;
          const points = Number(question.points);
          const safePoints = isNaN(points) || points <= 0 ? 1 : points;
          totalPossibleScore += safePoints;
          const correctOption = question.options
            .find((o) => o.isCorrect)
            ?.text?.trim()
            .toLowerCase();
          const userAnswer = (a.answer || "").trim().toLowerCase();
          console.log(
            `[MultipleChoice] user="${userAnswer}", correct="${correctOption}"`
          );
          if (userAnswer === correctOption) {
            correctItems = 1;
            earnedScore = safePoints;
          }
          break;
        }

        case "checkboxes": {
          const userAnswer = [
            ...new Set((a.answer || []).map((x) => Number(x))),
          ];
          const correctIndexes = question.options
            .map((opt, idx) => (opt.isCorrect ? idx : null))
            .filter((idx) => idx !== null);
          totalItems = correctIndexes.length;
          const points = Number(question.points);
          const safePoints = isNaN(points) || points <= 0 ? 1 : points;
          totalPossibleScore += totalItems * safePoints;
          console.log(
            `[Checkboxes] user=${JSON.stringify(
              userAnswer
            )}, correct=${JSON.stringify(correctIndexes)}`
          );
          correctIndexes.forEach((idx) => {
            if (userAnswer.includes(idx)) {
              correctItems++;
              earnedScore += safePoints;
            }
          });
          break;
        }

        case "find-highlight": {
          // ✅ Normalize text function
          const normalizeText = (text) => {
            if (!text) return "";
            return text
              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]"]/g, "")
              .replace(/\s{2,}/g, " ")
              .trim()
              .toLowerCase();
          };

          const userHighlights = a.answer || [];
          const correctAnswers = (question.gaps || []).map((g) => ({
            text: normalizeText(g.correct_answers?.[0] || ""),
          }));

          totalItems = correctAnswers.length;
          const points = Number(question.points);
          const safePoints = isNaN(points) || points <= 0 ? 1 : points;
          totalPossibleScore += totalItems * safePoints;

          console.log(
            `[FindHighlight] user=${JSON.stringify(
              userHighlights
            )}, correct=${JSON.stringify(correctAnswers)}`
          );

          // ✅ So sánh dựa trên normalized TEXT, bỏ qua position
          const usedIndexes = new Set();
          correctAnswers.forEach((correct) => {
            const match = userHighlights.find((h, idx) => {
              const userText = normalizeText(h.text || "");
              return !usedIndexes.has(idx) && userText === correct.text;
            });

            if (match) {
              correctItems++;
              usedIndexes.add(userHighlights.indexOf(match));
              earnedScore += safePoints;
            }
          });

          break;
        }

        default: {
          totalItems = 1;
          const points = Number(question.points);
          const safePoints = isNaN(points) || points <= 0 ? 1 : points;
          totalPossibleScore += safePoints;
          console.log(
            `[Default] user=${JSON.stringify(a.answer)}, correct=${JSON.stringify(
              question.correct_answer
            )}`
          );
          if (
            JSON.stringify(a.answer) === JSON.stringify(question.correct_answer)
          ) {
            correctItems = 1;
            earnedScore = safePoints;
          }
          break;
        }
      }

      console.log(
        `✅ Question ${question.id} => CorrectItems=${correctItems}/${totalItems}, Score=${earnedScore}`
      );

      totalEarnedScore += earnedScore;

      return {
        ...a,
        isCorrect: correctItems === totalItems,
        score: Math.round(earnedScore * 100) / 100,
      };
    });

    const finalScore =
      totalPossibleScore === 0
        ? 0
        : Math.round((totalEarnedScore / totalPossibleScore) * 100);
    const passed = finalScore >= 90;

    console.log(
      `🎯 Final Score: ${finalScore}% (${totalEarnedScore}/${totalPossibleScore})`
    );
    console.log(`🎓 Passed: ${passed ? "YES" : "NO"}`);

    await result.update({
      answers: gradedAnswers,
      score: finalScore,
      passed: passed,
      submittedAt: new Date(),
    });

    // ✅ correctAnswers trả về cũng đồng bộ key gap_0, dropdown_0, hint_0
    const correctAnswers = questions.map((q) => {
      let correct = null;

      switch (q.question_type) {
        // ✅ ADD: Essay and Description - return user's answer
        case "essay":
        case "description": {
          const userAnswer = answers.find(
            (a) => a.question.toString() === q.id.toString()
          );
          correct = userAnswer?.answer || "";
          return {
            question: q.id,
            answer: correct,
            requiresManualGrading: true,
          };
        }

        case "blank-boxes":
        case "reading":
        case "drag-drop-matching":
        case "generated-dropdowns": {
          correct = {};
          (q.gaps || []).forEach((gap, idx) => {
            correct[`gap_${idx}`] = gap.correct_answers?.[0] || "";
          });
          (q.dropdowns || []).forEach((dd, idx) => {
            correct[`dropdown_${idx}`] = dd.correct_answer || "";
          });
          (q.hintWords || []).forEach((hw, idx) => {
            correct[`hint_${idx}`] = hw.word || "";
          });
          break;
        }

        case "multiple-choice": {
          correct = q.options.find((o) => o.isCorrect)?.text || null;
          break;
        }

        case "checkboxes": {
          correct = q.options
            .map((o, idx) => (o.isCorrect ? idx : null))
            .filter((idx) => idx !== null);
          break;
        }

        case "find-highlight": {
          correct = q.correct_answer || [];
          break;
        }

        default: {
          correct = q.correct_answer || null;
          break;
        }
      }

      return {
        question: q.id,
        answer: correct,
      };
    });

    console.log(
      "✅ correctAnswers to return:",
      JSON.stringify(correctAnswers, null, 2)
    );

    res.json({
      message: "Submitted",
      result: {
        ...result.toJSON(),
        correctAnswers,
      },
    });
  } catch (err) {
    console.error("❌ Error during submitAttempt:", err);
    res.status(500).json({ error: "Submit failed", details: err.message });
  }
};

exports.getLatestResult = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    // Sequelize: find latest attempt (cả đã nộp và chưa nộp)
    const latest = await UserQuizResult.findOne({
      where: {
        user_id: userId,
        quiz_id: quizId,
      },
      order: [["attemptNumber", "DESC"]],
    });

    res.json(latest);
  } catch (err) {
    console.error("❌ Error in getLatestResult:", err);
    res.status(500).json({ error: "Get latest result failed" });
  }
};

exports.getAllAttempts = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    // Sequelize: find all attempts for user and quiz
    const attempts = await UserQuizResult.findAll({
      where: {
        user_id: userId,
        quiz_id: quizId,
      },
      order: [["attemptNumber", "DESC"]],
    });

    res.json(attempts);
  } catch (err) {
    console.error("❌ Error in getAllAttempts:", err);
    res.status(500).json({ error: "Get attempts failed" });
  }
};

exports.getUserQuizSummaryByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { UserQuizResult, Quiz } = require("../models");

    // Get all quiz results for the user, including quiz title
    const results = await UserQuizResult.findAll({
      where: { user_id: userId },
      include: [{ model: Quiz, as: "quiz", attributes: ["id", "title"] }],
      raw: true,
      nest: true,
    });

    // Aggregate results by quiz
    const summaryMap = {};
    for (const result of results) {
      if (!result.quiz || !result.quiz.id) continue;
      const quizId = result.quiz.id;
      if (!summaryMap[quizId]) {
        summaryMap[quizId] = {
          quizId,
          quizTitle: result.quiz.title,
          bestScore: result.score,
          attempts: 1,
          totalDuration:
            result.submittedAt && result.startedAt
              ? (new Date(result.submittedAt) - new Date(result.startedAt)) /
                1000
              : 0,
          durationCount: result.submittedAt && result.startedAt ? 1 : 0,
          lastAttempt: result.submittedAt || result.createdAt,
        };
      } else {
        const item = summaryMap[quizId];
        item.attempts += 1;
        item.bestScore = Math.max(item.bestScore, result.score);
        const duration =
          result.submittedAt && result.startedAt
            ? (new Date(result.submittedAt) - new Date(result.startedAt)) / 1000
            : 0;
        if (duration > 0) {
          item.totalDuration += duration;
          item.durationCount += 1;
        }
        if (
          result.submittedAt &&
          (!item.lastAttempt ||
            new Date(result.submittedAt) > new Date(item.lastAttempt))
        ) {
          item.lastAttempt = result.submittedAt;
        }
      }
    }

    const summary = Object.values(summaryMap).map((item) => ({
      quizId: item.quizId,
      quizTitle: item.quizTitle,
      bestScore: item.bestScore,
      attempts: item.attempts,
      avgDuration:
        item.durationCount > 0
          ? Math.round(item.totalDuration / item.durationCount)
          : null,
      lastAttempt: item.lastAttempt,
    }));

    res.json(summary);
  } catch (err) {
    console.error("❌ Error in getUserQuizSummaryByUserId:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Sequelize version: get best attempts by quiz
exports.getBestAttemptsByQuiz = async (req, res) => {
  const userId = req.user.id;
  const quizId = req.params.quizId;
  console.log(`🎯 Fetching best attempt for user ${userId}, quiz ${quizId}`);

  try {
    const result = await UserQuizResult.findOne({
      where: { user_id: userId, quiz_id: quizId },
      order: [["score", "DESC"]],
    });

    if (!result) {
      console.log("⚠️ No result found");
      return res.status(404).json({ message: "No attempts found" });
    }

    console.log("✅ Best attempt found:", result.toJSON());
    res.json(result);
  } catch (error) {
    console.error("❌ Error fetching best attempt:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Sequelize version: get users' best attempts by quiz
// Sequelize version: get users' best attempts by quiz
exports.getUsersBestAttemptsByQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { userId } = req.query; // ✅ Thêm query param để filter theo user

  try {
    console.log(
      `🎯 Fetching best attempts for quiz ${quizId}${userId ? ` (user ${userId})` : " (all users)"}`
    );

    // 1. Build where clause
    const whereClause = {
      quiz_id: quizId,
      submittedAt: { [Op.ne]: null },
    };

    // ✅ Nếu có userId, chỉ lấy user đó
    if (userId) {
      whereClause.user_id = userId;
    }

    // 2. Get all submitted results for this quiz
    const submittedResults = await UserQuizResult.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      order: [
        ["user_id", "ASC"],
        ["score", "DESC"],
        ["submittedAt", "DESC"],
      ],
    });

    if (submittedResults.length === 0) {
      console.log("⚠️ No results found");
      return res.json({
        results: [],
        questionParts: [],
        correctAnswersRow: [],
      });
    }

    // 3. Pick best attempt for each user
    const bestAttemptsMap = new Map();
    submittedResults.forEach((result) => {
      const uid = result.user?.id;
      if (!uid) return;
      if (!bestAttemptsMap.has(uid)) {
        bestAttemptsMap.set(uid, result);
      }
    });
    const bestResults = Array.from(bestAttemptsMap.values());

    console.log(`✅ Found ${bestResults.length} user(s) with results`);

    // 4. Get all questions for this quiz
    const questions = await Question.findAll({ where: { quiz_id: quizId } });

    const questionParts = [];
    const correctAnswersRow = [];
    const questionIdToParts = new Map();
    const questionIdToIndex = new Map();

    questions.forEach((question, qIndex) => {
      const partIndices = [];
      questionIdToIndex.set(question.id.toString(), qIndex);

      // Gaps
      question.gaps?.forEach((gap, i) => {
        const correct = gap.correct_answers?.[0] || "";
        questionParts.push(`Gap ${i + 1}`);
        correctAnswersRow.push(correct);
        partIndices.push({ type: "gap", index: i });
      });

      // Dropdowns
      question.dropdowns?.forEach((dropdown, i) => {
        const correct = dropdown.correct_answer || "";
        questionParts.push(`Dropdown ${i + 1}`);
        correctAnswersRow.push(correct);
        partIndices.push({ type: "dropdown", index: i });
      });

      // HintWords
      question.hintWords?.forEach((hw, i) => {
        const correct = hw.word || "";
        questionParts.push(`Hint ${i + 1}`);
        correctAnswersRow.push(correct);
        partIndices.push({ type: "hintWord", index: i });
      });

      // Options (multiple-choice or checkboxes)
      if (["multiple-choice", "checkboxes"].includes(question.question_type)) {
        question.options?.forEach((option, i) => {
          const correct = option.isCorrect ? option.text : "";
          questionParts.push(option.text);
          correctAnswersRow.push(correct);
          partIndices.push({
            type: "option",
            index: i,
            optionText: option.text,
          });
        });
      }

      // Essay / Speaking
      if (
        ["essay", "speaking", "description"].includes(question.question_type)
      ) {
        questionParts.push(`${question.question_type} - Manual grading`);
        correctAnswersRow.push("(manual grading)");
        partIndices.push({ type: "essay" });
      }

      questionIdToParts.set(question.id.toString(), partIndices);
    });

    // 5. Map each user's result
    const enrichedResults = bestResults.map((result) => {
      const userAnswersRow = [];
      const answerStatusRow = [];
      let correctIndex = 0;

      for (const question of questions) {
        const qid = question.id.toString();
        const partDefs = questionIdToParts.get(qid) || [];

        const userAnswerObj = result.answers.find(
          (ans) => ans.question.toString() === qid
        );
        const userAnswerRaw = userAnswerObj?.answer || {};

        let cursor = 0;

        for (const part of partDefs) {
          const correct = correctAnswersRow[correctIndex++];

          if (["gap", "dropdown", "hintWord"].includes(part.type)) {
            let key = "";
            if (part.type === "gap") key = `gap_${part.index}`;
            else if (part.type === "dropdown") key = `dropdown_${part.index}`;
            else if (part.type === "hintWord") key = `hint_${part.index}`;

            const userAns = userAnswerRaw[key] || "";
            userAnswersRow.push(userAns);
            answerStatusRow.push(
              userAns.toLowerCase() === correct.toLowerCase()
            );
          } else if (part.type === "option") {
            const selected = Array.isArray(userAnswerRaw)
              ? userAnswerRaw.includes(part.optionText)
              : userAnswerRaw === part.optionText;

            userAnswersRow.push(selected ? part.optionText : "");
            const isCorrect = correct !== "";
            answerStatusRow.push(isCorrect === selected);
          } else if (part.type === "essay") {
            const essayAns =
              typeof userAnswerRaw === "string" ? userAnswerRaw : "";
            userAnswersRow.push(essayAns);
            answerStatusRow.push(null);
          }
        }
      }

      return {
        ...result.toJSON(),
        userAnswersRow,
        answerStatusRow,
      };
    });

    res.json({ results: enrichedResults, questionParts, correctAnswersRow });
  } catch (error) {
    console.error("❌ Error fetching best attempts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBestAttemptsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`🎯 Fetching best attempts for user ${userId}`);

    // Get all submitted results for this user
    const results = await UserQuizResult.findAll({
      where: {
        user_id: userId,
        submittedAt: { [Op.ne]: null },
      },
      include: [
        {
          model: Quiz,
          as: "quiz",
          attributes: ["id", "title"],
        },
      ],
      order: [
        ["quiz_id", "ASC"],
        ["score", "DESC"],
        ["submittedAt", "DESC"],
      ],
    });

    if (results.length === 0) {
      console.log("⚠️ No submitted results found for this user");
      return res.json([]);
    }

    // Group by quiz and get best attempt for each
    const bestAttemptsMap = new Map();

    results.forEach((result) => {
      const quizId = result.quiz_id;
      if (!bestAttemptsMap.has(quizId)) {
        bestAttemptsMap.set(quizId, result);
      }
    });

    const bestAttempts = Array.from(bestAttemptsMap.values());

    console.log(
      `✅ Found ${bestAttempts.length} best attempts for user ${userId}`
    );

    res.json(bestAttempts);
  } catch (error) {
    console.error("❌ Error fetching best attempts by userId:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// controllers/userQuizResultController.js
exports.getUserResultsStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Lấy tất cả bài đã nộp
    const results = await UserQuizResult.findAll({
      where: {
        user_id: userId,
        submittedAt: { [Op.ne]: null },
      },
    });

    // Tính toán tổng quan
    let totalSubmitted = 0;
    let totalPassed = 0;
    let submittedToday = 0;
    let passedToday = 0;

    // Thống kê điểm theo ngày
    const dailyScores = {};

    for (const result of results) {
      totalSubmitted++;
      if (result.passed) totalPassed++;

      if (result.submittedAt >= startOfDay && result.submittedAt <= endOfDay) {
        submittedToday++;
        if (result.passed) passedToday++;
      }

      const date = result.submittedAt.toISOString().split("T")[0]; // YYYY-MM-DD

      if (!dailyScores[date]) {
        dailyScores[date] = { totalScore: 0, count: 0 };
      }

      dailyScores[date].totalScore += result.score;
      dailyScores[date].count += 1;
    }

    // Tạo chartData: điểm trung bình theo ngày
    const chartData = Object.keys(dailyScores)
      .map((date) => ({
        date,
        averageScore: parseFloat(
          (dailyScores[date].totalScore / dailyScores[date].count).toFixed(2)
        ),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return res.json({
      totalSubmitted,
      totalPassed,
      submittedToday,
      passedToday,
      chartData,
    });
  } catch (err) {
    console.error("❌ Error in getUserResultsStats:", err);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
};
