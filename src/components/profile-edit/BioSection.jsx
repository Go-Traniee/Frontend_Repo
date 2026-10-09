import TextareaField from "../common/TextareaField";

function BioSection({ value, onChange, error }) {
  return (
    <div className="bio-section">
      <h3 className="avail-title">نبذة تعريفية</h3>

      <TextareaField
        label="اكتب نبذة مختصرة عن نفسك، خبراتك واهتماماتك"
        name="bio"
        placeholder="مثال: طالب هندسة حاسوب مهتم بتطوير الويب، أتعلم باستمرار وأبحث عن فرص تدريبية عملية..."
        value={value}
        onChange={onChange}
        error={error}
      />
    </div>
  );
}

export default BioSection;