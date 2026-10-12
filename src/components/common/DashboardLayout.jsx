import { useEffect, useState } from "react";

import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaTh,
  FaRegUser,
  FaLightbulb,
  FaBook,
  FaBriefcase,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaRegFolderOpen,
  FaPlus,
} from "react-icons/fa";

import { getStudentProfile } from "../../services/studentService";
import { logout } from "../../services/authService";

import "./DashboardLayout.css";

const NAV_ITEMS = [
  {
    label: "لوحة التحكم",
    icon: <FaTh />,
    to: "/dashboard",
  },
  {
    label: "الملف الشخصي",
    icon: <FaRegUser />,
    to: "/student/profile",
  },
  {
    label: "المهارات",
    icon: <FaLightbulb />,
    to: "/student/skills",
  },
  {
    label: "التدريبات",
    icon: <FaBook />,
    to: "/trainings",
  },
  {
    label: "الوظائف",
    icon: <FaBriefcase />,
    to: "/jobs",
  },
  {
    label: "الإعدادات",
    icon: <FaCog />,
    to: "/settings",
  },
];

const ORGANIZATION_NAV_ITEMS = [
  {
    label: "لوحة التحكم",
    icon: <FaTh />,
    to: "/dashboard",
  },
  {
    label: "طلباتي",
    icon: <FaRegFolderOpen />,
    to: "/organization/requests",
  },
  {
    label: "الملف التعريفي",
    icon: <FaRegUser />,
    to: "/organization/profile",
  },
  {
    label: "الإعدادات",
    icon: <FaCog />,
    to: "/settings",
  },
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

  const isOrganization = getCurrentUser()?.role === "organization";
  const navItems = isOrganization ? ORGANIZATION_NAV_ITEMS : NAV_ITEMS;

  const [userName, setUserName] = useState(
    getCurrentUser()?.name || ""
  );

  useEffect(() => {
    setUserName(getCurrentUser()?.name || "");
  }, [location.pathname]);

  useEffect(() => {
    const syncProfile = async () => {
      if (getCurrentUser()?.role === "organization") return;

      try {
        const profile = await getStudentProfile();

        if (profile?.name) {
          const storedUser = getCurrentUser() || {};

          localStorage.setItem(
            "auth_user",
            JSON.stringify({
              ...storedUser,
              name: profile.name,
            })
          );

          setUserName(profile.name);
        }
      } catch (error) {
        console.log("تعذر تحديث بيانات المستخدم", error);
      }
    };

    syncProfile();
  }, []);

  const userInitial = userName
    ? userName.trim().charAt(0)
    : "";

  const isProfilePage =
    location.pathname.startsWith("/student/profile") ||
    location.pathname.startsWith("/student/skills") ||
    location.pathname.startsWith("/student/assessment");

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

          <div className="sidebar-logo-text">
            <span className="brand-go">Go</span>
            <span className="brand-trainee">Trainee</span>
          </div>
        </div>

        {isOrganization && (
          <Link
            to="/organization/requests/new"
            className="sidebar-new-project"
          >
            <FaPlus />

            <span>مشروع جديد</span>
          </Link>
        )}

        <p className="sidebar-section-label">
          القائمة الرئيسية
        </p>

        <nav className="sidebar-nav">

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => {
                const active =
                  isActive ||
                  (item.to === "/student/skills" &&
                    location.pathname.startsWith("/student/assessment"));

                return `sidebar-link ${active ? "sidebar-link-active" : ""}`;
              }}
            >
              <span className="sidebar-link-icon">
                {item.icon}
              </span>

              <span className="sidebar-link-text">
                {item.label}
              </span>
            </NavLink>
          ))}

        </nav>
        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="sidebar-link-icon" />

          <span>تسجيل الخروج</span>
        </button>

      </aside>
      <div className="app-main">

        <header className="app-topbar">
      <div style={{ flex: 1 }} />

          <button
            className="topbar-bell"
            aria-label="الإشعارات"
          >
            <FaBell />
          </button>

          <button
            type="button"
            className="topbar-language"
            aria-label="اللغة"
          >
            العربية
          </button>

          <div className="topbar-user">

            <div className="topbar-avatar">
              {userInitial}
            </div>

            <span className="topbar-username">
              {userName}
            </span>

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