import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { CiUser } from "react-icons/ci";
import { FaRegBuilding } from "react-icons/fa";

import InputFileds from "../components/common/InputFileds";
import TextareaField from "../components/common/TextareaField";
import SelectField from "../components/common/SelectField";

import { completeGoogleOnboarding } from "../services/authService";
import { UNIVERSITIES, ACADEMIC_MAJORS } from "../constants/academicOptions";
import { ORGANIZATION_TYPES } from "../constants/organizationOptions";

import "../AuthForm.css";

const STATUS_OPTIONS = [
  { value: "student", label: "ما زلت طالبًا" },
  { value: "graduated", label: "خريج" },
];

function GoogleOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();

  const onboardingToken = location.state?.onboarding_token;
  const googleAccount = location.state?.google_account;
  const defaultRole = location.state?.preferredRole === "organization"
    ? "organization"
    : "student";

  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});

  const [studentData, setStudentData] = useState({
    university: "",
    academic_major: "",
    status: "student",
    graduation_year: "",
    phone: "",
  });

  const [orgData, setOrgData] = useState({
    organization_name: "",
    organization_type: "",
    industry: "",
    description: "",
    location: "",
    website: "",
    contact_person: "",
  });

  if (!onboardingToken) {
    return (
      <div className="signin-page">
        <section className="signin-section">
          <div className="signin-container">
            <p className="description">
              انتهت صلاحية هاي الجلسة، الرجاء إعادة تسجيل الدخول بجوجل من
              جديد.
            </p>
          </div>
        </section>
      </div>
    );
  }

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrgChange = (e) => {
    const { name, value } = e.target;
    setOrgData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const data = selectedRole === "student" ? studentData : orgData;

    if (selectedRole === "student") {
      if (!data.university) newErrors.university = "الجامعة/الكلية مطلوبة";
      if (!data.academic_major)
        newErrors.academic_major = "التخصص الجامعي مطلوب";
    } else {
      if (!data.organization_name)
        newErrors.organization_name = "اسم المؤسسة مطلوب";
      if (!data.organization_type)
        newErrors.organization_type = "نوع المؤسسة مطلوب";
      if (!data.industry) newErrors.industry = "مجال العمل مطلوب";
      if (!data.description) newErrors.description = "وصف المؤسسة مطلوب";
      if (!data.location) newErrors.location = "الموقع مطلوب";
      if (!data.contact_person)
        newErrors.contact_person = "اسم الشخص المسؤول مطلوب";
    }

    setErrorMsg(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await completeGoogleOnboarding({
        onboarding_token: onboardingToken,
        role: selectedRole,
        ...data,
      });

      navigate(
        selectedRole === "student"
          ? "/student/profile/setup"
          : "/organization/profile",
      );
    } catch (error) {
      console.log(error);
      setErrorMsg({
        submit: error.message || "حدث خطأ أثناء إكمال التسجيل، حاول مرة أخرى",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="background-image"></div>
      <main className="signin-page">
        <section className="signin-section">
          <div className="signin-container">
            <div className="signin-content">
              <h1 className="animate-element delay-100">
                خطوة أخيرة يا {googleAccount?.name}!
              </h1>

              <p className="description animate-element delay-200">
                أكملي بياناتك عشان نجهز حسابك على GoTrainee بالشكل الصحيح.
              </p>

              <form
                className="signin-form animate-element delay-100"
                onSubmit={handleSubmit}
              >
                <div className="role-toggle-container animate-element delay-300">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    id="role-student"
                    className="hidden-radio"
                    checked={selectedRole === "student"}
                    onChange={() => setSelectedRole("student")}
                  />
                  <label htmlFor="role-student" className="role-label">
                    <CiUser className="role-icon" />
                    حساب طالب أو خريج
                  </label>

                  <input
                    type="radio"
                    name="role"
                    value="organization"
                    id="role-org"
                    className="hidden-radio"
                    checked={selectedRole === "organization"}
                    onChange={() => setSelectedRole("organization")}
                  />
                  <label htmlFor="role-org" className="role-label">
                    <FaRegBuilding className="role-icon" />
                    حساب مؤسسة
                  </label>
                </div>

                {selectedRole === "student" ? (
                  <>
                    <SelectField
                      label="الجامعة / الكلية"
                      name="university"
                      value={studentData.university}
                      onChange={handleStudentChange}
                      options={UNIVERSITIES}
                      error={errorMsg.university}
                      placeholder="اختر جامعتك أو كليتك"
                    />

                    <SelectField
                      label="التخصص الجامعي"
                      name="academic_major"
                      value={studentData.academic_major}
                      onChange={handleStudentChange}
                      options={ACADEMIC_MAJORS}
                      error={errorMsg.academic_major}
                      placeholder="اختر تخصصك الجامعي"
                    />

                    <SelectField
                      label="الحالة الدراسية"
                      name="status"
                      value={studentData.status}
                      onChange={handleStudentChange}
                      options={STATUS_OPTIONS}
                      placeholder="اختر حالتك الدراسية"
                    />

                    <InputFileds
                      label="سنة التخرج / المتوقعة (اختياري)"
                      type="number"
                      name="graduation_year"
                      placeholder="2027"
                      value={studentData.graduation_year}
                      onChange={handleStudentChange}
                      error={errorMsg.graduation_year}
                    />

                    <InputFileds
                      label="رقم الهاتف (اختياري)"
                      type="text"
                      name="phone"
                      placeholder="+970599000000"
                      value={studentData.phone}
                      onChange={handleStudentChange}
                    />
                  </>
                ) : (
                  <>
                    <InputFileds
                      label="اسم المؤسسة أو الشركة الرسمي"
                      type="text"
                      name="organization_name"
                      placeholder="اسم المنشأة أو المؤسسة"
                      value={orgData.organization_name}
                      onChange={handleOrgChange}
                      error={errorMsg.organization_name}
                    />

                    <SelectField
                      label="نوع المؤسسة"
                      name="organization_type"
                      value={orgData.organization_type}
                      onChange={handleOrgChange}
                      options={ORGANIZATION_TYPES}
                      error={errorMsg.organization_type}
                      placeholder="اختر نوع المؤسسة"
                    />

                    <InputFileds
                      label="مجال العمل"
                      type="text"
                      name="industry"
                      placeholder="مثال: تكنولوجيا المعلومات"
                      value={orgData.industry}
                      onChange={handleOrgChange}
                      error={errorMsg.industry}
                    />

                    <TextareaField
                      label="وصف المؤسسة"
                      name="description"
                      placeholder="نبذة مختصرة عن المؤسسة ونشاطها"
                      value={orgData.description}
                      onChange={handleOrgChange}
                      error={errorMsg.description}
                    />

                    <InputFileds
                      label="الموقع"
                      type="text"
                      name="location"
                      placeholder="غزة، فلسطين"
                      value={orgData.location}
                      onChange={handleOrgChange}
                      error={errorMsg.location}
                    />

                    <InputFileds
                      label="الموقع الإلكتروني (اختياري)"
                      type="url"
                      name="website"
                      placeholder="https://example.com"
                      value={orgData.website}
                      onChange={handleOrgChange}
                    />

                    <InputFileds
                      label="اسم الشخص المسؤول"
                      type="text"
                      name="contact_person"
                      placeholder="اسم الشخص المسؤول"
                      value={orgData.contact_person}
                      onChange={handleOrgChange}
                      error={errorMsg.contact_person}
                    />
                  </>
                )}

                {errorMsg.submit && (
                  <span className="error-message">{errorMsg.submit}</span>
                )}

                <button
                  className="signin-button animate-element delay-600"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "يتم إنشاء الحساب" : "إنهاء إنشاء الحساب"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default GoogleOnboarding;