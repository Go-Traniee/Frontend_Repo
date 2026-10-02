import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import {
  getStudentProfile,
  //  لا يوجد
  // getStudentSkills,
} from "../services/studentService";
import CircularProgress from "../components/common/CircularProgress";
import welcomeImg from "../assets/welcome.svg";
import "./Dashboard.css";

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("auth_user"));
  } catch {
    return null;
  }
}

const PROFILE_FIELDS = [
  "university",
  "academic_major",
  "specialization",
  "graduation_year",
  "phone",
];

function calcCompletion(profile, skillsCount) {
  if (!profile) return 0;

  const filledFields = PROFILE_FIELDS.filter((field) =>
    Boolean(profile[field]),
  ).length;

  const totalCriteria = PROFILE_FIELDS.length + 1;
  const filledCriteria = filledFields + (skillsCount > 0 ? 1 : 0);

  return Math.round((filledCriteria / totalCriteria) * 100);
}

function Dashboard() {
  const [profile, setProfile] = useState(null);
  //   endpoint بانتظار مهارات الطالب من الباك
  const [skillsCount] = useState(0);
  const [stats] = useState([]);
  const [activities] = useState([]);

  const storedUser = getCurrentUser();
  const firstName = (profile?.name || storedUser?.name || "")
    .trim()
    .split(" ")[0];

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getStudentProfile();
        setProfile(data);
      } catch (error) {
        console.log("تعذر جلب بيانات الملف الشخصي", error);
      }

      // ============================================================
      // try {
      //   const skills = await getStudentSkills();
      //   setSkillsCount(Array.isArray(skills) ? skills.length : 0);
      // } catch (error) {
      //   console.log("تعذر جلب المهارات", error);
      // }
      // ============================================================
    };

    loadData();
  }, []);

  const completion = calcCompletion(profile, skillsCount);

  return (
    <>
      <section className="dashboard-banner">
        <img
          src={welcomeImg}
          alt=""
          className="dashboard-banner-illustration"
        />

        <div className="dashboard-banner-content">
          <h1 className="dashboard-banner-title">
            مرحبًا بك في GoTrainee{firstName ? `، ${firstName}` : ""}!
          </h1>
          <p className="dashboard-banner-subtitle">
            ابدأ رحلتك التدريبية الآن واكتشف أفضل المسارات العملية والمشاريع
            المطروحة.
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

             <Link
              to="/student/profile"
              className="dashboard-banner-btn dashboard-banner-btn-light"
            >
              <span>إكمال الملف الشخصي</span>
              <CircularProgress percent={completion} size={26} />
            </Link>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">نظرة عامة</h2>
          <Link to="/overview" className="dashboard-section-link"></Link>
        </div>

        {stats.length === 0 ? (
          <div className="empty-state">
            ستظهر الإحصائياتك بعد إكمال بعض الأنشطة.
          </div>
        ) : (
          <div className="stats-grid">
            {stats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <div className="stat-card-top">
                  <span className="stat-trend">{stat.trend}</span>
                  <span className="stat-icon">{stat.icon}</span>
                </div>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">
            مسارات تدريبية موصى بها لبدء رحلتك
          </h2>
          <Link to="/trainings" className="dashboard-section-link">
            عرض الكل ←
          </Link>
        </div>

        <div className="empty-state">رح تظهر أول ما يجهز التدريبات.</div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">آخر نشاطاتك</h2>
          <Link to="/activity" className="dashboard-section-link">
            سجل النشاط الكامل
          </Link>
        </div>

        {activities.length === 0 ? (
          <div className="empty-state"> لا يوجد نشاطات لعرضها.</div>
        ) : (
          <div className="activity-list">
            {activities.map((activity, index) => (
              <div className="activity-item" key={index}>
                <span className="activity-time">{activity.time}</span>

                <div className="activity-content">
                  <h4 className="activity-title">{activity.title}</h4>
                  <p className="activity-description">
                    {activity.description}
                  </p>
                </div>

                <span className="activity-icon">{activity.icon}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Dashboard;