import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaFolderOpen,
} from "react-icons/fa";

import RequestStepper from "../components/common/RequestStepper";
import {
  createOrganizationRequest,
  getOrganizationRequests,
} from "../services/organizationService";

import "../components/common/RequestWizard.css";

const INTRO_PATH = "/organization/requests/new";

const questionsPath = (requestId) =>
  `/organization/requests/${requestId}/questions`;

const STATUS_LABELS = {
  draft: "مسودة",
  submitted: "قيد المراجعة",
  approved: "مقبول",
  rejected: "مرفوض",
};

function requestTitle(request) {
  const text = (
    request.project_name ||
    request.problem_description ||
    ""
  ).trim();

  if (!text) return "—";

  return text.length > 60 ? `${text.slice(0, 60)}...` : text;
}

function OrganizationRequestProblem() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    project_name: "",
    short_title: "",
    problem_description: "",
  });

  const [errorMsg, setErrorMsg] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await getOrganizationRequests();
        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("تعذر جلب الطلبات السابقة", error);
      }
    };

    loadRequests();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.project_name.trim()) {
      newErrors.project_name = "اسم المشروع مطلوب";
    }

    if (!formData.short_title.trim()) {
      newErrors.short_title = "العنوان القصير مطلوب";
    }

    if (!formData.problem_description.trim()) {
      newErrors.problem_description = "شرح المشكلة مطلوب";
    }

    setErrorMsg(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);

    try {
      const created = await createOrganizationRequest({
        project_name: formData.project_name.trim(),
        short_title: formData.short_title.trim(),
        problem_description: formData.problem_description.trim(),
        status: "draft",
      });

      if (created?.id) {
        navigate(questionsPath(created.id));
      }
    } catch (error) {
      console.log("فشل إنشاء الطلب:", error);

      setErrorMsg({
        submit: error.message || "حدث خطأ أثناء الحفظ، حاول مرة أخرى",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const previousRequests = [...requests].sort((a, b) => b.id - a.id);

  return (
    <div className="wizard">
      <p className="wizard-intro-text">
        حوّل مشكلتك إلى مشروع واضح في 4 خطوات بسيطة – بلا مصطلحات تقنية
      </p>

      <RequestStepper currentStep={1} />

      <form
        id="organizationProblemForm"
        className="wizard-card"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="wizard-card-title">
          ما التحدي الذي تواجهه؟
        </h2>

        <div className="wizard-field">
          <label
            className="wizard-label"
            htmlFor="project_name"
          >
            اسم المشروع
          </label>

          <input
            id="project_name"
            className="wizard-input"
            type="text"
            name="project_name"
            placeholder="مثال: نظام إدارة"
            maxLength={255}
            value={formData.project_name}
            onChange={handleChange}
          />

          {errorMsg.project_name && (
            <span className="wizard-error">
              {errorMsg.project_name}
            </span>
          )}
        </div>

        <div className="wizard-field">
          <label
            className="wizard-label"
            htmlFor="short_title"
          >
            عنوان قصير
          </label>

          <input
            id="short_title"
            className="wizard-input"
            type="text"
            name="short_title"
            placeholder="مثال: صعوبة متابعة طلبات العملاء"
            maxLength={255}
            value={formData.short_title}
            onChange={handleChange}
          />

          {errorMsg.short_title && (
            <span className="wizard-error">
              {errorMsg.short_title}
            </span>
          )}
        </div>

        <div className="wizard-field">
          <label
            className="wizard-label"
            htmlFor="problem_description"
          >
            اشرح المشكلة
          </label>

          <textarea
            id="problem_description"
            className="wizard-textarea"
            name="problem_description"
            placeholder="ماذا يحدث الآن؟ ما الذي يزعجك أو يُبطئ وقتك؟"
            maxLength={1000}
            value={formData.problem_description}
            onChange={handleChange}
          />

          {errorMsg.problem_description && (
            <span className="wizard-error">
              {errorMsg.problem_description}
            </span>
          )}
        </div>

        <div className="wizard-note">
          بعد الإرسال سيساعدك مساعد ذكي بعدة أسئلة بسيطة. لن يبدأ أي مشروع قبل
          موافقتك.
        </div>

        {errorMsg.submit && (
          <span className="wizard-error">
            {errorMsg.submit}
          </span>
        )}
      </form>

      <div className="wizard-actions">
        <button
          type="submit"
          form="organizationProblemForm"
          className="wizard-next-btn"
          aria-label="التالي"
          disabled={submitting}
        >
          {submitting ? "...يتم الحفظ" : <FaArrowRight />}
        </button>

        <button
          type="button"
          className="wizard-back-btn"
          aria-label="رجوع"
          disabled={submitting}
          onClick={() => navigate(INTRO_PATH)}
        >
          <FaArrowLeft />
        </button>
      </div>

      <section className="wizard-previous">
        {previousRequests.length === 0 ? (
          <>
            <FaFolderOpen className="wizard-previous-icon" />

            <span>
              لا توجد طلبات سابقة بعد. أول طلب لك سيظهر هنا.
            </span>
          </>
        ) : (
          <ul className="wizard-previous-list">
            {previousRequests.map((request) => (
              <li
                className="wizard-previous-item"
                key={request.id}
              >
                <span>{requestTitle(request)}</span>

                <span className="wizard-previous-status">
                  {STATUS_LABELS[request.status] || request.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default OrganizationRequestProblem;