import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentProfile from "./pages/StudentProfile";
import StudentProfileView from "./pages/StudentProfileView";
import StudentProfileEdit from "./pages/StudentProfileEdit";
import OrganizationProfile from "./pages/OrganizationProfile";
import MatchingLoading from "./pages/MatchingLoading";
import DashboardHome from "./pages/DashboardHome";
import PublicLayout from "./components/common/PublicLayout";
import DashboardLayout from "./components/common/DashboardLayout";
import GoogleOnboarding from "./pages/GoogleOnboarding";
import StudentSkills from "./pages/StudentSkills";
import StudentAssessment from "./pages/StudentAssessment";
import OrganizationRequestIntro from "./pages/OrganizationRequestIntro";
import OrganizationRequestProblem from "./pages/OrganizationRequestProblem";
import OrganizationRequestQuestions from "./pages/OrganizationRequestQuestions";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student/profile/setup" element={<StudentProfile />} />
      <Route path="/organization/profile" element={<OrganizationProfile />} />
      <Route path="/student/matching" element={<MatchingLoading />} />
      <Route path="/auth/google/onboarding" element={<GoogleOnboarding />} />

      <Route element={<PublicLayout />}>
        <Route path="/" element={<div>الصفحة الرئيسية</div>} />
        <Route path="/opportunities" element={<div>الفرص</div>} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/student/profile" element={<StudentProfileView />} />
        <Route path="/student/profile/edit" element={<StudentProfileEdit />} />
        <Route path="/student/skills" element={<StudentSkills />} />
        <Route path="/student/assessment" element={<StudentAssessment />} />
        <Route
          path="/organization/requests/new"
          element={<OrganizationRequestIntro />}
        />
        <Route
          path="/organization/requests/describe"
          element={<OrganizationRequestProblem />}
        />
        <Route
          path="/organization/requests/:id/questions"
          element={<OrganizationRequestQuestions />}
        />
      </Route>
      <Route path="/organization/matching" element={<MatchingLoading />} />
    </Routes>
  );
}

export default App;