import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  FaTh,
  FaRegUser,
  FaLightbulb,
  FaBook,
  FaBriefcase,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaBell,
} from "react-icons/fa";

import { getStudentProfile } from "../../services/studentService";
import { logout } from "../../services/authService";

import logo from "../../assets/logo.svg";
import "./DashboardLayout.css";

const NAV_ITEMS = [
  { label: "لوحة التحكم", icon: <FaTh />, to: "/dashboard" },
  { label: "الملف الشخصي", icon: <FaRegUser />, to: "/student/profile" },
  { label: "المهارات", icon: <FaLightbulb />, to: "/student/skills" },
  { label: "التدريبات", icon: <FaBook />, to: "/trainings" },
  { label: "الوظائف", icon: <FaBriefcase />, to: "/jobs" },
  { label: "الإعدادات", icon: <FaCog />, to: "/settings" },
];

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("auth_user"));
  } catch {
    return null;
  }
}

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [userName, setUserName] = useState(() => getCurrentUser()?.name || "");

  useEffect(() => {
    setUserName(getCurrentUser()?.name || "");
  }, [location.pathname]);

  useEffect(() => {
    const syncProfile = async () => {
      try {
        const profile = await getStudentProfile();
        if (profile?.name) {
          const storedUser = getCurrentUser() || {};
          localStorage.setItem(
            "auth_user",
            JSON.stringify({ ...storedUser, name: profile.name }),
          );
          setUserName(profile.name);
        }
      } catch (error) {
        console.log("تعذر تحديث بيانات المستخدم", error);
      }
    };

    syncProfile();
  }, []);

  const userInitial = userName ? userName.trim().charAt(0) : "";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log("فشل تسجيل الخروج من السيرفر", error);
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-text">
            <span className="brand-go">Go</span>
            <span className="brand-trainee">Trainee</span>
          </span>
          <img src={logo} alt="GoTrainee Logo" className="sidebar-logo-icon" />
        </div>

        <p className="sidebar-section-label">القائمة الرئيسية</p>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <FaSignOutAlt className="sidebar-link-icon" />
          <span>تسجيل الخروج</span>
        </button>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-search">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="ابحث عن الدورات، التدريبات، المشرفين..."
            />
            <FaSearch className="topbar-search-icon" />
          </div>

          <button className="topbar-bell" aria-label="الإشعارات">
            <FaBell />
          </button>

          <div className="topbar-user">
            <div className="topbar-avatar">{userInitial}</div>
            <span className="topbar-username">{userName}</span>
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;