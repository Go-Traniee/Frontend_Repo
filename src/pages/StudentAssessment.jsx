import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaDotCircle,
  FaRegCircle,
  FaFlag,
  FaRegFlag,
  FaTimes,
  FaRegClock,
  FaListOl,
} from "react-icons/fa";

import {
  getInitialAssessment,
  getStudentAssessmentResults,
  submitInitialAssessment,
} from "../services/studentService";

import "./StudentAssessment.css";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

const STATUS_LABELS = {
  completed: "Completed",
  current: "Current/Active",
  unanswered: "Unanswered",
};

const STATUS_ICONS = {
  completed: <FaCheckCircle />,
  current: <FaDotCircle />,
  unanswered: <FaRegCircle />,
};

const INTRO_TEXT = {
  title: "اختبار المهارات",
  noticeTitle:
    "تنبيه هام: الاختبار يشمل جميع المهارات المسجلة و المضافة حديثاً.",
  noticeDetails: "لقد تم تخصيص هذا الاختبار بناء على مهاراتك المسجلة في ملفك الشخصي لضمان أعلى نسب الموافقة الوظيفية والتدريبيةوترشيحك المباشر لفرص التدريب التعاوني مع الشركات",
  agree:
    "أؤكد أني قرأت وفهمت وأوافق على كافة قواعد الاختبار ومعايير ميثاق الشرف الأكاديمي.",
  startButton: "ابدأ الاختبار الآن",
};

const CODE_FENCE = /```[a-zA-Z]*\r?\n?([\s\S]*?)```/;
function splitQuestion(raw = "") {
  const match = raw.match(CODE_FENCE);

  if (!match) {
    return { text: raw.trim(), code: "" };
  }

  return {
    text: raw.replace(CODE_FENCE, "").trim(),
    code: match[1].replace(/\s+$/, ""),
  };
}

