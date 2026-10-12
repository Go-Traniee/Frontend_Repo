import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck, FaRobot } from "react-icons/fa";

import RequestStepper from "../components/common/RequestStepper";
import {
  getOrganizationRequest,
  startIntakeSession,
  sendIntakeMessage,
  generateSpecification,
} from "../services/organizationService";

import "../components/common/RequestWizard.css";

const TOPICS = [
  { key: "problem", label: "المشكلة" },
  { key: "current_process", label: "العملية الحالية" },
  { key: "desired_outcome", label: "النتيجة" },
  { key: "users", label: "المستخدمون" },
  { key: "business_needs", label: "الاحتياجات" },
  { key: "important_features", label: "الميزات" },
  { key: "constraints", label: "القيود" },
  { key: "expected_duration", label: "الموعد" },
  { key: "budget", label: "الميزانية" },
  { key: "operational_requirements", label: "التشغيل" },
  { key: "additional_clarifications", label: "إضافات" },
];

function isFilled(value) {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;

  return String(value).trim() !== "";
}

function OrganizationRequestQuestions() {
  const navigate = useNavigate();
  const { id: requestId } = useParams();

  const startedRef = useRef(false);
  const messagesRef = useRef(null);

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [requirements, setRequirements] = useState({});
  const [isSufficient, setIsSufficient] = useState(false);

  const [answer, setAnswer] = useState("");
  const [starting, setStarting] = useState(true);
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const applyReply = (result) => {
    if (result?.ai_reply) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: result.ai_reply },
      ]);
    }

    if (result?.requirements) {
      setRequirements(result.requirements);
    }

    if (result?.is_sufficient === true) {
      setIsSufficient(true);
    }
  };

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const start = async () => {
      try {
        const request = await getOrganizationRequest(requestId);
        const session = await startIntakeSession(requestId);

        setSessionId(session.session_id);

        const reply = await sendIntakeMessage(
          session.session_id,
          request.problem_description
        );

        applyReply(reply);
      } catch (error) {
        console.log("فشل بدء محادثة الأسئلة:", error);

        setErrorMsg(
          error.message || "تعذر بدء المحادثة، حاول مرة أخرى"
        );
      } finally {
        setStarting(false);
      }
    };

    start();
  }, [requestId]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, sending, starting]);

  const handleSend = async (e) => {
    e.preventDefault();

    const text = answer.trim();

    if (!text || sending || starting || isSufficient || !sessionId) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setAnswer("");
    setSending(true);
    setErrorMsg("");

    try {
      const result = await sendIntakeMessage(sessionId, text);
      applyReply(result);
    } catch (error) {
      console.log("فشل إرسال الرسالة:", error);

      setErrorMsg(
        error.message || "تعذر إرسال الرسالة، حاول مرة أخرى"
      );
    } finally {
      setSending(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setErrorMsg("");

    try {
      await generateSpecification(requestId);

      navigate(`/organization/requests/${requestId}/draft`);
    } catch (error) {
      console.log("فشل إنشاء المسودة:", error);

      setErrorMsg(
        error.message || "تعذر إنشاء المسودة، حاول مرة أخرى"
      );
    } finally {
      setGenerating(false);
    }
  };

  const filledCount = TOPICS.filter((topic) =>
    isFilled(requirements[topic.key])
  ).length;

  const currentTopicKey = isSufficient
    ? null
    : TOPICS.find((topic) => !isFilled(requirements[topic.key]))?.key;

  const inputDisabled = starting || sending || isSufficient || !sessionId;

  return (
    <div className="wizard">
      <p className="wizard-intro-text">
        حوّل مشكلتك إلى مشروع واضح في 4 خطوات بسيطة – بلا مصطلحات تقنية
      </p>

      <RequestStepper currentStep={2} />

      <section className="wizard-chat-card">
        <header className="wizard-chat-header">
          <h2 className="wizard-chat-title">
            Traino مساعد GoTrainee
          </h2>

          <span className="wizard-chat-count">
            {filledCount} من {TOPICS.length}
          </span>
        </header>

        <div className="wizard-progress">
          <div
            className="wizard-progress-fill"
            style={{
              width: `${(filledCount / TOPICS.length) * 100}%`,
            }}
          />
        </div>

        <div className="wizard-chat-body">
          <div
            className="wizard-messages"
            ref={messagesRef}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`wizard-message wizard-message-${message.role}`}
              >
                <span className="wizard-message-label">
                  {message.role === "ai" ? (
                    <>
                      <FaRobot />
                      <span>المساعد</span>
                    </>
                  ) : (
                    <span>أنت</span>
                  )}
                </span>

                <span className="wizard-message-text">
                  {message.text}
                </span>
              </div>
            ))}

            {(starting || sending) && (
              <div className="wizard-message wizard-message-ai">
                <span className="wizard-message-label">
                  <FaRobot />
                  <span>المساعد</span>
                </span>

                <span className="wizard-message-text">
                  ...يكتب
                </span>
              </div>
            )}
          </div>

          <aside className="wizard-topics">
            <h3 className="wizard-topics-title">
              محاور الفهم
            </h3>

            <ul className="wizard-topics-list">
              {TOPICS.map((topic) => {
                const status = isFilled(requirements[topic.key])
                  ? "done"
                  : topic.key === currentTopicKey
                    ? "current"
                    : "pending";

                return (
                  <li
                    key={topic.key}
                    className={`wizard-topic wizard-topic-${status}`}
                  >
                    <span>{topic.label}</span>

                    <span className="wizard-topic-icon">
                      {status === "done" && <FaCheck />}
                    </span>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>

        {errorMsg && (
          <span className="wizard-error">{errorMsg}</span>
        )}

        <form
          className="wizard-composer"
          onSubmit={handleSend}
        >
          <input
            className="wizard-input"
            type="text"
            placeholder="اكتب إجابتك..."
            maxLength={500}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={inputDisabled}
          />

          <button
            type="submit"
            className="wizard-send-btn"
            disabled={inputDisabled || !answer.trim()}
          >
            إرسال
          </button>
        </form>
      </section>

      {isSufficient && (
        <section className="wizard-success">
          <h3 className="wizard-success-title">
            جمعنا ما يكفي! 🎉
          </h3>

          <p className="wizard-success-text">
            جاهزون لإعداد مسودة المشروع
          </p>

          <button
            type="button"
            className="wizard-success-btn"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? "...جاري إنشاء المسودة" : "إنشاء مسودة المواصفات"}
          </button>
        </section>
      )}
    </div>
  );
}

export default OrganizationRequestQuestions;