import { useEffect, useRef } from "react";

function GoogleAuthButton({ children, onCredential, disabled }) {
  const realButtonRef = useRef(null);

  useEffect(() => {
    if (!window.google || !realButtonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response) => onCredential(response.credential),
    });

    window.google.accounts.id.renderButton(realButtonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      width: 400,
    });
  }, [onCredential]);

  return (
    <div className={`google-auth-wrapper ${disabled ? "is-disabled" : ""}`}>
      <div className="google-auth-visible">{children}</div>
      <div ref={realButtonRef} className="google-auth-real-button" />
    </div>
  );
}

export default GoogleAuthButton;