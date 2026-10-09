import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEdit,
  FaUniversity,
  FaDesktop,
  FaGraduationCap,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFileAlt,
  FaLightbulb,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import {
  getStudentProfile,
  getStudentSkills,
  getStudentEvidence,
  getStudentAvailability,
} from "../services/studentService";
import "./StudentProfileView.css";

const AVAILABILITY_STATUS_LABELS = {
  not_available: "غير متاح حاليًا",
  partially_available: "دوام جزئي",
  available: "متاح",
};

const WORK_TYPE_LABELS = {
  hybrid: "مكتبي و عن بعد",
  remote: "عن بعد",
  on_site: "حضوري",
};

const WORK_HOURS_LABELS = {
  flexible: "أوقات مرنة",
  evening: "الفترة المسائية",
  morning: "الفترة الصباحية",
};

const SKILL_LEVELS = {
  beginner: { label: "مبتدئ", dots: 1 },
  intermediate: { label: "متوسط", dots: 2 },
  advanced: { label: "متقدم", dots: 3 },
  expert: { label: "خبير", dots: 4 },
};

const SKILL_LEVEL_DOTS_TOTAL = 4;

function normalizeUrl(url) {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}

function getStudyStatus(status, year) {
  const label =
    status === "graduated" ? "خريج" : status === "student" ? "طالب" : "";

  if (!year) return label;

  const yearText =
    status === "student" ? `متوقع التخرج: ${year}` : `سنة التخرج: ${year}`;

  return label ? `${label} (${yearText})` : yearText;
}

function InfoRow({ icon, value, ltr = false }) {
  return (
    <div className="profile-info-row">
      {icon}

      {value ? (
        <span className={ltr ? "profile-info-ltr" : ""}>{value}</span>
      ) : (
        <span className="profile-field-empty">غير متوفر</span>
      )}
    </div>
  );
}

function PillGroup({ label, values }) {
  return (
    <div className="profile-pill-group">
      <span className="profile-field-label">{label}</span>

      {values.length === 0 ? (
        <span className="profile-field-empty">لم يتم إدخاله بعد</span>
      ) : (
        values.map((value) => (
          <div className="profile-pill" key={value}>
            <span className="profile-pill-radio" />
            <span>{value}</span>
          </div>
        ))
      )}
    </div>
  );
}

