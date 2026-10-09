import { useRef, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

function DocumentUploadSection({ label = "المستند", onFileSelected }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const validateAndSetFile = (file) => {
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
    setSelectedFile(file);
    if (onFileSelected) onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  return (
    <div className="doc-upload-field">
      <span className="doc-upload-label">{label}</span>

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

        {selectedFile ? (
          <p className="doc-upload-filename">{selectedFile.name}</p>
        ) : (
          <>
            <p className="doc-upload-text">
              قم بسحب وإفلات المستند هنا، أو <span>تصفح</span>
            </p>
            <p className="doc-upload-hint">
              التنسيقات المدعومة: PNG, JPG, PDF (الحد الأقصى 5 ميغابايت)
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleFileInputChange}
          hidden
        />
      </div>

      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default DocumentUploadSection;