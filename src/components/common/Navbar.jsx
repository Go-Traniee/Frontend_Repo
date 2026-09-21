import { Link } from "react-router-dom";
import "../../Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">GT</Link>
      <div className="navbar-links">
        <Link to="/">الرئيسية</Link>
        <Link to="/students">الطلاب</Link>
        <Link to="/organizations">الشركات</Link>
        <Link to="/about">من نحن</Link>
        <Link to="/register">إنشاء حساب</Link>
        <Link to="/login" className="navbar-btn">تسجيل دخول</Link>
      </div>
    </nav>
  );
}

export default Navbar;