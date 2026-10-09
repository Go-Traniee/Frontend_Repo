import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import "../AuthForm.css";

const CONTENT = {
  student: {
    title: "مرحبًا بك في GoTrainee",
    description:
      "ابن خبرتك العملية، طوّر مهاراتك بثقة، وانطلق نحو فرص التدريب والمحاكاة المهنية التي تستحقها.",
    status: "جاري البحث عن الفرص التدريبية المناسبة",
    redirectTo: "/dashboard",
  },
  organization: {
    title: "مرحبًا بك في GoTrainee",
    description:
      "حوّل تحديات شركتك ومشاريعك الرقمية إلى مواصفات تقنية مدروسة بدعم من الذكاء الاصطناعي، وارتبط بأفضل الكفاءات والفرق الطلابية لإنجازها.",
    status: "جاري إعداد بيئة العمل الخاصة بشركتك  ...",
    redirectTo: "/organization/profile",
  },
};

const SHAPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function MatchingLoading() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.pathname.startsWith("/organization")
    ? "organization"
    : "student";

  const content = CONTENT[role];
  const [titleText] = content.title.split("GoTrainee");

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(content.redirectTo);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, content.redirectTo]);

  return (
    <div className="matching-page">
      <div className="matching-waves" aria-hidden="true">
        {SHAPES.map((n) => (
          <span key={n} className={`matching-shape matching-shape-${n}`}></span>
        ))}
      </div>

      <img src={logo} alt="GoTrainee Logo" className="matching-logo" />

      <h1 className="matching-title">
        {titleText}
        <span className="matching-title-brand">GoTrainee</span>
      </h1>

      <p className="matching-description">{content.description}</p>

      <div className="matching-progress">
        <div className="matching-progress-bar"></div>
      </div>

      <p className="matching-status">{content.status}</p>
    </div>
  );
}

export default MatchingLoading;