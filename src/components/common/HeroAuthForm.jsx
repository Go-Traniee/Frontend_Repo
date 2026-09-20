function HeroAuthForm({ isStudent, isLogin }) {
  return (
    <section className="hero-section">
      <div
        className={`hero-image ${isLogin ? "login-image" : isStudent === "student" ? "student-image" : "orga-image"}`}
      >
        <div className="hero-overlay"></div>
      </div>
      <div id="testimonials" className="testimonials"></div>
    </section>
  );
}

export default HeroAuthForm;
