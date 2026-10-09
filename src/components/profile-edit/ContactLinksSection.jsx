import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import InputFileds from "../common/InputFileds";

function ContactLinksSection({ email, githubUrl, linkedinUrl, onChange }) {
  return (
    <div className="contact-links-section">
      <h3 className="avail-title">التواصل</h3>

      <InputFileds
        label="البريد الإلكتروني"
        icon={<FaEnvelope className="input-icon" />}
        type="email"
        name="email"
        placeholder="example@gmail.com"
        value={email || ""}
        onChange={() => {}}
        disabled={true}
      />

      <InputFileds
        label="رابط GitHub"
        icon={<FaGithub className="input-icon" />}
        type="text"
        name="github_url"
        placeholder="https://github.com/username"
        value={githubUrl || ""}
        onChange={onChange}
      />

      <InputFileds
        label="رابط LinkedIn"
        icon={<FaLinkedin className="input-icon" />}
        type="text"
        name="linkedin_url"
        placeholder="https://linkedin.com/in/username"
        value={linkedinUrl || ""}
        onChange={onChange}
      />
    </div>
  );
}

export default ContactLinksSection;