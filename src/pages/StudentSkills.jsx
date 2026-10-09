import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaPlus,
  FaLightbulb,
  FaMedal,
  FaStar,
  FaRegTrashAlt,
  FaTimes,
  FaBullseye,
  FaRoute,
  FaPenNib,
  FaFigma,
  FaPython,
  FaReact,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaPhp,
  FaLaravel,
  FaJava,
  FaGitAlt,
  FaCode,
  FaSearch,
  FaBullhorn,
  FaThLarge,
  FaDatabase,
} from "react-icons/fa";

import {
  getAvailableSkills,
  getStudentSkills,
  addStudentSkill,
  deleteStudentSkill,
  getSkillsInsights,
} from "../services/studentService";

import welcomeImg from "../assets/welcome.svg";

import "./Dashboard.css";
import "./StudentSkills.css";

const PROFICIENCY_OPTIONS = [
  { value: "beginner", label: "مبتدئ", dots: 1 },
  { value: "intermediate", label: "متوسط", dots: 2 },
  { value: "advanced", label: "متقدم", dots: 3 },
  { value: "expert", label: "خبير", dots: 4 },
];
const SKILL_ICONS = [
  { match: "figma", icon: FaFigma },
  { match: "python", icon: FaPython },
  { match: "react", icon: FaReact },
  { match: "javascript", icon: FaJs },
  { match: "html", icon: FaHtml5 },
  { match: "css", icon: FaCss3Alt },
  { match: "node", icon: FaNodeJs },
  { match: "laravel", icon: FaLaravel },
  { match: "php", icon: FaPhp },
  { match: "java", icon: FaJava },
  { match: "git", icon: FaGitAlt },
  { match: "sql", icon: FaDatabase },
  { match: "data", icon: FaDatabase },
  { match: "ux", icon: FaSearch },
  { match: "research", icon: FaSearch },
  { match: "design system", icon: FaThLarge },
  { match: "communication", icon: FaBullhorn },
  { match: "presentation", icon: FaBullhorn },
  { match: "ui", icon: FaPenNib },
  { match: "design", icon: FaPenNib },
  { match: "program", icon: FaCode },
];

function getSkillIcon(name = "") {
  const lower = name.toLowerCase();
  const found = SKILL_ICONS.find((item) => lower.includes(item.match));
  return found ? found.icon : FaLightbulb;
}

