import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaRegFileAlt,
  FaClipboardCheck,
  FaRocket,
  FaCheckCircle,
  FaUserGraduate,
  FaShieldAlt,
  FaRegClock,
} from "react-icons/fa";

import {
  getOrganizationProfile,
  getOrganizationRequests,
} from "../services/organizationService";

import CircularProgress from "../components/common/CircularProgress";
import profileBannerImg from "../assets/profile-banner.svg";

import "./OrganizationDashboard.css";

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("auth_user"));
  } catch {
    return null;
  }
}

const PROFILE_FIELDS = [
  "organization_name",
  "organization_type",
  "industry",
  "organization_description",
  "location",
  "website",
  "contact_person",
];

const STATUS_LABELS = {
  draft: "مسودة",
  submitted: "قيد المراجعة",
  approved: "مقبول",
  rejected: "مرفوض",
};

function calcCompletion(profile) {
  if (!profile) return null;

  const normalized = {
    ...profile,
    organization_description:
      profile.organization_description || profile.description,
  };

  const filledFields = PROFILE_FIELDS.filter((field) =>
    Boolean(normalized[field]),
  ).length;

  return Math.round((filledFields / PROFILE_FIELDS.length) * 100);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("ar-SY-u-nu-latn", {
    day: "numeric",
    month: "long",
  });
}

function projectTitle(description) {
  if (!description) return "—";

  const text = description.trim();

  return text.length > 45 ? `${text.slice(0, 45)}...` : text;
}

function OrganizationDashboard() {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);

  const storedUser = getCurrentUser();

  const organizationName = (
    storedUser?.name ||
    profile?.organization_name ||
    ""
  ).trim();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getOrganizationProfile();
        setProfile(data);
      } catch (error) {
        console.log("تعذر جلب بيانات ملف المؤسسة", error);
      }

      try {
        const data = await getOrganizationRequests();
        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("تعذر جلب طلبات المؤسسة", error);
      }
    };

    loadData();
  }, []);

  const completion = calcCompletion(profile);

  const total = requests.length;

  const countByStatus = (status) =>
    requests.filter((request) => request.status === status).length;

  const stats = [
    {
      label: "إجمالي المشاريع",
      value: total,
      icon: <FaRegFileAlt />,
    },
    {
      label: "قيد المراجعة",
      value: countByStatus("submitted"),
      icon: <FaClipboardCheck />,
    },
    {
      label: "المشاريع النشطة",
      value: countByStatus("approved"),
      icon: <FaRocket />,
    },
    {
      label: "المشاريع المكتملة",
      value: 0,
      icon: <FaCheckCircle />,
    },
  ];

  const latestRequests = [...requests]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <>
      <section className="dashboard-banner org-dashboard-banner">
        <img
          src={profileBannerImg}
          alt=""
          className="dashboard-banner-illustration org-banner-illustration"
        />

        <div className="dashboard-banner-content">
          <h1 className="dashboard-banner-title">
            مرحبًا بك في GoTrainee
            {organizationName ? `، ${organizationName}` : ""}!
          </h1>

          <p className="dashboard-banner-subtitle">
            حوّل احتياج مؤسستك إلى مشروع رقمي واضح وقابل للتنفيذ بكل سهولة
            وبدون تعقيدات تقنية.
          </p>

          <div className="dashboard-banner-actions">
            <Link
              to="/organization/requests/new"
              className="dashboard-banner-btn dashboard-banner-btn-primary"
            >
              <span>إنشاء مشروع جديد</span>

              <span className="btn-arrow-badge">
                <FaChevronLeft />
              </span>
            </Link>

            <Link
              to="/organization/profile"
              className="dashboard-banner-btn dashboard-banner-btn-light"
            >
              <span>إكمال الملف الشخصي</span>

              {completion !== null && (
                <CircularProgress
                  percent={completion}
                  size={26}
                />
              )}
            </Link>
          </div>
        </div>
      </section>

      <div className="org-info-row">
        <div className="org-info-card">
          <h2 className="org-idea-title">
            أخبرنا عن الفكرة التي تريد تنفيذها
          </h2>

          <p className="org-idea-text">
            لا تحتاج إلى أي معرفة تقنية. أخبرنا عن التحدي اليومي الذي تواجهه
            مؤسستك، وسنساعدك خطوة بخطوة على تحويله إلى مشروع تقني واضح وقابل
            للتنفيذ بأيدي طلاب متميزين.
          </p>
        </div>

        <div className="org-info-card">
          <ul className="org-features">
            <li className="org-feature">
              <span className="org-feature-icon">
                <FaUserGraduate />
              </span>

              <span>إشراف أكاديمي وفني متواصل</span>
            </li>

            <li className="org-feature">
              <span className="org-feature-icon">
                <FaShieldAlt />
              </span>

              <span>مشاريع بدون متطلبات برمجية معقدة</span>
            </li>

            <li className="org-feature">
              <span className="org-feature-icon">
                <FaRegClock />
              </span>

              <span>يستغرق فقط ٤ إلى ٦ دقائق</span>
            </li>
          </ul>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">
            نظرة عامة
          </h2>
        </div>

        <div className="org-stats-grid">
          {stats.map((stat) => (
            <div
              className="org-stat-card"
              key={stat.label}
            >
              <div className="org-stat-top">
                <span className="org-stat-icon">
                  {stat.icon}
                </span>

                <span className="org-stat-label">
                  {stat.label}
                </span>
              </div>

              <div className="org-stat-value-row">
                <span className="org-stat-value">
                  {stat.value}
                </span>

                <span className="org-stat-unit">
                  مشروع
                </span>
              </div>

              <div className="org-stat-bar">
                <div
                  className="org-stat-bar-fill"
                  style={{
                    width: `${total ? (stat.value / total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">
            مشاريعي وطلباتي
          </h2>
        </div>

        {latestRequests.length === 0 ? (
          <div className="empty-state">
            لا يوجد مشاريع لعرضها.
          </div>
        ) : (
          <div className="org-table">
            <div className="org-table-scroll">
              <div className="org-table-inner">
                <div className="org-table-head">
                  <span>المشروع</span>
                  <span>الموعد</span>
                  <span>التقدم</span>
                  <span>الحالة</span>

                  <Link
                    to="/organization/requests"
                    className="org-table-head-link"
                  >
                    عرض الكل &lt;
                  </Link>
                </div>

                {latestRequests.map((request) => (
                  <div
                    className="org-table-row"
                    key={request.id}
                  >
                    <span className="org-project-name">
                      {projectTitle(request.problem_description)}
                    </span>

                    <span>{formatDate(request.created_at)}</span>

                    <span>—</span>

                    <span>
                      <span
                        className={`org-status org-status-${request.status}`}
                      >
                        {STATUS_LABELS[request.status] || request.status}
                      </span>
                    </span>

                    <Link
                      to={`/organization/requests/${request.id}`}
                      className="org-row-link"
                    >
                      عرض التفاصيل &lt;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default OrganizationDashboard;