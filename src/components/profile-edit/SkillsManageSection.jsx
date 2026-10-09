import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import {
  getAvailableSkills,
  getStudentSkills,
  addStudentSkill,
  deleteStudentSkill,
} from "../../services/studentService";

const PROFICIENCY_OPTIONS = [
  { value: "beginner", label: "مبتدئ" },
  { value: "intermediate", label: "متوسط" },
  { value: "advanced", label: "متقدم" },
  { value: "expert", label: "خبير" },
];

function SkillsManageSection() {
  const [allSkills, setAllSkills] = useState([]);
  const [studentSkills, setStudentSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [selectedProficiency, setSelectedProficiency] = useState("beginner");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [available, mine] = await Promise.all([
          getAvailableSkills(),
          getStudentSkills(),
        ]);
        setAllSkills(Array.isArray(available) ? available : []);
        setStudentSkills(Array.isArray(mine) ? mine : []);
      } catch (error) {
        console.log("تعذر جلب المهارات", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const availableToAdd = allSkills.filter(
    (skill) => !studentSkills.some((s) => s.skill?.id === skill.id),
  );

  const handleAdd = async () => {
    if (!selectedSkillId) {
      setErrorMsg("الرجاء اختيار مهارة أولًا.");
      return;
    }

    setErrorMsg("");
    setAdding(true);

    try {
      const newSkill = await addStudentSkill({
        skill_id: Number(selectedSkillId),
        proficiency: selectedProficiency,
      });

      setStudentSkills((prev) => [...prev, newSkill]);
      setSelectedSkillId("");
      setSelectedProficiency("beginner");
    } catch (error) {
      setErrorMsg(error.message || "تعذر إضافة المهارة، حاول مرة أخرى.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (studentSkillId) => {
    try {
      await deleteStudentSkill(studentSkillId);
      setStudentSkills((prev) =>
        prev.filter((item) => item.id !== studentSkillId),
      );
    } catch (error) {
      setErrorMsg(error.message || "تعذر حذف المهارة، حاول مرة أخرى.");
    }
  };

  if (loading) {
    return <div className="avail-loading">جاري تحميل المهارات</div>;
  }

  return (
    <div className="avail-card">
      <h3 className="avail-title">المهارات</h3>

      <div className="skills-manage-tags">
        {studentSkills.length === 0 ? (
          <span className="profile-field-empty">لا توجد مهارات مضافة بعد</span>
        ) : (
          studentSkills.map((item) => (
            <span className="profile-skill-tag" key={item.id}>
              {item.skill?.name}
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                aria-label={`إزالة ${item.skill?.name}`}
              >
                <FaTimes />
              </button>
            </span>
          ))
        )}
      </div>

      <div className="skills-manage-add-row">
        <select
          value={selectedSkillId}
          onChange={(e) => setSelectedSkillId(e.target.value)}
          className="skills-manage-select"
        >
          <option value="">اختر مهارة</option>
          {availableToAdd.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>

        <select
          value={selectedProficiency}
          onChange={(e) => setSelectedProficiency(e.target.value)}
          className="skills-manage-select"
        >
          {PROFICIENCY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="avail-save-btn"
          onClick={handleAdd}
          disabled={adding}
        >
          {adding ? "جارِ الإضافة" : "إضافة"}
        </button>
      </div>

      {errorMsg && <p className="avail-error">{errorMsg}</p>}
    </div>
  );
}

export default SkillsManageSection;