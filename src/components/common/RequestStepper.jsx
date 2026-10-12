import { FaCheck } from "react-icons/fa";

import "./RequestWizard.css";

const STEPS = ["المشكلة", "الأسئلة", "المسودة", "القرار"];

function RequestStepper({ currentStep = 1 }) {
  return (
    <ol className="wizard-stepper">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;

        const status =
          stepNumber < currentStep
            ? "done"
            : stepNumber === currentStep
              ? "active"
              : "upcoming";

        return (
          <li
            key={label}
            className={`wizard-step wizard-step-${status}`}
          >
            <span className="wizard-step-circle">
              {status === "done" && <FaCheck />}

              {status === "active" && (
                <span className="wizard-step-dot" />
              )}
            </span>

            <span className="wizard-step-label">
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default RequestStepper;