function StudentProfileView() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getStudentProfile();
        setProfile(data);
      } catch (error) {
        console.log("تعذر جلب بيانات الملف الشخصي", error);
      }

      try {
        const skillsData = await getStudentSkills();
        setSkills(Array.isArray(skillsData) ? skillsData : []);
      } catch (error) {
        console.log("تعذر جلب المهارات", error);
      }

      try {
        const evidenceData = await getStudentEvidence();
        setEvidence(Array.isArray(evidenceData) ? evidenceData : []);
      } catch (error) {
        console.log("تعذر جلب المستندات", error);
      }

      try {
        const availabilityData = await getStudentAvailability();
        setAvailability(availabilityData || null);
      } catch (error) {
        console.log("تعذر جلب بيانات التوافر", error);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="profile-view-loading">
        جاري تحميل الملف الشخصي
      </div>
    );
  }

  const linkedinHref = normalizeUrl(profile?.linkedin_url);
  const githubHref = normalizeUrl(profile?.github_url);
  const emailHref = profile?.email ? `mailto:${profile.email}` : null;

  const availabilityStatusLabel =
    AVAILABILITY_STATUS_LABELS[availability?.availability_status];
  const workTypeLabel = WORK_TYPE_LABELS[availability?.preferred_work_type];
  const workHoursLabels = Array.isArray(availability?.available_hours)
    ? availability.available_hours
        .map((hour) => WORK_HOURS_LABELS[hour])
        .filter(Boolean)
    : [];

  return (
    <div className="profile-view">
      <div className="profile-cover-wrap">
        <section className="profile-cover">
          <svg
            className="profile-cover-wave"
            viewBox="0 0 800 220"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,130 C200,190 350,70 550,120 C650,145 720,110 800,125 L800,220 L0,220 Z"
              fill="#2a4a7a"
            />
          </svg>
        </section>

        <div className="profile-avatar-wrapper">
                    <div className="profile-avatar">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="الصورة الشخصية"
                className="profile-avatar-img"
              />
            ) : (
              <FaUser />
            )}
          </div>
        </div>
      </div>

      <div className="profile-identity">
        <h1 className="profile-name">{profile?.name || "—"}</h1>

        <p className="profile-role">
          {profile?.academic_major || (
            <span className="profile-field-empty">
              لم يتم إدخال التخصص بعد
            </span>
          )}
        </p>

        {(linkedinHref || githubHref || emailHref) && (
          <div className="profile-social-links">
            {linkedinHref && (
              <a
                className="profile-social-link profile-social-linkedin"
                href={linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            )}

            {githubHref && (
              <a
                className="profile-social-link profile-social-github"
                href={githubHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            )}

            {emailHref && (
              <a
                className="profile-social-link profile-social-gmail"
                href={emailHref}
                aria-label="البريد الإلكتروني"
              >
                <SiGmail />
              </a>
            )}
          </div>
        )}

        <div className="profile-tabs">
          <span className="profile-tab profile-tab-active">
            <FaUser />
            <span>الملف الشخصي</span>
          </span>
          <Link to="/student/profile/edit" className="profile-tab">
            <FaEdit />
            <span>تعديل الملف الشخصي</span>
          </Link>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-col-main">
          <div className="profile-card">
            <h3 className="profile-card-title">المهارات</h3>

            {skills.length === 0 ? (
              <span className="profile-field-empty">
                لا توجد مهارات مضافة بعد
              </span>
            ) : (
              <>
                <div className="profile-skills-filters">
                  <span className="profile-skills-filter profile-skills-filter-active">
                    الكل ({skills.length})
                  </span>
                </div>

                <div className="profile-skill-list">
                  {skills.map((item) => {
                    const level = SKILL_LEVELS[item.proficiency];

                    return (
                      <div className="profile-skill-row" key={item.id}>
                        <div className="profile-skill-icon">
                          <FaLightbulb />
                        </div>

                        <div className="profile-skill-info">
                          <span className="profile-skill-name">
                            {item.skill?.name}
                          </span>
                        </div>

                        {level && (
                          <div className="profile-skill-level">
                            <span className="profile-skill-dots">
                              {Array.from({ length: SKILL_LEVEL_DOTS_TOTAL }).map(
                                (_, index) => (
                                  <span
                                    key={index}
                                    className={`profile-skill-dot ${
                                      index < level.dots
                                        ? "profile-skill-dot-on"
                                        : ""
                                    }`}
                                  />
                                ),
                              )}
                            </span>
                            <span>{level.label}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="profile-card">
            <h3 className="profile-card-title">الشهادات</h3>

            {evidence.length === 0 ? (
              <div className="profile-certs-empty">لا يوجد شيء لعرضه</div>
            ) : (
              <ul className="profile-evidence-list">
                {evidence.map((item) => (
                  <li className="profile-evidence-item" key={item.id}>
                    <FaFileAlt />
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="profile-col-side">
          <div className="profile-card">
            <h3 className="profile-card-title">نبذة تعريفية</h3>

            <p className="profile-bio">
              {profile?.bio || (
                <span className="profile-field-empty">
                  لم تتم إضافة نبذة تعريفية بعد
                </span>
              )}
            </p>

            <div className="profile-info-list">
              <InfoRow icon={<FaUniversity />} value={profile?.university} />
              <InfoRow icon={<FaDesktop />} value={profile?.academic_major} />
              <InfoRow
                icon={<FaGraduationCap />}
                value={getStudyStatus(
                  profile?.status,
                  profile?.graduation_year,
                )}
              />
              <InfoRow icon={<FaEnvelope />} value={profile?.email} ltr />
              <InfoRow icon={<FaPhoneAlt />} value={profile?.phone} ltr />
              <InfoRow icon={<FaMapMarkerAlt />} value={profile?.address} />
            </div>
          </div>

          <div className="profile-card">
            <h3 className="profile-card-title">حالة التوافر</h3>

            <PillGroup
              label="حالة التوفر الحالية للتدريب والوظائف"
              values={availabilityStatusLabel ? [availabilityStatusLabel] : []}
            />
            <PillGroup
              label="طبيعة الدوام"
              values={workTypeLabel ? [workTypeLabel] : []}
            />
            <PillGroup label="فترة الدوام" values={workHoursLabels} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfileView;