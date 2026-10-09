import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  getStudentAvailability,
  updateStudentAvailability,
} from "../../services/studentService";
import "../../pages/StudentProfileEdit.css";

const AVAILABILITY_STATUS_OPTIONS = [
  { value: "not_available", label: "غير متاح حاليًا" },
  { value: "partially_available", label: "دوام جزئي" },
  { value: "available", label: "متاح" },
];

const WORK_TYPE_OPTIONS = [
  { value: "hybrid", label: "مكتبي و عن بعد" },
  { value: "remote", label: "عن بعد" },
  { value: "on_site", label: "حضوري" },
];

const WORK_HOURS_OPTIONS = [
  { value: "flexible", label: "أوقات مرنة" },
  { value: "evening", label: "الفترة المسائية" },
  { value: "morning", label: "الفترة الصباحية" },
];

function RadioPillGroup({ label, options, value, onChange, name }) {
  return (
    <div className="avail-field">
      <span className="avail-field-label">{label}</span>
      <div className="avail-pill-row">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`avail-pill ${value === opt.value ? "avail-pill-active" : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              onClick={() => {
                if (value === opt.value) onChange("");
              }}
              className="avail-pill-radio"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function CheckboxPillGroup({ label, options, values, onToggle, name }) {
  return (
    <div className="avail-field">
      <span className="avail-field-label">{label}</span>
      <div className="avail-pill-row">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`avail-pill ${values.includes(opt.value) ? "avail-pill-active" : ""}`}
          >
            <input
              type="checkbox"
              name={name}
              value={opt.value}
              checked={values.includes(opt.value)}
              onChange={() => onToggle(opt.value)}
              className="avail-pill-radio"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

const AvailabilitySection = forwardRef(function AvailabilitySection(
  props,
  ref,
) {
  const [availabilityStatus, setAvailabilityStatus] = useState("");
  const [preferredWorkType, setPreferredWorkType] = useState("");
  const [workHours, setWorkHours] = useState([]);

  const [visibleToOrganizations, setVisibleToOrganizations] = useState(true);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const data = await getStudentAvailability();

        if (data) {
          setAvailabilityStatus(data.availability_status || "");
          setPreferredWorkType(data.preferred_work_type || "");
          setWorkHours(
            Array.isArray(data.available_hours) ? data.available_hours : [],
          );
        }
      } catch (error) {
        console.log("تعذر جلب بيانات التوافر", error);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, []);

  const toggleWorkHour = (value) => {
    setWorkHours((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  useImperativeHandle(
    ref,
    () => ({
      save: async () => {
        
        if (!availabilityStatus && !preferredWorkType) return;

        if (!availabilityStatus || !preferredWorkType) {
          throw new Error("الرجاء تحديد حالة التوافر وطبيعة الدوام.");
        }

        await updateStudentAvailability({
          availability_status: availabilityStatus,
          preferred_work_type: preferredWorkType,
          available_hours: workHours,
        });
      },
    }),
    [availabilityStatus, preferredWorkType, workHours],
  );

  if (loading) {
    return <div className="avail-loading">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="avail-card">
      <h3 className="avail-title">حالة التوافر</h3>

      <div className="avail-visibility-row">
        <span className="avail-visibility-text">
          هل تريد إظهار ملفك الشخصي لشركات؟
        </span>
        <input
          type="checkbox"
          checked={visibleToOrganizations}
          onChange={(e) => setVisibleToOrganizations(e.target.checked)}
          className="avail-visibility-checkbox"
        />
      </div>
      <p className="avail-visibility-hint">
        اسمح لشركاء التوظيف بالاطلاع على ملفك الشخصي والتواصل معك بشأن الفرص
        المتاحة.
      </p>

      <RadioPillGroup
        label="حالة التوفر الحالية للتدريب والوظائف"
        name="availability_status"
        options={AVAILABILITY_STATUS_OPTIONS}
        value={availabilityStatus}
        onChange={setAvailabilityStatus}
      />

      <RadioPillGroup
        label="طبيعة الدوام"
        name="preferred_work_type"
        options={WORK_TYPE_OPTIONS}
        value={preferredWorkType}
        onChange={setPreferredWorkType}
      />

      <CheckboxPillGroup
        label="فترة الدوام (يمكن اختيار أكثر من فترة)"
        name="available_hours"
        options={WORK_HOURS_OPTIONS}
        values={workHours}
        onToggle={toggleWorkHour}
      />
    </div>
  );
});

export default AvailabilitySection;