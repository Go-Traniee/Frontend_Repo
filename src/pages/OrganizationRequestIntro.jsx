import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import bubbleBack from "../assets/step1-bubble-back.svg";
import bubbleFront from "../assets/step1-bubble-front.svg";
import sphere from "../assets/step2-sphere.svg";
import documentImg from "../assets/step3-document.svg";

import "./OrganizationRequestIntro.css";

const NEXT_STEP_PATH = "/organization/requests/describe";

const STEPS = [
  {
    number: "01",
    title: "اطرح علينا المشكلة",
    text: "اشرح بكلماتك البسيطة كيف تسير الأمور حاليًا وما الصعوبات التي تواجه فريقك أو المستفيدين.",
    footer: "لا قيود على الأسلوب أو الصياغة",
    illustration: (
      <div className="org-intro-bubbles">
        <img
          src={bubbleBack}
          alt=""
          className="org-intro-bubble-back"
        />

        <img
          src={bubbleFront}
          alt=""
          className="org-intro-bubble-front"
        />
      </div>
    ),
  },
  {
    number: "02",
    title: "نطرح عليك بعض الأسئلة الموجهة",
    text: "يطرح مساعد GoTrainee الذكي أسئلة توضيحية قليلة فقط للتأكد من فهم طبيعة أعمالك ودور مستخدمي الحل.",
    footer: "ذكاء اصطناعي يفهم طبيعة أعمالك",
    illustration: (
      <img
        src={sphere}
        alt=""
        className="org-intro-sphere"
      />
    ),
  },
  {
    number: "03",
    title: "ننشئ لك تصورًا متكاملًا للمشروع",
    text: "نحوّل إجاباتك إلى مقترح مشروع (Project Blueprint) يوضح النطاق، والمهارات المطلوبة، والجدول الزمني.",
    footer: "وثيقة تنفيذية جاهزة للطلب والموافقة",
    illustration: (
      <img
        src={documentImg}
        alt=""
        className="org-intro-document"
      />
    ),
  },
];

function OrganizationRequestIntro() {
  const navigate = useNavigate();

  return (
    <div className="org-intro">
      <header className="org-intro-header">
        <h1 className="org-intro-title">
          كيف تحوّل GoTrainee فكرتك إلى مشروع ناجح؟
        </h1>

        <span className="org-intro-subtitle">
          مسار العمل المبسط
        </span>
      </header>

      <div className="org-intro-steps">
        {STEPS.map((step) => (
          <article
            className="org-intro-card"
            key={step.number}
          >
            <span className="org-intro-card-number">
              {step.number}
            </span>

            <h2 className="org-intro-card-title">
              {step.title}
            </h2>

            <p className="org-intro-card-text">
              {step.text}
            </p>

            <div className="org-intro-illustration">
              {step.illustration}
            </div>

            <p className="org-intro-card-footer">
              {step.footer}
            </p>
          </article>
        ))}
      </div>

      <div className="org-intro-actions">
        <button
          type="button"
          className="org-intro-start-btn"
          onClick={() => navigate(NEXT_STEP_PATH)}
        >
          ابدأ
        </button>

        <button
          type="button"
          className="org-intro-back-btn"
          aria-label="رجوع"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
}

export default OrganizationRequestIntro;