function StudentAssessment() {
  const [assessment, setAssessment] = useState(null);
  const [submittedResult, setSubmittedResult] = useState(null);

  const [started, setStarted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [data, results] = await Promise.all([
          getInitialAssessment(),
          getStudentAssessmentResults(),
        ]);

        const previous = Array.isArray(results)
          ? results.find((item) => item.assessment?.slug === data?.slug)
          : null;

        setAssessment(data);
        setSubmittedResult(previous || null);
      } catch (error) {
        console.log("تعذر جلب الاختبار", error);
        setLoadError("تعذر تحميل الاختبار، حاول مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const questions = assessment?.questions || [];
  const total = questions.length;
  const question = questions[currentIndex];

  const answeredCount = questions.filter((q) => answers[q.id]).length;
  const allAnswered = total > 0 && answeredCount === total;
  const isLast = currentIndex === total - 1;

  const getStatus = (q, index) => {
    if (index === currentIndex) return "current";
    return answers[q.id] ? "completed" : "unanswered";
  };

  const handleSelect = (questionId, key) => {
    setAnswers((prev) => ({ ...prev, [questionId]: key }));
    setSubmitError("");
  };

  const toggleFlag = (questionId) => {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;

    setSubmitError("");
    setSubmitting(true);

    try {
      const payload = questions.map((q) => ({
        question_id: q.id,
        answer: answers[q.id],
      }));

      const result = await submitInitialAssessment(payload);
      setSubmittedResult(result);
    } catch (error) {
      setSubmitError(error.message || "تعذر إرسال الاختبار، حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="assessment-page">
        <div className="assessment-state">جاري تحميل الاختبار</div>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="assessment-page">
        <div className="assessment-state assessment-state-error">
          {loadError}
        </div>
      </section>
    );
  }

  if (submittedResult) {
    return (
      <section className="assessment-page">
        <div className="assessment-card assessment-result">
          <span className="assessment-result-icon">
            <FaCheckCircle />
          </span>

          <h2 className="assessment-result-title">تم إرسال اختبار المهارات</h2>

          <p className="assessment-result-name" dir="auto">
            {assessment?.name}
          </p>

          <p className="assessment-result-score">
            مجموع النقاط
            <strong>{Number(submittedResult.score)}</strong>
          </p>

          <Link
            to="/student/skills"
            className="assessment-btn assessment-btn-primary"
          >
            العودة إلى مهاراتي
          </Link>
        </div>
      </section>
    );
  }

  if (!question) {
    return (
      <section className="assessment-page">
        <div className="assessment-state">لا توجد أسئلة في هذا الاختبار بعد.</div>
      </section>
    );
  }

  if (!started) {
    const duration = assessment?.duration_minutes;

    return (
      <div className="assessment-intro-overlay">
        <div
          className="assessment-intro"
          role="dialog"
          aria-modal="true"
          aria-labelledby="assessment-intro-title"
        >
          <div className="assessment-intro-header">
            <h2 className="assessment-intro-title" id="assessment-intro-title">
              {INTRO_TEXT.title}
            </h2>

            <Link
              to="/student/skills"
              className="assessment-intro-close"
              aria-label="إغلاق"
            >
              <FaTimes />
            </Link>
          </div>

          <div className="assessment-intro-banner">
            <h3 className="assessment-intro-banner-title">
              {INTRO_TEXT.noticeTitle}
            </h3>

            {INTRO_TEXT.noticeDetails && (
              <p className="assessment-intro-banner-text">
                {INTRO_TEXT.noticeDetails}
              </p>
            )}
          </div>

          <div className="assessment-intro-stats">
            {duration ? (
              <div className="assessment-intro-stat">
                <span className="assessment-intro-stat-icon">
                  <FaRegClock />
                </span>

                <div className="assessment-intro-stat-text">
                  <span className="assessment-intro-stat-label">
                    الوقت المخصص
                  </span>
                  <span className="assessment-intro-stat-value">
                    {duration} دقيقة
                  </span>
                </div>
              </div>
            ) : null}

            <div className="assessment-intro-stat">
              <span className="assessment-intro-stat-icon">
                <FaListOl />
              </span>

              <div className="assessment-intro-stat-text">
                <span className="assessment-intro-stat-label">
                  عدد الأسئلة
                </span>
                <span className="assessment-intro-stat-value">
                  {total} سؤال
                </span>
              </div>
            </div>
          </div>

          <label className="assessment-intro-agree">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>{INTRO_TEXT.agree}</span>
          </label>

          <div className="assessment-intro-footer">
            <button
              type="button"
              className="assessment-btn assessment-btn-primary"
              disabled={!agreed}
              onClick={() => setStarted(true)}
            >
              <span>{INTRO_TEXT.startButton}</span>
              <FaArrowLeft />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { text, code } = splitQuestion(question.question);

  return (
    <section className="assessment-page">
      <div className="assessment-card">
        <div className="assessment-header">
          <div className="assessment-progress">
            <span className="assessment-progress-label">
              السؤال {currentIndex + 1} من {total}
            </span>

            <div className="assessment-progress-bar">
              {questions.map((q, index) => (
                <span
                  key={q.id}
                  className={`assessment-progress-seg ${
                    index <= currentIndex ? "assessment-progress-seg-on" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <h1 className="assessment-title" dir="auto">
            {assessment.name}
          </h1>
        </div>

        <div className="assessment-body">
          <div className="assessment-main">
            <h2 className="assessment-question-title">
              <span>السؤال {currentIndex + 1}:</span> <bdi>{text}</bdi>
            </h2>

            {code && (
              <pre className="assessment-code" dir="ltr">
                <code>{code}</code>
              </pre>
            )}

            <div
              className="assessment-options"
              role="radiogroup"
              aria-label={`السؤال ${currentIndex + 1}`}
            >
              {question.options.map((option, index) => {
                const selected = answers[question.id] === option.key;

                return (
                  <label
                    key={option.key}
                    className={`assessment-option ${
                      selected ? "assessment-option-selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.key}
                      checked={selected}
                      onChange={() => handleSelect(question.id, option.key)}
                    />

                    <span className="assessment-option-radio" />

                    <span className="assessment-option-text" dir="auto">
                      {OPTION_LETTERS[index]}. {option.label}
                    </span>
                  </label>
                );
              })}
            </div>

            {isLast && !allAnswered && (
              <p className="assessment-hint">
                أجب عن جميع الأسئلة لتتمكن من إرسال الاختبار ({answeredCount}/
                {total})
              </p>
            )}

            {submitError && <p className="assessment-error">{submitError}</p>}
          </div>

          <aside className="assessment-side">
            <h3 className="assessment-side-title">Questions</h3>

            <ul className="assessment-nav">
              {questions.map((q, index) => {
                const status = getStatus(q, index);

                return (
                  <li key={q.id}>
                    <button
                      type="button"
                      className={`assessment-nav-item assessment-nav-${status}`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <span className="assessment-nav-text" dir="ltr">
                        {index + 1}. {STATUS_LABELS[status]}
                      </span>

                      {flagged[q.id] && (
                        <FaFlag className="assessment-nav-flag" />
                      )}

                      <span className="assessment-nav-icon">
                        {STATUS_ICONS[status]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>

        <div className="assessment-footer">
          <button
            type="button"
            className="assessment-btn assessment-btn-outline"
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={currentIndex === 0}
          >
            <FaArrowRight />
            <span>Previous Question</span>
          </button>

          <div className="assessment-footer-actions">
            <button
              type="button"
              className={`assessment-btn assessment-btn-outline ${
                flagged[question.id] ? "assessment-btn-flagged" : ""
              }`}
              onClick={() => toggleFlag(question.id)}
            >
              <span>Flag for Review</span>
              {flagged[question.id] ? <FaFlag /> : <FaRegFlag />}
            </button>

            {isLast ? (
              <button
                type="button"
                className="assessment-btn assessment-btn-primary"
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
              >
                <span>{submitting ? "Submitting..." : "Submit Assessment"}</span>
              </button>
            ) : (
              <button
                type="button"
                className="assessment-btn assessment-btn-primary"
                onClick={() => setCurrentIndex((i) => i + 1)}
              >
                <span>Next Question</span>
                <FaArrowLeft />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentAssessment;