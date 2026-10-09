import { useRef, useState } from "react";
import { FaCloudUploadAlt, FaCertificate, FaTimes } from "react-icons/fa";

const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

function CertificatesSection() {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState("");

  const validateAndAddFile = (file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("نوع الملف غير مدعوم. التنسيقات المدعومة: PNG, JPG, PDF فقط.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("حجم الملف أكبر من الحد الأقصى المسموح (5 ميغابايت).");
      return;
    }

    setError("");
    setCertificates((prev) => [...prev, { id: Date.now(), name: file.name }]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndAddFile(file);
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    validateAndAddFile(file);
    e.target.value = "";
  };

  const handleRemove = (id) => {
    setCertificates((prev) => prev.filter((cert) => cert.id !== id));
  };

  return (
    <div className="certificates-section">
      <h3 className="avail-title">الشهادات</h3>
      <p className="certificates-hint">
        أرفق شهاداتك من داخل المنصة أو من جهات خارجية (دورات، تدريبات، مسابقات).
      </p>

      <div
        className={`doc-upload-dropzone ${isDragging ? "doc-upload-dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <FaCloudUploadAlt className="doc-upload-icon" />
        <p className="doc-upload-text">
          قم بسحب وإفلات الشهادة هنا، أو <span>تصفح</span>
        </p>
        <p className="doc-upload-hint">
          التنسيقات المدعومة: PNG, JPG, PDF (الحد الأقصى 5 ميغابايت)
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleFileInputChange}
          hidden
        />
      </div>

      {error && <span className="error-message">{error}</span>}

      {certificates.length > 0 && (
        <ul className="certificates-list">
          {certificates.map((cert) => (
            <li className="certificates-list-item" key={cert.id}>
              <FaCertificate className="certificates-list-icon" />
              <span className="certificates-list-name">{cert.name}</span>
              <button
                type="button"
                className="certificates-list-remove"
                onClick={() => handleRemove(cert.id)}
                aria-label={`إزالة ${cert.name}`}
              >
                <FaTimes />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CertificatesSection;