function StudentSkills() {
  const [allSkills, setAllSkills] = useState([]);
  const [studentSkills, setStudentSkills] = useState([]);
  const [insights, setInsights] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState("");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [available, mine] = await Promise.all([
          getAvailableSkills(),
          getStudentSkills(),
        ]);
        setAllSkills(Array.isArray(available) ? available : []);
        setStudentSkills(Array.isArray(mine) ? mine : []);
      } catch (error) {
        console.log("تعذر جلب المهارات", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await getSkillsInsights();
        setInsights(data || null);
      } catch (error) {
        setInsights(null);
      }
    };

    loadInsights();
  }, []);

  const matchRate = insights?.opportunity_match_rate;
  const careerCount = insights?.career_recommendations_count;
  const hasMatchRate = matchRate !== null && matchRate !== undefined;
  const hasCareerCount = careerCount !== null && careerCount !== undefined;

  const availableToAdd = allSkills.filter(
    (skill) => !studentSkills.some((s) => s.skill?.id === skill.id),
  );

  const suggestedSkills = availableToAdd.slice(0, 6);

  const advancedCount = studentSkills.filter(
    (s) => s.proficiency === "advanced" || s.proficiency === "expert",
  ).length;

  const closeModal = () => {
    setShowAdd(false);
    setSelectedSkillId("");
    setModalError("");
  };

  const handleAdd = async () => {
    if (!selectedSkillId) {
      setModalError("الرجاء اختيار مهارة أولًا.");
      return;
    }

    setModalError("");
    setAdding(true);

    try {
      const newSkill = await addStudentSkill({
        skill_id: Number(selectedSkillId),
        proficiency: "beginner",
      });

      setStudentSkills((prev) => [...prev, newSkill]);
      closeModal();
    } catch (error) {
      setModalError(error.message || "تعذر إضافة المهارة، حاول مرة أخرى.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (studentSkillId) => {
    setErrorMsg("");

    try {
      await deleteStudentSkill(studentSkillId);
      setStudentSkills((prev) =>
        prev.filter((item) => item.id !== studentSkillId),
      );
    } catch (error) {
      setErrorMsg(error.message || "تعذر حذف المهارة، حاول مرة أخرى.");
    }
  };

  return (
    <>
      <section className="dashboard-banner">
        <img
          src={welcomeImg}
          alt=""
          className="dashboard-banner-illustration"
        />

        <div className="dashboard-banner-content">
          <h1 className="dashboard-banner-title">مهاراتي</h1>

          <p className="dashboard-banner-subtitle">
            أضف مهاراتك وحدد مستوى اتقانك لتساعدنا على تقديم الفرص والمشاريع
            المناسبة لك
          </p>

          <div className="dashboard-banner-actions">
            <Link
              to="/student/assessment"
              className="dashboard-banner-btn dashboard-banner-btn-primary"
            >
              <span>اختبار المهارات</span>

              <span className="btn-arrow-badge">
                <FaChevronLeft />
              </span>
            </Link>

            <button
              type="button"
              className="dashboard-banner-btn dashboard-banner-btn-light"
              onClick={() => setShowAdd(true)}
            >
              <span>إضافة مهارة جديدة</span>
              <FaPlus />
            </button>
          </div>
        </div>
      </section>

      <section className="skills-stats">
        <div className="skills-stat skills-stat-dark">
          <span className="skills-stat-icon">
            <FaMedal />
          </span>

          <div className="skills-stat-text">
            <span className="skills-stat-label">إجمالي المهارات المضافة</span>
            <span className="skills-stat-value">
              {studentSkills.length}
              <span className="skills-stat-unit">مهارات</span>
            </span>
          </div>
        </div>

        <div className="skills-stat">
          <span className="skills-stat-icon">
            <FaStar />
          </span>

          <div className="skills-stat-text">
            <span className="skills-stat-label">مهارات متقدمة وخبير</span>
            <span className="skills-stat-value">
              {advancedCount}
              <span className="skills-stat-unit">مهارات</span>
            </span>
          </div>
        </div>

        {hasMatchRate && (
          <div className="skills-stat">
            <span className="skills-stat-icon">
              <FaBullseye />
            </span>

            <div className="skills-stat-text">
              <span className="skills-stat-label">نسبة مطابقة الفرص</span>
              <span className="skills-stat-value">
                {matchRate}%
                <span className="skills-stat-unit">جاهز للتقديم</span>
              </span>
            </div>
          </div>
        )}

        {hasCareerCount && (
          <div className="skills-stat">
            <span className="skills-stat-icon">
              <FaRoute />
            </span>

            <div className="skills-stat-text">
              <span className="skills-stat-label">مقترحة للمسار المهني</span>
              <span className="skills-stat-value">
                {careerCount}
                <span className="skills-stat-unit">توصيات مهنية</span>
              </span>
            </div>
          </div>
        )}
      </section>

      {errorMsg && <p className="skills-error">{errorMsg}</p>}

      <section>
        <div className="skills-filters">
          <span className="skills-filter skills-filter-active">
            الكل ({studentSkills.length})
          </span>
        </div>

        {loading ? (
          <div className="empty-state">جاري تحميل المهارات</div>
        ) : studentSkills.length === 0 ? (
          <div className="empty-state">لا توجد مهارات مضافة بعد.</div>
        ) : (
          <div className="skills-list">
            {studentSkills.map((item) => {
              const level = PROFICIENCY_OPTIONS.find(
                (opt) => opt.value === item.proficiency,
              );
              const SkillIcon = getSkillIcon(item.skill?.name);

              return (
                <div className="skills-row" key={item.id}>
                  <span className="skills-row-icon">
                    <SkillIcon />
                  </span>

                  <div className="skills-row-info">
                    <span className="skills-row-name">{item.skill?.name}</span>
                  </div>

                  <span className="skills-row-level">
                    <span className="skills-row-dots">
                      {[1, 2, 3, 4].map((n) => (
                        <span
                          key={n}
                          className={`skills-row-dot ${
                            n <= (level?.dots || 0) ? "skills-row-dot-on" : ""
                          }`}
                        />
                      ))}
                    </span>
                    {level?.label || item.proficiency}
                  </span>

                  <button
                    type="button"
                    className="skills-row-delete"
                    onClick={() => handleRemove(item.id)}
                    aria-label={`حذف ${item.skill?.name}`}
                  >
                    <FaRegTrashAlt />
                    <span>حذف</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showAdd && (
        <div className="skills-modal-overlay" onClick={closeModal}>
          <div
            className="skills-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="skills-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="skills-modal-header">
              <h3 className="skills-modal-title" id="skills-modal-title">
                إضافة مهارة جديدة
              </h3>

              <button
                type="button"
                className="skills-modal-close"
                onClick={closeModal}
                aria-label="إغلاق"
              >
                <FaTimes />
              </button>
            </div>

            <div className="skills-modal-body">
              <div className="skills-modal-label-row">
                <label className="skills-modal-label" htmlFor="skill-select">
                  اسم المهارة <span className="skills-modal-required">*</span>
                </label>

                <span className="skills-modal-hint">
                  المهارات الشائعة مقترحة أدناه
                </span>
              </div>

              <select
                id="skill-select"
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                className="skills-modal-select"
              >
                <option value="">اختر مهارة</option>
                {availableToAdd.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>

              {suggestedSkills.length > 0 && (
                <div className="skills-modal-suggest">
                  <span className="skills-modal-suggest-label">
                    مقترحة لك:
                  </span>

                  {suggestedSkills.map((skill) => (
                    <button
                      type="button"
                      key={skill.id}
                      className={`skills-modal-chip ${
                        String(skill.id) === String(selectedSkillId)
                          ? "skills-modal-chip-active"
                          : ""
                      }`}
                      onClick={() => setSelectedSkillId(String(skill.id))}
                    >
                      + {skill.name}
                    </button>
                  ))}
                </div>
              )}

              {modalError && <p className="skills-modal-error">{modalError}</p>}
            </div>

            <div className="skills-modal-footer">
              <button
                type="button"
                className="skills-modal-btn skills-modal-btn-primary"
                onClick={handleAdd}
                disabled={adding}
              >
                {adding ? "جارِ الإضافة" : "إضافة مهارة"}
              </button>

              <button
                type="button"
                className="skills-modal-btn skills-modal-btn-ghost"
                onClick={closeModal}
                disabled={adding}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentSkills;