import { useEffect, useRef, useState } from "react";

import { FaUser, FaCamera } from "react-icons/fa";

import {
  getStudentProfile,
  updateStudentProfile,
  uploadStudentAvatar,
} from "../services/studentService";

import InputFileds from "../components/common/InputFileds";
import SelectField from "../components/common/SelectField";
import BioSection from "../components/profile-edit/BioSection";
import ContactLinksSection from "../components/profile-edit/ContactLinksSection";
import SkillsManageSection from "../components/profile-edit/SkillsManageSection";
import AvailabilitySection from "../components/profile-edit/AvailabilitySection";
import DocumentUploadSection from "../components/profile-edit/DocumentUploadSection";

import {
  UNIVERSITIES,
  ACADEMIC_MAJORS,
} from "../constants/academicOptions";

import "../pages/StudentProfileView.css";
import "./StudentProfileEdit.css";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const AVATAR_TYPES = ["image/png", "image/jpeg"];

function StudentProfileEdit() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birth_date: "",
    address: "",
    bio: "",
    university: "",
    academic_major: "",
    graduation_year: "",
    status: "student",
    github_url: "",
    linkedin_url: "",
  });

  const [email, setEmail] = useState("");
  const availabilityRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarError, setAvatarError] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getStudentProfile();

        setEmail(data?.email || "");
        setAvatarPreview(data?.avatar_url || "");

        setFormData((prev) => ({
          ...prev,
          name: data?.name || "",
          phone: data?.phone || "",
          birth_date: data?.birth_date || "",
          address: data?.address || "",
          bio: data?.bio || "",
          university: data?.university || "",
          academic_major: data?.academic_major || "",
          graduation_year: data?.graduation_year || "",
          status: data?.status || "student",
          github_url: data?.github_url || "",
          linkedin_url: data?.linkedin_url || "",
        }));
      } catch (error) {
        console.log("تعذر جلب بيانات الملف الشخصي", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!AVATAR_TYPES.includes(file.type)) {
      setAvatarError("نوع الصورة غير مدعوم. المسموح: PNG, JPG.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError("حجم الصورة أكبر من 5 ميغابايت.");
      return;
    }

    setAvatarError("");
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "الاسم الكامل مطلوب";
    }

    setErrorMsg(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setSuccessMsg("");
    setAvatarError("");

    try {
      await updateStudentProfile(formData);

      if (availabilityRef.current) {
        await availabilityRef.current.save();
      }

      if (avatarFile) {
        try {
          await uploadStudentAvatar(avatarFile);
          setAvatarFile(null);
        } catch (avatarErr) {
          setAvatarError(
            avatarErr.message || "تعذر رفع الصورة الشخصية، حاول مرة أخرى.",
          );
        }
      }

      setSuccessMsg("تم حفظ بياناتك بنجاح.");
    } catch (error) {
      setErrorMsg({
        submit:
          error.message || "حدث خطأ أثناء الحفظ، حاول مرة أخرى.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="avail-loading">
        جاري تحميل البيانات
      </div>
    );
  }

  return (
    <div className="profile-edit-page">

      <div className="profile-edit-cover-spacer">

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
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="الصورة الشخصية"
                  className="profile-avatar-img"
                />
              ) : (
                <FaUser />
              )}
            </div>

            <button
              className="profile-avatar-camera"
              type="button"
              aria-label="تغيير الصورة الشخصية"
              onClick={handleAvatarClick}
            >
              <FaCamera />
            </button>

            <input
              ref={avatarInputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handleAvatarChange}
              hidden
            />

          </div>

        </div>

      </div>

      {avatarError && <p className="avail-error">{avatarError}</p>}

      <div className="profile-grid">

        <div className="profile-col-main">

          <div className="avail-card">

            <h3 className="avail-title">
              البيانات الشخصية
            </h3>

            <div className="profile-edit-field-grid">

              <InputFileds
                label="الاسم الكامل"
                type="text"
                name="name"
                placeholder="الاسم كامل"
                value={formData.name}
                onChange={handleChange}
                error={errorMsg.name}
              />

              <InputFileds
                label="تاريخ الميلاد"
                type="date"
                name="birth_date"
                placeholder="تاريخ الميلاد"
                value={formData.birth_date}
                onChange={handleChange}
                error={errorMsg.birth_date}
              />

              <InputFileds
                label="العنوان"
                type="text"
                name="address"
                placeholder="عنوانك الحالي"
                value={formData.address}
                onChange={handleChange}
                error={errorMsg.address}
              />

              <InputFileds
                label="رقم الهاتف"
                type="text"
                name="phone"
                placeholder="0594866081"
                value={formData.phone}
                onChange={handleChange}
                error={errorMsg.phone}
              />

            </div>

          </div>

          <div className="avail-card">

            <h3 className="avail-title">
              البيانات الأكاديمية
            </h3>

            <SelectField
              label="الجامعة / الكلية"
              name="university"
              value={formData.university}
              onChange={handleChange}
              options={UNIVERSITIES}
              error={errorMsg.university}
              placeholder="اختر جامعتك أو كليتك"
            />

            <InputFileds
              label="سنة التخرج / المتوقعة"
              type="number"
              name="graduation_year"
              value={formData.graduation_year}
              onChange={handleChange}
              error={errorMsg.graduation_year}
              placeholder="اختر سنة التخرج "
            />

            <SelectField
              label="التخصص الجامعي"
              name="academic_major"
              value={formData.academic_major}
              onChange={handleChange}
              options={ACADEMIC_MAJORS}
              error={errorMsg.academic_major}
              placeholder="اختر تخصصك الجامعي"
            />

          </div>

          <SkillsManageSection />

        </div>

        <div className="profile-col-side">

          <div className="avail-card">

            <BioSection
              value={formData.bio}
              onChange={handleChange}
              error={errorMsg.bio}
            />

          </div>
          <div className="avail-card">

            <ContactLinksSection
              email={email}
              githubUrl={formData.github_url}
              linkedinUrl={formData.linkedin_url}
              onChange={handleChange}
            />

          </div>

          <DocumentUploadSection label="رفع مستند" />

        </div>

      </div>

      <AvailabilitySection ref={availabilityRef} />
      <div className="profile-edit-actions">

        {errorMsg.submit && (
          <p className="avail-error">
            {errorMsg.submit}
          </p>
        )}

        {successMsg && (
          <p className="avail-success">
            {successMsg}
          </p>
        )}

        <button
          className="profile-edit-save-btn"
          type="button"
          onClick={handleSave}
          disabled={submitting}
        >
          {submitting
            ? "جارِ الحفظ"
            : "حفظ التغييرات"}
        </button>

      </div>

    </div>
  );
}

export default StudentProfileEdit;