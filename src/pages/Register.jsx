import HeroAuthForm from "../components/common/HeroAuthForm";
import "../AuthForm.css";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { CiLock, CiUser, CiGlobe } from "react-icons/ci";
import { FaGoogle, FaRegBuilding } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import InputFileds from "../components/common/InputFileds";
function Register() {
  const [formData, setFormData] = useState({
    name: "", // لاسم الطالب
    orgName: "", // لاسم المؤسسة
    email: "",
    website: "", // لموقع المؤسسة
    role: "student",
    password: "",
    password_confirmation: "", // تم توحيد الاسم هنا
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});
  // const [successMsg, setSuccessMsg] = useState('');
  const [selectedRole, setSelectedRole] = useState("student");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };
  const organizationFormData = [
    {
      id: 1,
      label: "اسم المؤسسة",
      name: "organization_name",
      placeholder: "أدخل اسم المؤسسة الرسمي",
      type: "text",
      icon: <FaRegBuilding className="input-icon" />,
      onChange: handleChange,
      value: formData.orgName,
    },
    {
      id: 2,
      label: "البريد الإلكتروني للمؤسسة",
      name: "email",
      placeholder: "org@example.com",
      type: "email",
      icon: <MdOutlineMail className="input-icon" />,
      value: formData.email,
      onChange: handleChange,
    },

    {
      id: 3,
      label: "كلمة المرور",
      name: "password",
      icon: <CiLock className="input-icon" />,
      type: "password",
      placeholder: "••••••••••••",
      value: formData.password,
      onChange: handleChange,
      error: errorMsg.password,
      ifPassword: showPassword,
      setPassword: setShowPassword,
    },
    {
      id: 4,
      label: "تأكيد كلمة المرور",
      name: "password_confirmation",
      icon: <CiLock className="input-icon" />,
      type: "password",
      placeholder: "••••••••••••",
      value: formData.password_confirm,
      onChange: handleChange,
      error: errorMsg.password_confirm,
      ifPassword: showPassword,
      setPassword: setShowPassword,
    },
  ];
  const studentFormData = [
    {
      id: 1,
      label: "الإسم الكامل (ثلاثي)",
      name: "name",
      icon: <CiUser className="input-icon" />,
      type: "text",
      placeholder: "أحمد محمد النجار",
      value: formData.name,
      onChange: handleChange,
      error: errorMsg.name,
    },
    {
      id: 2,
      label: "البريد الإلكتروني",
      name: "email",
      icon: <MdOutlineMail className="input-icon" />,
      type: "email",
      placeholder: "example@email.com",
      value: formData.email,
      onChange: handleChange,
      error: errorMsg.email,
    },
    {
      id: 3,
      label: "كلمة المرور",
      name: "password",
      icon: <CiLock className="input-icon" />,
      type: "password",
      placeholder: "••••••••••••",
      value: formData.password,
      onChange: handleChange,
      error: errorMsg.password,
      ifPassword: showPassword,
      setPassword: setShowPassword,
    },
    {
      id: 4,
      label: "تأكيد كلمة المرور",
      name: "password_confirmation",
      icon: <CiLock className="input-icon" />,
      type: "password",
      placeholder: "••••••••••••",
      value: formData.password_confirm,
      onChange: handleChange,
      error: errorMsg.password_confirm,
      ifPassword: showPassword,
      setPassword: setShowPassword,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const formDataErrors = new FormData(e.target);
    const name = formDataErrors.get("name");
    const email = formDataErrors.get("email");
    const password = formDataErrors.get("password");

    const password_confirm = formDataErrors.get("password_confirmation");
    if (!name) {
      newErrors.name = "الرجاء إدخال الإسم الكامل";
    } else if (!email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (password.length < 8) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    } else if (password !== password_confirm) {
      newErrors.password_confirm = "كلمة المرور لاتطابق";
    }
    setErrorMsg(newErrors);
    setLoading(true);
    try {
      const result = await login(formData);
      console.log(result);

      navigate("/student/profile");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <main className="signin-page">
        <HeroAuthForm isStudent={selectedRole} />
        <section className="signin-section">
          <div className="signin-container">
            <div className="signin-content">
              <h1 className="animate-element delay-100">
                مرحبًا بك في GoTrainee
              </h1>

              <p className="description animate-element delay-200">
                {selectedRole === "student"
                  ? " أنشئ حسابك كطالب أو باحث عن تدريب واستكشف أفضل الفرص المعتمدة"
                  : "سجّل منشأتك وابدأ استقطاب الكفاءات والكوادر الأكاديمية المؤهلة"}
              </p>

              <form
                id="signinForm"
                className="signin-form  animate-element delay-100"
                onSubmit={handleSubmit}
              >
                <div className="role-toggle-container animate-element delay-300">
                  {/* زر الطالب */}
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    id="student"
                    className="hidden-radio"
                    onChange={handleRoleChange}
                    checked={selectedRole === "student"}
                  />
                  <label htmlFor="student" className="role-label">
                    <CiUser className="role-icon" />
                    حساب طالب أو خريج
                  </label>

                  {/* زر المؤسسة */}
                  <input
                    type="radio"
                    name="role"
                    value="orga"
                    id="orga"
                    className="hidden-radio"
                    onChange={handleRoleChange}
                    checked={selectedRole === "orga"}
                  />
                  <label htmlFor="orga" className="role-label">
                    <FaRegBuilding className="role-icon" />
                    حساب مؤسسة
                  </label>
                </div>
                {selectedRole === "student"
                  ? // إذا كان المختار طالب، يعرض حقول الطالب
                    studentFormData.map((input, index) => (
                      <>
                        {index === 1 && (
                          <div className="select-container animate-element delay-300">
                            <div>
                              <label htmlFor="unrole">
                                <GiGraduateCap />
                                الجامعة / الكلية{" "}
                              </label>
                              <select
                                name="university"
                                id="unrole"
                                className="glass-input-wrapper"
                              >
                                <option value="">إختر جامعتك أو كليتك</option>
                                <option value="">جامعة الأزهر(AUS)</option>
                                <option value="">الجامعة الإسلامية(IUG)</option>
                                <option value="">الكلية الجامعية (UCAS)</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor="acdmic">التخصص الأكاديمي </label>
                              <select
                                name="academic_major"
                                id="acdmic"
                                className="glass-input-wrapper"
                              >
                                <option value="">اختر تخصصك</option>
                                <option value="">هندسة أنظمة حاسوب</option>
                                <option value="">ملتيميديا</option>
                                <option value="">مهندس زراعي</option>
                              </select>
                            </div>
                          </div>
                        )}
                        <InputFileds
                          key={input.id}
                          name={input.name}
                          icon={input.icon}
                          placeholder={input.placeholder}
                          label={input.label}
                          error={input.error}
                          type={input.type}
                          onChange={input.onChange}
                          value={input.value}
                          ifPassword={input.ifPassword}
                          setPassword={input.setPassword}
                        />
                      </>
                    ))
                  : // إذا كان المختار مؤسسة، يعرض حقول المؤسسة
                    organizationFormData.map((input, index) => (
                      <>
                        {index === 1 && (
                          <div className="select-container orga animate-element delay-300">
                            <div>
                              <label htmlFor="orga">نوع المؤسسة</label>
                              <select
                                name=""
                                id="orga"
                                className="glass-input-wrapper"
                              >
                                <option value="">إختر نوع المؤسسة...</option>
                                <option value="">مؤسسة تقنية</option>
                                <option value="">مؤسسة غير تقنية</option>
                              </select>
                            </div>
                          </div>
                        )}
                        <InputFileds
                          key={input.id}
                          icon={input.icon}
                          placeholder={input.placeholder}
                          label={input.label}
                          error={input.error}
                          type={input.type}
                          onChange={input.onChange}
                          value={input.value}
                          ifPassword={input.ifPassword}
                          setPassword={input.setPassword}
                        />
                      </>
                    ))}
                <div className="form-options animate-element delay-500">
                  <label className="remember-label">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <span>
                      أوافق على <a href="#">شروط الإستخدام المعتمدة</a> و{" "}
                      <a href="#">سياسة الخصوصية</a> الخاصة بمنصة GoTrainee.
                    </span>
                  </label>
                </div>

                <button
                  className="signin-button animate-element delay-600"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "يتم إنشاء الحساب...." : "إنشاء الحساب"}
                </button>
              </form>

              <button
                id="googleSignIn"
                className="google-button animate-element delay-800"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
                  />
                  <path
                    fill="#FF3D00"
                    d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
                  />
                </svg>
                <span>المتابعة بواسطة حساب جوجل</span>
              </button>

              <p className="create-account animate-element delay-900">
                لديك حساب بالفعل؟{" "}
                <a
                  href="/login"
                  id="createAccount"
                  className="action-link create-link"
                >
                  تسجيل الدخول
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Register;
